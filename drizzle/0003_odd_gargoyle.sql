ALTER TABLE `care_requests` ADD `privacy_version` text DEFAULT '2026-07-16' NOT NULL;--> statement-breakpoint
ALTER TABLE `commercial_leads` ADD `privacy_version` text DEFAULT '2026-07-16' NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `privacy_version` text DEFAULT '2026-07-16' NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` ADD `terms_version` text DEFAULT '2026-07-16' NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` ADD `privacy_version` text DEFAULT '2026-07-16' NOT NULL;