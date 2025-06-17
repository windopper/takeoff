export interface ProcessedPost {
  title: string;
  content: string;
  author: string;
  originalUrl: string;
  category: string;
  platform: string; // 'reddit', 'hackernews' 등
  community: string; // subreddit 이름 또는 'hackernews' 등
  originalTitle: string;
  originalAuthor: string;
  postScore?: number;
}

export class PostManager {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * 게시글이 이미 데이터베이스에 존재하는지 확인합니다.
   */
  async isPostExists(originalUrl: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare('SELECT COUNT(*) as count FROM ai_posts WHERE original_url = ?')
        .bind(originalUrl)
        .first();

      return (result?.count as number) > 0;
    } catch (error) {
      console.error('게시글 존재 확인 중 오류:', error);
      return false;
    }
  }

  /**
   * 처리된 게시글을 데이터베이스에 저장합니다.
   */
  async savePost(post: ProcessedPost): Promise<boolean> {
    try {
      // 이미 존재하는 게시글인지 확인
      if (await this.isPostExists(post.originalUrl)) {
        console.log(`이미 존재하는 게시글: ${post.originalTitle}`);
        return false;
      }

      await this.db
        .prepare(`
          INSERT INTO ai_posts (
            title, content, author, original_url, category, 
            platform, community, original_title, original_author, post_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          post.title,
          post.content,
          post.author,
          post.originalUrl,
          post.category,
          post.platform,
          post.community,
          post.originalTitle,
          post.originalAuthor,
          post.postScore || 0
        )
        .run();

      console.log(`게시글 저장 완료: ${post.title}`);
      return true;
    } catch (error) {
      console.error('게시글 저장 중 오류:', error);
      throw new Error(`게시글 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 여러 게시글을 배치로 저장합니다.
   */
  async savePosts(posts: ProcessedPost[]): Promise<{ saved: number; skipped: number; }> {
    let saved = 0;
    let skipped = 0;

    for (const post of posts) {
      try {
        const result = await this.savePost(post);
        if (result) {
          saved++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`게시글 저장 실패 (${post.title}):`, error);
        skipped++;
      }
    }

    return { saved, skipped };
  }

  /**
   * 저장된 게시글 목록을 조회합니다.
   */
  async getPosts(limit: number = 10, offset: number = 0): Promise<any[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT * FROM ai_posts 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `)
        .bind(limit, offset)
        .all();

      return result.results || [];
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<any> {
    try {
      const result = await this.db
        .prepare(`SELECT * FROM ai_posts WHERE id = ?`)
        .bind(id)
        .first();

      return result || null;
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 특정 서브레딧의 게시글을 조회합니다.
   */
  async getPostsBySubreddit(subreddit: string, limit: number = 10): Promise<any[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT * FROM ai_posts 
          WHERE subreddit = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        `)
        .bind(subreddit, limit)
        .all();

      return result.results || [];
    } catch (error) {
      console.error('서브레딧별 게시글 조회 중 오류:', error);
      return [];
    }
  }

  /**
   * 특정 플랫폼과 커뮤니티의 게시글을 조회합니다. (새로운 스키마 지원)
   */
  async getPostsByPlatformCommunity(platform: string, community: string, limit: number = 10): Promise<any[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT * FROM ai_posts 
          WHERE platform = ? AND community = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        `)
        .bind(platform, community, limit)
        .all();

      return result.results || [];
    } catch (error) {
      console.error('플랫폼/커뮤니티별 게시글 조회 중 오류:', error);
      return [];
    }
  }
}

