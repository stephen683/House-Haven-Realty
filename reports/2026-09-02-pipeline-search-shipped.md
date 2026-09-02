# Nashville Pipeline — county-wide search, shipped

**Date:** 2026-09-02 · **Live:** https://www.househavenrealty.com/pipeline
**Merged to main:** `64b9844` · deploy `dpl_DhjCaiCptbJVxupEFkQ9kZvQcvLQ`

---

## What was wrong

The search could only ever see a quarter of Davidson County, and nothing in the
response said so. ArcGIS caps every reply at `maxRecordCount` (1000) and answers
newest-first, so a single request silently truncated.

Measured against the live service with `returnCountOnly=true` — not estimated:

| Window | Real permits | What we had |
|---|---|---|
| 95 days | 997 | 996 — the row cap, not the window |
| 180 days | 1,990 | 996 |
| 365 days | 3,756 | 996 |

## Pagination — verified before it was built on

`supportsPagination: true`, `maxRecordCount: 1000`. Empirical check over a
1,990-row window, offsets 0 and 1000:

```
page1_rows 1000 | page2_rows 990 | total 1990
distinct_permits 1990 | overlap 0 | exceededTransferLimit true
```

1,990 rows, 1,990 distinct permits, zero overlap. Ordering is
`Date_Issued DESC,ObjectId ASC` — `Date_Issued` alone is not a total order, and
same-day ties shuffle between requests, which produces both duplicates *and*
gaps. `ObjectId` breaks the tie.

## Engine

`fetchPermitPages()` in `lib/permits.ts` pages with `resultOffset` until the set
is exhausted, a short page arrives, or the caller's cap is reached.
`fetchRecentPermits` / `fetchAllPermits` now treat `limit` as a total across
pages — callers that asked for 2000 stop silently receiving 1000.

Daily sync widened to **365 days** (a build runs 6–12 months), `maxDuration`
300, 500-row upsert chunks.

## Result

| | Before | After |
|---|---|---|
| Rows | 996 | **3,513** |
| Window | 95 days | **363 days** (2025-09-03 → 2026-09-01) |
| ZIPs | 30 | **32** — the feed's full extent |
| Builders | 368 | **960** |
| Construction value | $388M | **$1.47B** |

**Coverage honesty:** 32 ZIPs is everything this feed contains for a year. That
is Metro Nashville Codes' footprint — Davidson County plus a few edge ZIPs that
cross county lines (37064 Franklin, 37027 Brentwood, 37122 Mt. Juliet). The UI
states the measured window, never a hardcoded one.

## Search bar

`components/pipeline/PipelineSearchBar.tsx` replaces the address-only
`MapSearch`. One bar, four grouped sources:

- **Builders** and **Neighborhoods** — aggregated in `pipeline_search_suggest()`
- **Streets** — redacted in TypeScript via `streetOnly()`, so the house-number
  rule has exactly one implementation
- **Addresses** — ArcGIS geocoder, flies the map

Full-width, counts on every row, active-filter chips, arrow/enter/escape
keyboard nav, ARIA combobox with `aria-activedescendant`. Selecting a builder or
ZIP writes to the shared `FilterState`, so the map and the results list move
together rather than as two systems.

## Live verification

```
GET /api/pipeline/suggest?q=ryan
  → NVR, INC. T/A RYAN HOMES · 180 permits · nvr-inc-ta-ryan-homes
    (40 on the truncated set — the fuller corpus is live)

GET /api/pipeline/search?zip=37216&sort=construction_cost
  → total 156   (36 before)
    EARLENE DR · 37216 · $1,388,523 · 7,370 sqft · MAST BUILDING COMPANY LLC
    coverage: "363 days of permits — Sep 3, 2025 to Sep 1, 2026"

GET /api/pipeline/search?format=csv        → 403 (agent only)
GET /pipeline                              → 200, search bar server-rendered,
                                             TREC firm name + phone present
```

Public payloads carry street name only — no house number, no parcel, no
coordinates, confirmed on the live responses.

**63 tests passing**, `tsc` clean, lint clean, build green.

## Proposed deletions — not executed

1. `components/pipeline/MapSearch.tsx` — zero references after the search bar
   replaced it. Its `/api/suggest` + `/api/geocode` calls live on in the new bar.
2. `public._permit_backfill_raw` — staging table, two rows, backfill complete.
3. The `http` Postgres extension — added for the backfills. It lets SQL make
   outbound web requests. Recommend dropping now that the cron paginates and
   fills the table itself.

## Still open

- **RLS narrowing** (plan in the prior report). `building_permits` remains
  publicly readable by the anon key, including `parcel` and full `address`. The
  route's redaction is defence in depth, not a seal.
- **BuilderCard slugify divergence** — still uses a third implementation that
  404s for builders with punctuation.
- Tomorrow's 06:00 UTC cron is the first unattended run of the 365-day
  paginated sync. It now fails loudly if anything breaks.
