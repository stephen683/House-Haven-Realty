# Production rollback — Advisory rebuild → original site

**Date:** 2026-05-06
**Trigger:** Rebuild was pushed to `origin/main` and Vercel auto-deployed it to `househavenrealty.com` production. Stephen identified this was incorrect — the rebuild needs to live on a branch with preview-only deploys until production sign-off.

**Outcome:** Original site at commit `6379edf` is live in production. Rebuild is preserved intact on branch `claude/advisory-rebuild` with a stable preview URL. No production-deploy path exists from the rebuild branch.

---

## Step-by-step

### STEP 1 — Branch `claude/advisory-rebuild` from current HEAD `894f8ac`

Executed before any destructive action so the rebuild work was preserved on its own ref before `main` moved.

```bash
git branch claude/advisory-rebuild   # local branch from current main HEAD
git push -u origin claude/advisory-rebuild
```

**Verified:**
- Branch on origin at `894f8ac857acc7ee60135b2491f6397bb4ef2387`
- Exactly **12 rebuild commits** reachable via `git rev-list --count 6379edf..origin/claude/advisory-rebuild`
- All 12 commits present in order: phase-0 → phase-1 → phase-1.5 → phase-1.5b → phase-2-scaffolding → phase-2-second-pass → phase-3 → phase-4 → phase-5 → phase-6 → consolidated summary → claude.md update

### STEP 2 — Squashed revert commit on `main`

Single commit reverting the entire rebuild range, preserving full audit trail in git history (the original 12 commits remain reachable via `claude/advisory-rebuild`).

```bash
git revert --no-commit 6d4e21e^..894f8ac
git commit -m "revert: roll back Advisory rebuild to original site at 6379edf, rebuild preserved on claude/advisory-rebuild branch"
git push origin main
```

Result: `main` HEAD is now `401d43e`. Vercel auto-deployed (`dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w`, READY in 57s).

**Smoke tests against `https://www.househavenrealty.com`:**

| Test | Expected | Result |
|---|---|---|
| Homepage 200 | locked v2 tagline visible | ✓ "Nashville real estate, for people who want to see the whole picture" rendered; CTAs "Find your next home" + "What is my home worth?" |
| `/home-valuation` 200 | original page restored | ✓ Page meta confirms v2 spec: "What's My Home Worth? Free Nashville Home Valuation \| House Haven Realty" |
| Header nav | original v2 structure, no Advisory | ✓ About / Buyers / Sellers / Communities / Pipeline / Blog / Contact / Home Valuation / Property Search / Market Reports. **Zero Advisory references**. **Zero `/learn` references**. |

Production is serving the original site exactly as it existed at `6379edf`.

### STEP 3 — Recreate `valuation_requests` (SKIPPED with reasoning)

**Approved by Stephen and skipped after a finding overturned the premise.**

When I prepared STEP 3, I read `app/api/valuation/route.ts` and discovered the original `/home-valuation` form does **not** insert into `valuation_requests`. It writes to the unified `leads` table:

```typescript
await supabase.from('leads').insert({
  first_name: first, last_name: last, email, phone,
  form_type: 'valuation', source: 'website', interest: 'selling',
  …
})
```

`grep -rn "valuation_requests"` across `app/`, `components/`, `lib/` returned **zero application-code references**. The only repo file mentioning the table was `001_initial_schema.sql` itself.

**Conclusion:** Migration 010 (`drop_legacy_valuation_requests`) correctly identified the table as legacy. It was orphaned at the application layer before the drop. The STEP 2 schema-state inventory I posted earlier was wrong about `/home-valuation` form being broken; the form was working through the `leads` table the whole time.

**No schema action was needed.** Repo cleanliness preserved — no migration `014` created, no orphaned recreation. The `leads` table is the unified write target for the newsletter, contact, and valuation forms; all three are on the same code path and untouched by the rebuild.

### STEP 4 — Vercel: `main` → production, `claude/advisory-rebuild` → preview only

