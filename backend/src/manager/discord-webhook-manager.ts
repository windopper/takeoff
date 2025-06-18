import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { discordWebhook } from '../db/schema';
import { eq } from 'drizzle-orm';

export class DiscordWebhookManager {
	private db: DrizzleD1Database;

	constructor(db: D1Database) {
		this.db = drizzle(db);
	}

	async getWebhookUrl(id: string): Promise<string | null> {
		const result = await this.db
			.select()
			.from(discordWebhook)
			.where(eq(discordWebhook.id, parseInt(id)));
		return result[0]?.webhookUrl || null;
	}

    async getAllWebhookUrls(): Promise<string[]> {
        const result = await this.db
            .select()
            .from(discordWebhook);
        return result.map((item) => item.webhookUrl);
    }

    async createWebhookUrl(webhookUrl: string): Promise<number> {
        const result = await this.db
            .select()
            .from(discordWebhook)
            .where(eq(discordWebhook.webhookUrl, webhookUrl));
        if (result.length > 0) {
            throw new Error('Webhook URL already exists');
        }
        const id = await this.db.insert(discordWebhook).values({ webhookUrl }).returning({ id: discordWebhook.id });
        return id[0].id;
    }

    async deleteWebhookUrl(id: string): Promise<void> {
        await this.db.delete(discordWebhook).where(eq(discordWebhook.id, parseInt(id)));
    }
    
    async deleteWebhookUrlByUrl(webhookUrl: string): Promise<void> {
        await this.db.delete(discordWebhook).where(eq(discordWebhook.webhookUrl, webhookUrl));
    }
}
