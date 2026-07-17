# Cloudflare production deployment

## Correct Cloudflare target

This project is a dynamic Next.js application. It uses Route Handlers, server rendering, D1, R2 uploads, an admin endpoint, and customer-care lookups. A static Cloudflare Pages export would remove or break those capabilities. Cloudflare’s current documentation directs full-stack Next.js applications to **Cloudflare Workers through the OpenNext-style adapter**, while the Pages Next.js guide covers static exports.

- [Cloudflare: Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare: Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare: static Next.js export](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)

Therefore the repository is prepared for Cloudflare’s Workers hosting surface, with GitHub as the source of truth. This preserves the full website instead of pretending a static Pages build is equivalent.

## One-time Cloudflare setup

1. Create a production D1 database and R2 bucket in the intended Cloudflare account.
2. Create a scoped API token that can deploy Workers, apply D1 migrations, and use the intended account resources.
3. In GitHub repository settings, add these Actions secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_D1_DATABASE_ID`
   - `ADMIN_ACCESS_TOKEN` (at least 32 random characters)
4. Add these GitHub Actions variables:
   - `CLOUDFLARE_D1_DATABASE_NAME`
   - `CLOUDFLARE_R2_BUCKET_NAME`
   - `CLOUDFLARE_WORKER_NAME` (recommended: `novaclean-oc`)
   - `NEXT_PUBLIC_SITE_URL` (the verified production origin)
5. Point the verified custom domain to the deployed Worker only after the legal entity, public contact details, price-source review, insurance facts, and external communications are approved.

The workflow always runs lint, build, and tests. Deployment is skipped safely until all required Cloudflare credentials and resource identifiers exist.

## Local authenticated deployment

```bash
npm ci
npm test
export NEXT_PUBLIC_SITE_URL=https://novacleanoc.com
export CLOUDFLARE_WORKER_NAME=novaclean-oc
export CLOUDFLARE_D1_DATABASE_NAME=novaclean-production
export CLOUDFLARE_D1_DATABASE_ID=your-d1-id
export CLOUDFLARE_R2_BUCKET_NAME=novaclean-media
npm run cf:prepare
npx wrangler d1 migrations apply "$CLOUDFLARE_D1_DATABASE_NAME" --remote --config dist/server/wrangler.deploy.json
npx wrangler secret put ADMIN_ACCESS_TOKEN --config dist/server/wrangler.deploy.json
npx wrangler deploy --config dist/server/wrangler.deploy.json
```

Do not commit Cloudflare tokens, account IDs, the admin token, or a generated production Wrangler file.
