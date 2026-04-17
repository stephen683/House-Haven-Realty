# House Haven Realty — Launch Tracker

**Source of truth:** `docs/ROADMAP.md` (Master Build Spec v2)
**Goal:** Ship the 4 launch blockers, then domain cutover. Every other feature waits.
**Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked (needs Stephen / credentials / external approval)

---

## ⚠️ OPEN DECISIONS (gate launch)

- [!] **MLS Grid Realtracs pricing** — Real cost confirmed at MLS Grid application. Stephen to call Realtracs 615-385-0777 or email info@mlsgrid.com when submitting. Verified third-party listing shows ~$250/mo.
- [!] **RentCast plan tier** — Cheapest tier with AVM + comps is Foundation $74/mo (1,000 calls). Stephen approves Foundation, or upgrades to Growth ($199/mo, 5,000 calls)?

## ✅ DECISIONS RESOLVED (2026-04-17)

- **Brand kit always wins.** Locked: Modulus Bold + Regular fonts, B/W/Grey palette only, no accent color. v2 spec's serif/Inter Tight + warm accent proposals are dead.
- **Hero stats: "500+ homes closed · $250M+ sold."** Use these everywhere. v2 spec's "219 closings · $124M" is dead.
- **Office: 5016 Centennial Blvd Suite 200, Nashville TN 37209.** Already correct sitewide (footer, contact, privacy, terms, JSON-LD).
- **Olivia Mortensen: removed.** Deleted from `data/team.ts`; `/meet-olivia-mortensen` Blok redirect now points to `/team` index instead of a 404. Visible team count = 10.
- **NAR commission disclosure exact wording:** *"Broker commissions are not set by law and are fully negotiable."* Source: NAR settlement effective Aug 17 2024; same wording sitewide on seller-facing surfaces (Sellers page, Value page, listing-detail seller-info).

---

## 🚦 LAUNCH BLOCKERS (the only 4 things that ship before cutover)

### Blocker 1 — Realtracs IDX via MLS Grid ✅ CODE SHIPPED, AWAITS API KEY

- [!] Stephen submits MLS Grid application (gates real data; ~2-day approval expected)
- [!] Stephen sets `MLS_GRID_API_KEY` in Vercel
- [x] `lib/mlsgrid.ts` — typed RESO Web API v2 client with mock fallback (returns 8 sample listings until API key is set)
- [x] `supabase/migrations/004_listings_cache.sql` — `listings_cache` table (apply via Supabase MCP)
- [x] `app/homes-for-sale/page.tsx` — full search with filters (city/zip/price/beds/type)
- [x] `app/homes-for-sale/[id]/page.tsx` — full detail with hero + photo grid + listing attribution
- [x] `components/listings/` — ListingCard, ListingGrid, SearchFilters
- [x] NAR IDX compliance: Realtracs copyright, "deemed reliable" disclaimer, last-updated timestamp, listing brokerage attribution on every detail card, no buyer-agent compensation displayed
- [x] **NAR 2026 commission-negotiable disclosure** in `IDXDisclaimer` and on listing detail
- [x] Featured Listings strip on homepage pulls 8 cards live
- [x] `RealEstateListing` + `BreadcrumbList` schema on detail pages
- [ ] On API key arrival: smoke test live data, set `next.config.mjs` 15-min ISR if needed
- [ ] Search-by-listing-status filtering (post-launch enhancement; current search defaults to Active)

### Blocker 2 — Homepage Rebuilt Brokerage-First ✅ SHIPPED

All 8 sections per ROADMAP §6.1. Composed inline in `app/page.tsx` (single-file kept simple — sections clearly delineated; can split into `components/homepage/` later if needed).

