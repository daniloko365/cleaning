# Novaclean independent completion audit

Audit date: 2026-07-17
Blueprint: `../orange_county_textile_cleaning_website_blueprint.md`
Market workbook: `../../all info/orange_county_textile_market_audit_calling_workbook 2.numbers`

## Independent verdict

The codebase is a tested and deployed technical production candidate for a mobile Orange County upholstery and textile-care business. The conversion architecture, server-side pricing, live D1/R2 path, customer-care lookup, protected operations dashboard, automated retention, application-level abuse controls, legal center, security headers, accessibility, responsive behavior, SEO controls, and Cloudflare Worker are implemented.

It is **not yet approved for unrestricted public launch or paid promotion**. The remaining blockers are business facts and operating providers, not missing infrastructure or page templates: verified legal entity and public contact details, California counsel review, insurance/credential evidence, real staff and work proof, and production communications/calendar ownership. The public `workers.dev` origin is suitable for technical QA but should not be promoted or used for real customer intake until those inputs are supplied.

## Market weaknesses closed

| Market weakness | Novaclean response |
|---|---|
| Hidden prices and late minimums | 22 canonical public prices/bundles show a crossed published comparison, source, checked month, matched scope, and zone minimum before contact details. |
| Carpet-first category confusion | Home, navigation, services, and estimator lead with sofa, sectional, mattress, pet, rug, and textile care. |
| Call-only quoting | Eight-step mobile flow covers ZIP, item, fabric, condition, photos, estimate, preferred window, contact, and consent. |
| Doorstep price changes | One price registry feeds all surfaces; the server independently recalculates the estimate and ignores client-supplied totals. Added work requires explanation and approval. |
| Fake “live booking” | Generated windows are labeled preferences. A request remains requested until checked against real route capacity. |
| Overpromised stain/odor results | Material and contamination checks, safe-method limits, referral rules, and a separate quality/damage path replace absolute claims. |
| Weak fabric qualification | Care-code and material education, unknown-fabric continuation, test requirements, and explicit decline/referral conditions are present. |
| Lost post-booking context | NC reference, private status lookup, reschedule, care/claim, prepare, and aftercare routes retain the service context. |
| Weak commercial handoff | B2B intake captures company, role, counts, locations, access, timing, procurement/COI needs, and optional site media. |
| Thin local SEO and fabricated trust | City, results, reviews, team, credentials, and Spanish routes stay `noindex` or out of the sitemap until they have real proof and review. |

## Pricing verification

- Every displayed Novaclean rate is 70% of the named published comparison, rounded down for whole-dollar rates; low per-unit rates retain cents.
- Key Pit Klean public prices support the current $99 three-seat sofa, $79 loveseat, $89 room, $140 three rooms, $199 whole home, $3 stair, $25 hallway, $40 pet-area, $35 room protector, and $1.50/sq-ft rug comparisons.
- PR Cleaning public prices support the current $169 L sectional, $219 U sectional, $79 mattress, $59 rug, and $39 stain comparisons.
- Barefoot Clean publicly states $45–65 side-chair and $10–20 dining-chair ranges; Novaclean compares against the lower bound.
- Mattress, rug, and protector scope copy was corrected during this audit to match the source rather than imply a narrower or different unit.
- Auto-interior pricing was removed from the public matrix because operational readiness was not proven.
- Bundles use transparent sums of matched public items rather than invented former prices.

The price program still needs a documented refresh/retirement owner and California advertising counsel review before public launch. A competitor changing or removing a price requires the affected comparison to be updated or withdrawn.

## Critical defects found and fixed in this audit

1. **False success on database failure:** the browser previously generated a local-looking NC reference when `/api/quotes` failed. It now remains on the contact step, states that nothing was submitted, and preserves only a non-contact draft.
2. **Booking ZIP bypass:** `/book` could skip ZIP validation without a valid service ZIP. It now starts at ZIP unless the provided ZIP is in an explicit supported set.
3. **PII in local storage:** name, email, phone, address, notes, access information, consent, and uploads are no longer persisted in the quote draft. Non-contact drafts expire after seven days.
4. **Client-controlled price:** `/api/quotes` previously accepted `total` and `comparison`. It now calculates both from the canonical server registry and validates item, quantity, add-ons, zone, material, condition, window, identity, and consent.
5. **Fabricated care records:** `/api/care` could create a claim for a fake NC reference. It now verifies the reference/email pair and permits only documented reschedule or claim requests.
6. **Upload privacy:** uploads now validate image signatures and structure and remove common JPEG EXIF/IPTC/comment, PNG text/EXIF/time, and WebP EXIF/XMP metadata before private R2 storage.
7. **Successful quote resurrected as draft:** an effect could recreate a resume draft after success. Step 8 now guarantees removal.
8. **Accessibility landmarks/contrast:** nested complementary landmarks, unlandmarked quick actions, and a transient hero fade contrast failure were corrected.
9. **SEO leakage:** conversion, account, proof-pending, incomplete translation, and unverified trust routes are noindex and excluded from the sitemap as appropriate.
10. **Unverified structured data:** `LocalBusiness` was replaced by `Organization` until a real NAP can support local-business markup. Canonical origin is environment-driven.
11. **Unverified claims:** the UV-method statement and unverified public email were removed; “exact price” and live-availability language were replaced with estimate/preference language.
12. **API and response hardening:** JSON payload limits, stricter email/enumeration/date validation, consent-policy versioning, constant-work admin token comparison, no-store API responses, CSP, clickjacking, MIME, referrer, permissions, COOP, HSTS, and robots headers were added.
13. **Production abuse control:** D1-backed per-route limits now protect quote, upload, commercial, contact, care, analytics, and admin routes. Fingerprints rotate daily and do not store raw IP addresses.
14. **Retention and orphan media:** a daily Worker cron removes eligible analytics, stale leads/requests, old service records by status, expired rate-limit counters, and unsubmitted R2 media. Legal holds exempt operational records and every run is logged.
15. **Operations handoff:** the token-protected dashboard now exposes recent work queues, safe status updates, legal holds, guarded deletion with media cleanup, and manual retention execution instead of aggregate counts alone.

