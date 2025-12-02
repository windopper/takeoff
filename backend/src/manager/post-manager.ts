import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { AiPost, aiPosts } from '../db/schema';
import { count, desc, and, ilike, like, asc, lt, inArray, gt, sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { POST_EXPIRATION_TIME } from '../constants';

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
	async savePost(post: ProcessedPost): Promise<AiPost | null> {
		try {
			// 이미 존재하는 게시글인지 확인
			if (await this.isPostExists(post.originalUrl)) {
				console.log(`이미 존재하는 게시글: ${post.originalTitle}`);
				return null;
			}

			const result = await this.db
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
				.returning()
				.execute();

			console.log(`게시글 저장 완료: ${post.title}`);
			return result[0];
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
		sort = 'createdAt',
		order = 'desc',
		platform,
		community,
		category,
	}: {
		limit?: number;
		offset?: number;
		query?: string;
		sort?: string;
		order?: string;
		platform?: string;
		community?: string;
		category?: string;
	}): Promise<AiPost[]> {
		try {
			const where = [];
			const orderBy = [];
			if (query) {
				where.push(like(aiPosts.title, `%${query}%`));
			}
			if (platform) {
				where.push(eq(aiPosts.platform, platform));
			}
			if (community) {
				where.push(eq(aiPosts.community, community));
			}
			if (category) {
				where.push(like(aiPosts.category, `%${category}%`));
			}

			if (sort === 'createdAt') {
				orderBy.push(order === 'desc' ? desc(aiPosts.createdAt) : asc(aiPosts.createdAt));
			} else if (sort === 'postScore') {
				orderBy.push(order === 'desc' ? desc(aiPosts.postScore) : asc(aiPosts.postScore));
			}

			const result = await this.db
				.select()
				.from(aiPosts)
				.where(and(...where))
				.orderBy(...orderBy)
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

	async getPostsByIds(ids: string[]): Promise<AiPost[]> {
		const result = await this.db.select().from(aiPosts).where(inArray(aiPosts.id, ids.map((id) => parseInt(id)))).execute();
		return result;
	}

	async getPostCount({ query = '', category = '' }: { query?: string; category?: string }): Promise<number> {
		const where = [];
		if (query) {
			where.push(like(aiPosts.title, `%${query}%`));
		}
		if (category) {
			where.push(like(aiPosts.category, `%${category}%`));
		}
		const result = await this.db
			.select({ count: count() })
			.from(aiPosts)
			.where(and(...where))
			.execute();
		return result[0].count;
	}

	async getAllPostNotVectorized(): Promise<AiPost[]> {
		const result = await this.db.select().from(aiPosts).where(eq(aiPosts.isVectorized, 0)).execute();
		return result;
	}

	async getPostAfterDate(date: Date): Promise<AiPost[]> {
			// SQLite CURRENT_TIMESTAMP는 'YYYY-MM-DD HH:MM:SS' 포맷이므로 동일 포맷으로 비교
			const threshold = date
				.toISOString()
				.replace('T', ' ')
				.replace('Z', '')
				.replace(/\..+$/, ''); // 밀리초 제거
			const result = await this.db
				.select()
				.from(aiPosts)
				.where(gt(aiPosts.createdAt, threshold))
				.execute();
		return result;
	}

	async updatePost(id: number, data: Partial<AiPost>): Promise<void> {
		await this.db.update(aiPosts).set(data).where(eq(aiPosts.id, id));
	}

	async deletePost(id: string): Promise<void> {
		await this.db.delete(aiPosts).where(eq(aiPosts.id, parseInt(id)));
	}

	async cleanupOldPosts(): Promise<number> {
		try {
			// SQLite의 CURRENT_TIMESTAMP 포맷('YYYY-MM-DD HH:MM:SS')에 맞춰 비교값을 정규화
			const threshold = new Date(Date.now() - POST_EXPIRATION_TIME)
				.toISOString()
				.replace('T', ' ')
				.replace('Z', '')
				.replace(/\..+$/, ''); // 밀리초 제거
			// sql 템플릿을 사용하여 날짜 비교를 안전하게 처리
			// Drizzle ORM에서 컬럼 참조와 파라미터 바인딩을 올바르게 처리
			const result = await this.db
				.delete(aiPosts)
				.where(sql`${aiPosts.createdAt} < ${threshold}`)
				.execute();
			return (result as any).changes || 0;
		} catch (error) {
			console.error('오래된 게시글 삭제 중 오류:', error);
			if (error instanceof Error) {
				console.error('오류 상세:', error.message);
				console.error('오류 스택:', error.stack);
			}
			return 0;
		}
	}
}
