# House Haven Realty — Living Build TODO

**Source of truth:** `docs/ROADMAP.md`
**Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked (needs Stephen/credentials)

This document is kept in sync as Claude Code builds. Check it at the start of every session.

---

## Environment & Credentials (blocking external integrations)

- [x] Next.js 14 + TS + Tailwind scaffolding
- [x] Supabase clients (`lib/supabase/client.ts`, `server.ts`)
- [x] Initial schema migration (`supabase/migrations/001_initial_schema.sql`)
- [x] Brand tokens in Tailwind + Google Fonts (Playfair + DM Sans)
- [ ] Confirm Supabase migration is applied to remote project
- [!] `SUPABASE_SERVICE_ROLE_KEY` in Vercel env
- [!] `RESEND_API_KEY` in Vercel env (for lead notification emails)
- [!] `SIMPLYRETS_API_KEY` / `SIMPLYRETS_API_SECRET` (IDX)
- [!] `RENTCAST_API_KEY` (home valuation)
- [!] `GOOGLE_PLACES_API_KEY` (address autocomplete + reviews)
- [!] `HUBSPOT_API_KEY` (CRM push)
- [!] `NASHVILLE_DATA_APP_TOKEN` (Socrata rate limit bump — optional)
- [!] Confirm office address (Centennial Blvd vs "THE DOJO" Brentwood)
- [!] Confirm whether to include Olivia Mortensen (hidden on current site)

---

## Phase 1 — Foundation, Compliance Shell

- [x] Project init, dependencies, Tailwind config, brand colors
- [x] Google Fonts wired in `app/layout.tsx`
- [x] `components/compliance/SiteFooter.tsx` (firm name + phone + EHO) — expanded with socials + nav columns
- [x] `components/compliance/IDXDisclaimer.tsx`
- [x] `components/compliance/ComplianceBanner.tsx`
- [x] `components/compliance/FairHousingBadge.tsx`
- [x] `components/layout/Header.tsx` — logo mark, nav, click-to-call, mobile menu, dropdown sub-nav
- [x] Skip-to-content link in root layout
- [x] `components/forms/TCPAConsent.tsx` — reusable consent checkbox with Privacy Policy link
- [x] Privacy Policy — real content
- [x] `.eslintrc.json` (next/core-web-vitals)
- [x] `next.config.mjs` remote image hosts (agentaprd, unsplash, chime, supabase)
- [x] Logo package placed — landscape dark/light, vertical, icon mark in `public/images/logo/`
- [x] Brand fonts (Modulus Bold + Medium) copied to `public/fonts/`
- [x] Header: real landscape dark logo via next/image
- [x] Footer: real landscape light logo on navy
- [x] Favicon: house icon mark as `app/icon.png`
- [ ] Download Equal Housing Opportunity logo image to `public/images/` (text badge in footer for now)
- [ ] Download 11 team headshots to `public/images/team/` (currently remote-hosted via Next/Image unoptimized)
- [x] `/terms-of-service` route — full content
- [x] `/market-reports` route — county table + subscribe CTA (live data awaits MLS)
- [x] `/property-management` route — Door Collectors handoff

## Phase 2 — Core Pages

### Homepage
- [x] Hero section with headline, subheadline, dual CTAs
- [x] Featured Listings section (placeholder cards until IDX live) + IDX disclaimer
- [x] "Explore Our Communities" grid
- [x] Testimonials carousel (7 verbatim testimonials) — `TestimonialCarousel.tsx`
- [x] New Construction Map teaser
- [x] Meet the Team teaser
- [x] Newsletter signup with TCPA consent — `NewsletterSignup.tsx`

### About
- [x] Hero + boutique story copy
- [x] Stephen personal bio block
- [x] Stats bar (219+ sales, $124.2M, price range, since 2016)
- [x] "Rent Less, Own More!" initiative block
- [x] Team + contact CTAs

