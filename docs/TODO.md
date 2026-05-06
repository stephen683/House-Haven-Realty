# House Haven Realty — Launch Tracker

**Source of truth:** `docs/ROADMAP.md` (Master Build Spec v2, with v2.1 Advisory amendment 2026-05-06)
**Goal:** Ship HHR Advisory in 6 phases on top of the existing v2 launch surface (which is already shipped pending IDX key). Every Advisory phase has a `/reports/[date]-*.md` log.
**Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked (needs Stephen / credentials / external approval)

---

## 🚀 ADVISORY BUILD (2026-05-06+)

Six phases sequenced so the Advisory revenue surface ships as early as possible. Pipeline / Value / IDX preserved untouched (Pipeline core is the strategic moat per v2.1 amendment).

### Phase 0 — Foundations & decisions ✅ COMPLETE 2026-05-06

- [x] `/value` ↔ `/home-valuation` consolidation: removed duplicate v1 page + form + API; 301 in place; Header/Footer/Sellers/Communities all repointed; sitemap cleaned. Type-check + lint clean.
- [x] `/reports/` directory created; Phase 0 completion report at `/reports/2026-05-06-phase-0-completion.md`.
- [x] v2.1 amendment banner added to ROADMAP.md noting § 6.1 (homepage) and § 13 (the /learn kill-list item only) are superseded by Advisory pivot.
- [!] Stephen-OS Cloud Console OAuth: confirm "Published" status (or stephen@househavenrealty.com pinned permanent Test user) — **gates Phase 2**, not Phase 1
- [!] Create `HHR Advisory` Google Calendar inside stephen@househavenrealty.com; capture `HHR_ADVISORY_CALENDAR_ID` — **gates Phase 2**
- [!] Create Stripe $200 product in live mode; capture `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — **gates Phase 2**
- [ ] Confirm `ADVISORY_DISCLOSURE_TEXT` default is acceptable (or Stephen provides custom) — **soft gate for Phase 1**

### Phase 1 — `/advisory` argument surface (no booking, no payment) ✅ SHIPPED 2026-05-06

Report: `/reports/2026-05-06-phase-1-shipped.md`

- [x] `/advisory` main argument page (hero, how-it-works, three tracks, what's-in-a-Brief, why-this-exists, FAQ, disclosure)
- [x] `/advisory/fsbo` track page (with NAR commission disclosure)
- [x] `/advisory/buyer-roadmap` track page
- [x] `/advisory/sell-or-rent` track page (with NAR commission disclosure)
- [x] `/advisory/samples/[track]` placeholder routes (banner: "Sample Brief in production — check back soon")
- [x] `/advisory/book` placeholder with email-capture waitlist (Stephen tightening item 7)
- [x] `POST /api/advisory/waitlist` with dedupe by lower(email)
- [x] Supabase migration `009_advisory_book_waitlist` applied to project `eefqcgetyxdrvchkwhrq`
- [x] Header gets `Advisory` nav entry between Communities and Buyers (full restructure → Phase 3)
- [x] Reusable `<AdvisoryCTA context={...}/>` component staged for Phases 4–5
- [x] `Service` + `FAQPage` JSON-LD on `/advisory`; per-page `metadata` on every advisory route
- [x] Sitemap: 8 new advisory entries
- [ ] FSBO sample Brief — awaits Stephen's draft (placeholder live in the meantime)

### Phase 1.5 — Supabase cleanup ✅ SHIPPED 2026-05-06

Report: `/reports/2026-05-06-phase-1.5-cleanup.md`

- [x] Applied migration `003_value_tool` to Supabase (creates `valuation_cache`, `cma_requests`)
- [x] Applied migration `004_listings_cache` to Supabase
- [x] Dropped legacy `valuation_requests` table (orphaned by Phase 0 /value consolidation, superseded by `cma_requests`)
- [x] New migration file `010_drop_legacy_valuation_requests.sql` recording the drop in version control
- [x] Verified post-migration schema state via `list_tables`

### Phase 1.5b — `spatial_ref_sys` RLS (cosmetic) ⚠️ MANUAL APPLY REQUIRED

- [x] Migration `011_spatial_ref_sys_rls.sql` written and committed
- [!] Apply via Supabase Dashboard SQL Editor (MCP `apply_migration` returns `42501: must be owner of table spatial_ref_sys` — the table is owned by `supabase_admin` per PostGIS install; the Dashboard runs as a higher-privileged role)
- Header in `supabase/migrations/011_spatial_ref_sys_rls.sql` has the SQL ready to paste

### Phase 2 — Booking flow (Stripe + Google Calendar + Resend)

**Phase 2 scaffolding ✅ SHIPPED 2026-05-06** (libs + DB ready; UI/API routes in next pass)

Report: `/reports/2026-05-06-phase-2-scaffolding.md`

- [x] Supabase migration `012_advisory_bookings` applied (full lifecycle: payment_status, engagement_letter_status, brief_status, reminder timestamps, cancellation, admin_notes; auto-update updated_at trigger)
- [x] `lib/stripe.ts` — fetch-based wrapper with deterministic mock when `STRIPE_SECRET_KEY` unset (matches existing `rentcast/hubspot/resend` pattern, no SDK install). `createPaymentIntent`, `retrievePaymentIntent`, `verifyWebhookSignature` (manual HMAC-SHA256 with timestamp tolerance), `getPublishableKey`, `isStripeLive`
- [x] `lib/google-calendar.ts` — fetch-based wrapper with mock when OAuth env vars unset. OAuth refresh-token → access-token caching, `listBusy`, `createEvent` (with conferenceData / Google Meet link), `deleteEvent`, `isCalendarLive`
- [x] `lib/advisory-bookings.ts` — Supabase CRUD with full type model (`AdvisoryBookingRow`, `CreateBookingInput`, `UpdateBookingInput`). `createBooking`, `getBookingById`, `getBookingByPaymentIntent`, `updateBooking`, `listBookingsForReminderWindow(48|2)`
- [x] `lib/advisory-emails.ts` — six templates via `lib/resend.ts`: confirmation, engagement letter, 48h reminder, 2h reminder, brief delivery, Stephen new-booking notification

**Phase 2 second pass — UI + API + cron (next session, after Stephen smoke-tests Phase 1):**

- [ ] `app/advisory/book/page.tsx` — replace placeholder with real flow (Phase 1 waitlist remains live until this swap)
- [ ] `app/advisory/book/BookingClient.tsx` — multi-step (TrackPicker / IntakeForm / SlotPicker / StripeCheckout)
- [ ] Track-specific intake field components per brief (FSBO: address + listing status; Buyer Roadmap: timeframe + pre-approval; Sell-or-Rent: address + mortgage + reason)
- [ ] FSBO + Sell-or-Rent intake pre-pulls RentCast; stored on booking record
- [ ] `app/advisory/book/confirmation/page.tsx` — post-payment confirmation with .ics download, calendar add links
- [ ] `app/api/advisory/create-intent/route.ts` — POST: validates intake, RentCast pre-pull for relevant tracks, creates booking row, creates Stripe PaymentIntent, returns clientSecret
- [ ] `app/api/advisory/stripe-webhook/route.ts` — verifies signature, on `payment_intent.succeeded` creates Calendar event, fires confirmation + engagement letter emails
- [ ] `app/api/advisory/calendar-slots/route.ts` — GET: returns available slots in `?from=...&to=...` window with server-enforced rules (Tue 9/10:30, Thu 1/2:30 Central; 48hr min; 4/wk; 8/mo; no Fri PM)
- [ ] `app/api/advisory/deliver-brief/[id]/route.ts` — Stephen-only HMAC-gated, marks booking delivered + fires email
- [ ] `app/api/cron/advisory-reminders/route.ts` + Vercel cron entry — hourly tick, fires 48h + 2h reminders
- [ ] npm install: `@stripe/stripe-js` + `@stripe/react-stripe-js` (client-side Stripe Elements)
- [ ] Sample Brief #2 (Buyer Roadmap) — Stephen target end of Phase 2

### Phase 3 — Homepage rebrand to three peer paths

- [ ] Three homepage headline candidates → `/reports/[date]-homepage-headlines.md` (Stephen picks before merge)
- [ ] Hero rewrite: typography-only until Stephen-at-Nashville-location photo lands (data-file slot-in)
- [ ] Three peer cards (DIY tools / Hire by hour / Hire as agent) replacing existing Difference grid
- [ ] Below-fold: "What you walk away with" (sample Brief snippets via `data/sample-briefs.ts`), "Three tracks", "What we publish" (preview of /learn), "From Stephen" (text + non-Stephen photo), Testimonials (kept), Newsletter (kept)
- [ ] Header restructure: 5 top-level peers (Find Homes / Communities / Pipeline / Advisory / Home Value), drop dropdowns, secondary nav for About/Learn/Contact/phone
- [ ] SiteFooter footer-nav regroup (full diff in Phase 3 report)
- [ ] Old hero archived; commit hash noted in `/reports/[date]-phase-3-shipped.md`
- [ ] Sample Brief #3 (Sell-or-Rent) — Stephen target end of Phase 3

### Phase 4 — `/learn` library (restructure from `/blog`)

- [ ] `data/blog.ts` → `data/learn.ts` with `category` + `stage` taxonomy
- [ ] `app/learn/page.tsx`, `app/learn/[slug]/page.tsx`, `app/learn/greatest-hits/page.tsx`, `app/learn/feed.xml/route.ts`
- [ ] 301 `/blog/*` → `/learn/*` in next.config.mjs
- [ ] `<AdvisoryCTA>` block at end of each article (keyed off article tags)
- [ ] FSBO / Sell-or-Rent topic scaffolding with `status: 'publishing-soon'` markers
- [ ] Greatest Hits curation ask in `/reports/[date]-greatest-hits-curation-ask.md` (8–12 pieces with reader job-to-be-done from Stephen)
- [ ] RSS feed working

### Phase 5 — RentCast on community pages + Pipeline data cross-links

- [ ] Stephen delivers Top-10 Tier-1 communities list with transaction-history rationale
- [ ] `<NeighborhoodPipeline zip={...}/>` reusable component
- [ ] `<NeighborhoodRental zip={...}/>` reusable component
- [ ] 57 community pages rewritten to brief's 10-section structure (lifestyle content removed); Tier 1 / Tier 2 / Tier 3 differentiation
- [ ] Cross-link components on `/homes-for-sale/[id]` listing detail
- [ ] Pipeline page footer: contextual Advisory CTA

### Phase 6 — E-sign integration + admin polish

- [ ] Vendor pick: HelloSign or DocuSign (Stephen)
- [ ] Engagement letter swap from PDF placeholder to real e-sign send
- [ ] Webhook → `advisory_bookings.engagement_letter_status`
- [ ] Stephen admin view at `/agents/advisory` (HMAC-gated, reuses existing pattern)

---

---

## ⚠️ OPEN DECISIONS (gate launch)

- [!] **MLS Grid Realtracs pricing** — Real cost confirmed at MLS Grid application. Stephen to call Realtracs 615-385-0777 or email info@mlsgrid.com when submitting. Verified third-party listing shows ~$250/mo.
- [ ] **RentCast plan tier** — Key is live and working (2026-05-04). Tier confirmation deferred — doesn't gate launch. Confirm in RentCast dashboard whether this is Foundation $74/mo (1,000 calls) or Growth $199/mo (5,000 calls) so we know our budget for the cache strategy.

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

### Blocker 3 — House Haven Value ✅ RENTCAST LIVE · AWAITS HUBSPOT + RESEND

Per ROADMAP §7. AVM is live in production as of 2026-05-04. Lead-capture pipeline (HubSpot + Resend) still mocked until those keys land.

- [x] `RENTCAST_API_KEY` set in Vercel (production + preview + development) — 2026-05-04. Env ID `ZAHTHCAOPSyvwBpY`. Redeployed `dpl_2gVfXTF3kCxZLSjkQV4wp2q3ToRJ` (72s, READY+PROMOTED). Smoke-tested `4400 Murphy Rd, Sylvan Park` → `source: rentcast`, $290k/$483k/$676k, 5 comps. ✅ LIVE.
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
- [x] RentCast smoke test ✅ — 4400 Murphy Rd Sylvan Park returned real estimate + 5 comps via prod `/api/value`
- [ ] On HubSpot + Resend keys: verify CMA form submit lands a contact in portal 242305648, fires Stephen alert email, fires lead confirmation email

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

## 🔧 Post-v2 shipped (2026-04-20)

Pipeline product redesign beyond the original launch scope — triggered by Stephen's mobile smoke-test. Six commits on `main`, all deployed to prod.

- [x] **ArcGIS date-literal fix** (`36c07ca`) — permit map was returning zero features; ArcGIS rejected raw epoch-millis in WHERE, now uses `TIMESTAMP 'YYYY-MM-DD HH:MM:SS'` literal. 493 live permits restored.
- [x] **Compass-style detail panel** (`f80b163`) — full redesign: MapLibre mini-map hero + "Tracked by House Haven" chip, neighborhood-street-block (no house number), fiduciary-conflict block, email-only notify form with TCPA, builder card with prior Nashville builds, collapsible FTHB checklist, NAR 2026 commission disclosure. Removed: construction cost (read like a price), permit number, council district, parcel ID, census tract, raw Purpose text.
- [x] **Real construction-stage timeline** — ePermits REST API (`epermits.nashville.gov/api/permit/1.0/`) returns live inspection records. 7-stage ladder: Permitted → Site prep → Foundation → Framing → Dried-in → Finishing → Near listing. Per-stage click-to-expand shows underlying inspections with results + scheduled dates.
- [x] **Canary monitoring** (`69431c2` + `611b562`) — `/api/cron/canary` at `*/15 * * * *` hits 6 critical endpoints with shape assertions, writes to Supabase `canary_runs` + `canary_state`, emails on DOWN/RECOVERED transitions with 1hr cooldown. Verified end-to-end — canary caught its own config bug (VERCEL_URL was auth-gated), fired DOWN alerts, recovered on next cycle after fix.
- [x] **Condos + multifamily included** (`5016b0e`) — broadened ArcGIS filter to include condo permits (filed as Commercial-Rehab with subtype `Multifamily, Condominium`), duplexes, multifamily-new. Dedupe by building: 186 McGavock unit permits collapse to one pin with `unitCount: 186` chip on panel. Accessory subtypes (pools/sheds/carports) filtered out at source.
- [x] **Stage illustrations** — 7 branded SVG illustrations in `/public/images/pipeline/stages/` (permitted, site_prep, foundation, framing, dried_in, finishing, near_listing). Shipped as hero banner at top of stage timeline (always visible, no tap required). Swap to JPG photos by dropping files and flipping extension in `lib/stage-images.ts`.
- [x] **Lot size via parcels join** — new `fetchParcelByAPN()` hits `Parcels_view` ArcGIS layer, surfaces acres + zoning + land use. Panel shows 4th spec cell when acres > 0; zoning always in the footer caption.
- [x] **Unified map color** (`f8eff0c`) — pins now colored by ZIP saturation score (red/orange/yellow/blue/gray) via MapLibre `match` expression. Retired permit-age coloring + its bottom-left legend. Hot ZIPs side panel now collapsed by default; tiny "Show Hot ZIPs" pill in top-right, click to expand top-10 list.

**Supabase migrations added:** `005_permit_stages`, `006_property_notify`, `007_canary` — all applied.

**Env vars still pending on Vercel:**
- [ ] `RESEND_API_KEY` — currently alerts dry-run to logs; set this to activate email
- [ ] `HUBSPOT_PRIVATE_APP_TOKEN` + custom properties (`house_haven_source`, `selling_timeline`, `pipeline_notify` source)
- [ ] `CANARY_BASE_URL=https://househavenrealty.com` at DNS cutover

