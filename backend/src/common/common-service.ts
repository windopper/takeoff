import { env } from "cloudflare:workers";
import { PostManager } from "../manager/post-manager";
import { ArticleAIWriter } from "./article-ai-writer";

export async function processUrl(url: string) {
    const postManager = new PostManager(env.DB);
    const writer = new ArticleAIWriter({
        geminiApiKey: env.GEMINI_API_KEY,
    });

    const isPostExists = await postManager.isPostExists(url);
    if (isPostExists) {
        throw new Error('Post already exists');
    }

    const processedPost = await writer.processPost(url);
    const savedPost = await postManager.savePost(processedPost);
    return savedPost;
}