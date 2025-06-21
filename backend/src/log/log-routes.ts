import { Env } from "..";
import { getLogs } from "./log-stream-service";

export class LogRoutes {
    static async getLogs(request: Request, env: Env) {
        const url = new URL(request.url);
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 100;
        const logs = await getLogs(env.DB, limit);
        return new Response(JSON.stringify(logs), { status: 200 });
    }
}