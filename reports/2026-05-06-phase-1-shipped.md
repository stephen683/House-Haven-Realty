# Phase 1 — Shipped

**Date:** 2026-05-06
**Phase:** 1 of 6 (Advisory build)
**Status:** Complete. Booking is a placeholder; Stripe + Calendar arrive in Phase 2.

---

## What's live

Six new routes, indexable, server-rendered:

| Route | Purpose | Render |
|---|---|---|
| `/advisory` | Argument page — structural lead, how-it-works, three tracks, what's-in-a-Brief, why-this-exists, FAQ | Static |
| `/advisory/fsbo` | FSBO Sanity-Check track page | Static |
| `/advisory/buyer-roadmap` | Buyer Roadmap track page | Static |
| `/advisory/sell-or-rent` | Sell-or-Rent track page | Static |
| `/advisory/samples/[track]` | Per-track sample placeholder (banner: "Sample Brief in production"). Three SSG paths: `/fsbo`, `/buyer-roadmap`, `/sell-or-rent` | SSG |
| `/advisory/book` | Booking placeholder + email-capture waitlist (Stephen tightening item 7) | Dynamic — reads `?track=` |

One new API route:

- `POST /api/advisory/waitlist` — validates email, dedupes by `lower(email)`, stores `email + track + tcpa_consent + page_url` in Supabase. Returns 201 on insert, 200 with "Already on the list" on duplicate, 400/500 on error.

One Supabase migration applied to project `eefqcgetyxdrvchkwhrq`:

- `009_advisory_book_waitlist` — `advisory_book_waitlist` table with unique index on `lower(email)`, RLS enabled with service-role-full-access policy (matches existing `contract_submissions` pattern).

## What I built (file inventory)

**Lib:**
- `lib/advisory-config.ts` — central config: `ADVISORY_PRICE_USD`, `ADVISORY_TRACKS`, `getTrack()`, `getAdvisoryDisclosure()` (env-var-driven with default), Phase 2 slot constants (`ADVISORY_TIMEZONE`, `ADVISORY_SLOT_WINDOWS`, etc.) staged here so the booking flow reads from the same source

**Server components (no client state):**
- `components/advisory/Hero.tsx` — black-bg eyebrow + headline + lede pattern
- `components/advisory/PricingBlock.tsx` — three-cell `$200 / one hour / 48 hours` block (3 variants: default, compact, inline)
- `components/advisory/Disclosure.tsx` — env-var-driven standard disclosure footer
- `components/advisory/SampleBanner.tsx` — black bar at top of sample pages
- `components/advisory/HowItWorks.tsx` — 4-step explainer
- `components/advisory/ThreeTracks.tsx` — track cards reused across `/advisory` and the per-track pages (and homepage Phase 3)
- `components/advisory/WhatsInTheBrief.tsx` — 4-section visual of Brief structure (Bottom Line / Key recommendations / Framework / Action items)
- `components/advisory/WhyThisExists.tsx` — structural argument expanded
- `components/advisory/FAQ.tsx` — `<details>/<summary>` accordion (server-render, no JS needed)
- `components/advisory/HonestFraming.tsx` — track-page "honest data" block with optional source citation
- `components/advisory/AdvisoryCTA.tsx` — **reusable cross-link surface** for Phases 4–5 (community pages, listing detail, /learn articles). Takes `track`, `context`, `variant` props

**Client component:**
- `components/advisory/BookWaitlistForm.tsx` — email + optional track selector + TCPAConsent + submit. State for idle/submitting/ok/error. POSTs to `/api/advisory/waitlist`

