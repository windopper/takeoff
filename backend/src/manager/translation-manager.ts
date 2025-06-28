import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import {
	aiPostTranslations,
	weeklyNewsPostTranslations,
	AiPostTranslation,
	NewAiPostTranslation,
	WeeklyNewsPostTranslation,
	NewWeeklyNewsPostTranslation,
} from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export interface CreateAiPostTranslation {
	aiPostId: number;
	language: string;
	title: string;
	content: string;
}

export interface CreateWeeklyNewsTranslation {
	weeklyNewsPostId: number;
	language: string;
	title: string;
	content: string;
}

export class TranslationManager {
	private db: DrizzleD1Database;

	constructor(db: D1Database) {
		this.db = drizzle(db);
	}

	// AI 포스트 번역 관련 메서드들

	/**
	 * AI 포스트 번역이 이미 존재하는지 확인합니다.
	 */
	async isAiPostTranslationExists(aiPostId: number, language: string): Promise<boolean> {
		try {
			const result = await this.db
				.select()
				.from(aiPostTranslations)
				.where(and(eq(aiPostTranslations.aiPostId, aiPostId), eq(aiPostTranslations.language, language)))
				.limit(1)
				.execute();

			return result.length > 0;
		} catch (error) {
			console.error('AI 포스트 번역 존재 확인 중 오류:', error);
			return false;
		}
	}

