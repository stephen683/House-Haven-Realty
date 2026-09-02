# Nashville Pipeline — search v2, shipped

**Date:** 2026-09-02 · **Live:** https://www.househavenrealty.com/pipeline
**Commits on main:** `4365893` (feature), `79684ec` (cache paging fix)

---

## What you asked for

Find any new build in Davidson County by beds, baths, ZIP, property type — condos
included — on a search bar designed at a tier-one level, on desktop and mobile,
proven with visuals, live.

## What was actually wrong before this round

Three surfaces read three different corpora:

| Surface | Read from | Rows |
|---|---|---|
| Map pins | live ArcGIS, one request | 500 |
| Header stats + ZIP list | live ArcGIS, one request | 1,000 |
| Search list | `building_permits` cache | 3,513 |

A permit could be in the list and not on the map. Now all three read the cache
(`lib/permit-repo.ts`); the live feed is a fallback only when the cache is
empty, which the canary alarms on separately.

## Filters

- **Property type** — multi-select chips: Single family, Townhome, **Condo**,
  Duplex, Multi-family, ADU / accessory
- **Beds** — Any, 1+ … 5+ · **Baths** — Any, 1+, 1.5+, 2+, 2.5+, 3+, 4+
- **ZIP** — multi-select grid with neighborhood names; union of the 16 known
  neighborhoods and every ZIP in the data, so it never renders blank
- **Square feet**, **construction cost** ranges · **issued within** 7/30/90/180 days
- Typeahead across builders, neighborhoods, streets, and geocoded addresses

One `FilterState` drives both the MapLibre expression and the API query. A null
bedroom count fails a beds filter on the map exactly as SQL excludes NULL, so
map and list always agree.

## The data truth, stated in the product

Measured from the table — not assumed:

| Type | Permits | Beds recorded | Baths recorded | Sqft recorded |
|---|---|---|---|---|
| Single family | 2,627 | 20% | 19% | 83% |
| Townhome | 594 | 9% | 9% | 94% |
| ADU / accessory | 144 | 6% | 6% | 84% |
| Multi-family | 97 | 9% | 11% | 21% |
| **Condo** | **30** | **0%** | **0%** | 20% |
| Duplex | 21 | 0% | 0% | 81% |

Beds and baths come from parsing Metro's free-text permit purpose. Condo and
duplex permits are overwhelmingly interior rehabs (26 of 30 condo permits) and
never list them. So:

- The API returns `coverage.recorded` counts with every response.
- The filter panel says next to the beds/baths controls: *"Metro records beds
  on 17% and baths on 16% of permits… Condo and duplex permits almost never
  list them. A beds or baths filter only matches permits that do."*
- The coverage line reads *"363 days of permits — Sep 3, 2025 to Sep 1, 2026 ·
  beds on 17%, sqft on 82% of permits."*
- Result rows say **"beds/baths not on permit"** rather than hiding the gap.
- Condo + 3 beds honestly returns **0**, and the panel explains why instead of
  implying no condos exist.

## Mobile

Map / List toggle with a compact live count ("List 3.5K"); the results list is
a first-class surface; the filter panel is a bottom sheet with a **sticky
Clear all / Done header**. MapLibre is nudged to resize after a display toggle.

## Two silent caps found and fixed

1. **PostgREST caps every request at 1,000 rows** regardless of `.limit()`.
   The first cache-backed GeoJSON deploy served exactly 1,000 of 3,513 features
   with no error anywhere — the same failure class as the ArcGIS truncation,
   one layer down. `loadCachedPermits` now pages in 1,000-row ranges with a
   stable secondary order; a test asserts the exact ranges requested.
2. **Map payload** was ~3.3 MB raw, 2.1 MB of it Metro boilerplate after the
   first sentence. Description is trimmed to 240 chars in the GeoJSON only;
   search results are untouched.

## Verification

**Unit — 77 tests**, including: filter model ↔ API parity, null-bed semantics
on the map, PostgREST paging ranges, description trimming, redaction, agent
gating, ArcGIS pagination, cron fail-loud paths.

**Browser — Playwright, 8 scenarios × desktop 1440×900 and Pixel 5 390×844**,
against real-data fixtures captured from production. Chromium ran headless
with software WebGL; a non-production `window.__pipelineMap` hook lets tests
assert the permits source loaded and the condo filter reached the layer.
**SwiftShader rendered 20 pins.** Screenshots in `e2e/screenshots/`.

Scenarios: grouped typeahead + keyboard select + chips + redacted rows;
condo + 3 beds + 2.5 baths + 2 ZIPs drive the API (`propertyType=condo`,
`bedroomsMin=3`, `bathroomsMin=2.5`, `zip=37206,37216`) and the active-filter
count; chip removal clears a filter; mobile map/list toggle; empty state
stated once on whichever surface is visible; map pins from the cache respond
to filters.

