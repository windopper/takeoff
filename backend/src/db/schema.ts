// backend/db/schema.ts
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// AI로 작성한 글을 저장하는 테이블
export const aiPosts = sqliteTable('ai_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  originalUrl: text('original_url').notNull().default(''),
  category: text('category').notNull(),
  platform: text('platform').notNull(), // 'reddit', 'hackernews', 'medium' 등
  community: text('community').notNull(), // subreddit 이름 또는 hackernews 등
  originalTitle: text('original_title').notNull().default(''),
  originalAuthor: text('original_author').notNull().default(''),
  postScore: integer('post_score').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  isVectorized: integer('is_vectorized').notNull().default(0)
}, (table) => ({
  // 인덱스 생성 (검색 성능 향상)
  categoryIdx: index('idx_ai_posts_category').on(table.category),
  platformIdx: index('idx_ai_posts_platform').on(table.platform),
  communityIdx: index('idx_ai_posts_community').on(table.community),
  platformCommunityIdx: index('idx_ai_posts_platform_community').on(table.platform, table.community),
  createdAtIdx: index('idx_ai_posts_created_at').on(table.createdAt),
}));

export const aiPostTranslations = sqliteTable('ai_post_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  aiPostId: integer('ai_post_id').references(() => aiPosts.id),
  language: text('language').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// AI 필터로 걸러진 게시글을 저장하는 테이블
export const aiFiltered = sqliteTable('ai_filtered', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalUrl: text('original_url').notNull().unique(),
  originalTitle: text('original_title').notNull(),
  platform: text('platform').notNull(), // 'reddit', 'hackernews', 'medium' 등
  community: text('community').notNull(), // subreddit 이름 또는 hackernews 등
  filterReason: text('filter_reason').notNull(),
  filterType: text('filter_type').notNull(), // 'score', 'ai_relevance', 'keyword' 등
  confidence: real('confidence'), // AI 필터의 신뢰도 (0.0-1.0)
  postScore: integer('post_score').notNull().default(0),
  filteredAt: text('filtered_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text('expires_at').notNull() // 14일 후 자동 만료
}, (table) => ({
  // 필터링 테이블 인덱스
  urlIdx: index('idx_ai_filtered_url').on(table.originalUrl),
  platformIdx: index('idx_ai_filtered_platform').on(table.platform),
  communityIdx: index('idx_ai_filtered_community').on(table.community),
  platformCommunityIdx: index('idx_ai_filtered_platform_community').on(table.platform, table.community),
  expiresIdx: index('idx_ai_filtered_expires').on(table.expiresAt),
  typeIdx: index('idx_ai_filtered_type').on(table.filterType),
}));

export const discordWebhook = sqliteTable('discord_webhook', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  webhookUrl: text('webhook_url').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const processLog = sqliteTable('process_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  status: text("status").notNull(),
  message: text("message").notNull(),
  service: text("service"),
  operation: text("operation"),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const weeklyNewsPost = sqliteTable('weekly_news_post', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const weeklyNewsPostTranslations = sqliteTable('weekly_news_post_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  weeklyNewsPostId: integer('weekly_news_post_id').references(() => weeklyNewsPost.id),
  language: text('language').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

// TypeScript 타입 정의
export type AiPost = typeof aiPosts.$inferSelect;
export type NewAiPost = typeof aiPosts.$inferInsert;
export type AiFiltered = typeof aiFiltered.$inferSelect;
export type NewAiFiltered = typeof aiFiltered.$inferInsert;
export type DiscordWebhook = typeof discordWebhook.$inferSelect;
export type NewDiscordWebhook = typeof discordWebhook.$inferInsert;
export type ProcessLog = typeof processLog.$inferSelect;
export type NewProcessLog = typeof processLog.$inferInsert;
export type WeeklyNewsPost = typeof weeklyNewsPost.$inferSelect;
export type NewWeeklyNewsPost = typeof weeklyNewsPost.$inferInsert;
export type WeeklyNewsPostTranslation = typeof weeklyNewsPostTranslations.$inferSelect;
export type NewWeeklyNewsPostTranslation = typeof weeklyNewsPostTranslations.$inferInsert;
export type AiPostTranslation = typeof aiPostTranslations.$inferSelect;
export type NewAiPostTranslation = typeof aiPostTranslations.$inferInsert;