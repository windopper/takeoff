CREATE TABLE `process_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL,
	`message` text NOT NULL,
	`service` text,
	`operation` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
