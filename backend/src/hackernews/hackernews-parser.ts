export interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string; // 작성자
  time: number; // Unix timestamp
  descendants?: number; // 댓글 수
  type: string; // "story", "comment", "job", "poll", "pollopt"
}

export class HackerNewsParser {
  private readonly RSS_BEST_URL = 'https://hnrss.org/best';
  private readonly RSS_NEWEST_URL = 'https://hnrss.org/newest';
  private readonly USER_AGENT = 'TakeoffBot/1.0';

  constructor() {

  }

  /**
   * New Stories를 가져옵니다.
   */
  async getNewPosts(limit: number = 10): Promise<HackerNewsItem[]> {
    try {
      console.log(`HackerNews New Stories RSS 가져오기 (제한: ${limit})`);
      
      const response = await fetch(this.RSS_NEWEST_URL, {
        headers: { 'User-Agent': this.USER_AGENT }
      });

      if (!response.ok) {
        throw new Error(`RSS API 오류: ${response.status}`);
      }

      const rssText = await response.text();
      const items = this.parseRssToItems(rssText, limit);
      
      console.log(`총 ${items.length}개의 새로운 게시글을 수집했습니다.`);
      return items;
    } catch (error) {
      console.error('HackerNews New Posts RSS 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * Best Stories를 가져옵니다.
   */
  async getBestPosts(limit: number = 10): Promise<HackerNewsItem[]> {
    try {
      console.log(`HackerNews Best Stories RSS 가져오기 (제한: ${limit})`);
      
      const response = await fetch(`${this.RSS_BEST_URL}?count=${limit}`, {
        headers: { 'User-Agent': this.USER_AGENT }
      });

      if (!response.ok) {
        throw new Error(`RSS API 오류: ${response.status}`);
      }

      const rssText = await response.text();
      const items = this.parseRssToItems(rssText, limit);
      
      console.log(`총 ${items.length}개의 베스트 게시글을 수집했습니다.`);
      return items;
    } catch (error) {
      console.error('HackerNews Best Posts RSS 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * RSS XML을 파싱하여 HackerNewsItem 배열로 변환합니다.
   */
  parseRssToItems(rssText: string, limit: number): HackerNewsItem[] {
    try {
      // 정규식으로 RSS 아이템 추출
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const items: string[] = [];
      let match;
      
      while ((match = itemRegex.exec(rssText)) !== null && items.length < limit) {
        items.push(match[1]);
      }
      
      const hackerNewsItems: HackerNewsItem[] = [];
      
      for (const itemXml of items) {
        const parsedItem = this.parseRssItem(itemXml);
        
        if (parsedItem) {
          hackerNewsItems.push(parsedItem);
          console.log(`✓ 추가됨: ${parsedItem.title} (점수: ${parsedItem.score})`);
        }
      }
      
      return hackerNewsItems;
    } catch (error) {
      console.error('RSS 파싱 오류:', error);
      return [];
    }
  }

  /**
   * 개별 RSS 아이템을 HackerNewsItem으로 변환합니다.
   */
  parseRssItem(itemXml: string): HackerNewsItem | null {
    try {
      const title = this.extractTitle(itemXml);
      const description = this.extractDescription(itemXml);
      const pubDate = this.extractPubDate(itemXml);
      const author = this.extractAuthor(itemXml);
      const url = this.extractArticleUrl(itemXml);
      
      // Description에서 정보 추출
      const score = this.extractScore(description);
      const descendants = this.extractCommentCount(description);
      const id = this.extractItemId(description);
      
      if (!title || !url || !id) {
        console.log('파싱 실패 - 필수 필드 누락:', { 
          title: !!title, 
          url: !!url, 
          id: !!id,
          extractedTitle: title,
          extractedUrl: url,
          extractedId: id
        });
        return null;
      }
      
      return {
        id: id,
        title: title,
        url: url,
        score: score,
        by: author,
        time: this.parseDate(pubDate),
        descendants: descendants,
        type: 'story'
      };
    } catch (error) {
      console.error('RSS 아이템 파싱 오류:', error);
      return null;
    }
  }

  /**
   * XML에서 제목을 추출합니다.
   */
  private extractTitle(itemXml: string): string {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  /**
   * XML에서 설명을 추출합니다.
   */
  private extractDescription(itemXml: string): string {
    const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
    return descMatch ? descMatch[1] : '';
  }

  /**
   * XML에서 발행일을 추출합니다.
   */
  private extractPubDate(itemXml: string): string {
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    return pubDateMatch ? pubDateMatch[1].trim() : '';
  }

  /**
   * XML에서 작성자를 추출합니다.
   */
  private extractAuthor(itemXml: string): string {
    const authorMatch = itemXml.match(/<dc:creator>(.*?)<\/dc:creator>/);
    return authorMatch ? authorMatch[1].trim() : 'unknown';
  }

  /**
   * Description에서 Article URL을 추출합니다.
   */
  private extractArticleUrl(itemXml: string): string {
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    return linkMatch ? linkMatch[1].trim() : '';
  }

  /**
   * Description에서 점수를 추출합니다.
   */
  private extractScore(description: string): number {
    const scoreMatch = description.match(/Points:\s*(\d+)/);
    return scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  }

  /**
   * Description에서 댓글 수를 추출합니다.
   */
  private extractCommentCount(description: string): number {
    const commentMatch = description.match(/#\s*Comments:\s*(\d+)/);
    return commentMatch ? parseInt(commentMatch[1], 10) : 0;
  }

  /**
   * Description에서 HN 아이템 ID를 추출합니다.
   */
  private extractItemId(description: string): number {
    const idMatch = description.match(/item\?id=(\d+)/);
    return idMatch ? parseInt(idMatch[1], 10) : 0;
  }

  /**
   * RSS pubDate를 Unix timestamp로 변환합니다.
   */
  private parseDate(pubDate: string): number {
    try {
      return Math.floor(new Date(pubDate).getTime() / 1000);
    } catch (error) {
      return Math.floor(Date.now() / 1000);
    }
  }

  /**
   * 사용 가능한 카테고리 목록을 반환합니다.
   */
  getAvailableCategories(): string[] {
    return ['AI/ML', '프로그래밍', '비즈니스', '기술', 'Show HN', 'Ask HN', '일반'];
  }
} 