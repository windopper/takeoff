import { HackerNewsItem } from "./hackernews-parser";

type FilterReason = 'time' | 'keyword' | 'score' | 'ai_relevance';

export class HackernewsFilter {
	private minScore: number = 150;

	constructor({ minScore }: { minScore: number } = { minScore: 150 }) {
		this.minScore = minScore;
	}

	public filterAll(post: HackerNewsItem): FilterReason | null {
		return this.filterTime(post) || this.filterKeyword(post) || this.filterScore(post);
	}

	// 3일 이상 경과된 게시글 필터링
	public filterTime(post: HackerNewsItem): FilterReason | null {
		const now = new Date();
		const postDate = new Date(post.time * 1000);
		const diffTime = Math.abs(now.getTime() - postDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 3) {
			return 'time';
		}
		return null;
	}

	public filterKeyword(post: HackerNewsItem): FilterReason | null {
		return null;
	}

	public filterScore(post: HackerNewsItem): FilterReason | null {
		if (post.score < this.minScore) {
			return 'score';
		}
		return null;
	}
}