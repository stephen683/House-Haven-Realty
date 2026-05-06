# Phase 5 — RentCast on community pages + Pipeline cross-links

**Date:** 2026-05-06
**Phase:** 5 of 6
**Status:** Shipped. 56 community pages now follow the brief's 10-section structure with embedded Pipeline + RentCast data + Advisory CTAs. Listing detail and per-ZIP Pipeline pages cross-link.

---

## What changed

### New components in `components/communities/`

| Component | What it does | Data source |
|---|---|---|
| `NeighborhoodMetrics` | Sale-market data block per neighborhood ZIP — median list price, median price/sqft, active listing count | `public.listings_cache` (Supabase). Renders honest "arrives with MLS Grid" placeholder when no rows |
| `NeighborhoodRental` | Rental market block — median rent + 4 recent rental listings (address-masked) | `getNeighborhoodRentals(zip)` in `lib/rentcast.ts` (new function — see below) |
| `NeighborhoodPipeline` | New-construction permit data scoped to neighborhood ZIPs — count + 3 most recent permits + link to filtered Pipeline view | `public.building_permits` (synced daily). Empty state for ZIPs outside curated PIPELINE_ZIPS coverage |
| `NeighborhoodAdvisoryCTAs` | Two seller-focused track cards (FSBO + Sell-or-Rent) with neighborhood name interpolated | `lib/advisory-config.ts` |

### Extended `lib/rentcast.ts`

Added `getNeighborhoodRentals(zip)` — fetches active rental listings via `/listings/rental/long-term?zipCode=…&status=Active&limit=20`, computes median rent, returns 4 representative listings with address masking. Mock fallback when `RENTCAST_API_KEY` unset.

### `app/communities/[slug]/page.tsx` rewritten to 10-section structure

```
1. Hero photo                       (existing — county-keyed Unsplash)
2. Editorial: "What's different     (uses c.content sections; tier-gated:
   about buying or selling here"     Tier 1 = full, Tier 2 = first 3,
                                     Tier 3 = first 1)
3. Sale market data                  <NeighborhoodMetrics> — listings_cache
4. Rental market                     <NeighborhoodRental> — RentCast
5. Pipeline data                     <NeighborhoodPipeline> — building_permits
6. Active homes for sale             IDX-feed placeholder (existing)
7. + 8. Advisory CTAs                <NeighborhoodAdvisoryCTAs>
9. Related neighborhoods + articles  3 nearby cards + Learn cross-links
10. Bottom CTA                       Personalized read → /advisory + /contact
```

Tier-gating uses the existing `tier: 1 | 2 | 3` field already present on every community in `data/communities.ts`. Tier 1 communities (Joelton, Bordeaux, etc) render the full editorial body. Tier 2/3 render less editorial and lean on the data sections. **Stephen's top-10 list lands here** — when delivered, swap any community's `tier` to `1` in `data/communities.ts` and the page automatically shows full editorial.

### Cross-links on listing detail (`app/homes-for-sale/[id]/page.tsx`)

Below the IDX disclaimer, two new sections:
- `<NeighborhoodPipeline>` scoped to the listing's ZIP — shows the new-construction context for the area
- `<AdvisoryCTA track="buyer-roadmap">` — buyer-side track since this is a listing detail page; context line: "buyers evaluating [city] homes"

### Cross-links on per-ZIP Pipeline pages (`app/pipeline/[zip]/page.tsx`)

Below the existing data + sibling-ZIP block, before the footer:
- "Communities in [ZIP]" — auto-generated card grid linking to community pages whose `zips` array includes this ZIP (max 4)
- `<AdvisoryCTA track="buyer-roadmap">` — buyer-roadmap track for visitors exploring new construction

Main `/pipeline` map page is **not** modified — it intentionally renders full-viewport (Header/Footer hidden via the layout file). Adding a CTA there would break the focused-tool UX. Per-ZIP pages are the right surface for cross-promotion.

## Caching strategy

`/communities/[slug]` now declares `export const revalidate = 604_800` (7 days). With 56 community pages, that's ~8 RentCast calls per day — well inside the Foundation tier (1,000 calls/month). The Pipeline + listings_cache reads come from Supabase and have no per-call cost.

The 7-day TTL is correct for rental data which moves slowly; if Stephen wants tighter freshness, the constant is a single edit.

