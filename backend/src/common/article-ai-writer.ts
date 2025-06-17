import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ProcessedPost } from "../manager/post-manager";
import { generateHackernewsPostPrompt } from "../prompts/hackernews-post-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";

export interface AIWriteConfig {
    geminiApiKey: string;
    model?: string;
    temperature?: number;
}

export class ArticleAIWriter {
  private llm: ChatGoogleGenerativeAI;

  constructor(config: AIWriteConfig) {
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: config.geminiApiKey,
      model: config.model || 'gemini-2.5-flash-preview-05-20',
      temperature: config.temperature || 0.7,
    })
  }

  async processPost(url: string): Promise<ProcessedPost> {
    if (!url) {
      throw new Error('URL is required');
    }
    const prompt = generateHackernewsPostPrompt({ url });
    const response = await this.llm.bindTools([{ urlContext: {} }]).pipe(new StringOutputParser()).invoke(prompt);
    const titleMatch = response.match(/<title>\s*(.*?)\s*<\/title>/s);
    const contentMatch = response.match(/<content>\s*(.*?)\s*<\/content>/s);

    if (!titleMatch || !contentMatch) {
      throw new Error('Failed to parse title or content');
    }

    return {
      title: titleMatch ? titleMatch[1].trim() : "article",
      content: contentMatch ? contentMatch[1].trim() : response,
      author: "takeoff-ai",
      originalUrl: url,
      category: 'article',
      platform: 'article',
      community: 'article',
      originalTitle: "article",
      originalAuthor: "takeoff-ai",
      postScore: 0,
    };
  }
}