### Team
- [x] `data/team.ts` — all 11 agents with headshots, titles, placeholder bios
- [x] `app/team/page.tsx` — grid of `AgentCard`s
- [x] `app/team/[slug]/page.tsx` — dynamic agent profile
- [x] `generateStaticParams` — 11 static paths generated
- [ ] **TODO: scrape live bios from current site (currently good-faith placeholders)**
- [!] Confirm Olivia Mortensen visibility with Stephen

### Contact
- [x] Contact info block (address, phone, email, socials)
- [x] Google Map embed (iframe)
- [x] Contact form with TCPA consent + interest dropdown — `ContactForm.tsx`
- [x] `app/api/contact/route.ts` — validates, writes to Supabase, sends Resend email if key present

## Phase 3 — IDX Property Search

- [ ] `lib/simplyrets.ts` typed API client (gated on env var)
- [x] `/homes-for-sale` page with filter UI shell (placeholder until IDX live) + IDX disclaimer
- [x] `/homes-for-sale/[id]` listing detail shell + IDX disclaimer
- [ ] Property card component (dynamic, once real listings wire in)
- [ ] Listing attribution (listing agent/office) rendered
- [ ] Map view toggle (MapLibre)
- [ ] "Schedule a Showing" form with TCPA
- [ ] Save search (Supabase account) — deferred
- [!] Awaits MLS credentials

## Phase 4 — Home Valuation (Seller Lead Gen)

- [x] `/home-valuation` page with trust indicators + CMA form
- [x] CMA request form (name, email, phone, timeline, address, TCPA) — `ValuationForm.tsx`
- [x] `/api/valuation` route — validates, writes Supabase, sends Resend email if key present
- [x] Tennessee disclaimer copy
- [x] SEO metadata
- [ ] `lib/rentcast.ts` client for instant AVM preview (gated on env var)
- [ ] Instant value-range UI after address lookup
- [ ] Google Places / Mapbox address autocomplete

## Phase 5 — Community Pages (Programmatic SEO)

- [x] `/communities` index — grouped by county
- [x] `app/communities/[slug]/page.tsx` dynamic route
- [x] `generateStaticParams` from `data/communities.ts`
- [x] Community template sections: breadcrumbs, hero, long-form content, listings, nearby, lead capture
- [x] Structured data (Place + geo coordinates)
- [x] Fair-Housing-safe copy (no protected class references)
- [ ] Map-based index with clickable pins
- [ ] Live IDX listing embed per community (blocked on Phase 3)
- [ ] Permit activity counter pulling from `/api/permits`
- [ ] Market snapshot (median, DOM, trend) — blocked on MLS data

### Tier 1 community content (write first)
- [x] Joelton
- [x] Bordeaux / Brick Church Pike
- [x] Whites Creek
- [x] Madison
- [x] Ashland City
- [x] Pegram
- [x] Kingston Springs
- [x] Greenbrier
- [x] Springfield
- [x] White House
- [x] Coopertown
- [x] Dickson
- [x] Burns
- [x] Charlotte
- [x] Fairview
- [x] Thompsons Station
- [x] Watertown
- [x] Lebanon
- [x] Inglewood
- [x] Donelson — **All 20 Tier 1 communities live.**

### Tier 2 (build second)
- [x] 22 Tier 2 communities shipped: Hendersonville, Gallatin, Goodlettsville, Portland, Hermitage, Antioch, Bellevue, Old Hickory, Murfreesboro, Smyrna, La Vergne, Franklin, Brentwood, Nolensville, Spring Hill, Mt. Juliet, Pleasant View, Cross Plains, Orlinda, Millersville, White Bluff

### Tier 3 (build last)
- [x] 15 Nashville core neighborhoods: East Nashville, Germantown, The Gulch, 12 South, Sylvan Park, Green Hills, Berry Hill, Melrose, Wedgewood-Houston, Edgehill/Music Row, Hillsboro Village, West End/Midtown, Salemtown, The Nations, Lockeland Springs — **All 57 community pages live across 3 tiers.**

## Phase 6 — New Construction Permit Map (Flagship)

