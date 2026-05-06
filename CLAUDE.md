# House Haven Realty — Claude Code Configuration

## What this project is
Custom Next.js 14 website for House Haven Realty (househavenrealty.com), replacing a $300+/month Blok template with a high-performance lead-generating brokerage site. Currently 152 routes deploying green on Vercel; pre-launch on `project-bmq0e.vercel.app` until DNS cutover.

**Spec (locked, source of truth):** `docs/ROADMAP.md` (Master Build Spec v2)
**Live tracker:** `docs/TODO.md`
**Read both at the start of every session before making changes.**

## Current priority: launch-ready
Ship the 4 launch blockers, then domain cutover. **Nothing else.** Every other tool/page is a Post-Launch Layer.

1. Realtracs IDX via MLS Grid (`/homes-for-sale` + `/homes-for-sale/[mlsId]`)
2. Homepage rebuilt brokerage-first (8 sections per ROADMAP §6.1)
3. House Haven Value (`/value` — RentCast AVM, no signup wall)
4. Nashville Pipeline rebrand (current `/new-builds` → `/pipeline`, preserve all data)

If a request would expand scope before launch, push back and point at the spec.

## Strategic frame (from ROADMAP §1)

**House Haven is a brokerage first.** Not a platform. Not a tools company. Tools exist because they serve clients better.

**Three hero users.** Every UX decision answers which one is being served:
- **Chris** (32, The Nations, FTHB, pre-approved $475K, 90 days out)
- **Sarah** (41, Sylvan Park, considering selling in 12–18 mo)
- **The Thompsons** (relocating from Atlanta, $850K–$1.1M, want new construction)

**Voice:** direct, warm, informed. Short sentences. **Banned:** "luxury," "world-class," "premier," exclamation marks in headlines, stock-photo families with keys, exit-intent popups, chatbots, email walls in front of tools. If a sentence could have been written by any Nashville brokerage, rewrite it or cut it.

## Naming pattern (locked)
All tools follow **House Haven [Thing]**: Pipeline, Value, Journey, Match, Commute, Pulse, Risk, Tax, Comps, Digest. The Pipeline product is **publicly** branded "Nashville Pipeline" in press/SEO/standalone contexts; "House Haven Pipeline" inside the product architecture. Both correct.

## Stack
- **Framework:** Next.js 14 App Router + TypeScript (strict)
- **Database:** Supabase (Postgres + PostGIS) — project `eefqcgetyxdrvchkwhrq`, us-east-1
- **Hosting:** Vercel Pro — `prj_jM9nRgVoXkxknmlv7z3e99Lg6Ct9`, team `team_ar5Xgtj6VsBX5MdMCOgxwkGh`, region iad1, framework `nextjs` (set in `vercel.json`)
- **Styling:** Tailwind v3 (tokens under `househaven` namespace)
- **Maps:** MapLibre GL JS (PermitPilot architecture; CARTO light tiles, no key)
- **Email:** Resend
- **Analytics:** Vercel Web Analytics + Speed Insights (live); GA4 to wire at launch
- **Launch additions:** MLS Grid (Realtracs feed), RentCast (AVM), HubSpot API (CRM portal `242305648`)

## Dev commands
```bash
npm run dev         # localhost:3000
npm run build
npm run lint
npm run type-check
```

## Compliance — non-negotiable

Site does NOT launch if any of these are missing.

- **TREC Rule 1260-02-.12:** Firm name "House Haven Realty" + firm phone "(615) 624-4766" conspicuously on every page (server-rendered footer). Firm name in letters ≥ size of any licensee/team name. "Licensed by the Tennessee Real Estate Commission" in footer.
- **NAR IDX (post-2026 settlement):** Realtracs copyright on every page with MLS data; "deemed reliable but not guaranteed" disclaimer; last-updated timestamp; listing brokerage attribution; **no buyer-agent compensation displayed** (terminates feed access if violated); seller opt-out respected.
- **NAR 2026 disclosure (canonical wording, effective Aug 17 2024):** Where seller-facing content discusses representation (Sellers page, Value page, listing-detail seller-info), display verbatim: **"Broker commissions are not set by law and are fully negotiable."** Same wording sitewide — do not paraphrase.
- **Fair Housing:** EHO logo in footer; community pages describe amenities/commute/schools never demographics; no "good neighborhood," "safe area," or "family-friendly" without specific definition.
- **TCPA:** Every form uses the exact §5.4 consent language (see ROADMAP).
- **WCAG 2.1 AA:** Alt text, 4.5:1 contrast, keyboard nav, labeled inputs, skip-to-content.

