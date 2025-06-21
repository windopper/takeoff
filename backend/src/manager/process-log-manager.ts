import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { NewProcessLog, processLog } from '../db/schema';
import { desc, lt } from 'drizzle-orm';
import { POST_EXPIRATION_TIME } from '../constants';

export class ProcessLogManager {
	private db: DrizzleD1Database;

	constructor(db: D1Database) {
		this.db = drizzle(db);
	}

	async addLog(data: NewProcessLog) {
		await this.db.insert(processLog).values({
			status: data.status,
			message: data.message,
			service: data.service,
			operation: data.operation,
		});
	}

	async getLogs(limit: number = 100) {
		return await this.db.select().from(processLog).orderBy(desc(processLog.id)).limit(limit);
	}

	async cleanUpExpiredLogs() {
		await this.db.delete(processLog).where(lt(processLog.createdAt, new Date(Date.now() - POST_EXPIRATION_TIME).toISOString()));
	}
}
