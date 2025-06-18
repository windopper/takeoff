import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { aiPosts } from '../db/schema';
import { count, desc, and, ilike, like } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

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
	private db: DrizzleD1Database;

	constructor(db: D1Database) {
		this.db = drizzle(db);
	}

	/**
	 * 게시글이 이미 데이터베이스에 존재하는지 확인합니다.
	 */
	async isPostExists(originalUrl: string): Promise<boolean> {
		try {
			const result = await this.db.select({ count: count() }).from(aiPosts).where(eq(aiPosts.originalUrl, originalUrl)).limit(1).execute();

			return result[0].count > 0;
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
				.insert(aiPosts)
				.values({
					title: post.title,
					content: post.content,
					author: post.author,
					originalUrl: post.originalUrl,
					category: post.category,
					platform: post.platform,
					community: post.community,
					originalTitle: post.originalTitle,
					originalAuthor: post.originalAuthor,
					postScore: post.postScore,
				})
				.execute();

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
	async savePosts(posts: ProcessedPost[]): Promise<{ saved: number; skipped: number }> {
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
	async getPosts({
		limit = 10,
		offset = 0,
		query,
		platform,
		community,
	}: {
		limit?: number;
		offset?: number;
		query?: string;
		platform?: string;
		community?: string;
	}): Promise<any[]> {
		try {
      const where = [];
      if (query) {
        where.push(like(aiPosts.title, `%${query}%`));
      }
      if (platform) {
        where.push(eq(aiPosts.platform, platform));
      }
      if (community) {
        where.push(eq(aiPosts.community, community));
      }

			const result = await this.db
				.select()
				.from(aiPosts)
				.where(and(...where))
				.orderBy(desc(aiPosts.createdAt))
				.limit(limit)
				.offset(offset)
				.execute();

			return result || [];
		} catch (error) {
			console.error('게시글 조회 중 오류:', error);
			return [];
		}
	}

	async getPostById(id: string): Promise<any> {
		try {
			const result = await this.db
				.select()
				.from(aiPosts)
				.where(eq(aiPosts.id, parseInt(id)))
				.limit(1)
				.execute();

			return result[0] || null;
		} catch (error) {
			console.error('게시글 조회 중 오류:', error);
			return null;
		}
	}
}
