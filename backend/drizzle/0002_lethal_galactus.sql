CREATE TABLE `discord_webhook` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`webhook_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
