import { RedditParser } from './reddit-parser';
import { RedditAIWriter } from './reddit-ai-writer';
import { RedditFilter } from './reddit-filter';
import { PostManager } from '../manager/post-manager';
import { FilteredPostManager } from '../manager/filter-post-manager';

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

            const parser = new RedditParser();
            let posts;
            
            if (subreddit) {
                posts = await parser.getTopPosts(subreddit, limit);
                return Response.json({
                    success: true,
                    posts,
                    subreddit,
                    params: { limit },
                    message: `Reddit ${subreddit} 서브레딧: ${posts.length}개 게시글`
                });
            } else {
                const allPosts = await parser.getAllTopPosts(limit);
                return Response.json({
                    success: true,
                    allPosts,
                    params: { limit },
                    message: `Reddit 전체 서브레딧: ${allPosts.length}개 서브레딧`
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
            const limit = body.limit || 10;
            const minScore = body.minScore || 100;
                
            const parser = new RedditParser();
            const aiWriter = new RedditAIWriter({
                geminiApiKey: env.GEMINI_API_KEY,
            });
            const postManager = new PostManager(env.DB);
            const redditFilter = new RedditFilter({ 
                minScore, 
                geminiApiKey: env.GEMINI_API_KEY 
            });
            const filteredPostManager = new FilteredPostManager(env.DB);

            const allPosts = await parser.getAllTopPosts(limit);

            const results = [];
            for (const result of allPosts) {
                if (result.posts.length > 0) {
                    const processResult = await this.processAndSaveRedditPosts(
                        result.posts,
                        result.subreddit,
                        env.DB,
                        aiWriter,
                        redditFilter,
                        postManager,
                        filteredPostManager,
                        minScore
                    );
                    results.push({
                        subreddit: result.subreddit,
                        ...processResult
                    });
                }
            }

            return Response.json({
                success: true,
                results,
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

    // Reddit 게시글을 필터링하고 AI로 처리하여 데이터베이스에 저장하는 통합 함수
    static async processAndSaveRedditPosts(
        posts: any[],
        subreddit: string,
        db: D1Database,
        aiWriter: RedditAIWriter,
        redditFilter: RedditFilter,
        postManager: PostManager,
        filteredPostManager: FilteredPostManager,
        minScore: number = 100
    ): Promise<{ 
        processed: number; 
        saved: number; 
        skipped: number;
        filterStats: {
            total: number;
            alreadyFiltered: number;
            alreadyExists: number;
            scoreFiltered: number;
            aiFiltered: number;
            processed: number;
        };
    }> {
        console.log(`${subreddit}에서 ${posts.length}개 게시글 필터링 및 처리 시작...`);
        console.log(`필터 조건: 최소 추천 수 ${minScore}개, AI 관련성 필터 적용`);

        // 만료된 필터링 기록 정리
        await filteredPostManager.cleanupExpiredFilters();

        const filterStats = {
            total: posts.length,
            alreadyFiltered: 0,
            alreadyExists: 0,
            scoreFiltered: 0,
            aiFiltered: 0,
            processed: 0,
        };

        const processedPosts = [];
        let saved = 0;
        let skipped = 0;

        console.log(`\n=== 필터링 시작: 총 ${posts.length}개 게시글 ===`);

        for (const post of posts) {
            try {
                // 1. 이미 게시글로 작성된 게시글인지 확인
                if (await postManager.isPostExists(post.link)) {
                    console.log(`\n게시글: "${post.title.substring(0, 50)}..."`);
                    console.log('❌ 이미 게시글로 작성됨 - 건너뜀');
                    filterStats.alreadyExists++;
                    skipped++;
                    continue;
                }

                // 2. 이미 필터링된 게시글인지 확인
                if (await filteredPostManager.isPostFiltered(post.link)) {
                    console.log(`\n게시글: "${post.title.substring(0, 50)}..."`);
                    console.log('❌ 이미 필터링된 게시글 - 건너뜀');
                    filterStats.alreadyFiltered++;
                    skipped++;
                    continue;
                }

                // 3. 필터링 검사
                const filterResult = await redditFilter.shouldProcessRedditPost(post, subreddit);
                
                console.log(`\n게시글: "${post.title.substring(0, 50)}..."`);
                console.log(`점수: ${post.score || 0} (최소 ${minScore} 필요)`);
                console.log(`점수 필터: ${filterResult.scoreFilter ? '통과' : '실패'}`);
                console.log(`AI 필터: ${filterResult.aiFilter.isRelevant ? '관련성 있음' : '관련성 없음'} (신뢰도: ${filterResult.aiFilter.confidence.toFixed(2)})`);
                console.log(`이유: ${filterResult.aiFilter.reason}`);
                
                // 4. 점수 필터 실패시 필터링 테이블에 저장
                if (!filterResult.scoreFilter) {
                    filterStats.scoreFiltered++;
                    await filteredPostManager.saveFilteredPost({
                        originalUrl: post.link,
                        originalTitle: post.title,
                        platform: 'reddit',
                        community: subreddit,
                        filterReason: `점수가 최소 기준(${minScore}) 미달`,
                        filterType: 'score',
                        postScore: post.score,
                    });
                    skipped++;
                    continue;
                }
                
                // 5. AI 필터 실패시 필터링 테이블에 저장
                if (!filterResult.aiFilter.isRelevant || filterResult.aiFilter.confidence < 0.6) {
                    filterStats.aiFiltered++;
                    await filteredPostManager.saveFilteredPost({
                        originalUrl: post.link,
                        originalTitle: post.title,
                        platform: 'reddit',
                        community: subreddit,
                        filterReason: filterResult.aiFilter.reason,
                        filterType: 'ai_relevance',
                        confidence: filterResult.aiFilter.confidence,
                        postScore: post.score,
                    });
                    skipped++;
                    continue;
                }
                
                // 6. 필터를 통과한 게시글만 AI로 처리
                console.log('✅ 필터 통과 - AI 처리 시작');
                const processedPost = await aiWriter.processPost(post, subreddit);
                console.log(`처리 완료: ${processedPost.title}`);
                
                const savedPost = await postManager.savePost(processedPost);
                if (savedPost) {
                    saved++;
                }
                
                filterStats.processed++;
                
                // API 호출 제한을 고려하여 잠시 대기
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`게시글 처리 실패 (${post.title}):`, error);
                skipped++;
                continue;
            }
        }

        console.log(`\n=== 필터링 완료 ===`);
        console.log(`총 게시글: ${filterStats.total}`);
        console.log(`이미 게시글로 작성됨: ${filterStats.alreadyExists}`);
        console.log(`이미 필터링됨: ${filterStats.alreadyFiltered}`);
        console.log(`점수 필터로 제외: ${filterStats.scoreFiltered}`);
        console.log(`AI 필터로 제외: ${filterStats.aiFiltered}`);
        console.log(`최종 처리: ${filterStats.processed}`);

        // 필터링 통계 출력
        const filterStatsData = await filteredPostManager.getFilterStats(subreddit);
        if (filterStatsData.length > 0) {
            console.log('\n=== 필터링 통계 ===');
            filterStatsData.forEach(stat => {
                console.log(`${stat.community} - ${stat.filter_type}: ${stat.filtered_count}개 (평균 신뢰도: ${(stat.avg_confidence || 0).toFixed(2)})`);
            });
        }

        return {
            processed: filterStats.processed,
            saved,
            skipped,
            filterStats,
        };
    }
} 