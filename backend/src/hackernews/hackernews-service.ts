import { HackernewsFilter } from './hackernews-filter';
import { HackerNewsParser } from './hackernews-parser';
import { HackernewsAIWriter } from './hackernews-ai-writer';
import { processPosts, Statistics } from '../common/common-service';
import { CommonFetcher } from '../common/common-fetcher';

interface ProcessHackernewsPostsParams {
	limit: number;
	storyType: string;
}

export async function processHackernewsPosts(params: ProcessHackernewsPostsParams): Promise<Statistics> {
	const { limit, storyType } = params;

	const parser = new HackerNewsParser(limit);
	const aiWriter = new HackernewsAIWriter();
	const filter = new HackernewsFilter();
	const fetcher = new CommonFetcher()

	return await processPosts({
		url: storyType === 'newest' ? parser.RSS_NEWEST_URL : parser.RSS_BEST_URL,
		platform: 'hackernews',
		community: 'hackernews',
	}, fetcher, parser, filter, aiWriter);
}
