# Preview access — `claude/advisory-rebuild` branch

**Date:** 2026-05-06
**Purpose:** Single source of truth for how Stephen and reviewers access the rebuild preview without exposing it to the public or to search engines.

---

## TL;DR

| | |
|---|---|
| Stable preview URL | `https://house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app` |
| Indexability | `x-robots-tag: noindex` set automatically by Vercel |
| Production aliases | None — this URL is preview-only and cannot serve `househavenrealty.com` |
| Default access | **HTTP 401** (Vercel SSO Deployment Protection) |
| Stephen's access | Already logged into Vercel; clean URL works |
| Reviewer access | Requires a `_vercel_share` bypass token (two flavors below) |

---

## Token flavors — choose by review duration

Vercel offers two ways to bypass Deployment Protection. Stephen's instruction was Option 2 (Bypass Token). Vercel's "Bypass Token" comes in two distinct forms:

### Flavor A — Short-lived (23-hour) shareable URL

**Generated via the MCP — already done as part of this session for verification.**

```
https://house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app/?_vercel_share=OkktqVCaKWloC4kikPPGp9VvuSl93IHN
```

- **Expires:** 5/7/2026, 5:48:15 PM (≈23 hours from generation)
- **Mechanism:** First click on the URL sets a `_vercel_jwt` cookie scoped to the hostname. Subsequent visits within the cookie/token window work without the token in the URL.
- **Verified working:** curl with bypass returned 200 + rebuild content; without bypass returned 401.
- **Use this for:** quick same-day reviews. Re-generate as needed.

To regenerate before expiry, ask me to run `get_access_to_vercel_url` again (the MCP tool); each call mints a fresh 23-hour URL.

### Flavor B — Long-lived (until-revoked) Bypass Token — **recommended for the multi-week review cycle**

**This must be generated in the Vercel Dashboard. The MCP cannot do it.**

For a multi-reviewer cycle (attorney, Mitch, Shawn, Camil, Maria, possibly more), Stephen wants ONE URL he can share that doesn't require re-generating every 23 hours. That's the dashboard-generated **Protection Bypass for Automation** token.

#### Steps to generate

1. Open the Vercel Dashboard for the `house-haven-realty` project: <https://vercel.com/stephen-delahoussayes-projects/house-haven-realty>
2. **Settings** → **Deployment Protection**
3. Scroll to **Protection Bypass for Automation**
4. Click **Add Secret**
5. Name it something descriptive — e.g., `advisory-rebuild-review`
6. Vercel generates a token. **Copy it now — it won't show again** (Vercel hashes it immediately for storage).
7. Optional: also enable **OPTIONS Allowlist** if any reviewer's email link previewer is failing on preflight requests. Skip unless you see a problem.

#### How to share with reviewers

Construct the URL as:

```
https://house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app/?x-vercel-protection-bypass=<TOKEN>&x-vercel-set-bypass-cookie=true
```

The `x-vercel-set-bypass-cookie=true` query param tells Vercel to set the bypass cookie on first visit, so reviewers can subsequently navigate within the preview (clicking links to `/advisory`, `/learn/whatever`, `/communities/joelton`, etc.) without re-supplying the token. The cookie's `Max-Age` is 7 days; reviewers re-authenticate weekly by re-visiting any URL with the token.

To revoke: same Dashboard page → click the secret → **Delete**. Any URL using the revoked token immediately returns 401 again. The browser cookie continues to work until its 7-day expiry, but new browsers / new sessions are locked out.

#### Distribution to reviewers — suggested email template

> Subject: HHR Advisory rebuild — preview link for review
>
> Here's the preview of the Advisory rebuild we discussed. It's not on the live site; it's a separate review build.
>
> URL: `https://house-haven-realty-git-cl-5b3935-stephen-delahoussayes-projects.vercel.app/?x-vercel-protection-bypass=<TOKEN>&x-vercel-set-bypass-cookie=true`
>
> Click the link — it'll take you to the homepage of the rebuild. From there you can navigate normally for about a week before re-visiting the link refreshes your access. The site is search-engine-blocked, so don't worry about anyone finding it.
>
> Things I'd love your eye on: [whatever review prompt is appropriate]
>
> Reply with thoughts whenever you have them — no rush.

