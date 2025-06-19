export interface RedditPost {
  title: string;
  link: string;
  author: string;
  pubDate: string;
  description: string;
  category: string;
  score?: number; // Reddit 게시글 추천 수
}

export interface SubredditConfig {
  name: string;
  rssUrl: string;
}

export class RedditParser {
  private subreddits: SubredditConfig[] = [
    // {
    //   name: 'LocalLLaMA',
    //   rssUrl: 'https://www.reddit.com/r/LocalLLaMA/.rss?sort=top'
    // },
    {
      name: 'singularity',
      rssUrl: 'https://www.reddit.com/r/singularity/.rss?sort=top'
    }
  ];

  /**
   * Atom/RSS XML을 파싱하여 게시글 정보를 추출합니다.
   */
  private parseRSSXML(xmlText: string): RedditPost[] {
    const posts: RedditPost[] = [];
    
    // Atom 피드의 entry 태그들을 추출 (Reddit은 Atom 피드 사용)
    let entryMatches = xmlText.match(/<entry[\s>][\s\S]*?<\/entry>/g);
    
    // RSS 피드의 item 태그도 지원
    if (!entryMatches) {
      entryMatches = xmlText.match(/<item[\s>][\s\S]*?<\/item>/g);
    }
    
    if (!entryMatches) {
      return posts;
    }

    for (const entryMatch of entryMatches) {
      try {
        // Atom 피드 파싱
        const title = this.extractTagContent(entryMatch, 'title') || '';
        const linkHref = this.extractAtomLink(entryMatch) || this.extractTagContent(entryMatch, 'link') || '';
        const author = this.extractAtomAuthor(entryMatch) || this.extractTagContent(entryMatch, 'dc:creator') || '';
        const pubDate = this.extractTagContent(entryMatch, 'published') || 
                       this.extractTagContent(entryMatch, 'updated') || 
                       this.extractTagContent(entryMatch, 'pubDate') || '';
        const description = this.extractTagContent(entryMatch, 'content') || 
                           this.extractTagContent(entryMatch, 'description') || '';
        const category = this.extractTagContent(entryMatch, 'category') || '';
        
        // Reddit RSS에서 점수 정보 추출 시도 (제목에서 추출)
        const score = this.extractScoreFromTitle(title);

        const post: RedditPost = {
          title,
          link: linkHref,
          author,
          pubDate,
          description,
          category,
          score
        };

        // 제목과 링크가 있는 경우만 추가
        if (post.title && post.link) {
          posts.push(post);
        }
      } catch (error) {
        console.error('게시글 파싱 중 오류:', error);
      }
    }

    return posts;
  }

  /**
   * XML에서 특정 태그의 내용을 추출합니다.
   */
  private extractTagContent(xml: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    
    if (match && match[1]) {
      // HTML 엔티티 디코딩 및 CDATA 제거
      return match[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    }
    
    return null;
  }

  /**
   * Atom 피드에서 링크를 추출합니다.
   */
  private extractAtomLink(xml: string): string | null {
    // <link href="..." /> 형태의 링크 추출
    const linkMatch = xml.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/i);
    if (linkMatch && linkMatch[1]) {
      return linkMatch[1];
    }
    return null;
  }

  /**
   * Atom 피드에서 작성자 정보를 추출합니다.
   */
  private extractAtomAuthor(xml: string): string | null {
    // <author><n>...</n></author> 또는 <author><n>...</n></author> 형태
    const authorName = this.extractTagContent(xml, 'name') || this.extractTagContent(xml, 'n');
    if (authorName) {
      return authorName;
    }
    return null;
  }

  /**
   * Reddit 제목에서 점수 정보를 추출합니다.
   * Reddit RSS에서는 점수 정보가 직접 제공되지 않으므로,
   * 제목에 점수가 포함된 경우 추출하거나 기본값을 반환합니다.
   */
  private extractScoreFromTitle(title: string): number {
    return 0;
  }

  /**
   * 특정 서브레딧의 Top 게시글을 가져옵니다.
   */
  async getTopPosts(subredditName: string, limit: number = 10): Promise<RedditPost[]> {
    const subreddit = this.subreddits.find(sub => sub.name.toLowerCase() === subredditName.toLowerCase());
    
    if (!subreddit) {
      throw new Error(`서브레딧 '${subredditName}'을 찾을 수 없습니다.`);
    }

    try {
      console.log(`${subredditName} 서브레딧에서 게시글을 가져오는 중...`);
      
      const response = await fetch(subreddit.rssUrl, {
        headers: {
          'User-Agent': 'TakeoffBot/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`RSS 피드 가져오기 실패: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      const posts = this.parseRSSXML(xmlText);
      
      console.log(`${subredditName}에서 ${posts.length}개의 게시글을 파싱했습니다.`);
      
      return posts.slice(0, limit);
    } catch (error) {
      console.error(`${subredditName} 서브레딧 파싱 중 오류:`, error);
      throw error;
    }
  }

  /**
   * 모든 서브레딧의 Top 게시글을 가져옵니다.
   */
  async getAllTopPosts(limit: number = 10): Promise<{ subreddit: string; posts: RedditPost[] }[]> {
    const results: { subreddit: string; posts: RedditPost[] }[] = [];

    for (const subreddit of this.subreddits) {
      try {
        const posts = await this.getTopPosts(subreddit.name, limit);
        results.push({
          subreddit: subreddit.name,
          posts
        });
      } catch (error) {
        console.error(`${subreddit.name} 처리 중 오류:`, error);
        results.push({
          subreddit: subreddit.name,
          posts: []
        });
      }
    }

    return results;
  }

  /**
   * 사용 가능한 서브레딧 목록을 반환합니다.
   */
  getAvailableSubreddits(): string[] {
    return this.subreddits.map(sub => sub.name);
  }
} 