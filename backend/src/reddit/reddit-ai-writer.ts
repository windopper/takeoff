import { generateBlogPostPrompt } from '../prompts/blog-post-prompt';
import { CommonAIWriter } from '../common/common-ai-writer';
import { ParserResult } from '../common/common-parser';

export class RedditAIWriter extends CommonAIWriter {
  constructor(subreddit: string) {
    super({
      prompt: (post: ParserResult, similarPosts?: string[]) => generateBlogPostPrompt({
        description: post.description,
        similarPosts,
      }),
      platform: 'reddit',
      community: subreddit,
    });
  }
}
