import { CommonFetcher } from '../common/common-fetcher';
import { HackerNewsParser } from './hackernews-parser';
import { processHackernewsPosts } from './hackernews-service';

export interface Env {
	DB: D1Database;
	GEMINI_API_KEY: string;
}

export class HackerNewsRoutes {
	// HackerNews 게시글 목록 조회 API
	static async getHackerNewsPosts(request: Request): Promise<Response> {
		try {
			const url = new URL(request.url);
			const limit = parseInt(url.searchParams.get('limit') || '20');
			const storyType = (url.searchParams.get('storyType') || 'best') as 'new' | 'best';
			const fetcher = new CommonFetcher();
			const parser = new HackerNewsParser(limit);
			let posts;

			switch (storyType) {
				case 'new':
					const response = await fetcher.fetch(parser.RSS_NEWEST_URL);
					const text = await response.text();
					posts = parser.parse(text);
					break;
				case 'best':
					const response2 = await fetcher.fetch(parser.RSS_BEST_URL);
					const text2 = await response2.text();
					posts = parser.parse(text2);
					break;
				default:
					const response3 = await fetcher.fetch(parser.RSS_BEST_URL);
					const text3 = await response3.text();
					posts = parser.parse(text3);
			}   

			return Response.json({
				success: true,
				posts,
				params: { limit, storyType },
				message: `HackerNews ${storyType} stories: ${posts.length}개 게시글`,
			});
		} catch (error) {
			console.error('HackerNews 게시글 조회 중 오류:', error);
			return Response.json(
				{
					error: 'HackerNews 게시글 조회 중 오류가 발생했습니다.',
					details: error instanceof Error ? error.message : '알 수 없는 오류',
				},
				{ status: 500 }
			);
		}
	}

	// HackerNews 게시글을 AI로 처리하고 저장하는 API
	static async processHackerNewsPosts(request: Request, env: Env): Promise<Response> {
		try {
			if (!env.GEMINI_API_KEY) {
				return Response.json({ error: 'Gemini API Key가 설정되지 않았습니다.' }, { status: 500 });
			}

			const body = (await request.json().catch(() => ({}))) as any;
			const limit = body.limit || 20;
			const storyType = body.storyType || 'best';

			const result = await processHackernewsPosts({ limit, storyType });
            const { saved, skipped, total, filtered } = result;

			return Response.json({
				success: true,
				total,
				filtered,
				saved,
				skipped,
				params: { limit, storyType },
				message: `HackerNews 게시글 처리 완료: ${saved}개 저장됨`,
			});
		} catch (error) {
			console.error('HackerNews 게시글 처리 중 오류:', error);
			return Response.json(
				{
					error: 'HackerNews 게시글 처리 중 오류가 발생했습니다.',
					details: error instanceof Error ? error.message : '알 수 없는 오류',
				},
				{ status: 500 }
			);
		}
	}
}
