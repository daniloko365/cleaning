# Novaclean website

Full-stack Orange County upholstery and textile-care website built from `orange_county_textile_cleaning_website_blueprint.md`.

Read the honest release verdict and remaining launch blockers in [`NOVACLEAN_COMPLETION_AUDIT.md`](./NOVACLEAN_COMPLETION_AUDIT.md). Cloudflare setup is documented in [`CLOUDFLARE_DEPLOYMENT.md`](./CLOUDFLARE_DEPLOYMENT.md).

## Implemented

- Conversion-led multi-route Next.js site for residential, commercial, service-area, fabric, guide, customer-care, and legal journeys.
- 22 source-backed prices/bundles at 70% of matched public comparisons, with downward rounding, scope, source, and checked month.
- Eight-step photo-first estimate/request flow with explicit ZIP coverage, non-live preferred windows, consent, and server-confirmed reference.
- Server-side price recalculation and validation; the browser cannot submit its own total.
- Seven-day non-contact browser draft. Name, email, phone, address, notes, access details, consent, and files are never stored in that draft.
- D1 quotes, contact, commercial, care, and first-party analytics records with consent-policy versions and migrations.
- Private R2 upload path with count/size/type/signature validation and common metadata stripping.
- Reference/email status lookup plus verified reschedule and claim creation.
- Substantive versioned policy center for privacy, notice at collection, terms, SMS, cancellation, guarantee, photos, commercial, accessibility, cookies/storage, and damage claims.
- CSP and response-security headers, no-store APIs, D1-backed abuse limits, a token-protected operations dashboard, automated retention/legal holds, GPC/DNT handling, and deliberate `noindex` gates.
- Responsive visual system, reduced-motion support, semantic form states, unique metadata/canonicals, Organization/Service/FAQ schema, and verified sitemap routing.

## Local development

```bash
npm ci
npm run dev
npm run lint
npm test
```

The local URL is `http://localhost:3000`. The Vite/Cloudflare development layer provides local D1 and R2 bindings. D1 migrations live under `drizzle/`.

## Cloudflare hosting

The application requires server rendering, Route Handlers, D1, and R2. Cloudflare’s correct hosting target for this full-stack Next.js architecture is **Cloudflare Workers**. A static Pages export is not equivalent and would break quotes, uploads, tracking, and admin functionality.

The verified production site is [daniilnizhelskyi.com](https://daniilnizhelskyi.com). `www.daniilnizhelskyi.com` and the technical `workers.dev` hostname redirect to that canonical origin. A working domain is not authorization to begin marketing or collect real customer data while the business identity and operating contacts remain placeholders.

GitHub Actions verifies every push to `main` and deploys automatically only after the repository secrets/variables in `CLOUDFLARE_DEPLOYMENT.md` are configured. An authenticated release from this machine uses one migration-safe command:

```bash
export NEXT_PUBLIC_SITE_URL=https://daniilnizhelskyi.com
export CLOUDFLARE_CUSTOM_DOMAINS=daniilnizhelskyi.com,www.daniilnizhelskyi.com
export CLOUDFLARE_WORKER_NAME=novaclean-oc
export CLOUDFLARE_D1_DATABASE_NAME=novaclean-oc-db
export CLOUDFLARE_D1_DATABASE_ID=your-d1-id
export CLOUDFLARE_R2_BUCKET_NAME=novaclean-oc-media
npm run cf:deploy
```

## Sources of truth

- Prices, coverage, services, guides: `lib/site-data.ts`
- Legal content/version: `lib/legal-content.ts`
- Quote flow: `components/quote-wizard.tsx`
- Server validation: `app/api/*`
- D1 schema: `db/schema.ts`
- Route templates: `components/page-templates.tsx`
- Design system: `app/globals.css`
- Cloudflare config generator: `scripts/prepare-cloudflare-config.mjs`
- Media provenance: `public/media/ATTRIBUTION.md`

## Public-launch policy

No fake phone, staff member, review, completed job, credential, insurance claim, same-day availability, live calendar, or delivery confirmation is substituted for missing evidence. Unverified proof pages stay noindex. Cloudflare, retention, media storage, and application-level rate limiting are operational; unrestricted public launch still waits on the legal entity/NAP, counsel review, insurance/credentials, verified proof, and production communications/calendar ownership.
