import { RedditAIWriter } from './reddit-ai-writer';
import { RedditFilter } from './reddit-filter';
import { RedditParser } from './reddit-parser';
import { processPosts, Statistics } from '../common/common-service';
import { CommonFetcher } from '../common/common-fetcher';
import { env } from 'cloudflare:workers';
import { flushLogs, logError, logInfo, logSuccess } from '../log/log-stream-service';

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
		try {
			logInfo(`서브레딧 포스트 처리 시작: ${subreddit.name}`, 'reddit', 'processRedditPosts');
			const aiWriter = new RedditAIWriter(subreddit.name);
			const result = await processPosts({
				url: subreddit.rssUrl,
				platform: 'reddit',
				community: subreddit.name,
			}, fetcher, parser, redditFilter, aiWriter, {
				vectorize: !!env.VECTORIZE,
				webhook: true,
				translate: true,
			});
	
			statistics.total += result.total;
			statistics.filtered += result.filtered;
			statistics.saved += result.saved;
			statistics.skipped += result.skipped;
			logSuccess(`서브레딧 포스트 처리 완료: ${subreddit.name}`, 'reddit', 'processRedditPosts');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logError(`서브레딧 포스트 처리 실패: ${errorMessage}`, 'reddit', 'processRedditPosts');
		}
	}

	logSuccess(`레딧 포스트 처리 완료 (전체: ${statistics.total}, 저장: ${statistics.saved}, 필터링: ${statistics.filtered}, 건너뜀: ${statistics.skipped})`, 'reddit', 'processRedditPosts');
	await flushLogs();

	return statistics;
}
