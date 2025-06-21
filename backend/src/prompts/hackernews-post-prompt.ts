import { generateCommonBlogWritePrompt } from "./common-blog-write-prompt";

export interface HackernewsPostPromptParams {
	url: string;
	similarPosts?: string[];
}

export function generateHackernewsPostPrompt({ url, similarPosts }: HackernewsPostPromptParams): string {
	return generateCommonBlogWritePrompt(`링크: ${url}`, similarPosts);
}
 