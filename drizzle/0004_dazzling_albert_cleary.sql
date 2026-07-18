CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`hits` integer DEFAULT 1 NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `retention_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text DEFAULT 'running' NOT NULL,
	`analytics_deleted` integer DEFAULT 0 NOT NULL,
	`contact_deleted` integer DEFAULT 0 NOT NULL,
	`commercial_deleted` integer DEFAULT 0 NOT NULL,
	`care_deleted` integer DEFAULT 0 NOT NULL,
	`quote_deleted` integer DEFAULT 0 NOT NULL,
	`media_deleted` integer DEFAULT 0 NOT NULL,
	`error` text DEFAULT '' NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
ALTER TABLE `care_requests` ADD `legal_hold` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `commercial_leads` ADD `legal_hold` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `legal_hold` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` ADD `legal_hold` integer DEFAULT false NOT NULL;