	/**
	 * AI 포스트 번역을 생성합니다.
	 */
	async createAiPostTranslation(translation: CreateAiPostTranslation): Promise<AiPostTranslation | null> {
		try {
			// 이미 존재하는 번역인지 확인
			if (await this.isAiPostTranslationExists(translation.aiPostId, translation.language)) {
				console.log(`이미 존재하는 AI 포스트 번역: aiPostId=${translation.aiPostId}, language=${translation.language}`);
				return null;
			}

			const result = await this.db
				.insert(aiPostTranslations)
				.values({
					aiPostId: translation.aiPostId,
					language: translation.language,
					title: translation.title,
					content: translation.content,
				})
				.returning()
				.execute();

			console.log(`AI 포스트 번역 생성 완료: ${translation.title} (${translation.language})`);
			return result[0];
		} catch (error) {
			console.error('AI 포스트 번역 생성 중 오류:', error);
			throw new Error(`AI 포스트 번역 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	/**
	 * AI 포스트의 번역들을 조회합니다.
	 */
	async getAiPostTranslations(aiPostId: number): Promise<AiPostTranslation[]> {
		try {
			const result = await this.db
				.select()
				.from(aiPostTranslations)
				.where(eq(aiPostTranslations.aiPostId, aiPostId))
				.orderBy(asc(aiPostTranslations.language))
				.execute();

			return result || [];
		} catch (error) {
			console.error('AI 포스트 번역 조회 중 오류:', error);
			return [];
		}
	}

	async getAiPostTranslationsList({ count = 10, language = 'en' }: { count?: number; language?: string }): Promise<AiPostTranslation[]> {
		const result = await this.db.select().from(aiPostTranslations).orderBy(desc(aiPostTranslations.createdAt)).limit(count).execute();

		return result || [];
	}

	/**
	 * 특정 언어의 AI 포스트 번역을 조회합니다.
	 */
	async getAiPostTranslation(aiPostId: number, language: string): Promise<AiPostTranslation | null> {
		try {
			const result = await this.db
				.select()
				.from(aiPostTranslations)
				.where(and(eq(aiPostTranslations.aiPostId, aiPostId), eq(aiPostTranslations.language, language)))
				.limit(1)
				.execute();

			return result[0] || null;
		} catch (error) {
			console.error('AI 포스트 번역 조회 중 오류:', error);
			return null;
		}
	}

	/**
	 * AI 포스트 번역을 업데이트합니다.
	 */
	async updateAiPostTranslation(id: number, data: Partial<Pick<AiPostTranslation, 'title' | 'content'>>): Promise<void> {
		try {
			await this.db
				.update(aiPostTranslations)
				.set({
					...data,
					updatedAt: new Date().toISOString(),
				})
				.where(eq(aiPostTranslations.id, id))
				.execute();

			console.log(`AI 포스트 번역 업데이트 완료: id=${id}`);
		} catch (error) {
			console.error('AI 포스트 번역 업데이트 중 오류:', error);
			throw new Error(`AI 포스트 번역 업데이트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	/**
	 * AI 포스트 번역을 삭제합니다.
	 */
	async deleteAiPostTranslation(id: number): Promise<void> {
		try {
			await this.db.delete(aiPostTranslations).where(eq(aiPostTranslations.id, id)).execute();

			console.log(`AI 포스트 번역 삭제 완료: id=${id}`);
		} catch (error) {
			console.error('AI 포스트 번역 삭제 중 오류:', error);
			throw new Error(`AI 포스트 번역 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	// 주간 뉴스 번역 관련 메서드들

	/**
	 * 주간 뉴스 번역이 이미 존재하는지 확인합니다.
	 */
	async isWeeklyNewsTranslationExists(weeklyNewsPostId: number, language: string): Promise<boolean> {
		try {
			const result = await this.db
				.select()
				.from(weeklyNewsPostTranslations)
				.where(and(eq(weeklyNewsPostTranslations.weeklyNewsPostId, weeklyNewsPostId), eq(weeklyNewsPostTranslations.language, language)))
				.limit(1)
				.execute();

			return result.length > 0;
		} catch (error) {
			console.error('주간 뉴스 번역 존재 확인 중 오류:', error);
			return false;
		}
	}

	/**
	 * 주간 뉴스 번역을 생성합니다.
	 */
	async createWeeklyNewsTranslation(translation: CreateWeeklyNewsTranslation): Promise<WeeklyNewsPostTranslation | null> {
		try {
			// 이미 존재하는 번역인지 확인
			if (await this.isWeeklyNewsTranslationExists(translation.weeklyNewsPostId, translation.language)) {
				console.log(`이미 존재하는 주간 뉴스 번역: weeklyNewsPostId=${translation.weeklyNewsPostId}, language=${translation.language}`);
				return null;
			}

			const result = await this.db
				.insert(weeklyNewsPostTranslations)
				.values({
					weeklyNewsPostId: translation.weeklyNewsPostId,
					language: translation.language,
					title: translation.title,
					content: translation.content,
				})
				.returning()
				.execute();

			console.log(`주간 뉴스 번역 생성 완료: ${translation.title} (${translation.language})`);
			return result[0];
		} catch (error) {
			console.error('주간 뉴스 번역 생성 중 오류:', error);
			throw new Error(`주간 뉴스 번역 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	/**
	 * 주간 뉴스의 번역들을 조회합니다.
	 */
	async getWeeklyNewsTranslations(weeklyNewsPostId: number): Promise<WeeklyNewsPostTranslation[]> {
		try {
			const result = await this.db
				.select()
				.from(weeklyNewsPostTranslations)
				.where(eq(weeklyNewsPostTranslations.weeklyNewsPostId, weeklyNewsPostId))
				.orderBy(asc(weeklyNewsPostTranslations.language))
				.execute();

			return result || [];
		} catch (error) {
			console.error('주간 뉴스 번역 조회 중 오류:', error);
			return [];
		}
	}

	/**
	 * 특정 언어의 주간 뉴스 번역을 조회합니다.
	 */
	async getWeeklyNewsTranslation(weeklyNewsPostId: number, language: string): Promise<WeeklyNewsPostTranslation | null> {
		try {
			const result = await this.db
				.select()
				.from(weeklyNewsPostTranslations)
				.where(and(eq(weeklyNewsPostTranslations.weeklyNewsPostId, weeklyNewsPostId), eq(weeklyNewsPostTranslations.language, language)))
				.limit(1)
				.execute();

			return result[0] || null;
		} catch (error) {
			console.error('주간 뉴스 번역 조회 중 오류:', error);
			return null;
		}
	}

	/**
	 * 주간 뉴스 번역을 업데이트합니다.
	 */
	async updateWeeklyNewsTranslation(id: number, data: Partial<Pick<WeeklyNewsPostTranslation, 'title' | 'content'>>): Promise<void> {
		try {
			await this.db
				.update(weeklyNewsPostTranslations)
				.set({
					...data,
					updatedAt: new Date().toISOString(),
				})
				.where(eq(weeklyNewsPostTranslations.id, id))
				.execute();

			console.log(`주간 뉴스 번역 업데이트 완료: id=${id}`);
		} catch (error) {
			console.error('주간 뉴스 번역 업데이트 중 오류:', error);
			throw new Error(`주간 뉴스 번역 업데이트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	/**
	 * 주간 뉴스 번역을 삭제합니다.
	 */
	async deleteWeeklyNewsTranslation(id: number): Promise<void> {
		try {
			await this.db.delete(weeklyNewsPostTranslations).where(eq(weeklyNewsPostTranslations.id, id)).execute();

			console.log(`주간 뉴스 번역 삭제 완료: id=${id}`);
		} catch (error) {
			console.error('주간 뉴스 번역 삭제 중 오류:', error);
			throw new Error(`주간 뉴스 번역 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	// 유틸리티 메서드들

	/**
	 * 특정 AI 포스트의 모든 번역을 삭제합니다. (AI 포스트 삭제 시 사용)
	 */
	async deleteAllAiPostTranslations(aiPostId: number): Promise<void> {
		try {
			await this.db.delete(aiPostTranslations).where(eq(aiPostTranslations.aiPostId, aiPostId)).execute();

			console.log(`AI 포스트의 모든 번역 삭제 완료: aiPostId=${aiPostId}`);
		} catch (error) {
			console.error('AI 포스트 번역 일괄 삭제 중 오류:', error);
			throw new Error(`AI 포스트 번역 일괄 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	/**
	 * 특정 주간 뉴스의 모든 번역을 삭제합니다. (주간 뉴스 삭제 시 사용)
	 */
	async deleteAllWeeklyNewsTranslations(weeklyNewsPostId: number): Promise<void> {
		try {
			await this.db.delete(weeklyNewsPostTranslations).where(eq(weeklyNewsPostTranslations.weeklyNewsPostId, weeklyNewsPostId)).execute();

			console.log(`주간 뉴스의 모든 번역 삭제 완료: weeklyNewsPostId=${weeklyNewsPostId}`);
		} catch (error) {
			console.error('주간 뉴스 번역 일괄 삭제 중 오류:', error);
			throw new Error(`주간 뉴스 번역 일괄 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
		}
	}

	async getExistingAiPostTranslation(aiPostId: number, language: string): Promise<AiPostTranslation | null> {
		const result = await this.db
			.select()
			.from(aiPostTranslations)
			.where(and(eq(aiPostTranslations.aiPostId, aiPostId), eq(aiPostTranslations.language, language)))
			.limit(1)
			.execute();

		return result[0] || null;
	}

	async getExistingWeeklyNewsTranslation(weeklyNewsPostId: number, language: string): Promise<WeeklyNewsPostTranslation | null> {
		const result = await this.db
			.select()
			.from(weeklyNewsPostTranslations)
			.where(and(eq(weeklyNewsPostTranslations.weeklyNewsPostId, weeklyNewsPostId), eq(weeklyNewsPostTranslations.language, language)))
			.limit(1)
			.execute();

		return result[0] || null;
	}
}
