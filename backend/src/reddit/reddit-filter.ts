import { RedditPost } from "./reddit-parser";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { templateLoader } from '../utils/template-loader';

type FilterReason = 'time' | 'keyword' | 'score' | 'ai_relevance';

export interface FilterResult {
  isRelevant: boolean;
  reason: string;
  confidence: number;
}

export class RedditFilter {
    private minScore: number = 100;
    private llm?: ChatGoogleGenerativeAI;

    constructor({ minScore, geminiApiKey }: { minScore?: number; geminiApiKey?: string } = {}) {
        this.minScore = minScore || 100;
        
        if (geminiApiKey) {
            this.llm = new ChatGoogleGenerativeAI({
                apiKey: geminiApiKey,
                model: 'gemini-2.5-flash-preview-05-20',
                temperature: 0.7,
            });
        }
    }

    public filterAll(post: RedditPost): FilterReason | null {
        return this.filterScore(post) || this.filterKeyword(post);
    }

    public filterScore(post: RedditPost): FilterReason | null {
        if (!post.score) {
            return null;
        }

        if (post.score < this.minScore) {
            return 'score';
        }
        return null;
    }

    public filterKeyword(post: RedditPost): FilterReason | null {
        return null;
    }

    /**
     * AI 기반 필터: 새로운 논문이나 기술 관련 게시글인지 판단
     */
    async filterByRelevance(post: RedditPost, subreddit: string): Promise<FilterResult> {
        if (!this.llm) {
            // AI가 설정되지 않은 경우 키워드 기반 fallback 사용
            return this.fallbackKeywordFilter(post, '');
        }

        try {
            const prompt = templateLoader.renderFilterPrompt(
                post.title,
                post.description || post.title,
                subreddit
            );
            
            const chain = this.llm.pipe(new StringOutputParser());
            const result = await chain.invoke(prompt);

            // JSON 응답 파싱 시도
            try {
                // 마크다운 코드 블록 제거
                const cleanResult = result.trim()
                    .replace(/^```(?:json)?/gm, '') // 시작 코드 블록 제거
                    .replace(/```$/gm, '') // 끝 코드 블록 제거
                    .trim();
                
                const parsed = JSON.parse(cleanResult);
                return {
                    isRelevant: parsed.isRelevant || false,
                    reason: parsed.reason || '판단 불가',
                    confidence: parsed.confidence || 0.5,
                };
            } catch (parseError) {
                console.error('JSON 파싱 실패:', parseError);
                console.error('원본 응답:', result);
                // JSON 파싱 실패 시 텍스트에서 키워드로 판단
                return this.fallbackKeywordFilter(post, result);
            }
        } catch (error) {
            console.error('AI 필터링 중 오류:', error);
            // AI 필터링 실패 시 키워드 기반 fallback
            return this.fallbackKeywordFilter(post, '');
        }
    }

    /**
     * AI 필터링 실패 시 사용할 키워드 기반 fallback 필터
     */
    private fallbackKeywordFilter(post: RedditPost, aiResponse: string): FilterResult {
        const content = `${post.title} ${post.description || ''}`.toLowerCase();
        const response = aiResponse.toLowerCase();
        
        const relevantKeywords = [
            'paper', 'research', 'arxiv', 'study', 'published',
            'new', 'release', 'launched', 'announced', 'introduces',
            'breakthrough', 'innovation', 'novel', 'first',
            'github', 'open source', 'framework', 'library', 'tool',
            'ai', 'ml', 'machine learning', 'deep learning',
            'algorithm', 'model', 'neural', 'transformer',
            'beta', 'alpha', 'preview', '2024', '2025'
        ];

        const matches = relevantKeywords.filter(keyword => 
            content.includes(keyword) || response.includes(keyword)
        );

        const isRelevant = matches.length >= 2; // 최소 2개 키워드 매치
        
        return {
            isRelevant,
            reason: `키워드 매치: ${matches.join(', ')}`,
            confidence: Math.min(matches.length / 5, 1.0),
        };
    }

    /**
     * 룰 기반 필터: 추천 수가 최소 기준 이상인지 확인
     */
    private passesScoreFilter(post: RedditPost): boolean {
        const score = post.score || 0;
        return score >= this.minScore;
    }

    /**
     * 게시글을 필터링하여 처리할 가치가 있는지 판단
     */
    async shouldProcessRedditPost(post: RedditPost, subreddit: string): Promise<{
        shouldProcess: boolean;
        scoreFilter: boolean;
        aiFilter: FilterResult;
    }> {
        // 1. 룰 기반 필터: 추천 수 확인
        const scoreFilter = this.passesScoreFilter(post);
        
        if (!scoreFilter) {
            return {
                shouldProcess: false,
                scoreFilter: false,
                aiFilter: { isRelevant: false, reason: '점수 필터 통과 실패', confidence: 0 },
            };
        }

        // 2. AI 기반 필터: 관련성 확인
        const aiFilter = await this.filterByRelevance(post, subreddit);
        
        const shouldProcess = scoreFilter && aiFilter.isRelevant && aiFilter.confidence >= 0.6;
        
        return {
            shouldProcess,
            scoreFilter,
            aiFilter,
        };
    }
}