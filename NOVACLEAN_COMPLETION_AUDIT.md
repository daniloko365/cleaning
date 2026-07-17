# Novaclean independent completion audit

Audit date: 2026-07-16  
Blueprint: `../orange_county_textile_cleaning_website_blueprint.md`  
Market workbook: `../../all info/orange_county_textile_market_audit_calling_workbook 2.numbers`

## Independent verdict

The codebase is a tested release candidate for a mobile Orange County upholstery and textile-care business. The conversion architecture, server-side pricing, D1/R2 data path, customer-care lookup, legal center, security headers, accessibility, responsive behavior, SEO controls, and Cloudflare deployment path are implemented.

It is **not yet approved for unrestricted public launch**. The remaining blockers are business facts and external account configuration, not missing page templates: verified legal entity and public contact details, California counsel review, insurance/credential evidence, real staff and work proof, production communications/calendar operations, a tested retention/deletion workflow, and authenticated Cloudflare resources. The current hosted review version should remain private until those inputs are supplied.

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

## Legal and privacy coverage

The policy center now contains substantive, versioned pages for:

- Privacy Policy, categories/sources/purposes/disclosure/retention/security/California rights/GPC/children/changes.
- Notice at Collection with category, purpose, sale/share, sensitive-data, and intended-retention disclosures.
- Website and Service Terms covering formation, estimates, appointments, customer duties, change approval, outcomes, payment state, care, media, website use, and preserved statutory rights.
- SMS Terms, cancellation/rescheduling, care guarantee, operational photo/media policy, commercial terms, accessibility statement, Cookie and Storage Policy, and Claims and Damage Process.

The forms link the notice/privacy/terms at the point of consent and store policy version `2026-07-16`. Quote uploads do not grant marketing permission. The current build does not use third-party advertising cookies and suppresses optional analytics under Global Privacy Control or Do Not Track.

These pages are operationally specific, but they do not replace advice from a California attorney. Entity identity, physical/public contact disclosures, venue/contracting language, insurance, actual retention automation, and the final marketing/SMS implementation require counsel and operations verification.

## Verification evidence

- `npm run lint`: pass.
- `npm audit`: 0 known dependency vulnerabilities after secure PostCSS/esbuild overrides and current Next/Vite/Cloudflare tooling updates.
- `npm test`: pass after final build; rendered route, pricing rule, security headers, legal pages, sitemap, server-price integrity, migration, and media sanitizer coverage.
- End-to-end browser story: quote UI → `/api/quotes` → local D1 → confirmation → `/track`: pass.
- Tampered client total `$1`: ignored; API returned canonical `$69` estimate and `$99` comparison.
- Out-of-area quote: rejected. Fake care reference: rejected. Invalid JPG: rejected. Valid PNG: stored through local R2.
- 57/57 sitemap URLs: HTTP 200, HTML where expected, nonempty unique titles and canonical links.
- Proof/private route audit: team, results, reviews, gift cards, referral, care plan, credentials, Spanish draft, portal, admin, quote/book, and commercial form protected with `noindex` as designed.
- Axe 4.11.4: zero automated violations on home, pricing, quote, privacy, commercial request, contact, portal, and admin after fixes. Automated tools cover only part of accessibility; manual keyboard, zoom, responsive overflow, reduced-motion, and mobile menu checks were also performed.
- Desktop and 390 px mobile visual checks: no horizontal overflow, no framework error overlay, expected navigation and conversion controls visible.
- Route security: API responses are `no-store`; private/operational routes add `X-Robots-Tag`; all responses receive the configured security-header set.

## Remaining launch blockers and limitations

1. **Cloudflare account authentication:** the repository contains a verified Workers deployment generator and GitHub Actions workflow, but this machine is not authenticated to the owner’s Cloudflare account and the available dashboard is at login. Production D1/R2 IDs and scoped credentials must be configured.
2. **Correct Cloudflare product:** this is a full-stack Next.js application with route handlers, SSR, D1, and R2. It must deploy to Cloudflare Workers, not a static Pages export. Static Pages would silently break core functionality.
3. **Legal business facts:** legal entity, business/public address treatment, verified phone/text/email, contracting identity, and jurisdiction language are still unknown.
4. **Operational providers:** email sender, SMS provider and suppression logic, real route calendar, payment/deposit policy, and CRM notifications are not connected and are not simulated.
5. **Trust evidence:** team, reviews, results, insurance, licenses, certifications, and background-check claims remain unpublished until verified.
6. **Retention execution:** stated retention periods need an operational deletion job, legal-hold process, request log, and accountable owner before public data collection.
7. **Abuse controls:** Cloudflare WAF/rate limits, bot controls, alerting, and production log retention should be configured at the account layer after deployment.
8. **Media lifecycle:** unsubmitted uploads can be orphaned and require the retention cleanup job; public result use still requires a separate signed release.
9. **Price operations:** competitor sources need periodic evidence capture and refresh; the current check is dated July 2026.

## Release recommendation

Approve the code for source control, private stakeholder review, and authenticated production-environment setup. Do not open the site to the public or collect real customer data until the blockers above are assigned, verified, and recorded. After that, rerun migrations, the end-to-end quote/track flow, accessibility checks, security headers, and canonical/domain checks on the final Cloudflare origin.
