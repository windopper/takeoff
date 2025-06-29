import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { generateFilterPrompt } from "../prompts/filter-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ParserResult } from "./common-parser";
import { env } from "cloudflare:workers";
import { FilteredPostManager } from "../manager/filter-post-manager";

export type FilterReason = 'time' | 'keyword' | 'score' | 'ai_relevance' | 'already_exists';

export interface FilterResult {
    shouldProcess: boolean;
    aiReason?: string;
    reason?: FilterReason;
    confidence?: number;
}

export class CommonFilter {
    private minScore: number;
    private diffDays: number;
    private llm?: ChatGoogleGenerativeAI;
    private filterManager: FilteredPostManager;

    constructor({ minScore = 150, diffDays = 3 }: { minScore?: number; diffDays?: number;} = {}) {
        this.minScore = minScore;
        this.diffDays = diffDays;
        this.llm = new ChatGoogleGenerativeAI({
            apiKey: env.GEMINI_API_KEY,
            model: 'gemini-2.5-flash-preview-05-20',
            temperature: 0.4,
        });
        this.filterManager = new FilteredPostManager(env.DB);
    }

	async filterAll(post: ParserResult): Promise<FilterResult> {
        if (!this.filterScore(post.score)) {
            return {
                shouldProcess: false,
                reason: 'score',
            };
        }

        if (!this.filterTime(post.publishedAt)) {
            return {
                shouldProcess: false,
                reason: 'time',
            };
        }

        const isFiltered = await this.filterManager.isPostFiltered(post.url);
        if (isFiltered) {
            return {
                shouldProcess: false,
                reason: 'already_exists',
            };
        }

        const result = await this.filterByRelevance(post);
        if (result) {
            return {
                shouldProcess: false,
                aiReason: result.reason,
                reason: 'ai_relevance',
                confidence: result.confidence,
            };
        }

        return {
            shouldProcess: true,
        };
	}

    filterScore(score: number): boolean {
        if (score < this.minScore) {
            return false;
        }
        return true;
    }

    filterTime(publishedAt: string): boolean {
        const now = new Date();
        const postDate = new Date(publishedAt);
        const diffTime = Math.abs(now.getTime() - postDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > this.diffDays) {
            return false;
        }
        return true;
    }

    async filterByRelevance(post: { title: string, description: string }): Promise<{
        reason: string;
        confidence: number;
    } | null> {
        if (!this.llm) {
            console.error('LLM not initialized');
            return null;
        }

        try {
            const prompt = generateFilterPrompt({
                title: post.title,
                description: post.description,
            });
    
            const chain = this.llm.pipe(new StringOutputParser());
            const result = await chain.invoke(prompt);

            // XML 파싱
            const reasonMatch = result.match(/<reason>(.*?)<\/reason>/s);
            const confidenceMatch = result.match(/<confidence>(.*?)<\/confidence>/s);

            if (!reasonMatch || !confidenceMatch) {
                console.error('XML 파싱 실패:', result);
                return null;
            }

            const reason = reasonMatch[1].trim();
            const confidence = parseFloat(confidenceMatch[1].trim());

            if (isNaN(confidence)) {
                console.error('confidence 값이 숫자가 아닙니다:', confidenceMatch[1]);
                return null;
            }

            console.log(`AI 필터링 결과: ${reason} - ${confidence}`);
            if (confidence > 0.5) {
                return null;
            }

            return {
                reason: reason || '판단 불가',
                confidence: confidence,
            };
        } catch (error) {
            console.error('AI 필터링 중 오류:', error);
            return null;
        }
    }
}