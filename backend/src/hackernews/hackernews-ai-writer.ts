import { generateHackernewsPostPrompt } from "../prompts/hackernews-post-prompt";
import { CommonAIWriter } from "../common/common-ai-writer";
import { ParserResult } from "../common/common-parser";

export class HackernewsAIWriter extends CommonAIWriter {
  constructor() {
    super({
			prompt: (post: ParserResult, similarPosts?: string[]) => generateHackernewsPostPrompt({ url: post.url, similarPosts }),
      platform: 'hackernews',
      community: 'hackernews',
		});
  }
}