- [x] `lib/permits.ts` — Nashville Socrata client with residential filter
- [x] `/api/permits` route with days/limit params, 6-hour ISR
- [x] `/new-construction` page — SSR from Socrata, stats bar, permit grid, lead CTA
- [x] **MapView rebuilt** — direct MapLibre GL JS with CARTO light tiles (free, no key), GeoJSON circle layer (GPU-rendered), data-driven recency colors, hover highlight, click→detail panel
- [x] `/api/permits/geojson` route — GeoJSON FeatureCollection endpoint for MapLibre
- [x] `/api/suggest` + `/api/geocode` — ArcGIS Nashville address search (no API key)
- [x] `MapSearch.tsx` — debounced autocomplete with flyTo on select
- [x] `MapFilters.tsx` — filter panel (date range, cost min/max, ZIP code)
- [x] `PermitDetailPanel.tsx` — click detail with permit info + lead-capture CTA
- [x] Full-page map layout with compact header, toolbar, responsive detail panel
- [x] `building_permits` table migration for historical caching (Supabase migration 002)
- [x] Daily Vercel Cron `/api/cron/sync-permits` → upserts 180 days of permits into Supabase building_permits table (6am UTC daily)
- [x] Permit alert email signup — AlertSignup component on NashBuilds toolbar
- [ ] Surrounding counties (Sumner/Robertson/etc.) — research + add feeds

### Phase 6B — NashBuilds Flagship Product ✅ SHIPPED
**Branded as "NashBuilds" — standalone product at /new-builds**
- [x] Brand: "NashBuilds" — shorter, punchier, domain-friendly
- [x] Live ArcGIS API: services2.arcgis.com Nashville permits (29,460 records, daily refresh)
- [x] Property detail parsing: sqft, beds, baths parsed from permit Purpose field via regex
- [x] Property type classification: single_family, townhome, condo, duplex, multi_family, etc.
- [x] Saturation Score algorithm: per-ZIP scoring (0-100) based on volume + value + recency
- [x] Advanced filters: date range, cost, ZIP, beds, property type (6 dimensions)
- [x] Builder profiles: /new-builds/builders index + /new-builds/builders/[slug] dynamic pages
- [x] Email alert signup: AlertSignup component → leads table with target_zip + source='nashbuilds_alert'
- [x] Standalone product UI: /new-builds with own branded header/footer (black bg, NashBuilds branding)
- [x] Mobile bottom drawer: slide-up animation with backdrop, map stays visible
- [x] 15 ZIP landing pages: /new-builds/[zip] with saturation hero, builders, stats, embedded map
- [x] Homepage NashBuilds hero: flagship product showcase section
- [x] Dynamic OG images: NashBuilds, ZIP pages, About
- [x] Sitemap: all NashBuilds routes with daily/weekly priorities
- [x] 15 Market Report ZIP pages: /market-reports/[zip] with 6-month pipeline trend
- [ ] Photo integration for completed/in-progress builds
- [ ] Surrounding county data feeds

## Phase 7 — Blog & Market Reports

- [x] `data/blog.ts` — structured long-form posts with sections, callouts, related links
- [x] `/blog` index with featured post layout + grid of remaining
- [x] `/blog/[slug]` full post template with breadcrumbs, hero, body, author card, related communities, related posts, Article JSON-LD, OpenGraph metadata
- [x] Real long-form content for all 5 initial posts:
  - [x] Moving to Nashville in 2026
  - [x] Nashville market report — April 2026
  - [x] First-time buyer programs in Tennessee
  - [x] Rent vs. buy in Nashville 2026
  - [x] New construction contracts in Nashville
- [x] Internal linking — posts reference 20 community pages and each other
- [x] `/market-reports` page with county snapshot table
- [ ] `next-mdx-remote` upgrade if we want richer inline components
- [ ] Monthly cadence established (post-launch)

## Phase 8 — Buyer & Seller Journeys

- [x] `/buyers` — 8-step process timeline + Buyer Representation Agreement disclosure
- [x] `/sellers` — 8-step selling process, staging checklist, CMA CTA
- [x] Mortgage calculator widget on `/buyers#mortgage-calculator` — `components/buyers/MortgageCalculator.tsx` (client, live PITI math, editable price/down/rate/term/tax/insurance)
- [x] `/property-management` — Door Collectors handoff page
- [x] Moving checklist accordion on /buyers — `MovingChecklist.tsx` (5-phase accordion with checkbox UI)

