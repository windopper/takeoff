import { PostManager, ProcessedPost } from './manager/post-manager';
import { HackerNewsRoutes } from './hackernews/hackernews-routes';
import { RedditRoutes } from './reddit/reddit-routes';
import { ArticleAIWriter } from './common/article-ai-writer';
import { processHackernewsPosts } from './hackernews/hackernews-service';
import { CommonRoutes } from './common/common-routes';
import { processRedditPosts } from './reddit/reddit-service';
import { WebhookRoutes } from './webhook/webhook-routes';
import { ArxivRoutes } from './arxiv/arxiv-routes';
import { FilteredPostManager } from './manager/filter-post-manager';
import { FetchError } from './exceptions/fetch-error';
import { XmlParseError } from './exceptions/xml-parse-error';

export interface Env {
	// If you set another name in the Wrangler config file for the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
	// Google Gemini API Key를 환경 변수로 추가
	GEMINI_API_KEY: string;
	// Static Assets binding
	ASSETS: Fetcher;
	// 허용된 호스트 목록
	ALLOWED_HOSTS: string;
	TAKEOFF_API_KEY: string;
}

function checkApiKey(request: Request, env: Env): boolean {
	const apiKey = request.headers.get('Takeoff-Api-Key');
	return apiKey === env.TAKEOFF_API_KEY;
}

// CORS 헤더를 추가하는 헬퍼 함수
function addCorsHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Takeoff-Api-Key, Authorization');
	headers.set('Access-Control-Max-Age', '86400');
	
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: headers
	});
}

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);
		
		// OPTIONS 요청 (CORS preflight) 처리
		if (request.method === 'OPTIONS') {
			return addCorsHeaders(new Response(null, { status: 204 }));
		}
		
		if (pathname === "/takeoff.png") {
			try {
				const assetResponse = await env.ASSETS.fetch(request);
				return addCorsHeaders(assetResponse);
			} catch (error) {
				console.error('이미지 파일 제공 중 오류:', error);
				const errorResponse = new Response('이미지를 불러올 수 없습니다.', {
					status: 500,
					headers: {
						'Content-Type': 'text/plain; charset=utf-8',
					},
				});
				return addCorsHeaders(errorResponse);
			}
		}

		// Error Handling Boundary
		try {
			if (!checkApiKey(request, env)) {
				const forbiddenResponse = new Response('Forbidden', { status: 403 });
				return addCorsHeaders(forbiddenResponse);
			}
	
			if (pathname === "/api/reddit") {
				const response = await RedditRoutes.getRedditPosts(request);
				return addCorsHeaders(response);
			}
	
			// HackerNews 게시글 목록 조회 API
			if (pathname === "/api/hackernews") {
				const response = await HackerNewsRoutes.getHackerNewsPosts(request);
				return addCorsHeaders(response);
			}
	
			// /api/posts 형식으로 게시글 목록 조회 API
			if (pathname === "/api/posts" && request.method === 'GET') {
				const response = await CommonRoutes.getPosts(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/post-count" && request.method === 'GET') {
				const response = await CommonRoutes.getPostCount(request, env);
				return addCorsHeaders(response);
			}
	
			// /api/posts/:id 형식으로 특정 게시글 조회 API
			if (pathname.startsWith("/api/posts/") && request.method === 'GET') {
				const response = await CommonRoutes.getPostById(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname.startsWith("/api/posts/") && request.method === 'DELETE') {
				const response = await CommonRoutes.deletePost(request, env);
				return addCorsHeaders(response);
			}
	
			// Reddit 게시글을 AI로 처리하고 저장하는 API
			if (pathname === "/api/process-reddit" && request.method === 'POST') {
				const response = await RedditRoutes.processRedditPosts(request, env);
				return addCorsHeaders(response);
			}
	
			// HackerNews 게시글을 AI로 처리하고 저장하는 API
			if (pathname === "/api/process-hackernews" && request.method === 'POST') {
				const response = await HackerNewsRoutes.processHackerNewsPosts(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/process-arxiv" && request.method === 'POST') {
				const response = await ArxivRoutes.processArxivPaper(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/process-url" && request.method === 'POST') {
				const response = await CommonRoutes.processUrl(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/webhook-register" && request.method === 'POST') {
				const response = await WebhookRoutes.createWebhookUrl(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/webhook-list") {
				const response = await WebhookRoutes.getWebhookList(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/webhook-delete" && request.method === 'POST') {
				const response = await WebhookRoutes.deleteWebhookUrl(request, env);
				return addCorsHeaders(response);
			}
	
			if (pathname === "/api/webhook-test" && request.method === 'POST') {
				const response = await WebhookRoutes.sendWebhookTest(request, env);
				return addCorsHeaders(response);
			}
	
			const helpResponse = new Response(`사용 가능한 API:
			- GET /api/reddit?subreddit=LocalLLaMA&limit=5 - Reddit 게시글 목록
			- GET /api/hackernews?minScore=150&limit=10&storyType=top - HackerNews 게시글 목록
			- GET /api/community?platform=all&quality=default - 통합 커뮤니티 게시글 목록
			- GET /api/posts?platform=reddit&community=LocalLLaMA - 저장된 게시글 목록  
			- POST /api/process-reddit - Reddit 게시글 AI 처리 및 저장
			- POST /api/process-hackernews - HackerNews 게시글 AI 처리 및 저장
			- POST /api/process-community - 통합 커뮤니티 게시글 AI 처리 및 저장
			- POST /api/process-url - 임의 URL 아티클 처리
			- GET /api/posts/:id - 특정 게시글 조회`);
			return addCorsHeaders(helpResponse);
		} catch (error) {
			if (error instanceof FetchError) {
				return new Response(error.message, { status: 400 });
			} else if (error instanceof XmlParseError) {
				return new Response(error.message, { status: 400 });
			}
			console.error(error);
			return new Response('Internal Server Error', { status: 500 });
		}

	},

	// Cron Trigger를 위한 scheduled 핸들러 추가
	async scheduled(controller, env, ctx): Promise<void> {
		console.log('매 시간마다 실행되는 작업 시작:', new Date(controller.scheduledTime));
		try {
			if (!env.GEMINI_API_KEY) {
				console.error('Gemini API Key가 설정되지 않았습니다.');
				return;
			}

			const filteredPostManager = new FilteredPostManager(env.DB);
			await filteredPostManager.cleanupExpiredFilters();

			const postManager = new PostManager(env.DB);
			const deletedPosts = await postManager.cleanupOldPosts();
			console.log(`오래된 게시글 삭제 결과: ${deletedPosts}개 삭제됨`);

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
