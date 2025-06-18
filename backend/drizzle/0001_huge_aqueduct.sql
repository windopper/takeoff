PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_filtered` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original_url` text NOT NULL,
	`original_title` text NOT NULL,
	`platform` text NOT NULL,
	`community` text NOT NULL,
	`filter_reason` text NOT NULL,
	`filter_type` text NOT NULL,
	`confidence` real,
	`post_score` integer DEFAULT 0 NOT NULL,
	`filtered_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ai_filtered`("id", "original_url", "original_title", "platform", "community", "filter_reason", "filter_type", "confidence", "post_score", "filtered_at", "expires_at") SELECT "id", "original_url", "original_title", "platform", "community", "filter_reason", "filter_type", "confidence", "post_score", "filtered_at", "expires_at" FROM `ai_filtered`;--> statement-breakpoint
DROP TABLE `ai_filtered`;--> statement-breakpoint
ALTER TABLE `__new_ai_filtered` RENAME TO `ai_filtered`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ai_filtered_original_url_unique` ON `ai_filtered` (`original_url`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_url` ON `ai_filtered` (`original_url`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_platform` ON `ai_filtered` (`platform`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_community` ON `ai_filtered` (`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_platform_community` ON `ai_filtered` (`platform`,`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_expires` ON `ai_filtered` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_ai_filtered_type` ON `ai_filtered` (`filter_type`);--> statement-breakpoint
CREATE TABLE `__new_ai_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`author` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`original_url` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`platform` text NOT NULL,
	`community` text NOT NULL,
	`original_title` text DEFAULT '' NOT NULL,
	`original_author` text DEFAULT '' NOT NULL,
	`post_score` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ai_posts`("id", "title", "content", "author", "created_at", "original_url", "category", "platform", "community", "original_title", "original_author", "post_score", "updated_at") SELECT "id", "title", "content", "author", "created_at", "original_url", "category", "platform", "community", "original_title", "original_author", "post_score", "updated_at" FROM `ai_posts`;--> statement-breakpoint
DROP TABLE `ai_posts`;--> statement-breakpoint
ALTER TABLE `__new_ai_posts` RENAME TO `ai_posts`;--> statement-breakpoint
CREATE INDEX `idx_ai_posts_category` ON `ai_posts` (`category`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_platform` ON `ai_posts` (`platform`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_community` ON `ai_posts` (`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_platform_community` ON `ai_posts` (`platform`,`community`);--> statement-breakpoint
CREATE INDEX `idx_ai_posts_created_at` ON `ai_posts` (`created_at`);