## Phase 9 — Reviews & Social Proof

- [ ] Google Places API client (or manual Supabase table)
- [ ] Reviews widget on homepage
- [ ] AggregateRating schema.org
- [ ] Reviews section on About
- [ ] Per-agent reviews on team pages

## Phase 10 — SEO & Structured Data

- [x] Per-page metadata on every built route (title/description/canonical where relevant)
- [x] JSON-LD: RealEstateAgent + WebSite+SearchAction rendered sitewide via `components/seo/OrganizationJsonLd.tsx`
- [x] Place schema on every community page
- [x] `app/sitemap.ts` — auto-includes static routes + all communities + all team members
- [x] `app/robots.ts`
- [x] Breadcrumb nav on community pages
- [x] RealEstateAgent Person schema per team member on `/team/[slug]` pages (linked to parent Organization via `@id` reference)
- [x] Article schema on blog posts (`/blog/[slug]` — headline, author, publisher, datePublished, dateModified, mainEntityOfPage)
- [x] OpenGraph article metadata on blog posts
- [ ] RealEstateListing + BreadcrumbList on listings (blocked on Phase 3 IDX)
- [x] Full Breadcrumb component (`components/ui/Breadcrumbs.tsx`) with BreadcrumbList JSON-LD — used on community + blog pages
- [x] FAQPage JSON-LD on Buyers, Sellers, and Home Valuation pages (11 FAQs targeting rich results)
- [x] LocalBusiness JSON-LD on Contact page with geo coordinates + hours
- [x] Enriched Organization JSON-LD — foundingDate, openingHours, priceRange, numberOfEmployees
- [x] Canonical URLs on all 15 static pages
- [x] Internal linking: community pages → related blog posts
- [x] Blog sitemap entries with lastModified dates
- [x] Phone click tracking data attributes (data-event="phone_click")
- [ ] Image optimization audit (WebP + responsive) — pending local-hosted headshots

## Phase 11 — Lead Capture, CRM, Analytics

- [x] `leads` table migration (unified lead funnel) — Supabase migration 002
- [x] Contact + Valuation forms → unified leads pipeline with TCPA consent tracking
- [ ] Resend — confirmation email to lead + notification to Stephen
- [ ] HubSpot API push (fallback to Supabase if API fails)
- [ ] GA4 via `next/script`
- [ ] Custom events: form_submission, property_search, listing_view, valuation_request, community_page_view, permit_map_interaction, phone_click
- [x] Vercel Web Analytics + Speed Insights (added to root layout)

## Phase 12 — QA, Perf, A11y, Launch

- [x] Compliance walkthrough — TREC, NAR, Fair Housing, TCPA, ADA all verified. Removed "family-friendly" language per Fair Housing best practice.
- [x] Lighthouse audit + fixes: autocomplete on all forms, security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy), canonical URLs on all 15 pages, OG image + Twitter card in layout metadata
- [ ] axe-core audit
- [ ] Keyboard nav test
- [ ] Screen reader smoke test
- [ ] Cross-browser: Chrome/Safari/Firefox/Edge + iOS/Android
- [x] 301 redirect map from old URLs (see ROADMAP Appendix B) — configured in `next.config.mjs`
- [ ] Vercel domain + DNS cutover
- [ ] Search Console + sitemap submit
- [ ] 48-hour post-launch monitoring

---