- [x] Hero with locked tagline, two CTAs (Browse homes / What is my home worth), trust line ("500+ homes closed · $250M+ sold · since 2016")
- [x] Featured Listings Strip (8 cards) pulling live via `searchListings` (mock fallback in place)
- [x] House Haven Difference cards: Pipeline visually weighted (col-span-2 + photo hero), Value, Journey (Coming Soon with newsletter capture)
- [x] Nashville Pipeline Preview section (full-width black) with CTA into `/pipeline`
- [x] Communities grid — 12 featured (East Nashville, The Nations, 12 South, Germantown, Franklin, Brentwood, Mt Juliet, Hendersonville, Sylvan Park, Spring Hill, Nolensville, Thompson's Station)
- [x] Stephen Moment — first-person paragraph + working headshot + tel: link
- [x] Testimonials section using existing 7 verbatim
- [x] Newsletter section (dark variant) with TCPA
- [x] Build size: 3.57 kB / 105 kB First Load JS
- [x] Verified TREC §5.1: firm name + phone in every-page footer; phone also in nav and Stephen Moment
- [ ] Lighthouse Mobile Performance ≥ 90 (LCP ≤ 2.5s) — verify on Vercel preview after deploy
- [ ] axe-core full sweep — verify on preview
- [ ] If Stephen confirms a specific Nashville architectural photo for the hero, swap in (currently text-only hero per spec)

### Blocker 3 — House Haven Value ✅ CODE SHIPPED, AWAITS API KEYS

Per ROADMAP §7. UI ships with mock-fallback estimates; real numbers activate the moment RentCast is connected.

- [!] Stephen sets `RENTCAST_API_KEY` in Vercel (Foundation tier $74/mo confirmed)
- [!] Stephen sets `HUBSPOT_PRIVATE_APP_TOKEN` (portal 242305648). Custom properties needed: `house_haven_source` (single-line text), `selling_timeline` (single-line text)
- [!] Stephen sets `RESEND_API_KEY` and verifies `alerts@househavenrealty.com` sender domain
- [ ] Stephen sets `GOOGLE_PLACES_API_KEY` (post-launch enhancement; current input is plain text and works fine without autocomplete)
- [x] `lib/rentcast.ts` — server-side AVM client with deterministic mock fallback
- [x] `lib/hubspot.ts` — search/create/update contact, attach note, gracefully no-op without token
- [x] `lib/resend.ts` — wrapper that dry-runs (logs to console) without API key
- [x] `supabase/migrations/003_value_tool.sql` — `valuation_cache` (30-day TTL) + `cma_requests` (apply via Supabase MCP)
- [x] `app/value/page.tsx` (server, SEO meta + `LocalBusiness` + `Service` schema) + `app/value/ValueClient.tsx` (interactive)
- [x] Result card with Low / Mid / High range + 3–5 comps (address-masked)
- [x] CMA request form: name/email/phone/timeline + TCPA + NAR commission disclosure
- [x] `app/api/value/route.ts` — Supabase cache check → RentCast → cache write
- [x] `app/api/value/request-cma/route.ts` — Supabase insert → HubSpot upsert → Resend (Stephen alert + lead confirmation)
- [x] HubSpot fallback safe: Supabase always source of truth; HubSpot failure never blocks lead
- [x] No email wall before estimate appears
- [x] Disclaimer: "This is an automated estimate based on public records and recent sales. It is not an appraisal."
- [x] NAR 2026 commission disclosure on form + page footer
- [ ] On API keys: smoke test with real Sylvan Park address; verify HubSpot contact + Stephen email + lead email

### Blocker 4 — Nashville Pipeline Rebrand ✅ SHIPPED

Per ROADMAP §8. All data, scoring, and ZIP logic preserved; only the wrapper changed.

- [x] Moved: `app/new-builds/` → `app/pipeline/`, `app/api/nashbuilds/` → `app/api/pipeline/`, `components/permits/` → `components/pipeline/`, `lib/nashbuilds-zips.ts` → `lib/pipeline-zips.ts`, `NashBuildsApp.tsx` → `PipelineApp.tsx`
- [x] Renamed exports: `NASHBUILDS_ZIPS` → `PIPELINE_ZIPS`
- [x] All copy updated: `NashBuilds` → `Nashville Pipeline` (public) / `House Haven Pipeline` (product refs); `pipeline_alert` source name (newsletter route accepts both for backward compat)
- [x] Updated header nav (Pipeline replaces NashBuilds entry), footer nav (Pipeline link), sitemap, market-reports/[zip] cross-links
- [x] 301 redirects added: `/new-builds` + `/new-builds/:path*` → `/pipeline/*`; `/api/nashbuilds/*` → `/api/pipeline/*`; `/new-construction` → `/pipeline` (deleted as orphaned duplicate)
- [x] OG images regenerated for `/pipeline` and `/pipeline/[zip]`
- [x] `Dataset` schema added on `/pipeline` (Nashville/Davidson scope per §8.5) and per-ZIP `Dataset` + `Place` on `/pipeline/[zip]`
- [x] Polish pass:
  - [x] Loading skeleton on dynamic MapLibre import (spinner + label)
  - [x] Empty state on ZIP page when 0 permits in 12mo (CTA to active ZIPs + alerts)
  - [x] Empty state on main map when filters return 0 results (with "Clear all filters" button)
  - [x] Permit popup copy rewrite per §8.3 template (residential new construction · permit issued date · est. cost · builder · specs)
  - [x] "How to use this map" modal accessible from header; explains pin colors, filtering, alerts
- [x] Build verified clean: 15 ZIP pages + builders + main map all rendering at `/pipeline/*`
- [x] Copy says "Nashville" (not "Middle Tennessee") until Layer 0.5 county expansion
- [ ] Builder profile pages: live "currently building" count + cross-link to MLS filter (post-launch — small enhancement)
- [ ] Press-ready PDF export button on `/pipeline` (deferred to Layer 4 Pulse first issue)
- [ ] Mobile pinch/tap smoothing — verify on actual iPhone/Android post-deploy

---

## 🎬 LAUNCH PREP (post-blockers, pre-cutover)

- [ ] `robots.ts` updated to allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Bingbot per §10.2
- [ ] `sitemap.ts` regenerated with `/pipeline/*`, `/value`, `/homes-for-sale/*`
- [ ] GA4 measurement ID added; events wired per §11.2 (14 events)
- [ ] `app/api/cron/sync-permits` confirmed running daily on Vercel Pro cron
- [ ] Resend sender domain (`alerts@househavenrealty.com`) verified in Resend dashboard
- [ ] HubSpot custom properties created in portal 242305648: `house_haven_source`, `selling_timeline`
- [ ] Search Console verified for `househavenrealty.com` (and submit sitemap on cutover)
- [ ] Lighthouse audit: 10 representative pages, all categories ≥ 90 (Perf), ≥ 95 (A11y/SEO/Best Practices)
- [ ] axe-core sweep
- [ ] Cross-browser smoke: Chrome, Safari, Firefox, Edge, iPhone Safari, Android Chrome
- [ ] Confirm 301 map covers every Blok URL Stephen knows about (`next.config.mjs` already has 20+; review for gaps)

## 🚪 DOMAIN CUTOVER (Gate D — Stephen explicit go)

- [ ] Stephen DNS: `househavenrealty.com` → Vercel
- [ ] SSL provisioning verified (Vercel auto)
- [ ] Production smoke test: every launch-blocker page loads, every form submits, every redirect resolves
- [ ] Submit sitemap to Search Console
- [ ] 24-hour monitoring: Vercel Analytics, Speed Insights, error logs
- [ ] Stephen cancels Blok subscription
- [ ] Send launch announcement (Stephen's personal FB/IG + past-client email — see §10.4 Week 1)

---

## 🌱 POST-LAUNCH LAYERS (do not start any of these before launch is live)

Each layer ships with a shareable moment per §9. One layer every 2–3 weeks. Stephen approves scope + PR plan at Gate F before each layer begins.

- [ ] **Layer 0.5** (Week 2–3) — Pipeline county expansion (Williamson, Sumner, Rutherford, Wilson). Then update copy to "Middle Tennessee."
- [ ] **Layer 1** (Week 4–6) — House Haven Journey (FTHB pillar + 12 spokes; built for Chris). Axios pitch + Reddit r/nashville post.
- [ ] **Layer 2** (Week 7–9) — House Haven Match (6-question neighborhood quiz, lifestyle-only).
- [ ] **Layer 3** (Week 10–12) — House Haven Commute (Distance Matrix). Nashville Post pitch.
- [ ] **Layer 4** (Week 13–15) — House Haven Pulse (monthly market report). Tennessean pitch + Pulse newsletter launch.
- [ ] **Layer 5** (Week 16–18) — House Haven Risk (FEMA NFHL + NOAA storms).
- [ ] **Layer 6** (Week 19–21) — House Haven Tax (TN-specific calculator).
- [ ] **Layer 7** (Week 22–24) — House Haven Comps (deed-derived, TN non-disclosure workaround).
- [ ] **Layer 8** (Week 25–27) — House Haven Digest (homeowner retention email).

---

## 📦 PRESERVED FROM PRE-V2 BUILD (already shipped, stays as-is)

These exist on `main` and are not relaunched, just light-polished where needed:

- 152 routes deploying green on Vercel (commit `40265b9`)
- Compliance shell: SiteFooter, IDXDisclaimer, ComplianceBanner, FairHousingBadge, TCPAConsent
- Header (logo + nav + click-to-call + mobile menu)
- 57 community pages (Tier 1 × 20 + Tier 2 × 22 + Tier 3 × 15) — Fair Housing audited, Place schema
- 11 team profile pages with Person + RealEstateAgent schema
- 25 blog posts with Article schema (no new posts until Layer 1)
- About, Contact, Buyers (with mortgage calculator + moving checklist), Sellers, Privacy, Terms, Property Management, Market Reports landing
- Supabase migrations 001 (initial) + 002 (leads + building_permits)
- Daily Vercel Cron `/api/cron/sync-permits` (6am UTC)
- Vercel Analytics + Speed Insights
- 20+ legacy Blok URL redirects in `next.config.mjs`
- Brand fonts (Modulus Bold + Medium) in `public/fonts/`
- Logo package in `public/images/logo/`

---

## Change Log

- **2026-04-17 (later) — All 4 launch blockers built, awaiting API keys.** Pipeline rebrand: NashBuilds → Nashville Pipeline / House Haven Pipeline (file moves, find/replace, 301s, Dataset schema, empty states, permit popup rewrite, "how to use" modal). Compliance: NAR 2026 commission-negotiable disclosure component mounted on Sellers, Home Valuation, Value, IDX disclaimer; TCPA aligned to spec §5.4 verbatim. House Haven Value: full /value page + ValueClient + RentCast/HubSpot/Resend libs (graceful mock fallback when keys missing) + Supabase migration 003 + 2 API routes. Realtracs IDX skeleton: MLS Grid client + listings cache migration 004 + ListingCard/Grid/SearchFilters components + full /homes-for-sale and detail page with NAR-compliant attribution + RealEstateListing schema. Homepage: 8 sections per §6.1, brokerage-first, brand-kit-true. Deleted orphaned `/new-construction` route (consolidated into Pipeline via 301). Final: type-check ✅, lint ✅, build ✅ (homepage 3.57 kB, /pipeline 7.68 kB, /value 3.39 kB).
- **2026-04-17 — v2 pivot.** Rewrote `docs/ROADMAP.md` and `docs/TODO.md` to Master Build Spec v2. Locked the 4-blocker launch model: Realtracs IDX, homepage rebuild, House Haven Value, Nashville Pipeline rebrand. Verified 3 spec inaccuracies via web research and flagged at top of each doc (MLS Grid pricing, RentCast tiering, NAR 2026 disclosure). Catalogued 30+ NashBuilds references awaiting rename. Surfaced Modulus-vs-Fraunces typography conflict and B/W-vs-warm-accent palette conflict to Stephen as decisions needed.
- **2026-04-16 (session 4)** — Vercel deploys fixed (`framework: null` → `nextjs` via `vercel.json`). Rebuilt new construction map on PermitPilot architecture (MapLibre + ArcGIS). Logo package + Modulus fonts placed. 22 Tier 2 + 15 Tier 3 community pages. NashBuilds shipped end-to-end at `/new-builds` (saturation scoring, builder profiles, alert signup, mobile drawer, 15 ZIP pages). 25 blog posts. Brand kit applied (B/W/Grey, Modulus, squared forms). 152 routes, all green.
- **2026-04-15 (sessions 1–3)** — Initial scaffold + content push: Header, footer, compliance shell, all forms, homepage, About, Team (11 profiles), Contact (with API), Home Valuation (with API), Buyers (mortgage calc + moving checklist), Sellers, Communities (20 Tier 1 pages), Blog (5 long-form posts + author cards + Article schema), `/new-construction` with live Socrata permit fetch + interactive map. Full SEO foundation: sitemap, robots, OrganizationJsonLd, Place schema, Article schema, Person schema, BreadcrumbList, FAQ schema, LocalBusiness schema. 20+ Blok URL 301s.
