import { CommonFetcher } from '../common/common-fetcher';
import { ParserResult } from '../common/common-parser';
import { RedditParser } from './reddit-parser';
import { processRedditPosts, subreddits } from './reddit-service';

export interface Env {
    DB: D1Database;
    GEMINI_API_KEY: string;
}

export class RedditRoutes {
    // Reddit 게시글 목록 조회 API
    static async getRedditPosts(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get('limit') || '5');
            const subreddit = url.searchParams.get('subreddit');
            const fetcher = new CommonFetcher();
            const parser = new RedditParser(limit);
            let posts;
            
            if (subreddit) {
                const response = await fetcher.fetch(subreddit);
                const text = await response.text();
                posts = parser.parse(text);
                return Response.json({
                    success: true,
                    posts,
                    subreddit,
                    params: { limit },
                    message: `Reddit ${subreddit} 서브레딧: ${posts.length}개 게시글`
                });
            } else {
                let posts: ParserResult[] = [];
                for (const subreddit of subreddits) {
                    const response = await fetcher.fetch(subreddit.rssUrl);
                    const text = await response.text();
                    posts.push(...parser.parse(text));
                }
                return Response.json({
                    success: true,
                    posts,
                    params: { limit },
                    message: `Reddit 전체 서브레딧: ${posts.length}개 서브레딧`
                });
            }
        } catch (error) {
            console.error('Reddit 게시글 조회 중 오류:', error);
            return Response.json({
                error: 'Reddit 게시글 조회 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : '알 수 없는 오류'
            }, { status: 500 });
        }
    }

    // Reddit 게시글을 AI로 처리하고 저장하는 API
    static async processRedditPosts(request: Request, env: Env): Promise<Response> {
        try {
            if (!env.GEMINI_API_KEY) {
                return Response.json({ error: 'Gemini API Key가 설정되지 않았습니다.' }, { status: 500 });
            }

            const body = await request.json().catch(() => ({})) as any;
            const limit = body.limit || 20;
                
            const result = await processRedditPosts({ limit });
            const { filtered, saved, skipped, total } = result;

            return Response.json({
                total,
                filtered,
                saved,
                skipped,
                params: { limit },
                message: 'Reddit 게시글 처리 및 저장 완료'
            });
        } catch (error) {
            console.error('Reddit 게시글 처리 중 오류:', error);
            return Response.json({
                error: 'Reddit 게시글 처리 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : '알 수 없는 오류'
            }, { status: 500 });
        }
    }
} 