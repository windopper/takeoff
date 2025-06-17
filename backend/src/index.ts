import { PostManager } from './manager/post-manager';
import { HackerNewsRoutes } from './hackernews/hackernews-routes';
import { RedditRoutes } from './reddit/reddit-routes';
import { ArticleAIWriter } from './common/article-ai-writer';
import { processHackernewsPosts } from './hackernews/hackernews-service';
import { CommonRoutes } from './common/common-routes';

export interface Env {
	// If you set another name in the Wrangler config file for the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
	// Google Gemini API Key를 환경 변수로 추가
	GEMINI_API_KEY: string;
}

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);

		console.log(pathname);

		if (pathname === "/api/reddit") {
			return await RedditRoutes.getRedditPosts(request);
		}

		// HackerNews 게시글 목록 조회 API
		if (pathname === "/api/hackernews") {
			return await HackerNewsRoutes.getHackerNewsPosts(request);
		}

		// AI로 처리된 게시글 목록 조회 API
		if (pathname === "/api/posts") {
			return await CommonRoutes.getPosts(request, env);
		}

		if (pathname.startsWith("/api/posts/")) {
			return await CommonRoutes.getPostById(request, env);
		}

		// Reddit 게시글을 AI로 처리하고 저장하는 API
		if (pathname === "/api/process-reddit" && request.method === 'POST') {
			return await RedditRoutes.processRedditPosts(request, env);
		}

		// HackerNews 게시글을 AI로 처리하고 저장하는 API
		if (pathname === "/api/process-hackernews" && request.method === 'POST') {
			return await HackerNewsRoutes.processHackerNewsPosts(request, env);
		}

		if (pathname === "/api/process-url" && request.method === 'POST') {
			const aiWriter = new ArticleAIWriter({ 
				geminiApiKey: env.GEMINI_API_KEY, 
			});
			const body = await request.json().catch(() => ({})) as any;
			const url = body.url;
			console.log(`Processing URL: ${url}`);
			const processedPost = await aiWriter.processPost(url);
			return Response.json(processedPost);
		}

		return new Response(`사용 가능한 API:
		- GET /api/reddit?subreddit=LocalLLaMA&limit=5 - Reddit 게시글 목록
		- GET /api/hackernews?minScore=150&limit=10&storyType=top - HackerNews 게시글 목록
		- GET /api/community?platform=all&quality=default - 통합 커뮤니티 게시글 목록
		- GET /api/posts?platform=reddit&community=LocalLLaMA - 저장된 게시글 목록  
		- POST /api/process-reddit - Reddit 게시글 AI 처리 및 저장
		- POST /api/process-hackernews - HackerNews 게시글 AI 처리 및 저장
		- POST /api/process-community - 통합 커뮤니티 게시글 AI 처리 및 저장
		- POST /api/process-url - 임의 URL 아티클 처리
		- GET /api/posts/:id - 특정 게시글 조회`);
	},

	// Cron Trigger를 위한 scheduled 핸들러 추가
	async scheduled(controller, env, ctx): Promise<void> {
		console.log('매 시간마다 실행되는 작업 시작:', new Date(controller.scheduledTime));
		try {
			if (!env.GEMINI_API_KEY) {
				console.error('Gemini API Key가 설정되지 않았습니다.');
				return;
			}

			const result = await processHackernewsPosts({
				limit: 100,
				storyType: 'best'
			})

			console.log(`HackerNews 게시글 처리 결과: ${result.processed}개 처리됨, ${result.saved}개 저장됨, ${result.skipped}개 건너뜀`);
		} catch (error) {
			console.error('Scheduled 작업 중 오류 발생:', error);
		}
	},
} satisfies ExportedHandler<Env>;