## Legal and privacy coverage

The policy center now contains substantive, versioned pages for:

- Privacy Policy, categories/sources/purposes/disclosure/retention/security/California rights/GPC/children/changes.
- Notice at Collection with category, purpose, sale/share, sensitive-data, and intended-retention disclosures.
- Website and Service Terms covering formation, estimates, appointments, customer duties, change approval, outcomes, payment state, care, media, website use, and preserved statutory rights.
- SMS Terms, cancellation/rescheduling, care guarantee, operational photo/media policy, commercial terms, accessibility statement, Cookie and Storage Policy, and Claims and Damage Process.

The forms link the notice/privacy/terms at the point of consent and store policy version `2026-07-17`. Quote uploads do not grant marketing permission. The current build does not use third-party advertising cookies and suppresses optional analytics under Global Privacy Control or Do Not Track.

These pages are operationally specific, but they do not replace advice from a California attorney. Entity identity, physical/public contact disclosures, venue/contracting language, insurance, and the final marketing/SMS implementation require counsel and operations verification. Retention automation and legal-hold controls are now implemented and production-tested; the business still needs to assign an accountable operator and approve the stated periods.

## Verification evidence

- `npm run lint`: pass.
- `npm audit`: 0 known dependency vulnerabilities after secure PostCSS/esbuild overrides and current Next/Vite/Cloudflare tooling updates.
- `npm test`: 15/15 pass after production-origin build; rendered routes, pricing rule, security headers, legal pages, sitemap, server-price integrity, migrations, media sanitizer, rate limiting, retention, cron, and operations controls are covered.
- End-to-end browser story: quote UI → `/api/quotes` → local D1 → confirmation → `/track`: pass.
- Tampered client total `$1`: ignored; API returned canonical `$69` estimate and `$99` comparison.
- Out-of-area quote: rejected. Fake care reference: rejected. Invalid JPG: rejected. Valid PNG: stored through local R2.
- 57/57 sitemap URLs: HTTP 200, HTML where expected, nonempty unique titles and canonical links.
- Proof/private route audit: team, results, reviews, gift cards, referral, care plan, credentials, Spanish draft, portal, admin, quote/book, and commercial form protected with `noindex` as designed.
- Axe 4.11.4: zero automated violations on home, pricing, quote, privacy, commercial request, contact, portal, and admin after fixes. Automated tools cover only part of accessibility; manual keyboard, zoom, responsive overflow, reduced-motion, and mobile menu checks were also performed.
- Desktop and 390 px mobile visual checks: no horizontal overflow, no framework error overlay, expected navigation and conversion controls visible.
- Route security: API responses are `no-store`; private/operational routes add `X-Robots-Tag`; all responses receive the configured security-header set.
- GitHub: production-operations commit `f33a162` was pushed to `main`; verification run `29628012644` passed lint/build/15 tests. Cloudflare deployment remained intentionally skipped in CI because unattended deployment secrets are not yet configured.
- Cloudflare production: Worker `novaclean-oc` deployed at `https://novaclean-oc.daniel-c45.workers.dev`; D1 migrations `0000`–`0004` are applied; R2 `novaclean-oc-media`, observability, and cron `17 8 * * *` are active.
- Production full-story checks: homepage/privacy 200; expected canonical and security headers; D1-backed unmatched care lookup 404; protected admin 200 with valid token; retention run completed and logged; R2 image upload/read/delete succeeded; ninth quote attempt in a 15-minute test bucket returned 429 after eight allowed requests.

## Remaining launch blockers and limitations

1. **Legal business facts:** legal entity, business/public address treatment, verified phone/text/email, contracting identity, and jurisdiction language are still unknown.
2. **Operational providers:** email sender, SMS provider and suppression logic, real route calendar, payment/deposit policy, and CRM notifications are not connected and are not simulated.
3. **Trust evidence:** team, reviews, results, insurance, licenses, certifications, and background-check claims remain unpublished until verified.
4. **Counsel and price operations:** California counsel must review advertising comparisons, terms, retention periods, contact disclosures, and the contracting entity. Competitor sources need periodic evidence capture and refresh; the current check is dated July 2026.
5. **Custom domain and unattended releases:** the Worker production origin is live, but the final domain is not selected/attached. GitHub Actions verifies every push; automatic Cloudflare deployment still needs scoped repository secrets/variables or a native Workers Builds connection.
6. **Account-layer defense:** application-level limits are enforced. Cloudflare WAF/bot rules, alert ownership, log-retention policy, and incident routing remain account/operations decisions rather than code blockers.
7. **Operating ownership:** retention is automated and tested, but a named owner must review failures/legal holds and respond to privacy, claim, accessibility, and care queues before real data collection.

## Release recommendation

Approve the code and current Worker environment for technical production QA and stakeholder review. Do not market the origin or collect real customer data until the blockers above are assigned, verified, and recorded. When the final domain and business facts arrive, rebuild with that origin, rerun the end-to-end quote/track flow, test provider delivery and route capacity, recheck accessibility/security/canonicals, and then remove only the proof gates supported by real evidence.
