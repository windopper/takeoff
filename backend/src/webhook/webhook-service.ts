import { APIEmbed, JSONEncodable, WebhookClient } from 'discord.js';
import { DiscordWebhookManager } from '../manager/discord-webhook-manager';
import { env } from 'cloudflare:workers';
import { FRONTEND_URL } from '../constants';

interface WebhookData {
	title: string;
	content: string;
	url: string;
}

export class WebhookService {
	static async sendWelcomeMessage(webhookUrl: string) {
		const webhookClient = new WebhookClient({ url: webhookUrl });

		await webhookClient.send({
			username: 'Takeoff.',
			avatarURL: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
			embeds: [
				{
					title: 'Takeoff. Discord 봇 등록 완료 ',
					description: 'Takeoff. 디스코드 봇이 등록되었습니다. 커뮤니티에서 화제가 된 AI/SW/CS 관련 글을 디스코드에서 바로 확인해보세요.',
					url: FRONTEND_URL,
					color: 0x800080, // 보라색
					footer: {
						text: 'Takeoff.',
						icon_url: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
					},
					timestamp: new Date().toISOString(),
				},
			],
		});
	}

	static async sendWebhookTest(webhookUrl: string) {
		await this.sendWebhook(webhookUrl, {
			title: 'Test',
			content:
				'This is a test webhook This is a test webhook This is a test webhook This is a test webhook This is a test webhook This is a test webhook This is a test webhook This is a test webhook This is a test webhook ',
			url: 'https://takeoff.ai',
		});
	}

	static async sendWebhook(webhookUrl: string, data: WebhookData) {
		const webhookClient = new WebhookClient({ url: webhookUrl });
		const { title, content, url } = data;

		// content가 100자 이상이면 자르고 "..." 추가
		const truncatedContent = content.length > 300 ? content.substring(0, 300) + '...' : content;

		await webhookClient.send({
			username: 'Takeoff.',
			avatarURL: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
			embeds: [
				{
					title: title,
					description: truncatedContent,
					url: url, // 클릭 시 해당 URL로 이동
					color: 0x0099ff,
					footer: {
						text: 'Takeoff.',
						icon_url: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
					},
					timestamp: new Date().toISOString(),
				},
			],
		});
	}

	private static async _sendWebhookBatch(webhookUrl: string, data: WebhookData[]) {
		const webhookClient = new WebhookClient({ url: webhookUrl });

		if (data.length > 10) {
			throw new Error('Maximum 10 items allowed');
		}

		const embeds: APIEmbed[] = data.map((item) => {
			const { title, content, url } = item;

			const truncatedContent = content.length > 300 ? content.substring(0, 300) + '...' : content;

			return {
				title: title,
				description: truncatedContent,
				url: url, // 클릭 시 해당 URL로 이동
				color: 0x0099ff,
				footer: {
					text: 'Takeoff.',
					icon_url: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
				},
				timestamp: new Date().toISOString(),
			};
		});

		await webhookClient.send({
			username: 'Takeoff.',
			avatarURL: 'https://takeoff-backend.kamilereon.workers.dev/takeoff.png',
			embeds: embeds,
		});
	}

	static async sendWebhookBatch(webhookUrl: string, data: WebhookData[]) {
		const batchSize = 10;
		for (let i = 0; i < data.length; i += batchSize) {
			const batch = data.slice(i, i + batchSize);
			await this._sendWebhookBatch(webhookUrl, batch);
		}
	}

	static async sendWebhookBatchToSubscribers(data: WebhookData[]) {
		const webhookManager = new DiscordWebhookManager(env.DB);
		const webhookUrls = await webhookManager.getAllWebhookUrls();
		const results = await Promise.all(
			webhookUrls.map(async (webhookUrl) => {
				try {
					await this._sendWebhookBatch(webhookUrl, data);
					return {
						success: true,
					};
				} catch (error: any) {
                    if (error.code === 10015) {
                        console.log('Delete unknown webhook url', webhookUrl);
                        await webhookManager.deleteWebhookUrlByUrl(webhookUrl);
                    }
					console.log('Failed to send webhook to', webhookUrl, error.code);
					return {
						success: false,
					};
				}
			})
		);
		return results;
	}
}
