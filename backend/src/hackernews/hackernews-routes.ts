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

			const parser = new HackerNewsParser();
			let posts;

			switch (storyType) {
				case 'new':
					posts = await parser.getNewPosts(limit);
					break;
				case 'best':
					posts = await parser.getBestPosts(limit);
					break;
				default:
					posts = await parser.getBestPosts(limit);
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
            const { processed, saved, skipped, success } = result;

			return Response.json({
				success,
				processed,
				saved,
				skipped,
				params: { limit, storyType },
				message: success ? `HackerNews 게시글 처리 완료: ${processed}개 처리됨` : 'HackerNews 게시글 처리 실패',
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