**Empty commit pushed to `claude/advisory-rebuild` to mint a unique SHA** so Vercel built a fresh preview deployment for the branch (Vercel was deduplicating against `894f8ac` which had been deployed under `main` as production prior to the revert).

```bash
git checkout claude/advisory-rebuild
git commit --allow-empty -m "branch: force preview deployment on claude/advisory-rebuild"
git push origin claude/advisory-rebuild
```

New deployment `dpl_6EfTtJfyn5VreXiVTxZrcRy8Jfhb` for SHA `746309f`:

| Property | Value | Confirms |
|---|---|---|
| `state` | `READY` | Build green |
| `target` | `null` | NOT production (Vercel only marks `main` deploys as production) |
| `alias` | `["house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app"]` | Stable branch alias bound; only this one URL is on the deployment |
| `lambdaRuntimeStats.nodejs` | `7` | Rebuild's lambda routes (Advisory APIs etc.) are present |

**Stable preview URL:**

```
https://house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app
```

(Vercel slugifies `claude/advisory-rebuild` and truncates with a 6-char hash to fit the 63-char DNS label limit. The `5b3935` hash is derived from the branch name, **not** the commit SHA — so the URL stays stable across future pushes to the branch.)

**Header verification on the preview alias:**

```
HTTP/2 401
x-robots-tag: noindex          ✓ search engines won't index
set-cookie: _vercel_sso_nonce  ⚠️ Vercel SSO Deployment Protection is on
```

**Production guarantees:**
- The preview deployment does not have any production aliases bound. Production aliases (`househavenrealty.com`, `www.househavenrealty.com`, `project-bmq0e.vercel.app`, `house-haven-realty-stephen-delahoussayes-projects.vercel.app`, `house-haven-realty-git-main-stephen-delahoussayes-projects.vercel.app`) all point to `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` (the revert commit on `main`).
- Vercel's GitHub integration only deploys the configured Production Branch to production. The default is the repo's default branch (`main`). Stephen needs to one-time-verify in Project Settings → Git → "Production Branch" = `main`.
- The only paths to push rebuild content to production from here are deliberate, dashboard-mediated actions: (a) manual "Promote to Production" of a preview deployment, (b) changing the Production Branch setting, (c) `vercel --prod` from CLI. None can happen from a `git push` alone.

---

## Final state

### Git refs on origin

| Ref | HEAD | Content | Vercel target |
|---|---|---|---|
| `main` | `401d43e` | Original site (revert of all 12 rebuild commits) | production |
| `claude/advisory-rebuild` | `746309f` | All 12 rebuild commits + 1 marker commit | preview |

### Vercel deployments — current alias bindings

| Alias | → Deployment | Commit | Site content |
|---|---|---|---|
| `househavenrealty.com` | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `401d43e` | Original site |
| `www.househavenrealty.com` | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `401d43e` | Original site |
| `project-bmq0e.vercel.app` | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `401d43e` | Original site |
| `house-haven-realty-stephen-delahoussayes-projects.vercel.app` | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `401d43e` | Original site |
| `house-haven-realty-git-main-stephen-delahoussayes-projects.vercel.app` | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `401d43e` | Original site |
| `house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app` | `dpl_6EfTtJfyn5VreXiVTxZrcRy8Jfhb` | `746309f` | Rebuild (SSO-gated) |

**No orphaned production aliases of the rebuild.** Historical rebuild deployments (e.g., `dpl_ErRrcZnNw8JQXKv6GR5dbU3r8Ugq` for phase-6 at `a3b8812`) remain in Vercel's deployment history with `target: production` and `isRollbackCandidate: true`, but no production aliases point at them. They cannot serve traffic on `househavenrealty.com` unless someone deliberately clicks "Promote to Production" in the dashboard. This is Vercel's standard behavior — historical deploys are preserved for one-click rollback but don't auto-serve.

### Supabase schema state

The git revert cannot undo migrations applied to Supabase. Post-revert state of relevant tables:

