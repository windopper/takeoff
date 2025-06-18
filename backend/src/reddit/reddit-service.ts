import { env } from 'cloudflare:workers';
import { FilteredPostManager } from '../manager/filter-post-manager';
import { RedditAIWriter } from './reddit-ai-writer';
import { RedditFilter } from './reddit-filter';
import { PostManager } from '../manager/post-manager';
import { RedditParser } from './reddit-parser';
import { XmlParseError } from '../exceptions/xml-parse-error';

interface ProcessRedditPostsParams {
	limit: number;
}

interface ProcessRedditPostsResult {
	success: boolean;
	processed: number;
	saved: number;
	skipped: number;
}

const MIN_SCORE = 150;

export async function processRedditPosts(params: ProcessRedditPostsParams): Promise<ProcessRedditPostsResult> {
	const { limit } = params;

	const parser = new RedditParser();
	const aiWriter = new RedditAIWriter({
		geminiApiKey: env.GEMINI_API_KEY,
	});
	const postManager = new PostManager(env.DB);
	const redditFilter = new RedditFilter({ minScore: MIN_SCORE, geminiApiKey: env.GEMINI_API_KEY });
	const filteredPostManager = new FilteredPostManager(env.DB);

	await filteredPostManager.cleanupExpiredFilters();

	const postWithSubreddit = await parser.getAllTopPosts(limit);

	const filterStats = {
		total: postWithSubreddit.map((subReddit) => subReddit.posts.length).reduce((a, b) => a + b, 0),
		alreadyFiltered: 0,
		alreadyExists: 0,
		scoreFiltered: 0,
		aiFiltered: 0,
		processed: 0,
	};

	let saved = 0;
	let skipped = 0;

	for (const subReddit of postWithSubreddit) {
		for (const post of subReddit.posts) {
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
				const filterResult = await redditFilter.shouldProcessRedditPost(post, subReddit.subreddit);

				console.log(`\n게시글: "${post.title.substring(0, 50)}..."`);
				console.log(`점수: ${post.score || 0} (최소 ${MIN_SCORE} 필요)`);
				console.log(`점수 필터: ${filterResult.scoreFilter ? '통과' : '실패'}`);
				console.log(
					`AI 필터: ${filterResult.aiFilter.isRelevant ? '관련성 있음' : '관련성 없음'} (신뢰도: ${filterResult.aiFilter.confidence.toFixed(
						2
					)})`
				);
				console.log(`이유: ${filterResult.aiFilter.reason}`);

				// 4. 점수 필터 실패시 스킵
				if (!filterResult.scoreFilter) {
					filterStats.scoreFiltered++;
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
						community: subReddit.subreddit,
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
				const processedPost = await aiWriter.processPost(post, subReddit.subreddit);
				console.log(`처리 완료: ${processedPost.title}`);

				const savedPost = await postManager.savePost(processedPost);
				if (savedPost) {
					saved++;
				}

				filterStats.processed++;

				// API 호출 제한을 고려하여 잠시 대기
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (error) {
                if (error instanceof XmlParseError) {
                    console.error('Reddit 게시글 처리 중 오류:', error);
                    skipped++;
                    await filteredPostManager.saveFilteredPost({
                        community: subReddit.subreddit,
                        filterReason: 'xml_parse_error',
                        filterType: 'xml_parse_error',
                        originalUrl: post.link,
                        originalTitle: post.title,
                        platform: 'reddit',
                        postScore: 0,
                        confidence: 0.5,
                    });
                } else {
                    console.error(`게시글 처리 실패 (${post.title}):`, error);
                    skipped++;
                }
				continue;
			}
		}
	}

	return {
		success: true,
		processed: filterStats.processed,
		saved: saved,
		skipped: skipped,
	};
}
