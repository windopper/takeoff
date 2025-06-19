import { Env } from "..";
import { processArxivPaper } from "./arxiv-service";

export class ArxivRoutes {
    static async processArxivPaper(request: Request, env: Env): Promise<Response> {
        const body = await request.json().catch(() => ({})) as any;
        const paperUrl = body.url;
        if (!paperUrl) {
            return Response.json({ error: 'url is required' }, { status: 400 });
        }

        try {
            const response = await processArxivPaper({ url: paperUrl });
            return Response.json({
                success: true,
                response,
            });
        } catch (error) {
            console.error("Arxiv Routes: 포스트 처리 중 오류", error);
            return Response.json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }, { status: 500 });
        }
    }   
}