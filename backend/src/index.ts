import { PostManager } from './manager/post-manager';
import { HackerNewsRoutes } from './hackernews/hackernews-routes';
import { RedditRoutes } from './reddit/reddit-routes';
import { ArticleAIWriter } from './common/article-ai-writer';
import { processHackernewsPosts } from './hackernews/hackernews-service';
import { CommonRoutes } from './common/common-routes';
import { processRedditPosts } from './reddit/reddit-service';
import { WebhookRoutes } from './webhook/webhook-routes';

export interface Env {
	// If you set another name in the Wrangler config file for the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
	// Google Gemini API Key를 환경 변수로 추가
	GEMINI_API_KEY: string;
	// Static Assets binding
	ASSETS: Fetcher;
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

		// /api/posts 형식으로 게시글 목록 조회 API
		if (pathname === "/api/posts") {
			return await CommonRoutes.getPosts(request, env);
		}

		if (pathname === "/api/post-count") {
			return await CommonRoutes.getPostCount(request, env);
		}

		// /api/posts/:id 형식으로 특정 게시글 조회 API
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

		if (pathname === "/api/webhook-register" && request.method === 'POST') {
			return await WebhookRoutes.createWebhookUrl(request, env);
		}

		if (pathname === "/api/webhook-list") {
			return await WebhookRoutes.getWebhookList(request, env);
		}

		if (pathname === "/api/webhook-delete" && request.method === 'POST') {
			return await WebhookRoutes.deleteWebhookUrl(request, env);
		}

		if (pathname === "/api/webhook-test" && request.method === 'POST') {
			return await WebhookRoutes.sendWebhookTest(request, env);
		}

		if (pathname === "/takeoff.png") {
			try {
				return await env.ASSETS.fetch(request);
			} catch (error) {
				console.error('이미지 파일 제공 중 오류:', error);
				return new Response('이미지를 불러올 수 없습니다.', {
					status: 500,
					headers: {
						'Content-Type': 'text/plain; charset=utf-8',
					},
				});
			}
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

			const hackernewResult = await processHackernewsPosts({
				limit: 100,
				storyType: 'best'
			})
			console.log(`HackerNews 게시글 처리 결과: ${hackernewResult.processed}개 처리됨, ${hackernewResult.saved}개 저장됨, ${hackernewResult.skipped}개 건너뜀`);

			const redditResult = await processRedditPosts({
				limit: 15,
			})
			console.log(`Reddit 게시글 처리 결과: ${redditResult.processed}개 처리됨, ${redditResult.saved}개 저장됨, ${redditResult.skipped}개 건너뜀`);
		} catch (error) {
			console.error('Scheduled 작업 중 오류 발생:', error);
		}
	},
} satisfies ExportedHandler<Env>;
