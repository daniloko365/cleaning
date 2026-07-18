import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  analyticsEvents,
  careRequests,
  commercialLeads,
  contactMessages,
  quotes,
  retentionRuns,
} from "@/db/schema";
import { hasAdminAccess } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    if (!(await hasAdminAccess(request)))
      return Response.json({ error: "Authentication required." }, { status: 401 });
    const db = await getDb();
    const [
      quoteRows,
      careRows,
      commercialRows,
      messageRows,
      eventRows,
      latestRetention,
      recentQuotes,
      recentCare,
      recentCommercial,
      recentMessages,
    ] = await Promise.all([
      db
        .select({ value: count() })
        .from(quotes)
        .where(eq(quotes.status, "requested")),
      db
        .select({ value: count() })
        .from(careRequests)
        .where(eq(careRequests.status, "received")),
      db
        .select({ value: count() })
        .from(commercialLeads)
        .where(eq(commercialLeads.status, "received")),
      db
        .select({ value: count() })
        .from(contactMessages)
        .where(eq(contactMessages.status, "received")),
      db.select({ value: count() }).from(analyticsEvents),
      db
        .select()
        .from(retentionRuns)
        .orderBy(desc(retentionRuns.startedAt))
        .limit(1),
      db
        .select({
          reference: quotes.reference,
          status: quotes.status,
          createdAt: quotes.createdAt,
          customerName: quotes.customerName,
          email: quotes.email,
          phone: quotes.phone,
          zip: quotes.zip,
          itemId: quotes.itemId,
          quantity: quotes.quantity,
          requestedSlot: quotes.requestedSlot,
          estimateTotal: quotes.estimateTotal,
          address: quotes.address,
          notes: quotes.notes,
          legalHold: quotes.legalHold,
        })
        .from(quotes)
        .orderBy(desc(quotes.createdAt))
        .limit(30),
      db
        .select({
          reference: careRequests.reference,
          quoteReference: careRequests.quoteReference,
          status: careRequests.status,
          createdAt: careRequests.createdAt,
          email: careRequests.email,
          requestType: careRequests.requestType,
          message: careRequests.message,
          legalHold: careRequests.legalHold,
        })
        .from(careRequests)
        .orderBy(desc(careRequests.createdAt))
        .limit(30),
      db
        .select({
          reference: commercialLeads.reference,
          status: commercialLeads.status,
          createdAt: commercialLeads.createdAt,
          company: commercialLeads.company,
          customerName: commercialLeads.customerName,
          email: commercialLeads.email,
          phone: commercialLeads.phone,
          propertyType: commercialLeads.propertyType,
          targetDate: commercialLeads.targetDate,
          notes: commercialLeads.notes,
          legalHold: commercialLeads.legalHold,
        })
        .from(commercialLeads)
        .orderBy(desc(commercialLeads.createdAt))
        .limit(30),
      db
        .select({
          reference: contactMessages.reference,
          status: contactMessages.status,
          createdAt: contactMessages.createdAt,
          customerName: contactMessages.customerName,
          email: contactMessages.email,
          phone: contactMessages.phone,
          topic: contactMessages.topic,
          message: contactMessages.message,
          legalHold: contactMessages.legalHold,
        })
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt))
        .limit(30),
    ]);
    return Response.json(
      {
        generatedAt: new Date().toISOString(),
        queues: [
          {
            label: "Unreviewed photo quotes",
            count: quoteRows[0]?.value ?? 0,
            state: "live",
          },
          {
            label: "Open care / re-clean requests",
            count: careRows[0]?.value ?? 0,
            state: "live",
          },
          {
            label: "Commercial briefs",
            count: commercialRows[0]?.value ?? 0,
            state: "live",
          },
          {
            label: "General / privacy messages",
            count: messageRows[0]?.value ?? 0,
            state: "live",
          },
          {
            label: "First-party analytics events",
            count: eventRows[0]?.value ?? 0,
            state: "live",
          },
        ],
        controls: [
          {
            label: "Calendar capacity / conflict detection",
            state: "request-only",
            detail:
              "Windows remain requested until the verified calendar provider confirms route capacity; this prevents false double-booking claims.",
          },
          {
            label: "SMS and email delivery failures",
            state: "provider-ready",
            detail:
              "Notification templates exist; delivery/failure signals activate with the verified sender, domain and SMS provider.",
          },
          {
            label: "Payment failures and final-price variance",
            state: "deferred",
            detail:
              "No payment is collected in the launch flow, so payment failures and estimate-vs-final variance are not fabricated.",
          },
          {
            label: "Price and scope review",
            state: "owner-managed",
            detail:
              "Public menu prices and inclusions are editable in the owner dashboard and should be reviewed before promotions or scope changes.",
          },
          {
            label: "Abandoned requests",
            state: "privacy-safe",
            detail:
              "Drafts save and resume in the customer browser without collecting contact data prematurely; orphaned media is removed after seven days.",
          },
          {
            label: "API abuse controls",
            state: "enforced",
            detail:
              "D1-backed per-route limits protect quote, upload, contact, care, analytics and admin endpoints without storing raw IP addresses.",
          },
          {
            label: "Retention execution",
            state: latestRetention[0]?.status ?? "scheduled",
            detail: latestRetention[0]
              ? `Last run ${latestRetention[0].startedAt}; media ${latestRetention[0].mediaDeleted}, records ${latestRetention[0].quoteDeleted + latestRetention[0].careDeleted + latestRetention[0].commercialDeleted + latestRetention[0].contactDeleted}, analytics ${latestRetention[0].analyticsDeleted}.`
              : "Daily cleanup is scheduled; no completed production run is recorded yet.",
          },
          {
            label: "City-page proof threshold",
            state: "protected",
            detail:
              "All city routes stay noindex until a real case, service note, availability fact and internal proof link exist.",
          },
        ],
        records: {
          quotes: recentQuotes,
          care: recentCare,
          commercial: recentCommercial,
          messages: recentMessages,
        },
        retention: latestRetention[0] ?? null,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
