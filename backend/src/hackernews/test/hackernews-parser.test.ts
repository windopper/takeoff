import { HackerNewsParser } from "../hackernews-parser";

describe('HackerNewsParser', () => {
  it('should parse RSS to items', async () => {
    const parser = new HackerNewsParser();
    const items = await parser.getBestPosts(20);
    console.log(items);
    expect(items.length).toBe(20);
  });
});