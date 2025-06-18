import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { aiFiltered } from "../db/schema";
import { count, gt, lt } from "drizzle-orm";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";

export class FilteredPostManager {
  private db: DrizzleD1Database;

  constructor(db: D1Database) {
    this.db = drizzle(db);
  }

  /**
   * 게시글이 이미 필터링되어 있는지 확인합니다.
   */
  async isPostFiltered(originalUrl: string): Promise<boolean> {
    try {
      const result = await this.db
        .select({ count: count() })
        .from(aiFiltered)
        .where(and(eq(aiFiltered.originalUrl, originalUrl), gt(aiFiltered.expiresAt, new Date().toISOString())))
        .execute();

      return result[0].count > 0;
    } catch (error) {
      console.error('필터링된 게시글 확인 중 오류:', error);
      return false;
    }
  }

  /**
   * 필터링된 게시글을 데이터베이스에 저장합니다.
   */
  async saveFilteredPost(filteredPost: FilteredPost): Promise<boolean> {
    try {
      // 이미 필터링된 게시글인지 확인
      if (await this.isPostFiltered(filteredPost.originalUrl)) {
        return false;
      }

      // 14일 후 만료 날짜 계산
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);

      await this.db
        .insert(aiFiltered)
        .values({
          originalUrl: filteredPost.originalUrl,
          originalTitle: filteredPost.originalTitle,
          platform: filteredPost.platform,
          community: filteredPost.community,
          filterReason: filteredPost.filterReason,
          filterType: filteredPost.filterType,
          confidence: filteredPost.confidence,
          postScore: filteredPost.postScore,
          expiresAt: expiresAt.toISOString()
        })
        .execute();

      console.log(`필터링된 게시글 저장: ${filteredPost.originalTitle} (${filteredPost.filterType})`);
      return true;
    } catch (error) {
      console.error('필터링된 게시글 저장 중 오류:', error);
      return false;
    }
  }

  /**
   * 만료된 필터링 기록을 수동으로 정리합니다.
   */
  async cleanupExpiredFilters(): Promise<number> {
    try {
      const result = await this.db
        .delete(aiFiltered)
        .where(lt(aiFiltered.expiresAt, new Date().toISOString()))
        .execute();

      const deleted = (result as any).changes || 0;
      if (deleted > 0) {
        console.log(`만료된 필터링 기록 ${deleted}개 정리 완료`);
      }
      return deleted;
    } catch (error) {
      console.error('만료된 필터링 기록 정리 중 오류:', error);
      return 0;
    }
  }

  /**
   * 필터링 통계를 조회합니다.
   */
  async getFilterStats(community?: string): Promise<any[]> {
    try {
      const result = await this.db
        .select()
        .from(aiFiltered)
        .where(and(eq(aiFiltered.community, community || ''), gt(aiFiltered.expiresAt, new Date().toISOString())))
        .groupBy(aiFiltered.community, aiFiltered.filterType)
        .orderBy(aiFiltered.community, aiFiltered.filterType)
        .execute();

      return result || [];
    } catch (error) {
      console.error('필터링 통계 조회 중 오류:', error);
      return [];
    }
  }
}

export interface FilteredPost {
  originalUrl: string;
  originalTitle: string;
  platform: string; // 'reddit', 'hackernews' 등
  community: string; // subreddit 이름 또는 'hackernews' 등
  filterReason: string;
  filterType: 'score' | 'time' | 'ai_relevance' | 'keyword' | 'already_exists' | 'xml_parse_error';
  confidence?: number;
  postScore?: number;
}

