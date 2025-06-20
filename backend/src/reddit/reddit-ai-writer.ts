import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RedditPost } from './reddit-parser';
import { ProcessedPost } from '../manager/post-manager';
import { XmlParseError } from '../exceptions/xml-parse-error';
import { generateBlogPostPrompt } from '../prompts/blog-post-prompt';

export interface AIWriteConfig {
  geminiApiKey: string;
  model?: string;
  temperature?: number;
}

export class RedditAIWriter {
  private llm: ChatGoogleGenerativeAI;

  constructor(config: AIWriteConfig) {
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: config.geminiApiKey,
      model: config.model || 'gemini-2.5-flash-preview-05-20',
      temperature: config.temperature || 0.7,
    });
  }

  /**
   * Reddit 게시글을 AI로 정리합니다.
   */
  async processPost(post: RedditPost, subreddit: string, similarPosts?: string[]): Promise<ProcessedPost> {
    try {
      const prompt = generateBlogPostPrompt({
        description: post.description,
        similarPosts,
      });
      
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

      const category = categoryMatch[1].trim().split(',').map(c => c.trim());

      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        author: 'takeoff-writer',
        originalUrl: post.link,
        category: category.join(','),
        platform: 'reddit', // 현재는 Reddit만 지원
        community: subreddit,
        originalTitle: post.title,
        originalAuthor: post.author,
        postScore: 0,
      };
    } catch (error) {
      console.error('AI 처리 중 오류:', error);
      throw new Error(`AI 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }
}
