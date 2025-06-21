import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { generateFilterPrompt } from "../prompts/filter-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ParserResult } from "./common-parser";
import { env } from "cloudflare:workers";

export type FilterReason = 'time' | 'keyword' | 'score' | 'ai_relevance';

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

    constructor({ minScore = 150, diffDays = 3 }: { minScore?: number; diffDays?: number;} = {}) {
        this.minScore = minScore;
        this.diffDays = diffDays;
        this.llm = new ChatGoogleGenerativeAI({
            apiKey: env.GEMINI_API_KEY,
            model: 'gemini-2.5-flash-preview-05-20',
            temperature: 0.4,
        });
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

            const cleanResult = result.trim()
                    .replace(/^```(?:json)?/gm, '') // 시작 코드 블록 제거
                    .replace(/```$/gm, '') // 끝 코드 블록 제거
                    .trim();
                
            const parsed = JSON.parse(cleanResult);

            // confidence 0.5 이상인 경우만 반환
            console.log(`AI 필터링 결과: ${parsed.reason} - ${parsed.confidence}`);
            if (parsed.confidence < 0.5) {
                return null;
            }

            return {
                reason: parsed.reason || '판단 불가',
                confidence: parsed.confidence || 0.5,
            };
        } catch (error) {
            console.error('AI 필터링 중 오류:', error);
            return null;
        }
    }
}