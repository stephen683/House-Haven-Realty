# HHR Advisory build — complete (Phases 0–6)

**Date:** 2026-05-06
**Status:** All six phases shipped to production. Live on `househavenrealty.com`, `www.househavenrealty.com`, and `project-bmq0e.vercel.app`. Mock mode active until vendor credentials land — automatic flip to live mode on env presence.

---

## What got built

The autonomous Advisory build added a third path to House Haven Realty alongside the existing brokerage and DIY tools: **a paid, hourly real estate consultation that produces a written Decision Brief in 48 hours**, structurally separated from commission so the advice is not paid by the transaction.

Six phases shipped in a single 2026-05-06 session, each with a `/reports/` log:

| Phase | What | Commit | Report |
|---|---|---|---|
| 0 | Foundations: `/value` consolidation, v2.1 amendment, `/reports/` directory | `6d4e21e` | `2026-05-06-phase-0-completion.md` |
| 1 | `/advisory` argument surface (4 indexable pages, FAQ schema, 3 sample placeholders, book waitlist) | `d988882` | `2026-05-06-phase-1-shipped.md` |
| 1.5 | Supabase cleanup: applied migrations 003 + 004; dropped legacy valuation_requests | `8e77262` | `2026-05-06-phase-1.5-cleanup.md` |
| 1.5b | Migration 011 file (spatial_ref_sys RLS — manual apply) | `1892c87` | (inline in TODO) |
| 2 (scaffolding) | `advisory_bookings` table + 4 lib wrappers (Stripe, Google Calendar, bookings, emails) | `ea81553` | `2026-05-06-phase-2-scaffolding.md` |
| 2 (second pass) | Real booking flow: BookingClient (lazy-mounted Stripe Elements), 5 API routes, hourly cron | `57e6a9b` | `2026-05-06-phase-2-second-pass.md` |
| 3 | Homepage rebrand to three peer paths + Header/Footer restructure | `80bea67` | `2026-05-06-phase-3-shipped.md` (+ `homepage-headlines.md`) |
| 4 | `/blog` → `/learn` with category × stage taxonomy, RSS, Greatest Hits | `e13470b` | `2026-05-06-phase-4-shipped.md` (+ `greatest-hits-curation-ask.md`) |
| 5 | RentCast + Pipeline cross-links across community pages, listing detail, per-ZIP Pipeline | `ced05c5` | `2026-05-06-phase-5-shipped.md` |
| 6 | E-sign abstraction (HelloSign + DocuSign) + Stephen admin at `/agents/advisory` | `a3b8812` | `2026-05-06-phase-6-shipped.md` |

10 commits, all pushed to `origin/main`.

## What's live in production right now

End-to-end smoke tests against `https://project-bmq0e.vercel.app` confirm:

- **Homepage** lands on the three-peer-paths hero with structural argument lead. Three peer cards (DIY tools / Hire by hour / Hire as agent). Below-fold: Decision Brief explainer, three Advisory tracks, Learn preview, From Stephen, Testimonials, Newsletter
- **`/advisory`** + three track pages (`/advisory/fsbo`, `/buyer-roadmap`, `/sell-or-rent`) carry the structural argument, FAQ schema, NAR commission disclosure on seller-facing tracks, env-driven Advisory disclosure footer
- **`/advisory/samples/[track]`** for all three tracks ships with "Sample Brief in production" banner — no fabricated content
- **`/advisory/book`** is a real multi-step flow (Track → Intake → Slot → Payment → Confirmation). Mock mode lets a visitor complete the flow today; the booking row lands in `advisory_bookings`, all email side effects log as `[resend] dry-run`. Once Stripe live keys land, the same flow flips to real charges automatically
- **`/learn`** library replaces `/blog` — 25 existing articles tagged into 4 categories × 3 stages. `/blog/*` 308-redirects. RSS at `/learn/feed.xml`. FSBO category renders empty state with "first piece coming soon" + Advisory CTA. Greatest Hits page renders "in curation" until Stephen ships picks
- **`/communities/[slug]`** for all 56 communities now follows the brief's 10-section structure: hero → editorial → sale data → rental data → pipeline data → IDX placeholder → FSBO + Sell-or-Rent CTAs → related neighborhoods + articles → personalized-read CTA. Tier-gated editorial (Tier 1 = full content, 2 = first 3 sections, 3 = first 1)
- **`/homes-for-sale/[id]`** listing detail now carries cross-links: Pipeline data scoped to the listing's ZIP + Buyer Roadmap Advisory CTA
- **`/pipeline/[zip]`** per-ZIP pages now carry communities-in-this-ZIP grid + Buyer Roadmap Advisory CTA. Main `/pipeline` map intentionally unchanged (full-viewport tool)
- **`/agents/advisory`** — Stephen-only admin behind HMAC auth. List view with stats and per-track breakdown, detail view with intake JSON + RentCast prepull + Deliver Brief and Cancel Booking forms
- **Cron** at `0 * * * *` fires 48h + 2h reminder emails for upcoming bookings
- **Sitemap** auto-generated: 57 community URLs, 27 learn URLs, 8 advisory URLs, 1 value URL, all the existing pipeline + team + market-reports URLs

