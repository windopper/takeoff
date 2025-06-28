import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { env } from 'cloudflare:workers';
import { TranslationManager } from '../manager/translation-manager';
import { getTranslationPrompt } from '../prompts/translation-prompt';
import { Env } from '..';
import { PostManager } from '../manager/post-manager';
import { AiPostTranslation } from '../db/schema';

export type Language = 'en' | 'ko';

export interface TranslationResult {
	translatedTitle: string;
	translatedContent: string;
}

export class TranslateService {
	private static translator = new ChatGoogleGenerativeAI({
		model: 'gemini-2.5-flash-lite-preview-06-17',
		apiKey: env.GEMINI_API_KEY,
		temperature: 0.3,
		maxRetries: 3,
	});

	/**
	 * 주어진 포스트를 지정된 언어로 번역합니다.
	 * @param post - 번역할 포스트 (제목과 내용 포함)
	 * @param language - 대상 언어 코드
	 * @returns 번역된 제목과 내용
	 */
	static async translate(
		post: {
			title: string;
			content: string;
		},
		language: Language
	): Promise<TranslationResult> {
		try {
			// 번역 프롬프트 생성 (ChatPromptTemplate 사용)
			const promptValue = await getTranslationPrompt(post.title, post.content, language);

			// AI 모델과 JSON 파서를 연결한 체인 생성
			const chain = TranslateService.translator.pipe(new JsonOutputParser<TranslationResult>());

			// 번역 실행 및 JSON 파싱
			const translationResult = (await chain.invoke(promptValue)) as TranslationResult;

			// 번역 결과 검증
			if (!translationResult.translatedTitle || !translationResult.translatedContent) {
				throw new Error('번역 결과가 완전하지 않습니다.');
			}

			return translationResult;
		} catch (error) {
			console.error('번역 중 오류 발생:', error);

			// JsonOutputParser 실패 시 fallback 처리
			if (error instanceof Error && error.message.includes('parse')) {
				console.warn('JSON 파싱 실패, 기본 번역으로 fallback 처리');
				try {
					// 파서 없이 직접 호출하여 텍스트 응답 받기
					const promptValue = await getTranslationPrompt(post.title, post.content, language);
					const response = await TranslateService.translator.invoke(promptValue);

					// 수동으로 JSON 추출 시도
					const jsonMatch = response.content.toString().match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						const fallbackResult = JSON.parse(jsonMatch[0]);
						return {
							translatedTitle: fallbackResult.translatedTitle || post.title,
							translatedContent: fallbackResult.translatedContent || response.content.toString(),
						};
					} else {
						// JSON을 찾을 수 없으면 원본 제목과 응답 내용 사용
						return {
							translatedTitle: post.title,
							translatedContent: response.content.toString(),
						};
					}
				} catch (fallbackError) {
					console.error('Fallback 번역도 실패:', fallbackError);
					throw new Error(`번역 실패: ${error.message}`);
				}
			}

			throw new Error(`번역 실패: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * 포스트 ID와 언어를 기반으로 기존 번역이 있는지 확인합니다.
	 * @param env - 환경 변수
	 * @param aiPostId - AI 포스트 ID
	 * @param language - 언어 코드
	 * @returns 기존 번역 데이터 또는 null
	 */
	static async getExistingTranslation(aiPostId: number, language: Language) {
		try {
			const translationManager = new TranslationManager(env.DB);
			const existingTranslation = await translationManager.getAiPostTranslation(aiPostId, language);

			return existingTranslation;
		} catch (error) {
			console.error('기존 번역 조회 중 오류:', error);
			return null;
		}
	}

	/**
	 * 번역 결과를 데이터베이스에 저장합니다.
	 * @param env - 환경 변수
	 * @param aiPostId - AI 포스트 ID
	 * @param language - 언어 코드
	 * @param translation - 번역 결과
	 */
	static async saveAiPostTranslation(aiPostId: number, language: Language, translation: TranslationResult) {
		try {
			const translationManager = new TranslationManager(env.DB);
			await translationManager.createAiPostTranslation({
				aiPostId,
				language,
				title: translation.translatedTitle,
				content: translation.translatedContent,
			});
		} catch (error) {
			console.error('번역 저장 중 오류:', error);
			throw new Error('번역 저장에 실패했습니다.');
		}
	}

	static async saveWeeklyNewsPostTranslation(weeklyNewsPostId: number, language: Language, translation: TranslationResult) {
		try {
			const translationManager = new TranslationManager(env.DB);
			await translationManager.createWeeklyNewsTranslation({
				weeklyNewsPostId,
				language,
				title: translation.translatedTitle,
				content: translation.translatedContent,
			});
		} catch (error) {
			console.error('번역 저장 중 오류:', error);
			throw new Error('번역 저장에 실패했습니다.');
		}
	}

	/**
	 * 포스트를 번역하고 데이터베이스에 저장합니다.
	 * 기존 번역이 있으면 해당 번역을 반환합니다.
	 * @param env - 환경 변수
	 * @param aiPostId - AI 포스트 ID
	 * @param post - 번역할 포스트
	 * @param language - 대상 언어
	 * @param forceRetranslate - 강제 재번역 여부
	 * @returns 번역 결과
	 */
	static async translateAndSaveAiPost(
		aiPostId: number,
		post: { title: string; content: string },
		language: Language,
		forceRetranslate = false
	): Promise<TranslationResult> {
		// 기존 번역 확인 (강제 재번역이 아닌 경우)
		if (!forceRetranslate) {
			const existingTranslation = await this.getExistingTranslation(aiPostId, language);
			if (existingTranslation) {
				return {
					translatedTitle: existingTranslation.title,
					translatedContent: existingTranslation.content,
				};
			}
		}

        console.log(`Translating post ${post.title}...`);
		// 새로운 번역 수행
		const translation = await this.translate(post, language);
        console.log(`Translated post ${translation.translatedTitle}...`);

		// 번역 결과 저장
		await this.saveAiPostTranslation(aiPostId, language, translation);
        console.log(`Saved translation for post ${post.title}...`);

		return translation;
	}

	static async translateAndSaveWeeklyNewsPost(
		weeklyNewsPostId: number,
		post: { title: string; content: string },
		language: Language,
		forceRetranslate = false
	): Promise<TranslationResult> {
		// 기존 번역 확인 (강제 재번역이 아닌 경우)
		if (!forceRetranslate) {
			const existingTranslation = await this.getExistingTranslation(weeklyNewsPostId, language);
			if (existingTranslation) {
				return {
					translatedTitle: existingTranslation.title,
					translatedContent: existingTranslation.content,
				};
			}
		}

        console.log(`Translating post ${post.title}...`);
		// 새로운 번역 수행
		const translation = await this.translate(post, language);
        console.log(`Translated post ${translation.translatedTitle}...`);

		// 번역 결과 저장
		await this.saveWeeklyNewsPostTranslation(weeklyNewsPostId, language, translation);
        console.log(`Saved translation for post ${post.title}...`);

		return translation;
	}

	static async translateLatestNPosts(language: Language, count: number) {
		const postManager = new PostManager(env.DB);
		const latestPosts = await postManager.getPosts({ limit: count, sort: 'createdAt', order: 'desc' });
		for (const post of latestPosts) {
            console.log(`Translating post ${post.title}...`);
			const result = await this.translateAndSaveAiPost(post.id, { title: post.title, content: post.content }, language, true);
            console.log(`Translated post ${result.translatedTitle}...`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

    static async getTranslatePostList(env: Env, language: Language, count: number): Promise<AiPostTranslation[]> {
        const translationManager = new TranslationManager(env.DB);
        const translations = await translationManager.getAiPostTranslationsList({ count, language });
        return translations;
    }

    static async getTranslatedPostById(id: number, language: Language) {
        const translationManager = new TranslationManager(env.DB);
        const translation = await translationManager.getAiPostTranslation(id, language);
        if (translation) {
            return {
                title: translation.title,
                content: translation.content,
            };
        }
        return null;
    }

    static async getTranslatedWeeklyNewsById(id: number, language: Language) {
        const translationManager = new TranslationManager(env.DB);
        const translation = await translationManager.getWeeklyNewsTranslation(id, language);
        if (translation) {
            return {
                title: translation.title,
                content: translation.content,
            };
        }
        return null;
    }
}
