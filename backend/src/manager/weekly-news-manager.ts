import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { WeeklyNewsPost, weeklyNewsPost } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export class WeeklyNewsManager {
	private db: DrizzleD1Database;

	constructor(db: D1Database) {
		this.db = drizzle(db);
	}

	async createPost(title: string, content: string): Promise<number> {
		const result = await this.db.insert(weeklyNewsPost).values({ title, content }).returning({ id: weeklyNewsPost.id });
		return result[0].id;
	}

	async getPost(id: number): Promise<WeeklyNewsPost | null> {
		const result = await this.db.select().from(weeklyNewsPost).where(eq(weeklyNewsPost.id, id));
		return result[0] || null;
	}   

	async getAllPosts(): Promise<WeeklyNewsPost[]> {
		const result = await this.db.select().from(weeklyNewsPost).orderBy(desc(weeklyNewsPost.createdAt));
		return result;
	}

	async deletePost(id: number): Promise<void> {
		await this.db.delete(weeklyNewsPost).where(eq(weeklyNewsPost.id, id));
	}

	async updatePost(id: number, title: string, content: string): Promise<void> {
		await this.db.update(weeklyNewsPost).set({ title, content }).where(eq(weeklyNewsPost.id, id));
	}

    async getLatestPost(): Promise<WeeklyNewsPost | null> {
        const result = await this.db.select().from(weeklyNewsPost).orderBy(desc(weeklyNewsPost.createdAt)).limit(1);
        return result[0] || null;
    }
}