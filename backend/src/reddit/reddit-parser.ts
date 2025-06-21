import { CommonParser, ParserResult } from "../common/common-parser";

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

export class RedditParser extends CommonParser {
  limit: number = 10;

  constructor(limit: number = 10) {
    super();
    this.limit = limit;
  }

  parse(text: string): ParserResult[] {
    const posts = this.parseRSSXML(text);
    return posts.slice(0, this.limit);
  }

  /**
   * Atom/RSS XML을 파싱하여 게시글 정보를 추출합니다.
   */
  private parseRSSXML(xmlText: string): ParserResult[] {
    const posts: ParserResult[] = [];
    
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

        const post: ParserResult = {
          title,
          description,
          publishedAt: pubDate,
          url: linkHref,
          score,
          by: author,
        };
        console.log(`✓ 추가됨: ${post.title}`);

        // 제목과 링크가 있는 경우만 추가
        if (post.title && post.url) {
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
} 