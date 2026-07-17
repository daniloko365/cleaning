CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`zip` text DEFAULT '' NOT NULL,
	`topic` text DEFAULT 'question' NOT NULL,
	`message` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_messages_reference_unique` ON `contact_messages` (`reference`);