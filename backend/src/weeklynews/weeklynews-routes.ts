import { Env } from "..";
import { WeeklyNewsManager } from "../manager/weekly-news-manager";
import { WeeklyNewsService } from "./weeklynews-service";

export class WeeklyNewsRoutes {
    
    static async getWeeklyNewsList(req: Request, env: Env): Promise<Response> {
        const posts = await WeeklyNewsService.getWeeklyNewsList(env);
        return Response.json(posts);
    }

    static async getWeeklyNews(req: Request, env: Env): Promise<Response> {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return Response.json({ error: 'ID is required' }, { status: 400 });
        }
        const post = await WeeklyNewsService.getWeeklyNews(parseInt(id), env);
        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }
        return Response.json(post);
    }

    static async getLatestWeeklyNews(req: Request, env: Env): Promise<Response> {
        const post = await WeeklyNewsService.getLatestWeeklyNews(env);
        return Response.json(post);
    }

    static async createWeeklyNews(req: Request, env: Env): Promise<Response> {
        // 오늘부터 일주일 전 날짜 구하기
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const title = `주간 블로그 ${startDate.toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})} ~ ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        const post = await WeeklyNewsService.createWeeklyNews(title, env);
        return Response.json(post);
    }

    static async deleteWeeklyNews(req: Request, env: Env): Promise<Response> {
        const { id } = await req.json() as { id: number };
        if (!id) {
            return Response.json({ error: 'ID is required' }, { status: 400 });
        }
        await WeeklyNewsService.deleteWeeklyNews(id, env);
        return Response.json({ message: 'Weekly news deleted' });
    }

    static async revalidateCache(req: Request, env: Env): Promise<Response> {
        const { id } = await req.json() as { id: number };
        await WeeklyNewsService.revalidateCache(id);
        return Response.json({ message: 'Cache revalidated' });
    }
}