**Compliance:**
- `/advisory` main, `/advisory/fsbo`, `/advisory/sell-or-rent` all carry the existing `<CommissionDisclosure variant="card" />` (NAR 2026 verbatim wording, seller-facing)
- `/advisory/buyer-roadmap` does NOT carry it (buyer-facing)
- All `/advisory/*` pages carry `<AdvisoryDisclosure />` reading `ADVISORY_DISCLOSURE_TEXT` env var (default: brief's verbatim wording)
- TCPAConsent component on the waitlist form uses the existing §5.4 verbatim language

**SEO / structured data:**
- `Service` JSON-LD on `/advisory` with `RealEstateAgent` provider, TN service area, $200/USD offer
- `FAQPage` JSON-LD on `/advisory` with all 10 FAQ items
- Per-page `metadata` exports with `title` / `description` / `alternates.canonical` / `openGraph` on all six routes
- Sitemap includes `/advisory`, `/advisory/book`, three track pages, three sample pages — total 8 new entries

**Header:**
- `components/layout/Header.tsx` — `Advisory` entry inserted between `Communities` and `Buyers` with a 4-item dropdown (How HHR Advisory works / FSBO Sanity-Check / Buyer Roadmap / Sell-or-Rent). Phase 3 will restructure the whole nav to 5 peers; Phase 1 just adds visibility

## Voice and copy decisions worth noting

The structural argument is the lead on every page. Specifically:

- Homepage hero of `/advisory`: **"Real estate has been all-or-nothing. We changed that."**
- The "Why this exists" section centers on: **"We get paid for our advice. Not for your transaction. So we have no reason to push you into one."** (typeset in serif at large size; this is the page's argumentative anchor)
- FSBO page "Why we will not try to take your listing" repeats the same line in the same prominent typography pattern — this is intentional, the structural argument has to be the hero of every track page where it applies

The 10 FAQ items honor the brief's explicit list (8–10 minimum; included all required ones plus two more). The Advisory-fee-vs-commission separation (item 2) and the FSBO-listing-pitch policy (item 3) are answered with explicit "No." — no softening.

**Banned words audit:** none of "luxury", "world-class", "premier", "trusted", "white-glove", "concierge", "act now", "limited time", "your dream home", "Music City", "Athens of the South", "your real estate journey", or exclamation marks in headlines appear in any new file. Two checks I made deliberately: the `BookWaitlistForm` success state says "You are on the list." (period, not exclamation), and the FSBO honest framing says "harder than the YouTube videos make it look" — pointed without being sales-y.

**One-CTA-per-page rule:** each `/advisory/*` page has a single primary CTA at the bottom. Track cards on `/advisory` are navigational, not CTAs. Sample-link cards on track pages are navigational, not CTAs. The bottom CTA on a track page goes to `/advisory/book?track=[slug]`; on `/advisory` main it goes to `/advisory/book`; on sample pages it goes to `/advisory/book?track=[slug]`.

## Brand tokens used

Existing only — no new tokens added.

| Token | Used for |
|---|---|
| `bg-black` / `text-white` | Hero, "What's in the Brief" section, sample banner, primary CTAs, AdvisoryCTA card variant |
| `bg-househaven-surface` (`#F5F5F5`) | Track-list section, FAQ section, brief-contents section |
| `bg-white` + `border-black/10` | Card surfaces, form, disclosure |
| `text-househaven-navy` (#000) | Headlines, primary text |
| `text-househaven-text-muted` (#6b6b6b) | Eyebrows, body subtleties |
| `font-serif` (Modulus Bold) | Headlines and section titles |
| Default sans (Modulus Medium) | Body |

The Advisory peer-card visual featuring on the homepage (Phase 3) will reuse the same `bg-black text-white` weighted-card pattern Pipeline currently uses on `app/page.tsx:81-107` — that's the existing-brand-accent treatment the brief specified.

## Validation

```
npx tsc --noEmit                  # clean
npx next lint                     # ✔ No ESLint warnings or errors
npx next build                    # 152 + 8 new routes = 160 routes, all green
```

New routes in build output:
```
○ /advisory                        205 B    96.1 kB
ƒ /advisory/book                  2.71 kB    98.6 kB
○ /advisory/buyer-roadmap          205 B    96.1 kB
○ /advisory/fsbo                   205 B    96.1 kB
● /advisory/samples/[track]        205 B    96.1 kB  (× 3 paths prerendered)
○ /advisory/sell-or-rent           205 B    96.1 kB
ƒ /api/advisory/waitlist             0 B       0 B
```

Bundle sizes are tiny because the pages are mostly server-rendered with no client JavaScript beyond the waitlist form (which is the only client component).

## What's deferred / blocked

- **Stephen photo on `/advisory` hero or any track page:** none used. Per Phase 0 decision, typography-only until you commission the Nashville-location photo. Slot-in is a single line in `Hero` component.
- **Sample Brief content (FSBO target end of Phase 1):** placeholder banner is in production now. When you write the FSBO sample, slot it into `/advisory/samples/fsbo` — likely as a new component reading from `data/sample-briefs.ts` (Phase 3 will introduce that data file for the homepage `WhatYouWalkAwayWith.tsx`; we can introduce it in Phase 1 if you ship the sample first)
- **Real booking flow:** Phase 2. The `/advisory/book` page is a waitlist placeholder.
- **Engagement letter PDF placeholder:** Phase 2 — needs your attorney's draft v1 language and a hosted PDF URL into `ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL`.

## Surfaced for Stephen — found while shipping Phase 1

**Issue (not Phase 1 caused):** Migrations `003_value_tool.sql` (valuation_cache, cma_requests) and `004_listings_cache.sql` (listings_cache) are present in the local repo as `[x]` shipped per `docs/TODO.md`, but `mcp__Supabase__list_tables` confirms **none of those three tables exist on the production Supabase project**. `/value` works because `lib/rentcast.ts` and `lib/mlsgrid.ts` both fall back gracefully when the cache table is missing — but cache reads/writes are silently no-ops in production. Recommend applying both migrations before Phase 2 starts, and verifying the `cma_requests` insert path on `/api/value/request-cma` actually persists once HubSpot keys land.

**Existing schema observation:** there is a `valuation_requests` table (RLS-enabled, 0 rows) on Supabase that doesn't appear in any local migration file. Likely an early experiment from before the v2 spec landed. If unused, recommend dropping it as a small cleanup; if it's intentionally retained, document it in 003 retroactively.

Both observations are out-of-scope for Phase 1; flagging so you can decide before Phase 2.

## What Stephen needs to do next

**To unblock Phase 1 in production:**
1. **Verify** `/advisory` and the four sub-pages on Vercel preview after the next deploy. Confirm copy is on-brand and the FAQ schema renders (paste the page through Google's Rich Results Test).
2. **Optionally** set `ADVISORY_DISCLOSURE_TEXT` env var in Vercel if you want to override the default disclosure text now. Default reads as: *"Stephen Delahoussaye is a licensed real estate broker in Tennessee. HHR Advisory provides general real estate consulting and is not legal, financial, or tax advice. For specific legal, financial, or tax questions, consult a licensed professional in those fields."* — verbatim from the brief.
3. **Send me your FSBO sample Decision Brief** when ready — slot-in is a small follow-up commit, not a new phase.

**Before Phase 2 starts (already on the Phase 0 list, restating for completeness):**
1. Stephen-OS Cloud Console OAuth status: confirm "Published" or pin stephen@ as permanent Test user
2. Create `HHR Advisory` Google Calendar; capture `HHR_ADVISORY_CALENDAR_ID`
3. Create Stripe $200 product in live mode; set the three Stripe env vars in Vercel
4. Resend sender domain verification (this also unblocks v2 CMA confirmation emails)
5. Apply migrations 003 and 004 to Supabase per the issue surfaced above

## Suggested next steps

If you want to ship Phase 1 to production today:
1. `git add` and commit Phase 1 changes (suggested message in body below)
2. `git push origin main` — Vercel auto-deploys the preview
3. Smoke test `/advisory`, `/advisory/fsbo`, `/advisory/book`, the waitlist form (it'll write to `advisory_book_waitlist`)

If you want me to start drafting Phase 2 booking flow components in parallel (without depending on Stripe/OAuth keys yet — using the same dry-run pattern `lib/resend.ts` uses), say the word.

---

## Suggested commit message

```
phase-1(advisory): ship /advisory argument surface + waitlist

- 4 indexable pages (main, fsbo, buyer-roadmap, sell-or-rent) with structural
  argument leading, $200/1hr/48hr pricing block, FAQ schema, NAR 2026
  disclosure on seller-facing tracks, env-var-driven Advisory disclosure
- 3 sample placeholder routes (no fabricated content; banner: "Sample Brief
  in production")
- /advisory/book placeholder with email-capture waitlist (Stephen tightening
  item 7 — captures intent during Phase 1→2 gap)
- POST /api/advisory/waitlist with dedupe by lower(email)
- Supabase migration 009 applied: advisory_book_waitlist table
- 11 reusable advisory/* components (incl. AdvisoryCTA staged for Phases 4-5
  cross-linking on community/listing/learn pages)
- lib/advisory-config.ts: single source of truth for pricing, tracks,
  Phase 2 slot rules, disclosure env-var fallback
- Header: Advisory dropdown entry between Communities and Buyers (full
  restructure deferred to Phase 3)
- Sitemap: 8 new advisory routes
```
