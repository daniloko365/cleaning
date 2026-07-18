import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../dist/server/wrangler.json", import.meta.url);
const targetPath = new URL("../dist/server/wrangler.deploy.json", import.meta.url);
const required = ["CLOUDFLARE_D1_DATABASE_NAME", "CLOUDFLARE_D1_DATABASE_ID", "CLOUDFLARE_R2_BUCKET_NAME"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing Cloudflare deployment variables: ${missing.join(", ")}`);

const config = JSON.parse(await readFile(sourcePath, "utf8"));
const customDomains = (process.env.CLOUDFLARE_CUSTOM_DOMAINS || "daniilnizhelskyi.com,www.daniilnizhelskyi.com")
  .split(",")
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean);
config.name = process.env.CLOUDFLARE_WORKER_NAME || "novaclean-oc";
config.d1_databases = [{
  binding: "DB",
  database_name: process.env.CLOUDFLARE_D1_DATABASE_NAME,
  database_id: process.env.CLOUDFLARE_D1_DATABASE_ID,
  migrations_dir: "../../drizzle",
}];
config.r2_buckets = [{ binding: "MEDIA", bucket_name: process.env.CLOUDFLARE_R2_BUCKET_NAME }];
config.vars = { ...(config.vars || {}), NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://daniilnizhelskyi.com" };
config.routes = customDomains.map((pattern) => ({ pattern, custom_domain: true }));
config.workers_dev = true;
config.preview_urls = true;
config.triggers = { ...(config.triggers || {}), crons: ["17 8 * * *"] };
config.observability = { enabled: true, logs: { enabled: true, invocation_logs: true } };
await writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Prepared ${targetPath.pathname} for Worker ${config.name}.`);