`/homes-for-sale/[id]` and `/pipeline/[zip]` already had their own ISR (`revalidate = 900` and `21600` respectively) — kept as-is.

## What this delivers (per the brief)

✅ "Pipeline data flows wherever it adds value" — community pages, listing detail, per-ZIP Pipeline pages
✅ Reusable cross-link components (`<AdvisoryCTA>`, `<NeighborhoodPipeline>`, `<NeighborhoodRental>`) take context as props
✅ Community page does not include lifestyle content as primary surface — data sections lead, editorial is gated to Tier 1 communities
✅ Section 7 + 8 Advisory CTAs on every community page
✅ Section 10 bottom CTA points at `/advisory`
✅ FSBO and Sell-or-Rent track names visible on every community page

## Brand tokens used

Existing only — no new tokens.
- `bg-white` / `bg-househaven-surface` / `bg-black` for section alternation
- `border-black/10`, `text-househaven-navy`, `text-househaven-text-muted` everywhere
- Advisory CTA cards keep the `bg-black text-white` weighted-card pattern

## Validation

```
npx tsc --noEmit                  # clean
npx next lint                     # ✔ No ESLint warnings or errors
npx next build                    # 56 community pages + 15 Pipeline ZIP pages all green
```

## What ships pending Stephen

1. **Top-10 Tier-1 communities list** — when Stephen ships the list, edit `tier: 1` on those 10 in `data/communities.ts`. The community pages already auto-render full editorial for Tier 1.
2. **MLS Grid API key** — `<NeighborhoodMetrics>` will start populating with real numbers the moment the listings_cache table has rows.
3. **RentCast quota check** — confirm the Foundation tier (1,000 calls/mo) covers steady-state. Each first-time community page render costs 1 RentCast call; ISR covers the next 7 days.

## What is **not** in this phase

- **Pipeline data on /learn articles** — would be a future Phase polish. The brief says "Pipeline data flows wherever it adds value: into community pages... etc." and explicitly mentions /learn for "topic context" but not data embedding. Skipped on purpose.
- **Pre-fill neighborhood in Advisory intake** — the brief mentioned link to `/advisory/fsbo with neighborhood pre-filled in intake`. The current intake form does not have a neighborhood field per Phase 2 spec. Adding it would require an intake-form schema change. Surfaced for future polish.
- **Lifestyle-content trim per Tier 1 community** — Tier 1 communities still show all their existing `c.content` sections. Stephen can edit `data/communities.ts` content sections to remove lifestyle entries; structural changes are not needed.
- **Pipeline main map page footer CTA** — intentionally skipped. The map is a full-viewport tool; per-ZIP pages handle the cross-promotion.

## What's next

- **Phase 6** — E-sign integration (HelloSign or DocuSign) + Stephen admin view at `/agents/advisory`. Vendor pick required from Stephen.

## Suggested commit message

```
phase-5(communities): RentCast + Pipeline cross-links across the site

- 4 new components in components/communities/:
  - NeighborhoodMetrics (sale data from listings_cache, MLS Grid placeholder)
  - NeighborhoodRental (RentCast rental listings + median, 7-day ISR)
  - NeighborhoodPipeline (building_permits scoped to ZIP, link to /pipeline)
  - NeighborhoodAdvisoryCTAs (FSBO + Sell-or-Rent track cards)
- lib/rentcast.ts extended with getNeighborhoodRentals(zip)
- app/communities/[slug]/page.tsx rewritten to brief's 10-section
  structure with tier-gated editorial (Tier 1 = full, 2 = first 3, 3 = 1)
- Cross-link on /homes-for-sale/[id]: NeighborhoodPipeline (listing's
  ZIP) + AdvisoryCTA (buyer-roadmap)
- Cross-link on /pipeline/[zip]: communities-in-this-ZIP grid +
  AdvisoryCTA (buyer-roadmap). Main /pipeline map intentionally
  unchanged (full-viewport tool)
- Community pages: revalidate = 7 days to stay inside RentCast
  Foundation tier (~8 calls/day vs 33/day budget)

Tier-1 list pending Stephen — edit tier field in data/communities.ts.
RentCast neighborhood data flips from mock → live the moment
RENTCAST_API_KEY is set (already live in production).
```