Stephen owns the token; if it ever gets shared further than intended, revoke and regenerate.

---

## Production Branch verification

Stephen asked me to confirm Vercel's **Production Branch = main**. The Vercel MCP `get_project` doesn't expose this setting directly, but it can be **inferred from observed deployment behavior**, which is decisive:

| Recent push | New deployment | `target` | Production aliases bound? |
|---|---|---|---|
| `main` ← `401d43e` (revert) | `dpl_3Bx7MbsobZ6jw6VqWjYP4o69L43w` | `production` | ✓ — all 5 production aliases including `househavenrealty.com` |
| `main` ← `894f8ac` (claude.md) | `dpl_PFXDuwew2sSUkKSAX5Byp5P5QEEd` | `production` | (was, before revert) |
| `main` ← `2e7b695` (consolidated summary) | `dpl_AVKdViEAGieneX9EhnxdWDiVUPTn` | `production` | (was, before revert) |
| `main` ← every other rebuild commit | … | `production` | (each was, then superseded) |
| `claude/advisory-rebuild` ← `746309f` (marker) | `dpl_6EfTtJfyn5VreXiVTxZrcRy8Jfhb` | **`null`** (preview) | ✗ — only the branch alias |

**Strong inference:** every push to `main` produces a `target: production` deployment that grabs the production aliases; a push to `claude/advisory-rebuild` produces a `target: null` deployment that only binds the branch alias. This pattern only holds if Vercel's Production Branch setting is `main`. Any other configuration would flip these results.

**Canonical confirmation step (one-time, on Stephen):** Dashboard → Settings → Git → **Production Branch** field reads `main`. If it reads anything else, surface as a finding and don't change without Stephen's approval (per Stephen's instruction). Based on observed behavior, the dashboard will read `main`.

---

## Indexability (preview noindex) — automatic, verified

Verified via `curl -I` on the preview alias:

```
HTTP/2 401
x-robots-tag: noindex
```

Vercel sets `x-robots-tag: noindex` on every non-production deployment. No code or config change required. Search engines (Google, Bing, etc.) will not index the preview content even if a reviewer accidentally shares the URL publicly.

---

## Production-deploy guarantees

Three independent guarantees that the rebuild branch cannot accidentally reach production:

1. **Branch separation.** `claude/advisory-rebuild` is not the configured Production Branch (verified by inference above). Vercel's GitHub integration only auto-deploys the Production Branch to production aliases.
2. **No production aliases bound.** The preview deployment's `alias` field contains only the branch hostname, never `househavenrealty.com` / `www.` / `project-bmq0e`.
3. **Manual promotion requires deliberate dashboard action.** Historical rebuild deployments retain `target: production` in Vercel's history with `isRollbackCandidate: true` flags — but these would only serve traffic if Stephen explicitly clicks "Promote to Production" in the dashboard or runs `vercel --prod` from CLI. No `git push` can cause this.

---

## Operational hygiene

- **Don't commit the bypass token to the repo.** Treat it like a Stripe live-mode secret.
- **Rotate after the review cycle ends** — once the rebuild is approved or abandoned, delete the token in the Dashboard so revoked URLs return 401 if anyone re-shares them.
- **One token per cohort, optionally.** If reviewers split into groups (e.g., legal vs. team), generate two tokens. Revoking one doesn't affect the other.
- **The branch alias is stable across pushes to `claude/advisory-rebuild`.** Stephen can push more rebuild iterations and the URL stays the same; reviewers always see the latest preview at the same hostname.

---

## Pending Stephen actions

| | |
|---|---|
| ☐ | Generate the Dashboard Bypass Token (Settings → Deployment Protection → Add Secret); name it `advisory-rebuild-review`; capture the token; share `?x-vercel-protection-bypass=<TOKEN>&x-vercel-set-bypass-cookie=true` URL with reviewers |
| ☐ | (One-time) Confirm Settings → Git → Production Branch = `main` |
| ☐ | When review is complete: revoke the bypass token in Dashboard |

---

## Loop ending

Per Stephen's instruction at end of last message: no further autonomous work until Stephen delivers content (FSBO sample Brief, Tier 1 community paragraphs, Greatest Hits curation) or vendor credentials. Loop ends after this report commits and pushes.
