import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RedditPost } from './reddit-parser';
import { templateLoader } from '../utils/template-loader';
import { PostManager, ProcessedPost } from '../manager/post-manager';

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
  async processPost(post: RedditPost, subreddit: string): Promise<ProcessedPost> {
    try {
      const prompt = templateLoader.renderRedditBlogPostPrompt(
        post.description,
      );
      
      const chain = this.llm.pipe(new StringOutputParser());
      const result = await chain.invoke(prompt);

      // AI 응답에서 제목과 내용을 분리
      const titleMatch = result.match(/제목:\s*(.+)/);
      const contentMatch = result.match(/내용:\s*([\s\S]+?)(?=---|\n\n출처:|$)/);
      
      const processedTitle = titleMatch ? titleMatch[1].trim() : post.title;
      const processedContent = contentMatch ? contentMatch[1].trim() : result;

      return {
        title: processedTitle,
        content: processedContent,
        author: 'AI Assistant', // AI가 정리한 글이므로
        originalUrl: post.link,
        category: post.category || 'General',
        platform: 'reddit', // 현재는 Reddit만 지원
        community: subreddit,
        originalTitle: post.title,
        originalAuthor: post.author,
        postScore: post.score,
      };
    } catch (error) {
      console.error('AI 처리 중 오류:', error);
      throw new Error(`AI 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }
}
