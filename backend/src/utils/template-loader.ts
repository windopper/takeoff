import { generateFilterPrompt, FilterPromptParams } from '../prompts/filter-prompt';
import { generateBlogPostPrompt, BlogPostPromptParams } from '../prompts/blog-post-prompt';

export class TemplateLoader {
  constructor() {
    // 더 이상 Nunjucks 환경 설정이 필요하지 않음
  }

  /**
   * 필터링 프롬프트를 생성합니다.
   */
  renderFilterPrompt(title: string, description: string, subreddit: string): string {
    return generateFilterPrompt({
      title,
      description,
      subreddit,
    });
  }

  /**
   * 블로그 포스트 프롬프트를 생성합니다. (새로운 인터페이스 사용)
   */
  renderBlogPostPrompt(
    description: string,
  ): string {
    return generateBlogPostPrompt({
      description,
    });
  }

  /**
   * 레거시 호환성을 위한 Reddit 전용 메서드
   */
  renderRedditBlogPostPrompt(
    description: string,
  ): string {
    return this.renderBlogPostPrompt(
      description,
    );
  }
}

export const templateLoader = new TemplateLoader(); 