CREATE TABLE `ai_filtered` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original_url` text NOT NULL,
	`original_title` text NOT NULL,
	`platform` text NOT NULL,
	`community` text NOT NULL,
	`filter_reason` text NOT NULL,
	`filter_type` text NOT NULL,
	`confidence` real,
	`post_score` integer,
	`filtered_at` text DEFAULT CURRENT_TIMESTAMP,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_filtered_original_url_unique` ON `ai_filtered` (`original_url`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_url` ON `ai_filtered` (`original_url`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_platform` ON `ai_filtered` (`platform`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_community` ON `ai_filtered` (`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_platform_community` ON `ai_filtered` (`platform`,`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_expires` ON `ai_filtered` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_type` ON `ai_filtered` (`filter_type`);--> statement-breakpoint
CREATE TABLE `ai_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`author` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`original_url` text,
	`category` text NOT NULL,
	`platform` text NOT NULL,
	`community` text NOT NULL,
	`original_title` text,
	`original_author` text,
	`post_score` integer,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_ai_posts_category` ON `ai_posts` (`category`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_platform` ON `ai_posts` (`platform`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_community` ON `ai_posts` (`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_platform_community` ON `ai_posts` (`platform`,`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_created_at` ON `ai_posts` (`created_at`);