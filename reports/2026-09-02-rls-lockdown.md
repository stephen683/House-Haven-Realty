# RLS lockdown — every table closed to the browser key

**Date:** 2026-09-02 · **Commit:** `fe4ccf1` (routes) · migrations listed below
**Deploy:** `dpl_FfzMXJN5BhABe8csmQ8BQ8nDKcyu`

---

## What was wrong

Every table in the project carried a policy named for the service role but
granted to `public` with qual `true`, and the `anon` role — whose key ships in
the browser bundle — held INSERT/UPDATE/DELETE/TRUNCATE grants on all of them.
Anyone with DevTools could read or delete `leads`, `contact_submissions`,
`contract_submissions` — client PII and TCPA consent records.

Root cause, two layers:

1. **Default privileges.** Supabase's defaults for role `postgres` in `public`
   granted ALL on every new table to `anon` and `authenticated`. Each table
   was born open; the policies just kept it that way.
2. **The anon client was used server-side.** Eight route handlers wrote
   through the cookie-based anon client. The site has no login, so it carried
   no identity — it worked only because the tables were open.

## The map that made the fix safe

Every `.from('<table>')` in the codebase, by client:

| Client | Files | Tables |
|---|---|---|
| Browser (`@/lib/supabase/client`) | BuilderCard only | `building_permits_public` (view) |
| Server anon (`@/lib/supabase/server`) — **removed** | contact, newsletter, valuation, agents/contract, notify-property, request-cma, value, stage | leads, contract_submissions, property_notify_requests, cma_requests, valuation_cache, permit_stages |
| Service role | cron ×3, search, suggest, permit-repo, canary | building_permits, canary_* |

Nothing in the browser touches a table. So every table can close completely.

## What changed

**Code (`fe4ccf1`)** — `lib/supabase/service.ts`, one server-only
service-role client. All eight routes use it. `lib/supabase/server.ts`
deleted (no importers; its only purpose was handing the anon key to server
code). `tests/service-role-routes.test.ts` guards this two ways: a
source-level check that no route imports the anon client, and a runtime
check that each of the eight routes authenticates with
`SUPABASE_SERVICE_ROLE_KEY` and returns success.

Deployed **before** the tables closed, so no form was broken in between.

**Migrations** — each drops every policy, revokes all privileges from
`anon`/`authenticated`/`public`, enables RLS, and verifies **as the anon
role** that SELECT and a write are refused, and as the owner that row counts
are intact:

| Migration | Tables |
|---|---|
| `close_pii_tables_to_browser_roles` | leads (121 rows), contact_submissions, contract_submissions (6) |
| `close_lead_capture_tables_to_browser_roles` | advisory_bookings, advisory_book_waitlist, cma_requests, property_notify_requests |
| `close_operational_tables_and_default_privileges` | permit_stages (177), canary_runs (75k), canary_state, valuation_cache, listings_cache, agents, blog_posts, communities — **plus** default privileges for tables and sequences revoked from browser roles, verified by creating a probe table and checking it received no grants |
| `close_app_functions_to_browser_roles` | `set_updated_at` closed; `pipeline_search_suggest` already was |

Earlier today, separately: `building_permits` (view + read-only fix).

## Schema sweep after — measured, not assumed

```
policies on any public table ........... none
tables without RLS ..................... none
browser-role grants .................... building_permits_public (SELECT only)
                                         + PostGIS catalog views (standard)
default ACL, tables/sequences .......... postgres + service_role only
app-owned functions anon can execute ... none
```

Live after close: the stage route (reads `permit_stages` and
`building_permits`) returns the full parcel; search and suggest work;
`/pipeline` renders with the header count.

## One thing I could not make stick — recorded, not hidden

Default privileges for **functions** would not exclude PUBLIC on this
instance. With the stored default already reduced to
`{postgres=X, service_role=X}`, a probe function created immediately
afterward still received `=X/postgres` (PUBLIC execute). No event trigger
explains it (the Supabase ones touch graphql/cron/net only). Consequence:
**any future function must be closed explicitly in its own migration.** The
verify block in `close_app_functions_to_browser_roles` audits every
app-owned function for anon execute and is the pattern to reuse.

## Still open on the product

Launch blocker #1 — `/homes-for-sale` has no MLS data and no IDX
disclaimer; it needs MLS Grid credentials and is a separate build.
