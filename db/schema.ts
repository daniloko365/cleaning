import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quotes = sqliteTable("quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  status: text("status").notNull().default("requested"),
  source: text("source").notNull().default("quote"),
  zip: text("zip").notNull(),
  itemId: text("item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  fabric: text("fabric").notNull(),
  condition: text("condition").notNull(),
  hasStain: integer("has_stain", { mode: "boolean" }).notNull().default(false),
  hasPet: integer("has_pet", { mode: "boolean" }).notNull().default(false),
  notes: text("notes").notNull().default(""),
  uploadKeys: text("upload_keys", { mode: "json" }).$type<string[]>().notNull().default([]),
  estimateTotal: real("estimate_total").notNull(),
  comparisonTotal: real("comparison_total").notNull(),
  requestedSlot: text("requested_slot").notNull(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull().default(""),
  accessNotes: text("access_notes").notNull().default(""),
  consentAt: text("consent_at").notNull(),
  termsVersion: text("terms_version").notNull().default("2026-07-16"),
  privacyVersion: text("privacy_version").notNull().default("2026-07-16"),
  legalHold: integer("legal_hold", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const careRequests = sqliteTable("care_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  quoteReference: text("quote_reference").notNull(),
  requestType: text("request_type").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("received"),
  privacyVersion: text("privacy_version").notNull().default("2026-07-16"),
  legalHold: integer("legal_hold", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event: text("event").notNull(),
  path: text("path").notNull(),
  sessionId: text("session_id").notNull(),
  payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const commercialLeads = sqliteTable("commercial_leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  status: text("status").notNull().default("received"),
  company: text("company").notNull(),
  customerName: text("customer_name").notNull(),
  role: text("role").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyType: text("property_type").notNull(),
  locations: integer("locations").notNull().default(1),
  seatingCount: integer("seating_count").notNull().default(0),
  carpetSqft: integer("carpet_sqft").notNull().default(0),
  frequency: text("frequency").notNull(),
  accessHours: text("access_hours").notNull().default(""),
  targetDate: text("target_date").notNull().default(""),
  requiresCoi: integer("requires_coi", { mode: "boolean" }).notNull().default(false),
  procurement: text("procurement").notNull().default(""),
  notes: text("notes").notNull().default(""),
  uploadKeys: text("upload_keys", { mode: "json" }).$type<string[]>().notNull().default([]),
  consentAt: text("consent_at").notNull(),
  privacyVersion: text("privacy_version").notNull().default("2026-07-16"),
  legalHold: integer("legal_hold", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  status: text("status").notNull().default("received"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  zip: text("zip").notNull().default(""),
  topic: text("topic").notNull().default("question"),
  message: text("message").notNull(),
  consentAt: text("consent_at").notNull(),
  privacyVersion: text("privacy_version").notNull().default("2026-07-16"),
  legalHold: integer("legal_hold", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  hits: integer("hits").notNull().default(1),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const retentionRuns = sqliteTable("retention_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  status: text("status").notNull().default("running"),
  analyticsDeleted: integer("analytics_deleted").notNull().default(0),
  contactDeleted: integer("contact_deleted").notNull().default(0),
  commercialDeleted: integer("commercial_deleted").notNull().default(0),
  careDeleted: integer("care_deleted").notNull().default(0),
  quoteDeleted: integer("quote_deleted").notNull().default(0),
  mediaDeleted: integer("media_deleted").notNull().default(0),
  error: text("error").notNull().default(""),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});