**Live, on househavenrealty.com** — see the bottom of this report.

## Proposed, not executed

- `components/pipeline/MapSearch.tsx` — unreferenced since the new bar
- `public._permit_backfill_raw` and the `http` Postgres extension — backfill
  scaffolding; the cron now fills the table itself

## Still open from earlier rounds

- RLS narrowing on `building_permits` (anon key can still read `parcel` and
  full `address`; route redaction is defence in depth, not a seal)
- BuilderCard slugify divergence (404s for builders with punctuation)

## Live verification — househavenrealty.com, deploy `dpl_8DzNTFFJV13DMjiM2TtwgytyhhXE`

```
GET /api/permits/geojson
  200 · X-Permits-Source: cache · 3,513 features · 32 ZIPs
  30 condo pins · 27 multi-unit markers · max description 240 chars
  2.7 MB raw (Brotli on the wire)

GET /pipeline
  200 · search bar · header "Permits: 3,513" · Filters · Map/List toggle
  TREC firm name + phone + license line present

GET /api/pipeline/search?propertyType=single_family,townhome
      &bedroomsMin=4&bathroomsMin=3&zip=37203,37206,37216&sort=construction_cost
  → 42 results · RUSSELL ST 37206 · 5 bd / 5 ba · 5,270 sqft · $943,535 · LEVERICK HOMES

GET /api/pipeline/search?propertyType=condo&sort=construction_cost
  → 30 condos · MCGAVOCK ST 204 · $12,970,575 · BRPH

GET /api/pipeline/search?propertyType=condo&bedroomsMin=1
  → 0 (honest: no condo permit records beds) · recorded rates returned

GET /api/pipeline/search?zip=37216&bathroomsMin=2&propertyType=single_family,townhome,condo
  → 22 results · one with baths recorded and beds not, shown as "— bd / 3.5 ba"
```

Public payloads carry street name only — no house number, parcel, or
coordinates — confirmed on every response above.

---

## Security round — deploy `dpl_3mfSGaVitrbXmvwxU3QLH8KWUMHA`, commit `dad0848`

### building_permits closed to the browser key

Before: the anon key in the browser bundle could read every column
(parcel, full address, coordinates) and — through a policy named
"Service role write access" but granted to `public` with qual `true` —
insert, update and delete rows. `anon` also held table-level
INSERT/UPDATE/DELETE/TRUNCATE grants.

After (`building_permits_rls_narrow_and_public_view`,
`building_permits_public_view_read_only`):

- `building_permits_public` view: street-only address, no parcel, no
  coordinates, no description. SELECT only for anon/authenticated — Supabase
  default privileges had auto-granted writes on the new view, and because it
  runs as its owner a DELETE through it would have bypassed RLS; revoked and
  verified as the anon role.
- Both policies dropped, all table privileges revoked from anon/authenticated.
  Zero policies, zero anon grants remain. Service role bypasses RLS, so the
  cron, search, suggest, GeoJSON and canary paths are unchanged.
- SQL redaction in the view matches `streetOnly()` in TypeScript on 200
  real addresses sampled from production (`tests/street-parity.test.ts`).

Readers moved: BuilderCard now reads the view, groups on `contractor_key`,
and links with the shared `slugifyBuilder` (its local copy produced
`nvr-inc-t-a-ryan-homes`, which 404s). The stage route's parcel lookup —
the only other anon-key reader — moved to the service role; verified live,
it still returns the parcel (APN 128150D08200CO, 0.21 ac, RS20).

### Deleted, as authorized

- `components/pipeline/MapSearch.tsx`
- `public._permit_backfill_raw` (verify: table gone, 3,513 rows and
  `unit_count` backfill intact)
- `http` Postgres extension (verify: gone, `pipeline_search_suggest` intact)

### Found, not fixed — needs a decision: the same hole on 16 other tables

Every table in the project carries a "service role" policy that is actually
granted to `public` with qual `true`, and `anon` holds full write grants:

`advisory_book_waitlist, advisory_bookings, agents, blog_posts, canary_runs,
canary_state, cma_requests, communities, contact_submissions,
contract_submissions, leads, listings_cache, permit_stages,
property_notify_requests, valuation_cache`

The browser key can read and delete `leads`, `contact_submissions` and
`contract_submissions` — TCPA consent records and client PII.

Not fixed here because some paths depend on it: the stage route writes
`permit_stages` with the anon client and only works because that table is
open. Plan, per table: (1) list every reader/writer and which client it
uses; (2) move writes to the service role in route handlers; (3) replace the
public ALL policy with none (service role bypasses RLS) and, where the
browser must read, a SELECT-only policy or a redacted view; (4) revoke
non-SELECT grants from anon/authenticated; (5) verify as the anon role in the
migration. Do `leads`, `contact_submissions`, `contract_submissions` first.
