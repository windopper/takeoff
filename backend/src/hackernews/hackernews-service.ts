import { env } from 'cloudflare:workers';
import { HackernewsFilter } from './hackernews-filter';
import { HackerNewsParser } from './hackernews-parser';
import { HackernewsAIWriter } from './hackernews-ai-writer';
import { PostManager } from '../manager/post-manager';
import { FilteredPostManager } from '../manager/filter-post-manager';
import { XmlParseError } from '../exceptions/xml-parse-error';
import { WebhookService } from '../webhook/webhook-service';
import { FRONTEND_URL, PUBLIC_URL } from '../constants';

interface ProcessHackernewsPostsParams {
	limit: number;
	storyType: string;
}

interface ProcessHackernewsPostsResult {
	success: boolean;
	processed: number;
	saved: number;
	skipped: number;
}

export async function processHackernewsPosts(params: ProcessHackernewsPostsParams): Promise<ProcessHackernewsPostsResult> {
	const { limit, storyType } = params;

	const parser = new HackerNewsParser();
	const aiWriter = new HackernewsAIWriter({
		geminiApiKey: env.GEMINI_API_KEY,
	});
	const postManager = new PostManager(env.DB);
	const postFilter = new HackernewsFilter();
	const filteredPostManager = new FilteredPostManager(env.DB);
	let hackernews;

	switch (storyType) {
		case 'new':
			hackernews = await parser.getNewPosts(limit);
			break;
		case 'best':
			hackernews = await parser.getBestPosts(limit);
			break;
		default:
			hackernews = await parser.getBestPosts(limit);
	}

	if (hackernews.length === 0) {
		return {
			success: true,
			processed: 0,
			saved: 0,
			skipped: 0,
		};
	}

	let processed = 0;
	let saved = 0;
	let skipped = 0;

	for (const item of hackernews) {
		processed++;
		if (!item.url) {
			console.log(`url이 없는 게시글: ${item.title}`);
			skipped++;
			continue;
		}

		const isExists = await postManager.isPostExists(item.url);

		// 이미 처리된 게시글 필터링
		if (isExists) {
			console.log(`이미 처리된 게시글: ${item.title}`);
			skipped++;
			continue;
		}

		const filterReason = postFilter.filterAll(item);

		if (filterReason) {
			if (filterReason === 'ai_relevance') {
				await filteredPostManager.saveFilteredPost({
					community: 'hackernews',
					filterReason: filterReason,
					filterType: filterReason,
					originalUrl: item.url,
					originalTitle: item.title,
					platform: 'hackernews',
					postScore: item.score,
					confidence: 0.5,
				});
			}
			console.log(`${item.title} 필터링 완료: ${filterReason}`);
			skipped++;
			continue;
		}

		try {
			console.log(`처리 중: ${item.title} (점수: ${item.score})`);
			const processedPost = await aiWriter.processPost(item);
			console.log(`처리 완료: ${processedPost.title}`);
			const savedPost = await postManager.savePost(processedPost);
			if (savedPost) saved++;

			// 웹훅 전송
			await WebhookService.sendWebhookBatchToSubscribers([{
				title: processedPost.title,
				content: processedPost.content,
				url: `${FRONTEND_URL}/posts/${savedPost}`,
			}]);
		} catch (error) {
            if (error instanceof XmlParseError) {
                console.error('HackerNews 게시글 처리 중 오류:', error);
                skipped++;

                await filteredPostManager.saveFilteredPost({
                    community: 'hackernews',
                    filterReason: 'xml_parse_error',
                    filterType: 'xml_parse_error',
                    originalUrl: item.url,
                    originalTitle: item.title,
                    platform: 'hackernews',
                    postScore: 0,
                    confidence: 0.5,
                });
            } else {
                console.error('HackerNews 게시글 처리 중 오류:', error);
                skipped++;
            }
			continue;
		}
	}

	return {
		success: true,
		processed,
		saved,
		skipped,
	};
}