| Table | State | Created by | Used by post-revert |
|---|---|---|---|
| `leads` | Exists, in active use | Original (pre-rebuild) | newsletter, contact, **valuation forms** (all three) |
| `valuation_requests` | **Dropped** | Migration 001 → dropped by 010 | Nothing — was orphaned even pre-rebuild |
| `valuation_cache` | Exists | Migration 003 (Phase 1.5) | `/value` AVM cache |
| `cma_requests` | Exists | Migration 003 (Phase 1.5) | `/api/value/request-cma` |
| `listings_cache` | Exists | Migration 004 (Phase 1.5) | `/homes-for-sale` (when MLS Grid key lands) |
| `advisory_book_waitlist` | Exists, empty | Migration 009 (rebuild) | Nothing — orphaned post-revert |
| `advisory_bookings` | Exists, empty (with e-sign columns from 013) | Migration 012 + 013 (rebuild) | Nothing — orphaned post-revert |
| `building_permits`, `permit_stages`, `property_notify_requests`, `canary_*`, `contract_submissions`, `agents`, `communities`, `blog_posts`, `spatial_ref_sys` | Exists | Untouched by rebuild | Same as before |

**Net:** `/value` and `/homes-for-sale` actually work better post-revert than they did pre-rebuild — the cache tables those routes expected (created by 003 + 004) now exist. The two orphaned `advisory_*` tables are harmless dead state on Supabase. Stephen can drop them later if the rebuild is abandoned, or leave them in place to be reused when the rebuild eventually merges to main.

---

## Stephen-pending follow-ups (none blocking)

| Item | Action |
|---|---|
| **Production Branch verification** | Dashboard one-time check: Settings → Git → Production Branch should be `main`. Default; likely already correct. |
| **Deployment Protection decision** | Pick Option 1 / 2 / 3 from my STEP 4 message so reviewers (attorney, Mitch, Shawn, Camil, Maria) can hit the preview URL. Recommended: Option 2 (Bypass Token) — one shareable URL with `?_vercel_share=<token>`, revocable anytime. |
| **Apply migration 011 (spatial_ref_sys RLS)** | Still cosmetic-only. SQL was on the rebuild branch in `supabase/migrations/011_spatial_ref_sys_rls.sql` (now removed from main); copy from the branch + paste into Supabase Dashboard SQL Editor when convenient. Not blocking. |
| **Drop orphaned `advisory_*` tables** | Optional cleanup. If the rebuild is fully abandoned, drop `advisory_book_waitlist` + `advisory_bookings`. If the rebuild may eventually ship, leave them — they'll be reused. |

## Audit trail (relevant commits on origin)

| Commit | Branch | What |
|---|---|---|
| `6379edf` | (parent of rebuild) | Last good commit before rebuild started |
| `6d4e21e..894f8ac` | `claude/advisory-rebuild` | The 12 rebuild commits, in order |
| `746309f` | `claude/advisory-rebuild` | Empty commit to force preview deployment |
| `401d43e` | `main` | Squashed revert commit (current production) |

---

## Lessons captured

- **Vercel auto-deploys `main` to production by default.** Any push to `main` ships. For exploratory work, branch first; merge to `main` only after explicit approval.
- **Vercel deduplicates deployments by SHA.** Pushing a branch that points at a SHA already deployed under `main` does not create a new preview build — an empty commit on the branch forces a fresh deployment with the preview alias.
- **Vercel's SSO Deployment Protection gates non-production URLs by default on Pro plans.** Reviewers without Vercel accounts need either a bypass token or an explicit protection-disable for the preview to be shareable.
- **Schema-state inventories need to verify the actual code path,** not infer from migration filenames. The original `/home-valuation` form was correctly using `leads`, not the legacy `valuation_requests` table that migration 010 dropped — but my STEP 2 inventory wrongly flagged `/home-valuation` as broken. Caught only because Stephen explicitly asked for verification ("surface any other broken endpoints from the schema state").
- **Stephen's branch-first approval gate matters.** This rollback was a single-session correction because the rebuild was preserved cleanly on a branch before the revert; no work was lost. The lesson is structural — before the next rebuild, set up a feature branch from the start with explicit production gating.
