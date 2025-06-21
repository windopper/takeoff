import { HackernewsFilter } from './hackernews-filter';
import { HackerNewsParser } from './hackernews-parser';
import { HackernewsAIWriter } from './hackernews-ai-writer';
import { processPosts, Statistics } from '../common/common-service';
import { CommonFetcher } from '../common/common-fetcher';
import { logInfo, logSuccess, logError, flushLogs } from '../log/log-stream-service';
import { env } from 'cloudflare:workers';

interface ProcessHackernewsPostsParams {
	limit: number;
	storyType: string;
}

export async function processHackernewsPosts(params: ProcessHackernewsPostsParams): Promise<Statistics> {
	const { limit, storyType } = params;

	await logInfo(`HackerNews 포스트 처리 시작 (타입: ${storyType}, 제한: ${limit})`, 'hackernews', 'process');

	try {
		const parser = new HackerNewsParser(limit);
		const aiWriter = new HackernewsAIWriter();
		const filter = new HackernewsFilter();
		const fetcher = new CommonFetcher()

		const result = await processPosts({
			url: storyType === 'newest' ? parser.RSS_NEWEST_URL : parser.RSS_BEST_URL,
			platform: 'hackernews',
			community: 'hackernews',
		}, fetcher, parser, filter, aiWriter, {
			vectorize: !!env.VECTORIZE,
			webhook: true,
		});

		await logSuccess(`HackerNews 포스트 처리 완료 (전체: ${result.total}, 저장: ${result.saved}, 필터링: ${result.filtered}, 건너뜀: ${result.skipped})`, 'hackernews', 'process');
		await flushLogs();
		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		await logError(`HackerNews 포스트 처리 실패: ${errorMessage}`, 'hackernews', 'process');
		throw error;
	}
}
