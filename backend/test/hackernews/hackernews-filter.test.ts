import { beforeEach, describe, expect, test } from 'vitest'
import { HackernewsFilter } from '../../src/hackernews/hackernews-filter';
import { HackerNewsItem } from '../../src/hackernews/hackernews-parser';

describe('HackernewsFilter', () => {
    let mockPost: HackerNewsItem;

    beforeEach(() => {
        mockPost = {
            id: 1,
            title: 'Test Post',
            time: new Date().getTime() / 1000,
            score: 999,
            by: 'Test User',
            type: 'story',
        }
    });

	test('should pass posts', () => {
		const filter = new HackernewsFilter();
		const result = filter.filterAll(mockPost);
		expect(result).toBeNull();
	});

    test('should filter score', () => {
        const filter = new HackernewsFilter({ minScore: 150 });
        mockPost.score = 100;
        const result = filter.filterAll(mockPost);
        expect(result).toBe('score');
    });

    test('should filter time', () => {
        const filter = new HackernewsFilter({ diffDays: 3 });
        mockPost.time = new Date().getTime() / 1000 - 4 * 24 * 60 * 60;
        const result = filter.filterAll(mockPost);
        expect(result).toBe('time');
    });
});