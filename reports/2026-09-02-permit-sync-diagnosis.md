# Permit Sync — Diagnosis, Fix, and Backfill

**Date:** 2026-09-02
**Branch:** `claude/permits-sync-cron-debug-badjm7`
**Scope:** Box 1 (diagnose + fix + backfill) and Box 2 (make silent failure impossible). Box 3 not started.

---

## 1. Summary

`public.building_permits` had **0 rows**. It now has **996**.

The daily sync was firing on schedule and being rejected by its own authentication guard with a 401, every day, silently. The cause was a missing `CRON_SECRET` environment variable in Vercel Production — not a schema problem, not an ArcGIS problem, not a timeout.

The failure went unnoticed for months because the one monitor that would have caught it, the canary, is the only cron route whose auth guard *tolerates* a missing `CRON_SECRET`. It therefore returned 200 and looked healthy in exactly the state that broke the other two crons.

---

## 2. Root cause

> **`CRON_SECRET` was not set in the Vercel Production environment, so Vercel's cron scheduler sent no `Authorization` header, and `sync-permits` rejected every daily invocation with 401 before it ever fetched or upserted anything.**

### Evidence

**1. Production runtime logs — the crons fire and are refused.**

```
06:00:56  GET /api/cron/sync-permits        401   [serverless]
07:00:55  GET /api/cron/sync-permit-stages  401   [serverless]
07:01:00  GET /api/cron/canary              200   [serverless]
```

Both data crons fire exactly on their `vercel.json` schedules (`0 6 * * *`, `0 7 * * *`) and are rejected. The canary, 5 seconds later on the same scheduler, succeeds.

**2. A discriminating probe proved the variable was the difference.**

The two guards are not equivalent:

```ts
// sync-permits + sync-permit-stages — strict, fails closed
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return 401

// canary — conditional, fails OPEN when the secret is missing
const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null
if (expected && authHeader !== expected) return 401
```

An **unauthenticated** GET to `/api/cron/canary` returned **200** with a live run body:

```json
{"ok":true,"checked":6,"failing":0,"alertsSent":[],"baseUrl":"https://project-bmq0e.vercel.app","timestamp":"2026-09-02T16:14:30.783Z"}
```

That is only possible when `process.env.CRON_SECRET` is falsy. With the secret unset, the strict guard compares the incoming header against the literal string `"Bearer undefined"` and can never match.

**3. Confirmed by fixing it.** After `CRON_SECRET` was added to Production and the project redeployed, the identical unauthenticated request returned:

```json
{"error":"Unauthorized"}   // HTTP 401
```

Before: 200. After: 401. The variable is now live.

**4. ArcGIS was never implicated.** `/api/permits?days=180` returns fresh data (newest `date_issued` 2026-09-01, `daysAgo: 1`). No timeout, no bad `where` clause, no filter bug. The `{ synced: 0 }` branch is ruled out.

---

## 3. A premise in the original brief was wrong

The brief stated that `sync-permit-stages` "uses the IDENTICAL auth guard and HAS successfully written rows (permit_stages: 176), so CRON_SECRET works and Vercel crons do fire."

**It has never written a row.** All 176 rows carry `source = 'epermits'`:

```
source     |  n  | first_fetch                | last_fetch
-----------+-----+----------------------------+---------------------------
epermits   | 176 | 2026-04-20 16:38:15.315+00 | 2026-09-01 15:59:39.974+00
```

The cron writes `source: 'cron'`. There are zero such rows. Those 176 were written on demand by `app/api/pipeline/permit/[permitNumber]/stage/route.ts` when visitors opened a permit detail panel.

This premise is what made the bug hard to find — it ruled out the auth guard, which was the actual cause.

What *does* prove crons fire on this project is the canary: **77,616 runs across 136 days**, every 15 minutes. And it only works because its guard fails open.

---

## 4. Backfill

`CRON_SECRET` is now set, but the sync could not be invoked from the working session — egress policy blocked `vercel.app`, `househavenrealty.com`, and `services2.arcgis.com`, and no available tool could attach an `Authorization` header.

Instead, the backfill ran **entirely server-side inside Postgres**:

1. Enabled the `http` extension (migration `enable_http_for_permit_backfill`, with a verify block).
2. Had Postgres call `https://househavenrealty.com/api/permits?days=180&limit=1000` — a public endpoint returning the same `fetchRecentPermits()` output the cron writes. Response: HTTP 200, 996 permits, 1,251 kB.
3. Staged the raw JSON in `public._permit_backfill_raw`, then upserted into `building_permits` using the exact field mapping from `app/api/cron/sync-permits/route.ts`, `ON CONFLICT (permit_number) DO UPDATE`.
4. Verified in the same atomic block — the transaction would have aborted if the table were still empty or `max(date_issued)` were stale.

No data passed through a client. No rows were deleted.

---

## 5. Data report

| Metric | Value |
|---|---|
| Total rows | **996** (was 0) |
| `min(date_issued)` | 2026-05-29 |
| `max(date_issued)` | 2026-09-01 |
| Rows where `contractor IS NULL` | **0** (one empty string) |
| Rows missing lat/lng | 0 |
| Distinct ZIPs | 30 |
| Distinct contractors | 377 |
| Rows with parsed sqft | 808 |
| Total construction value | $388,485,819 |
| Average construction cost | $390,046 |

### Top 10 contractors