Compliance components live in `components/compliance/` — never delete or bypass.

## Business info
- **Brokerage:** House Haven Realty
- **Broker/Owner:** Stephen Delahoussaye (stephen@househavenrealty.com)
- **Phone:** (615) 624-4766
- **Address:** 5016 Centennial Blvd Suite 200, Nashville, TN 37209 (confirmed)
- **HubSpot portal:** 242305648
- **Instagram:** https://www.instagram.com/househavenrealty/

## Brand (LOCKED — official brand kit always wins)
- **Colors:** Black `#000000` + Grey `#C6C4C4` + White `#FFFFFF`. No navy. No accent. Period.
- **Typography:** Modulus Bold (headings) + Modulus Regular (body). Local fonts in `public/fonts/`.
- **Form:** Bold lines, squared forms, geometric — avoid decorative.
- The v2 spec's Fraunces/Inter Tight + "warm accent" proposals are superseded by the brand kit. Confirmed 2026-04-17. Do not reintroduce.

## Brokerage stats (LOCKED — confirmed 2026-04-17)
- **500+ homes closed · $250M+ in volume · since 2016.** Use this exact phrasing in hero, About, Stephen Moment, JSON-LD. Never inflate, never alter.

## Repository structure (current)
```
app/
├── layout.tsx · page.tsx · sitemap.ts · robots.ts · icon.png · opengraph-image.tsx
├── about · buyers · sellers · contact · privacy · terms-of-service · property-management
├── home-valuation · market-reports/[zip] · new-construction
├── new-builds (TO RENAME → pipeline) ── NashBuildsApp.tsx · [zip] · builders/[slug] · layout · opengraph
├── communities · communities/[slug]
├── homes-for-sale · homes-for-sale/[id]   (shells; full IDX in Blocker 1)
├── team · team/[slug]
├── blog · blog/[slug]
└── api/ ── contact · cron · geocode · nashbuilds · newsletter · permits · suggest · valuation

components/
├── compliance/ — SiteFooter, IDXDisclaimer, ComplianceBanner, FairHousingBadge
├── layout/ — Header
├── permits/ (TO RENAME → pipeline/) — MapView, MapFilters, MapSearch, AlertSignup, PermitDetailPanel
├── forms/, sections/, team/, buyers/, ui/, seo/

lib/
├── supabase/ {client.ts, server.ts}
├── permits.ts, saturation-score.ts, nashbuilds-zips.ts (TO RENAME), types.ts

data/
├── team.ts (11 agents) · communities.ts (57) · blog.ts (25 posts) · testimonials.ts (7)

supabase/migrations/
├── 001_initial_schema.sql · 002_leads_and_permits_tables.sql
```

## Conventions
- TypeScript strict — no `any`
- Server Components by default; Client Components only when needed
- All compliance renders server-side
- Tailwind only — no CSS modules, no styled-components
- Images via `next/image` with descriptive alt (ADA)
- Every form has TCPA consent
- Community pages describe amenities/schools/lifestyle — never demographics
- Don't add features beyond what's specified; don't add backwards-compat shims; don't add comments unless the WHY is non-obvious

## Don't do
Locked kill list (ROADMAP §13):
- No chatbot, no AI assistant on the site
- No account creation / login
- No Zillow Zestimate display anywhere
- No "Schedule a free consultation" sticky CTA
- No exit-intent or floating widgets
- No new blog posts until Layer 1 (existing 25 stay)
- No mortgage calculator on the homepage (one already exists at `/buyers#mortgage-calculator` — leave it there)
- No property management / NGCR / Biznalu cross-promotion
