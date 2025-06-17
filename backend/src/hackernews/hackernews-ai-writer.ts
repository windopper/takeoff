import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HackerNewsItem } from "./hackernews-parser";
import { ProcessedPost } from "../manager/post-manager";
import { generateHackernewsPostPrompt } from "../prompts/hackernews-post-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { XmlParseError } from "../exceptions/xml-parse-error";

export interface AIWriteConfig {
    geminiApiKey: string;
    model?: string;
    temperature?: number;
}

export class HackernewsAIWriter {
  private llm: ChatGoogleGenerativeAI;

  constructor(config: AIWriteConfig) {
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: config.geminiApiKey,
      model: config.model || 'gemini-2.5-flash-preview-05-20',
      temperature: config.temperature || 0.4,
    })
  }

  async processPost(post: HackerNewsItem): Promise<ProcessedPost> {
    if (!post.url) {
      throw new Error('Post URL is required');
    }
    const prompt = generateHackernewsPostPrompt({ url: post.url });
    const response = await this.llm.bindTools([{ urlContext: {} }]).pipe(new StringOutputParser()).invoke(prompt);
    const titleMatch = response.match(/<title>\s*(.*?)\s*<\/title>/s);
    const contentMatch = response.match(/<content>\s*(.*?)\s*<\/content>/s);

    if (!titleMatch || !contentMatch) {
      throw new XmlParseError('Failed to parse title or content');
    }

    return {
      title: titleMatch ? titleMatch[1].trim() : post.title,
      content: contentMatch ? contentMatch[1].trim() : response,
      author: post.by,
      originalUrl: post.url,
      category: 'hackernews',
      platform: 'hackernews',
      community: 'hackernews',
      originalTitle: post.title,
      originalAuthor: post.by,
      postScore: 0,
    };
  }
}