import { beforeEach, describe, expect, test } from 'vitest'
import { HackernewsFilter } from '../../src/hackernews/hackernews-filter';
import { ParserResult } from '../../src/common/common-parser';

describe('HackernewsFilter', () => {
    let mockPost: ParserResult;

    beforeEach(() => {
        mockPost = {
            title: 'Test Post',
            description: 'Test Description',
            publishedAt: new Date().toISOString(),
            url: 'https://test.com',
            score: 999,
            by: 'Test User',
        }
    });

	test('should pass posts', () => {
		const filter = new HackernewsFilter();
		const result = filter.filterAll(mockPost);
		expect(result).toBeNull();
	});

    test('should filter score', () => {
        const filter = new HackernewsFilter();
        mockPost.score = 100;
        const result = filter.filterAll(mockPost);
        expect(result).toBe('score');
    });

    test('should filter time', () => {
        const filter = new HackernewsFilter();
        mockPost.publishedAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
        const result = filter.filterAll(mockPost);
        expect(result).toBe('time');
    });
});