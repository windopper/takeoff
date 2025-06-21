import { RedditAIWriter } from './reddit-ai-writer';
import { RedditFilter } from './reddit-filter';
import { RedditParser } from './reddit-parser';
import { processPosts, Statistics } from '../common/common-service';
import { CommonFetcher } from '../common/common-fetcher';
import { env } from 'cloudflare:workers';

interface ProcessRedditPostsParams {
	limit: number;
}

export const subreddits = [
    // {
    //   name: 'LocalLLaMA',
    //   rssUrl: 'https://www.reddit.com/r/LocalLLaMA/.rss?sort=top'
    // },
    {
      name: 'singularity',
      rssUrl: 'https://www.reddit.com/r/singularity/.rss?sort=top'
    }
  ];

export async function processRedditPosts(params: ProcessRedditPostsParams): Promise<Statistics> {
	const { limit } = params;

	const parser = new RedditParser(limit);
	const redditFilter = new RedditFilter();
	const fetcher = new CommonFetcher();

	const statistics: Statistics = {
		total: 0,
		filtered: 0,
		saved: 0,
		skipped: 0,
	}
	
	for (const subreddit of subreddits) {
		const aiWriter = new RedditAIWriter(subreddit.name);
		const result = await processPosts({
			url: subreddit.rssUrl,
			platform: 'reddit',
			community: subreddit.name,
		}, fetcher, parser, redditFilter, aiWriter, {
			vectorize: !!env.VECTORIZE
		});

		statistics.total += result.total;
		statistics.filtered += result.filtered;
		statistics.saved += result.saved;
		statistics.skipped += result.skipped;
	}

	return statistics;
}
