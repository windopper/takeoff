import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ProcessedPost } from "../manager/post-manager";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ParserResult } from "./common-parser";
import { XmlParseError } from "../exceptions/xml-parse-error";
import { env } from "cloudflare:workers";

export interface Config {
    prompt: (data: ParserResult, simliarPosts?: string[]) => string;
    platform?: string;
    community?: string;
    model?: string;
    temperature?: number;
}

export abstract class CommonAIWriter {
    private llm: ChatGoogleGenerativeAI;
    private prompt: (data: ParserResult, simliarPosts?: string[]) => string;
    private platform: string;
    private community: string;

    constructor(config: Config) {
        this.llm = new ChatGoogleGenerativeAI({
            apiKey: env.GEMINI_API_KEY,
            model: config.model || 'gemini-flash-latest',
            temperature: config.temperature || 0.4,
        })

        this.prompt = config.prompt;
        this.platform = config.platform || 'article';
        this.community = config.community || 'article';
    }

    async processPost(post: ParserResult, simliarPosts?: string[]): Promise<ProcessedPost> {
        const prompt = this.prompt(post, simliarPosts);
        const response = await this.llm.bindTools([{ urlContext: {} }]).pipe(new StringOutputParser()).invoke(prompt);

        const titleMatch = response.match(/<title>\s*(.*?)\s*<\/title>/s);
        const contentMatch = response.match(/<content>\s*(.*?)\s*<\/content>/s);
        const categoryMatch = response.match(/<category>\s*(.*?)\s*<\/category>/s);
        const errorMatch = response.match(/<error>\s*(.*?)\s*<\/error>/s);
    
        if (errorMatch) {
            throw new Error(errorMatch[1].trim());
        }

        if (!titleMatch || !contentMatch || !categoryMatch) {
            throw new XmlParseError('Failed to parse title or content or category');
        }
    
        return {
          title: titleMatch ? titleMatch[1].trim() : "article",
          content: contentMatch ? contentMatch[1].trim() : "",
          author: "takeoff-ai",
          originalUrl: post.url,
          category: categoryMatch[1].trim().split(',').map(c => c.trim()).join(','),
          platform: this.platform,
          community: this.community,
          originalTitle: post.title,
          originalAuthor: post.by,
          postScore: 0,
        };
    }
}