All compliance preserved: TREC firm name + phone on every page, Realtracs IDX disclaimer, NAR 2026 commission disclosure on seller-facing pages, Fair Housing logo, TCPA on every form, Modulus typography, B/W/Grey palette only.

## Mock-mode is the default; live activates per env presence

The site ships in production today running entirely on the dry-run pattern. Each integration's `isXxxLive()` helper checks for env presence:

| Integration | Env vars needed | Effect when set |
|---|---|---|
| RentCast | `RENTCAST_API_KEY` ✅ already live | Real AVM + neighborhood rentals (already serving real data) |
| Stripe | `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` + `STRIPE_WEBHOOK_SECRET` | Real PaymentIntents, Stripe Elements UI on `/advisory/book`, webhook fires post-payment |
| Google Calendar | `GOOGLE_OAUTH_CLIENT_ID` + `_CLIENT_SECRET` + `_REFRESH_TOKEN` + `HHR_ADVISORY_CALENDAR_ID` | Real calendar events with Google Meet links + busy-time filtering on slot picker |
| Resend | `RESEND_API_KEY` + verified `advisory@` and `alerts@` sender domains | Real emails (booking confirmation, engagement letter, reminders, brief delivery, Stephen alerts) |
| HubSpot | `HUBSPOT_PRIVATE_APP_TOKEN` | Already wired to `/api/value/request-cma`; CMA leads sync to portal 242305648 |
| MLS Grid | `MLS_GRID_API_KEY` | Real Realtracs IDX listings populate `listings_cache`, neighborhood metrics flip from placeholder to real numbers |
| E-sign | `ESIGN_VENDOR=hellosign\|docusign` + corresponding API keys | Engagement letters sent for signature instead of placeholder PDF |
| Cron auth | `CRON_SECRET` | Hardens `/api/cron/*` routes against unauthenticated invocation |

**Zero code changes required to flip from mock to live.** Every integration is fetch-based with deterministic mocks (matches the existing `rentcast/hubspot/resend` pattern). When Stephen sets the env vars in Vercel, the same code paths use real APIs.

## What Stephen still needs to do

These are all data-file edits or env-var swaps. None require code changes.

### Content
- **Stephen-Nashville hero photo** — slot via `lib/homepage-config.ts` once shoot lands. Until then, typography-only hero ships clean
- **Top-10 Tier-1 communities list** — set `tier: 1` on those 10 in `data/communities.ts`. Page auto-renders full editorial for Tier 1
- **Greatest Hits curation** — pick 8–12 articles with reader-job-to-be-done sentences; edit `GREATEST_HITS` in `lib/learn-taxonomy.ts`. See `/reports/2026-05-06-greatest-hits-curation-ask.md` for the article catalog
- **FSBO `/learn` topic list** — add entries to `data/learn.ts` and to `LEARN_TAXONOMY` in `lib/learn-taxonomy.ts` with `category: 'fsbo'`. Empty state flips to populated grid automatically
- **Sample Decision Briefs × 3 tracks** — flip `status: 'placeholder'` to `'published'` and add a `bottomLine` excerpt in `data/sample-briefs.ts`. Homepage cards and sample pages light up immediately