---

## Change Log

- **2026-05-04 — RentCast live in production.** `RENTCAST_API_KEY` set on Vercel (prod + preview + dev) via REST API. Redeployed `dpl_2gVfXTF3kCxZLSjkQV4wp2q3ToRJ` from `6379edf` in 72s, READY + PROMOTED across all aliases (`project-bmq0e.vercel.app`, `househavenrealty.com`, `www.househavenrealty.com`). Smoke test on `4400 Murphy Rd, Nashville TN 37209`: `source: rentcast`, low/mid/high $290k/$483k/$676k, 5 comps within 0.5mi/6mo. Supabase `valuation_cache` writing on cache miss (30-day TTL). Blocker 3 status: RENTCAST LIVE → AWAITS HUBSPOT + RESEND. Sidebar observation: Vercel deployment aliases now include `househavenrealty.com` and `www.househavenrealty.com` — DNS may have already cut over or is pre-configured to. Verify before announcing launch.
- **2026-04-17 (later) — All 4 launch blockers built, awaiting API keys.** Pipeline rebrand: NashBuilds → Nashville Pipeline / House Haven Pipeline (file moves, find/replace, 301s, Dataset schema, empty states, permit popup rewrite, "how to use" modal). Compliance: NAR 2026 commission-negotiable disclosure component mounted on Sellers, Home Valuation, Value, IDX disclaimer; TCPA aligned to spec §5.4 verbatim. House Haven Value: full /value page + ValueClient + RentCast/HubSpot/Resend libs (graceful mock fallback when keys missing) + Supabase migration 003 + 2 API routes. Realtracs IDX skeleton: MLS Grid client + listings cache migration 004 + ListingCard/Grid/SearchFilters components + full /homes-for-sale and detail page with NAR-compliant attribution + RealEstateListing schema. Homepage: 8 sections per §6.1, brokerage-first, brand-kit-true. Deleted orphaned `/new-construction` route (consolidated into Pipeline via 301). Final: type-check ✅, lint ✅, build ✅ (homepage 3.57 kB, /pipeline 7.68 kB, /value 3.39 kB).
- **2026-04-17 — v2 pivot.** Rewrote `docs/ROADMAP.md` and `docs/TODO.md` to Master Build Spec v2. Locked the 4-blocker launch model: Realtracs IDX, homepage rebuild, House Haven Value, Nashville Pipeline rebrand. Verified 3 spec inaccuracies via web research and flagged at top of each doc (MLS Grid pricing, RentCast tiering, NAR 2026 disclosure). Catalogued 30+ NashBuilds references awaiting rename. Surfaced Modulus-vs-Fraunces typography conflict and B/W-vs-warm-accent palette conflict to Stephen as decisions needed.
- **2026-04-16 (session 4)** — Vercel deploys fixed (`framework: null` → `nextjs` via `vercel.json`). Rebuilt new construction map on PermitPilot architecture (MapLibre + ArcGIS). Logo package + Modulus fonts placed. 22 Tier 2 + 15 Tier 3 community pages. NashBuilds shipped end-to-end at `/new-builds` (saturation scoring, builder profiles, alert signup, mobile drawer, 15 ZIP pages). 25 blog posts. Brand kit applied (B/W/Grey, Modulus, squared forms). 152 routes, all green.
- **2026-04-15 (sessions 1–3)** — Initial scaffold + content push: Header, footer, compliance shell, all forms, homepage, About, Team (11 profiles), Contact (with API), Home Valuation (with API), Buyers (mortgage calc + moving checklist), Sellers, Communities (20 Tier 1 pages), Blog (5 long-form posts + author cards + Article schema), `/new-construction` with live Socrata permit fetch + interactive map. Full SEO foundation: sitemap, robots, OrganizationJsonLd, Place schema, Article schema, Person schema, BreadcrumbList, FAQ schema, LocalBusiness schema. 20+ Blok URL 301s.
