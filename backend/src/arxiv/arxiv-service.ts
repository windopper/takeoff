import { env } from "cloudflare:workers";
import { ArxivAIWriter } from "./arxiv-ai-writer";
import { ArxivParser } from "./arxiv-parser";
import { PostManager, ProcessedPost } from "../manager/post-manager";

interface ProcessArxivPaperParams {
    url: string;
}

interface ProcessArxivPaperResult {
    success: boolean;
    message: string;
}

export async function processArxivPaper(params: ProcessArxivPaperParams): Promise<ProcessArxivPaperResult> {
    const postManager = new PostManager(env.DB);
    const parser = new ArxivParser();

    if (await postManager.isPostExists(params.url)) {
        return {
            success: true,
            message: 'Post already exists',
        }
    }

    const paper = await parser.fetchPaper(params.url);
    console.log("Arxiv Service: 파일 페칭 완료", paper.url);
    
    const writer = new ArxivAIWriter({
        geminiApiKey: env.GEMINI_API_KEY,
    })

    const processedPost = await writer.processPaper(paper);
    console.log("Arxiv Service: 포스트 생성 완료", processedPost.title);

    const savedPost = await postManager.savePost(processedPost);
    console.log("Arxiv Service: 포스트 저장 완료");

    if (!savedPost) {
        return {
            success: false,
            message: 'Post not saved',
        }
    }
    
    return {
        success: true,
        message: 'Post processed',
    }
}