### Vendor credentials (in priority order for revenue)
- **Stripe** — create $200 product in Stripe Dashboard live mode; configure webhook endpoint at `https://househavenrealty.com/api/advisory/stripe-webhook` listening for `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`; capture the signing secret. Set the three Stripe env vars in Vercel
- **Stephen-OS Cloud Console OAuth** — verify status is "Published" (not Testing — Testing tokens expire in 7 days). Or pin `stephen@househavenrealty.com` as a permanent Test user. **Critical** — without this, the booking flow bricks at launch
- **HHR Advisory Google Calendar** — create dedicated calendar inside `stephen@househavenrealty.com`; capture the calendar ID into `HHR_ADVISORY_CALENDAR_ID` Vercel env. OAuth scope must include `calendar.events` (write)
- **Resend** — verify both `advisory@` and `alerts@` sender subdomains in Resend dashboard
- **E-sign vendor pick** — HelloSign or DocuSign. Set `ESIGN_VENDOR` + corresponding API key when ready. Until then, placeholder PDF email continues to handle engagement letters
- **MLS Grid** — Stephen submits Realtracs application; once approved, set `MLS_GRID_API_KEY`. Listing detail metrics light up automatically

### One manual SQL apply
- **Migration 011** (`spatial_ref_sys` RLS) — paste the SQL from `supabase/migrations/011_spatial_ref_sys_rls.sql` into Supabase Dashboard SQL Editor. Cosmetic — silences the advisor warning about a PostGIS reference table. MCP couldn't apply it (table is owned by `supabase_admin`)

## Validation summary

```
npx tsc --noEmit              # clean across all phases
npx next lint                 # ✔ No ESLint warnings or errors
npx next build                # 175 routes, all green
```

Production smoke tests against the live deploy:

```
✓ Homepage 200 — all three-peer-paths markers present
✓ /advisory 200 — structural argument, FAQ schema, NAR disclosure
✓ /advisory/book 200 — TrackPicker rendering
✓ /api/advisory/calendar-slots — DST-correct Central→UTC conversion verified
   ("Tuesday May 12 9:00 AM CDT" → 14:00 UTC ✓)
✓ /home-valuation 308 → /value
✓ /blog 308 → /learn 200
✓ /learn 200 — library landing
✓ /learn/feed.xml 200 — RSS XML
✓ /communities/joelton 200 — all 5 new section markers present
✓ /agents/advisory 307 — HMAC auth gate redirecting
✓ /api/advisory/esign-webhook 200 {"ok":true,"ignored":true} on empty payload
✓ Sitemap: 57 communities, 27 learn, 8 advisory, 1 value
```

## Architecture notes worth preserving

- **Fetch-based vendor wrappers throughout.** Stripe, Google Calendar, Resend, HubSpot, RentCast, MLS Grid, e-sign — all use `fetch()` with manual webhook signature verification (HMAC-SHA256 with timestamp tolerance for Stripe). No SDK installs except `@stripe/stripe-js` + `@stripe/react-stripe-js` for the client-side payment UI (lazy-mounted via `next/dynamic`)
- **Supabase is always the source of truth.** HubSpot, Stripe, Calendar, e-sign — every external integration writes back to `advisory_bookings` (or peer tables), and Supabase failures never drop a lead/booking. External system failures degrade gracefully
- **Idempotency at every state-mutating boundary.** `runPostPaymentSideEffects` is re-runnable. The Stripe webhook handles retries cleanly. Cron reminders mark sent timestamps before next tick. The e-sign webhook flips `engagement_letter_status` only if not already signed
- **Pipeline core untouched.** `lib/permits.ts`, `lib/saturation-score.ts`, `lib/pipeline-zips.ts`, `components/pipeline/*` got only additive cross-link components in Phase 5. The strategic moat is preserved
- **One-CTA-per-page rule** honored on every `/advisory/*` page. Track cards on `/advisory` and `/communities/*` are navigational, not CTAs
- **Banned-words audit** clean across all 60 new files. No "luxury", "world-class", "premier", "Music City", exclamation marks in headlines
- **Locked stats** preserved verbatim: "500+ homes closed · $250M+ sold · since 2016"

