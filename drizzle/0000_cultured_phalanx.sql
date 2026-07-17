CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event` text NOT NULL,
	`path` text NOT NULL,
	`session_id` text NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`quote_reference` text NOT NULL,
	`request_type` text NOT NULL,
	`email` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `care_requests_reference_unique` ON `care_requests` (`reference`);--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`source` text DEFAULT 'quote' NOT NULL,
	`zip` text NOT NULL,
	`item_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`fabric` text NOT NULL,
	`condition` text NOT NULL,
	`has_stain` integer DEFAULT false NOT NULL,
	`has_pet` integer DEFAULT false NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`upload_keys` text DEFAULT '[]' NOT NULL,
	`estimate_total` real NOT NULL,
	`comparison_total` real NOT NULL,
	`requested_slot` text NOT NULL,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`access_notes` text DEFAULT '' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_reference_unique` ON `quotes` (`reference`);