## Change Log
- **2026-04-15 (session 1)** — Big push. Added Header + mobile nav + skip link, TCPAConsent, NewsletterSignup, ContactForm, ValuationForm, AgentCard, TestimonialCarousel. Wrote real content for Home, About, Team (index + 11 dynamic profiles), Contact (with working POST /api/contact), Home Valuation (with POST /api/valuation), Communities index + 5 Tier 1 guides (Joelton, Ashland City, Greenbrier, Springfield, Thompsons Station) with JSON-LD Place schema, Buyers, Sellers, Blog shell, Homes-for-sale + listing detail shells. Built New Construction page with live Socrata permit fetch + stats bar + `/api/permits` route. Seeded `data/team.ts` (11 agents), `data/communities.ts`, `data/testimonials.ts`. Added `.eslintrc.json`. Fixed strict-mode types in `lib/supabase/server.ts`. `npm run type-check`, `npm run lint`, and `npm run build` all green — 34 routes generated (11 static team pages, 5 static community pages, 3 dynamic API routes).
- **2026-04-15 (session 2)** — Content & SEO push. Added 15 more Tier 1 community guides (Bordeaux, Whites Creek, Madison, Pegram, Kingston Springs, White House, Coopertown, Dickson, Burns, Charlotte, Fairview, Watertown, Lebanon, Inglewood, Donelson) — **all 20 Tier 1 communities now live**. Shipped `app/sitemap.ts` (auto-generates from team + communities data), `app/robots.ts`, sitewide `OrganizationJsonLd` component (RealEstateAgent + WebSite+SearchAction schema). Built `/terms-of-service`, `/market-reports` (county snapshot table), `/property-management` (Door Collectors handoff). Added 20+ 301 redirects in `next.config.mjs` covering legacy Blok/AgentA URLs (meet-the-team, meet-*, whats-my-home-worth, homes-for-sale-featured, calculate-my-payments, property-organizer-login, etc.). Build clean: **54 routes generated** (20 static community pages, 11 static team pages, sitemap.xml, robots.txt, 3 API routes).
- **2026-04-15 (session 3)** — Flagship + content push. Shipped `components/permits/PermitMap.tsx` — interactive MapLibre map on `/new-construction` via react-map-gl/maplibre, markers colored by permit recency (green ≤30d / navy ≤90d / gray older), click-to-popup with address/cost/contractor, NavigationControl, legend overlay. Wrote 5 real long-form blog posts in `data/blog.ts` (Moving to Nashville 2026 · April 2026 market report · Tennessee first-time buyer programs · Rent-vs-buy 2026 · New construction contracts) — 8-14 min reads each with callouts and internal links. Rebuilt `/blog` as a featured-post + grid layout and `/blog/[slug]` as a full template with breadcrumbs, hero image, structured body sections, author card, related communities (5 per post), related posts, Article JSON-LD, and OpenGraph article metadata. Added `RealEstateAgent` Person JSON-LD to `/team/[slug]` pages linked via `@id` to the Organization. Built `components/buyers/MortgageCalculator.tsx` — client component with live PITI math (P&I amortization + tax + insurance), editable price/down/rate/term/tax/insurance, mounted at `/buyers#mortgage-calculator`. Build clean: **59 routes generated** (20 static community pages, 11 static team pages, 5 static blog posts, 3 API routes, sitemap, robots). Fixed one type error in PermitMap (attributionControl boolean vs object).
- **2026-04-16 (session 4)** — Vercel deployment fixed + major feature push. Diagnosed all 20 failed Vercel deploys — root cause was `framework: null` in project settings; fixed with `vercel.json` containing `"framework": "nextjs"`. First successful production deploy at project-bmq0e.vercel.app. Rebuilt new construction map using PermitPilot architecture: direct MapLibre GL JS with CARTO light tiles, GeoJSON circle layer, ArcGIS address search (/api/suggest + /api/geocode), filter panel, click→detail panel with lead CTA. Added logo package: landscape dark/light in header/footer, icon as favicon, brand fonts to public/fonts/. Shipped 22 Tier 2 community pages (Hendersonville, Gallatin, Goodlettsville, Portland, Hermitage, Antioch, Bellevue, Old Hickory, Murfreesboro, Smyrna, La Vergne, Franklin, Brentwood, Nolensville, Spring Hill, Mt. Juliet, Pleasant View, Cross Plains, Orlinda, Millersville, White Bluff). Upgraded homepage images to next/image with hover effects. Build clean: **82 routes generated** (42 community pages, 11 team, 5 blog, 6 API routes, sitemap, robots, icon).
