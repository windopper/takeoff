import { generateCommonBlogWritePrompt } from "./common-blog-write-prompt";

export interface BlogPostPromptParams {
	description: string;
	similarPosts?: string[];
}

export function generateBlogPostPrompt({ description, similarPosts }: BlogPostPromptParams): string {
	return generateCommonBlogWritePrompt(`내용: ${description}`, similarPosts);
}
