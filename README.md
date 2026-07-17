# Novaclean website

Production-oriented Orange County upholstery and textile care website built from `orange_county_textile_cleaning_website_blueprint.md`.

The final requirement-to-evidence matrix is in `NOVACLEAN_COMPLETION_AUDIT.md`.

## What is implemented

- Multi-route App Router website: core conversion, 10 service pages, fabric education, commercial, service-area, guides, customer care, trust/legal and system states.
- Central launch-price matrix used by home, pricing, service pages and quote estimator. Display prices equal 70% of documented public comparisons with downward whole-dollar rounding.
- Photo-first eight-step quote / booking flow with ZIP zoning, item/quantity, fabric, condition, add-ons, secure upload, estimate, requested route window, contact, consent and full-scope confirmation.
- Browser draft persistence and resume banner. An unconfirmed route window is never represented as live confirmed capacity.
- D1 models and migrations for quotes, general messages, commercial leads, care requests and privacy-aware analytics events.
- R2 upload path with file type, count and size controls.
- Customer-care status, reschedule and 7-day care request flows.
- Commercial walkthrough intake with counts, access, procurement, COI requirement, target date and photo/floor-plan upload.
- Corporate visual system, custom CSS logo/favicon, edited WebP editorial imagery, responsive motion, reduced-motion handling and deterministic OG card.
- Canonicals, sitemap, robots rules, LocalBusiness / Service / FAQ structured data, city-page `noindex` guard and EN/ES landing alternates.
- GPC / Do Not Track respected by the first-party analytics client.

## Run and verify

```bash
npm install
npm run dev
npm run lint
npm run build
npm test
```

The local URL is `http://localhost:3000`. D1 migrations are generated under `drizzle/` and packaged automatically by Sites. Logical bindings are declared in `.openai/hosting.json` as `DB` and `MEDIA`.

## Single sources of truth

- Content and prices: `lib/site-data.ts`
- Notification-ready copy: `lib/notification-templates.ts`
- D1 schema: `db/schema.ts`
- Quote flow: `components/quote-wizard.tsx`
- Route templates: `components/page-templates.tsx`
- Brand and layout system: `app/globals.css`
- Media origin record: `public/media/ATTRIBUTION.md`

## Launch verification

Only two visible verification categories are used on the website:

1. `[VERIFY BEFORE LAUNCH]` consolidates business phone/text, legal entity/service-base facts, named team, real review/result proof, insurance/credentials and external email/SMS/payment/calendar/admin-access integrations.
2. `[VERIFY LEGAL]` covers current, scope-matched comparison-price evidence and California advertising review.

No fake phone, people, review, job result, credential, same-day claim or live-calendar claim is shipped as a substitute.

## Admin and portal architecture

The noindex customer portal uses a service reference plus booking email, exposes only operational status, and links preparation, aftercare, reschedule, care-request and rebook paths. Its data model can attach appointment, invoice, job-media and history records when the verified scheduler/payment/CRM systems are connected.

The noindex admin control room requires a long `ADMIN_ACCESS_TOKEN`. Its server endpoint returns 404 when access is unconfigured or invalid and returns aggregate queue counts only—never customer PII. Provider-backed calendar, notification, payment and audit integrations remain explicit launch gates rather than simulated controls.
