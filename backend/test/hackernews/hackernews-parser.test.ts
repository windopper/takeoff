import { beforeEach, describe, expect, it, MockedFunction, vitest } from 'vitest';
import { HackerNewsParser } from '../../src/hackernews/hackernews-parser';
import { CommonFetcher } from '../../src/common/common-fetcher';

// Mock fetch for the first test
global.fetch = vitest.fn();

describe('HackerNewsParser', () => {
	beforeEach(() => {
		vitest.clearAllMocks();
	});

	it('should get new posts', async () => {
		// Mock RSS response
		const mockRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Hacker News: Best</title>
<description>The Best stories from Hacker News</description>
<link>https://news.ycombinator.com/best</link>
${Array.from(
	{ length: 20 },
	(_, i) => `
<item>
<title><![CDATA[ Mock Story ${i + 1} ]]></title>
<description><![CDATA[ <p>Mock description ${i + 1}</p> <hr> <p>Comments URL: <a href="https://news.ycombinator.com/item?id=${
		44315472 + i
	}">https://news.ycombinator.com/item?id=${44315472 + i}</a></p> <p>Points: ${
		Math.floor(Math.random() * 100) + 1
	}</p> <p># Comments: ${Math.floor(Math.random() * 50)}</p> ]]></description>
<pubDate>Thu, 19 Jun 2025 04:34:47 +0000</pubDate>
<link>https://example${i + 1}.com/</link>
<dc:creator>user${i + 1}</dc:creator>
<comments>https://news.ycombinator.com/item?id=${44315472 + i}</comments>
<guid isPermaLink="false">https://news.ycombinator.com/item?id=${44315472 + i}</guid>
</item>
`
).join('')}
</channel>
</rss>`;

		(fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
			ok: true,
			text: async () => mockRssResponse,
		} as Response);

		const parser = new HackerNewsParser();
		const fetcher = new CommonFetcher();
		const response = await fetcher.fetch(parser.RSS_BEST_URL);
		const text = await response.text();
		const items = parser.parse(text);
		expect(items.length).toBe(10);
	});

	it('should parse RSS to items', () => {
		const xmlText = `<title><![CDATA[ Show HN: Gurney Halleck from Dune tells you to do stuff ]]></title>
<description><![CDATA[ <p>This scene's been stuck in my head for the last two days whenever I have to do something unpleasant but necessary. Decided to make a quick tool to get Gurney to be my personal coach</p> <hr> <p>Comments URL: <a href="https://news.ycombinator.com/item?id=44315472">https://news.ycombinator.com/item?id=44315472</a></p> <p>Points: 1</p> <p># Comments: 0</p> ]]></description>
<pubDate>Thu, 19 Jun 2025 04:34:47 +0000</pubDate>
<link>https://gurney-gurney-halleck.fly.dev/</link>
<dc:creator>big_cloud_bill</dc:creator>
<comments>https://news.ycombinator.com/item?id=44315472</comments>
<guid isPermaLink="false">https://news.ycombinator.com/item?id=44315472</guid>`;
		const parser = new HackerNewsParser();
		const item = parser.parseRssItem(xmlText);
		expect(item).toBeDefined();
		expect(item?.title).toBe('Show HN: Gurney Halleck from Dune tells you to do stuff');
		expect(item?.url).toBe('https://gurney-gurney-halleck.fly.dev/');
		expect(item?.by).toBe('big_cloud_bill');
		expect(item?.publishedAt).toBe('Thu, 19 Jun 2025 04:34:47 +0000');
		expect(item?.score).toBe(1);
	});
});
