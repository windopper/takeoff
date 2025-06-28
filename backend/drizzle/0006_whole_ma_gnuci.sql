CREATE TABLE `ai_post_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ai_post_id` integer,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`ai_post_id`) REFERENCES `ai_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `weekly_news_post_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weekly_news_post_id` integer,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`weekly_news_post_id`) REFERENCES `weekly_news_post`(`id`) ON UPDATE no action ON DELETE no action
);