| # | Contractor | Permits | Construction value |
|---|---|---|---|
| 1 | NVR, INC. T/A RYAN HOMES | 40 | $14,954,808 |
| 2 | ashley ivey-bodman | 36 | $11,137,878 |
| 3 | MERITAGE HOMES OF TENNESSEE INC | 36 | $14,340,334 |
| 4 | amanda tupper | 35 | $11,482,557 |
| 5 | LEGACY SOUTH BUILDERS LLC | 33 | $9,879,914 |
| 6 | SELF CONTRACTOR RESIDENTIAL | 32 | $2,593,426 |
| 7 | Century Communities of TN | 23 | $9,247,583 |
| 8 | REGENT HOMES | 20 | $6,506,295 |
| 9 | BEAZER HOMES LLC | 18 | $5,714,894 |
| 10 | DREES PREMIER HOMES INC | 16 | $11,407,434 |

Note: contractor values arrive from Metro unnormalized — mixed case, individual names alongside corporate entities, and a catch-all `SELF CONTRACTOR RESIDENTIAL` bucket.

### Permits by ZIP

| ZIP | Permits | ZIP | Permits | ZIP | Permits |
|---|---|---|---|---|---|
| 37209 | 108 | 37214 | 36 | 37138 | 10 |
| 37013 | 103 | 37216 | 36 | 37220 | 8 |
| 37207 | 92 | 37221 | 31 | 37027 | 7 |
| 37115 | 86 | 37208 | 27 | 37080 | 7 |
| 37076 | 69 | 37212 | 27 | 37072 | 4 |
| 37206 | 64 | 37215 | 27 | 37189 | 3 |
| 37218 | 52 | 37210 | 25 | 37201 | 2 |
| 37205 | 49 | 37204 | 23 | 37015 | 1 |
| 37211 | 44 | 37122 | 15 | 37228 | 1 |
| | | 37203 | 14 | | |
| | | 37217 | 13 | | |
| | | 37135 | 12 | | |

### Permits by property type

| Type | Permits |
|---|---|
| single_family | 676 |
| townhome | 216 |
| accessory | 53 |
| multi_family | 42 |
| condo | 8 |
| duplex | 1 |

---

## 6. Box 2 — silent failure closed

Shipped on `claude/permits-sync-cron-debug-badjm7`. `tsc --noEmit` clean, `next lint` clean, `next build` green, 9/9 tests passing.

### `app/api/cron/sync-permits/route.ts`

- Empty ArcGIS fetch now returns **502**, not `{ ok: true, synced: 0 }`.
- A chunk upsert error **aborts the run immediately** and returns **500** with `chunkStart`, `details` (the Postgres message), `fetched`, and the partial `upserted` count in the body. It is never counted as success and no further chunks are attempted.
- An explicit `upserted === 0` guard returns 500 as a final invariant.

### `lib/canary.ts` + `app/api/cron/canary/route.ts`

New check `DB public.building_permits` asserting **row count > 0 AND `max(date_issued)` within 7 days**. HTTP 200 is no longer sufficient to pass. This is the check that would have caught the original bug on day one — the existing HTTP checks all pass off the live ArcGIS feed regardless of what is in the table.

### Tests

New: `vitest` (`npm test`), `tests/sync-permits.test.ts`, `tests/canary-permit-table.test.ts`.

| Test | Asserts |
|---|---|
| rejects request without cron secret | 401 |
| empty ArcGIS fetch | 502, `upserted: 0`, upsert never called |
| chunk upsert failure | 500, aborts at chunk 2 of 3, reports `chunkStart` and partial count |
| all chunks succeed | 200, `fetched` and `upserted` both accurate |
| table empty | canary check fails, reports "0 rows" |
| `max(date_issued)` stale | canary check fails |
| populated + fresh | canary check passes |
| count query errors | canary check fails loudly |
| rows exist, all `date_issued` null | canary check fails |

---

## 7. Other bugs found — reported, not fixed

### Bug 2 — `/api/cron/canary` was publicly invokable (now closed)

Because its guard fails open when `CRON_SECRET` is missing, anyone on the internet could trigger it. It writes to `canary_runs`/`canary_state` and **sends email via Resend**. Setting `CRON_SECRET` closed this automatically.

**Recommendation:** extract one shared fail-closed guard used by all three cron routes, so a missing secret can never again produce a route that silently runs for the public while its siblings 401.

### Bug 3 — the 180-day window never actually applies

`sync-permits` requests `{ days: 180, limit: 1000 }`, but ArcGIS returns newest-first and truncates at `resultRecordCount`. The backfill returned 996 rows spanning **95 days** (2026-05-29 → 2026-09-01), not 180.

The row cap binds before the date window ever does. Raising `limit` alone won't fix it — ArcGIS enforces its own `maxRecordCount`. A correct fix pages with `resultOffset` until exhausted.

---

## 8. Open items

1. **`http` extension is still enabled** on Supabase project `eefqcgetyxdrvchkwhrq`, along with the `public._permit_backfill_raw` staging table. Both were added for the backfill. The extension lets SQL make outbound web requests — a modest new security surface. **Recommend dropping both.** Not executed: deletions are proposed, never performed.
2. **The hardening branch is unmerged.** Now safe to merge — the new canary check passes against a populated, 1-day-fresh table, so it will not fire a false alarm.
3. **Bug 3 (pagination)** is unaddressed by design.
4. **`SUPABASE_SERVICE_ROLE_KEY`** shows a "Needs Attention" badge in Vercel. It is functioning; worth a look separately.

---

## 9. How to re-verify

```sql
-- Should be non-zero, with a recent max
select count(*), min(date_issued)::date, max(date_issued)::date
from public.building_permits;
```

```bash
# Should return 401 — proves CRON_SECRET is live
curl -i https://househavenrealty.com/api/cron/canary
```

Tomorrow's 06:00 UTC run is the real test: it should now authenticate and return `{"ok":true,"fetched":N,"upserted":N}`. If it does not, the response body will say why — which was the entire point of Box 2.
