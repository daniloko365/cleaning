# Cloudflare production deployment

## Correct Cloudflare target

This project is a dynamic Next.js application. It uses Route Handlers, server rendering, D1, R2 uploads, an admin endpoint, and customer-care lookups. A static Cloudflare Pages export would remove or break those capabilities. Cloudflare’s current documentation directs full-stack Next.js applications to **Cloudflare Workers through the OpenNext-style adapter**, while the Pages Next.js guide covers static exports.

- [Cloudflare: Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare: Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare: static Next.js export](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)

Therefore the repository is prepared for Cloudflare’s Workers hosting surface, with GitHub as the source of truth. This preserves the full website instead of pretending a static Pages build is equivalent.

## Current production state

Verified on 2026-07-17:

- Worker: `novaclean-oc`
- Origin: [https://novaclean-oc.daniel-c45.workers.dev](https://novaclean-oc.daniel-c45.workers.dev)
- D1 database: `novaclean-oc-db`
- R2 bucket: `novaclean-oc-media`
- Scheduled retention: `17 8 * * *` UTC
- D1 migrations: `0000` through `0004` applied
- Observability/invocation logs: enabled
- Protected admin secret: installed directly with Wrangler; never committed

Production checks covered the homepage/canonical/security headers, a D1-backed care lookup, authenticated admin summary and manual retention run, R2 upload/read/delete, and a live 429 response after the configured quote-request limit.

## One-time Cloudflare setup

The Worker, D1 database, R2 bucket, secret, migrations, and cron already exist in the intended account. The remaining one-time setup below is only for unattended GitHub-to-Cloudflare releases:

1. Create a scoped API token that can deploy Workers and apply D1 migrations in the intended account.
2. In GitHub repository settings, add these Actions secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_D1_DATABASE_ID`
   - `ADMIN_ACCESS_TOKEN` (at least 32 random characters)
3. Add these GitHub Actions variables:
   - `CLOUDFLARE_D1_DATABASE_NAME`
   - `CLOUDFLARE_R2_BUCKET_NAME`
   - `CLOUDFLARE_WORKER_NAME` (recommended: `novaclean-oc`)
   - `NEXT_PUBLIC_SITE_URL` (the verified production origin)
4. Point the verified custom domain to the deployed Worker only after the legal entity, public contact details, price-source review, insurance facts, and external communications are approved. Rebuild with that exact origin so every canonical, sitemap URL, and structured-data URL changes together.

The workflow always runs lint, build, and tests. Deployment is skipped safely until all required Cloudflare credentials and resource identifiers exist.

## Local authenticated deployment

```bash
npm ci
npm test
export NEXT_PUBLIC_SITE_URL=https://novacleanoc.com
export CLOUDFLARE_WORKER_NAME=novaclean-oc
export CLOUDFLARE_D1_DATABASE_NAME=novaclean-oc-db
export CLOUDFLARE_D1_DATABASE_ID=your-d1-id
export CLOUDFLARE_R2_BUCKET_NAME=novaclean-oc-media
npm run build
npm run cf:prepare
npx wrangler secret put ADMIN_ACCESS_TOKEN --config dist/server/wrangler.deploy.json
npm run cf:deploy
```

`npm run cf:deploy` builds, generates the production Wrangler file, applies outstanding remote D1 migrations, and deploys. Run `wrangler secret put` only when creating or rotating the admin token; an ordinary deploy preserves it.

Do not commit Cloudflare tokens, account IDs, the admin token, or a generated production Wrangler file. The admin UI deliberately keeps its bearer token only in the current tab’s memory rather than local storage.
