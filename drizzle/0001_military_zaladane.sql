CREATE TABLE `commercial_leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`company` text NOT NULL,
	`customer_name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`property_type` text NOT NULL,
	`locations` integer DEFAULT 1 NOT NULL,
	`seating_count` integer DEFAULT 0 NOT NULL,
	`carpet_sqft` integer DEFAULT 0 NOT NULL,
	`frequency` text NOT NULL,
	`access_hours` text DEFAULT '' NOT NULL,
	`target_date` text DEFAULT '' NOT NULL,
	`requires_coi` integer DEFAULT false NOT NULL,
	`procurement` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`upload_keys` text DEFAULT '[]' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commercial_leads_reference_unique` ON `commercial_leads` (`reference`);