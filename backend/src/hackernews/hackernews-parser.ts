import { CommonParser, ParserResult } from "../common/common-parser";
import { HACKERNEWS_RSS_BEST_URL, HACKERNEWS_RSS_NEWEST_URL } from "../constants";

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

export class HackerNewsParser extends CommonParser {
  limit = 10;
  RSS_BEST_URL = HACKERNEWS_RSS_BEST_URL;
  RSS_NEWEST_URL = HACKERNEWS_RSS_NEWEST_URL;
  USER_AGENT = 'TakeoffBot/1.0';

  constructor(limit: number = 10) {
    super();
    this.limit = limit;
  }
  
  parse(text: string): ParserResult[] {
    try {
      // 정규식으로 RSS 아이템 추출
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const items: string[] = [];
      let match;
      
      while ((match = itemRegex.exec(text)) !== null && items.length < this.limit) {
        items.push(match[1]);
      }
      
      const results: ParserResult[] = [];
      
      for (const itemXml of items) {
        const parsedItem = this.parseRssItem(itemXml);
        
        if (parsedItem) {
          results.push(parsedItem);
          console.log(`✓ 추가됨: ${parsedItem.title} (점수: ${parsedItem.score})`);
        }
      }
      
      return results;
    } catch (error) {
      console.error('RSS 파싱 오류:', error);
      return [];
    }
  }

  /**
   * 개별 RSS 아이템을 HackerNewsItem으로 변환합니다.
   */
  parseRssItem(itemXml: string): ParserResult | null {
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
        title: title,
        description: description,
        url: url,
        score: score,
        by: author,
        publishedAt: pubDate,
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