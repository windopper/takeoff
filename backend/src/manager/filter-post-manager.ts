
export class FilteredPostManager {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * 게시글이 이미 필터링되어 있는지 확인합니다.
   */
  async isPostFiltered(originalUrl: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare(`
          SELECT COUNT(*) as count 
          FROM ai_filtered 
          WHERE original_url = ? AND expires_at > CURRENT_TIMESTAMP
        `)
        .bind(originalUrl)
        .first();

      return (result?.count as number) > 0;
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
        .prepare(`
          INSERT OR REPLACE INTO ai_filtered (
            original_url, original_title, platform, community, filter_reason, 
            filter_type, confidence, post_score, expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          filteredPost.originalUrl,
          filteredPost.originalTitle,
          filteredPost.platform,
          filteredPost.community,
          filteredPost.filterReason,
          filteredPost.filterType,
          filteredPost.confidence || null,
          filteredPost.postScore || null,
          expiresAt.toISOString()
        )
        .run();

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
        .prepare('DELETE FROM ai_filtered WHERE expires_at <= CURRENT_TIMESTAMP')
        .run();

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
      let query = `
        SELECT 
          community,
          filter_type,
          COUNT(*) as filtered_count,
          AVG(confidence) as avg_confidence,
          MAX(filtered_at) as latest_filtered
        FROM ai_filtered 
        WHERE expires_at > CURRENT_TIMESTAMP
      `;

      const params: any[] = [];
      if (community) {
        query += ' AND community = ?';
        params.push(community);
      }

      query += ' GROUP BY community, filter_type ORDER BY community, filter_type';

      const result = await this.db
        .prepare(query)
        .bind(...params)
        .all();

      return result.results || [];
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