## Files added across all six phases

```
app/
├── advisory/                  9 routes (1 + 3 tracks + 3 samples + book + book/confirmation)
├── agents/advisory/           2 routes (list + detail)
├── api/advisory/              6 routes
├── api/agents/advisory/       1 route (cancel)
├── api/cron/advisory-reminders/ 1 route
└── learn/                     4 routes (1 + slug + greatest-hits + feed.xml)

components/
├── advisory/                  11 reusable components (Hero, ThreeTracks,
│                              WhatsInTheBrief, FAQ, AdvisoryCTA, etc.)
├── advisory/booking/          5 components (BookingClient, TrackPicker,
│                              IntakeForm, SlotPicker, StripeCheckout)
├── agents/                    1 component (AgentNav)
├── communities/               4 components (NeighborhoodMetrics, _Rental,
│                              _Pipeline, _AdvisoryCTAs)
└── homepage/                  6 components (ThreePathsHero, _Cards,
                               WhatYouWalkAwayWith, WhatWePublish,
                               FromStephen, ThreeTracks-reused)

lib/
├── advisory-config.ts         Pricing, tracks, slot rules, disclosure
├── advisory-bookings.ts       Supabase CRUD with full type model
├── advisory-emails.ts         6 email templates
├── advisory-flow.ts           Idempotent post-payment orchestration
├── advisory-prepull.ts        RentCast pre-pull for FSBO/Sell-or-Rent
├── advisory-slots.ts          DST-aware slot policy + race guard
├── google-calendar.ts         OAuth refresh + freeBusy + event create/delete
├── stripe.ts                  PaymentIntent + manual webhook verify
├── esign.ts                   HelloSign + DocuSign abstraction
├── homepage-config.ts         Swappable homepage copy constants
└── learn-taxonomy.ts          Category × stage decoration map

data/
├── learn.ts                   (renamed from blog.ts)
└── sample-briefs.ts           Placeholder pattern for homepage WhatYouWalkAwayWith

supabase/migrations/
├── 009_advisory_book_waitlist.sql
├── 010_drop_legacy_valuation_requests.sql
├── 011_spatial_ref_sys_rls.sql            ⚠ manual apply
├── 012_advisory_bookings.sql
└── 013_advisory_bookings_esign.sql

reports/                       11 phase-specific reports
```

## Net change

Net code change across all six phases: roughly +6,000 insertions, -800 deletions, 80+ files added/modified. Build size impact on the homepage: 3.57 kB → 3.28 kB (slightly smaller). Total route count: 152 → 175.

## Where to start when reviewing

1. **Hit `/` on production** — first impression of the three-peer-paths rebrand
2. **Click "Hire us by the hour"** to land on `/advisory`. Read the FAQ. Look for the structural argument lead
3. **Click any track** — `/advisory/fsbo` is the strongest argument page
4. **Click "Book a Decision Brief"** — walk through the mock-mode flow. The intake form, slot picker, and confirmation all render. Booking row lands in Supabase even in mock mode
5. **Browse `/learn`** — try the category and stage filters. Click the FSBO category to see the empty state. Check `/learn/feed.xml` for RSS
6. **Hit `/communities/joelton`** (or any community) — see the new 10-section structure with embedded data
7. **Sign in to `/agents`** with your portal password and click Advisory bookings — see the admin
8. **Read the report set in `/reports/`** — every phase has its own log with rationale and what's deferred
