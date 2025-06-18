import { Env } from "..";
import { DiscordWebhookManager } from "../manager/discord-webhook-manager";
import { WebhookService } from "./webhook-service";

export class WebhookRoutes {
    static async getWebhookUrl(req: Request, env: Env): Promise<Response> {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return Response.json({ error: 'ID is required' }, { status: 400 });
        }
        const webhookUrl = await new DiscordWebhookManager(env.DB).getWebhookUrl(id);
        if (!webhookUrl) {
            return Response.json({ error: 'Webhook URL not found' }, { status: 404 });
        }
        return Response.json({ webhookUrl });
    }

    static async createWebhookUrl(req: Request, env: Env): Promise<Response> {
        const body = await req.json().catch(() => ({})) as any;
        const webhookUrl = body.webhookUrl;
        if (!webhookUrl) {
            return Response.json({ error: 'Webhook URL is required' }, { status: 400 });
        }
        await new DiscordWebhookManager(env.DB).createWebhookUrl(webhookUrl);
        return Response.json({ message: 'Webhook URL created successfully' });
    }

    static async deleteWebhookUrl(req: Request, env: Env): Promise<Response> {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return Response.json({ error: 'ID is required' }, { status: 400 });
        }
        await new DiscordWebhookManager(env.DB).deleteWebhookUrl(id);
        return Response.json({ message: 'Webhook URL deleted successfully' });
    }

    static async sendWebhookTest(req: Request, env: Env): Promise<Response> {
        const body = await req.json().catch(() => ({})) as any;
        const webhookUrl = body.webhookUrl;
        if (!webhookUrl) {
            return Response.json({ error: 'Webhook URL is required' }, { status: 400 });
        }
        try {
            await WebhookService.sendWebhookTest(webhookUrl);
            return Response.json({ message: 'Webhook test sent successfully' });
        } catch (error: any) {
            if (error.code === 10015) {
                await new DiscordWebhookManager(env.DB).deleteWebhookUrlByUrl(webhookUrl);
                return Response.json({ error: 'Unknown Webhook URL' }, { status: 400 });
            }
            return Response.json({ error: 'Failed to send webhook' }, { status: 500 });
        }
    }

    static async getWebhookList(req: Request, env: Env): Promise<Response> {
        const webhookList = await new DiscordWebhookManager(env.DB).getAllWebhookUrls();
        return Response.json({ webhookList });
    }
}