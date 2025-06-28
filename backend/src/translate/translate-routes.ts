import { Env } from '..';
import { Language, TranslateService } from './translate-service';

export class TranslateRoutes {
    static async getTranslatedPostById(request: Request, env: Env) {
        const url = new URL(request.url);
        const id = parseInt(url.searchParams.get('id') || '0');
        const language = url.searchParams.get('language') as Language;

        if (!id || !language) {
            return new Response(JSON.stringify({ error: 'id and language are required' }), { status: 400 });
        }

        const post = await TranslateService.getTranslatedPostById(id, language);

        if (!post) {
            return new Response(JSON.stringify({ error: 'post not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(post));
    }

    static async getTranslatedWeeklyNewsById(request: Request, env: Env) {
        const url = new URL(request.url);
        const id = parseInt(url.searchParams.get('id') || '0');
        const language = url.searchParams.get('language') as Language;

        if (!id || !language) {
            return new Response(JSON.stringify({ error: 'id and language are required' }), { status: 400 });
        }

        const post = await TranslateService.getTranslatedWeeklyNewsById(id, language);

        if (!post) {
            return new Response(JSON.stringify({ error: 'post not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(post));
    }

	static async getTranslatePostList(request: Request, env: Env) {
		const url = new URL(request.url);
		const language = url.searchParams.get('language') as Language;
		const count = parseInt(url.searchParams.get('count') || '10');
		const postList = await TranslateService.getTranslatePostList(env, language, count);
		return new Response(JSON.stringify(postList));
	}

	static async translate(request: Request, env: Env) {
		const { title, content, language } = (await request.json()) as { title: string; content: string; language: Language };
		const translation = await TranslateService.translate({ title, content }, language);
		return new Response(JSON.stringify(translation));
	}

	static async translateLatestNPosts(request: Request, env: Env) {
		const { language = 'en', count = 10 } = (await request.json()) as { language?: Language; count?: number };
		await TranslateService.translateLatestNPosts(language, count);
		return new Response(JSON.stringify({ message: '번역 완료' }));
	}
}
