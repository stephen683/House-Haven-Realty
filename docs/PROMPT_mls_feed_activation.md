# Prompt — Activate Realtracs MLS Feed

**When to use:** The moment your MLS Grid token + Realtracs approval land in your inbox.
**Where to paste:** Fresh Claude Code session in this repo.
**Time to run:** ~30 minutes including verification.

---

## Copy-paste prompt

```
I have the Realtracs IDX feed approved through MLS Grid. I need you to wire it
into the House Haven Realty site (Next.js 14 / Vercel / Supabase) end-to-end,
test it, and confirm everything still passes compliance. Do not make
assumptions — if anything is unclear or contradictory, surface it before acting.

## Credentials I have in hand
- MLS_GRID_API_KEY: <PASTE OAUTH TOKEN FROM app.mlsgrid.com TOKEN TAB>
- MLS_GRID_ORIGINATING_SYSTEM: <PASTE EXACT VALUE FROM SUBSCRIPTION PAGE — e.g. "rtmls" or whatever MLS Grid assigned>
- Realtracs subscription approved: <yes / waiting>

## The site setup you should already understand
- Spec: docs/ROADMAP.md (Master Build Spec v2). Compliance section is §5.
- Tracker: docs/TODO.md. Blocker 1 (Realtracs IDX) is "code shipped, awaits API key."
- Locked rules: CLAUDE.md (brand kit Black/Grey/White + Modulus, NAR commission
  disclosure verbatim, "500+ homes / $250M+ sold" stats, kill-list in §13).
- Vercel: project prj_jM9nRgVoXkxknmlv7z3e99Lg6Ct9, team team_ar5Xgtj6VsBX5MdMCOgxwkGh
  (use the Vercel MCP if available — never expose tokens to the client).
- Supabase: project eefqcgetyxdrvchkwhrq (use the Supabase MCP if available).
- Pre-existing code:
  - lib/mlsgrid.ts — RESO Web API v2 client. Currently returns empty when key
    missing. Reads MLS_GRID_API_KEY only — does NOT yet use
    MLS_GRID_ORIGINATING_SYSTEM. Add an `OriginatingSystemName eq '<value>'`
    filter to every $filter query so we only ever pull Realtracs records (this
    matters because some MLS Grid accounts can span multiple MLSs).
  - app/homes-for-sale/page.tsx — auto-detects source === 'mlsgrid' and flips
    from the boutique HomeSearchForm to the live SearchFilters + ListingGrid.
    Do not break this branch — when the API key is set, the page must show
    live results without further code changes.
  - app/homes-for-sale/[id]/page.tsx — currently 404s when getListing returns
    null. Will start rendering real listings once the feed is live.
  - components/listings/ — ListingCard, ListingGrid, SearchFilters all built.
    ListingCard already shows listing brokerage attribution per NAR IDX policy.
  - components/compliance/IDXDisclaimer.tsx — already includes Realtracs copyright,
    "deemed reliable" disclaimer, last-updated timestamp, AND the NAR 2026
    commission-negotiable line. Mounted on /homes-for-sale and listing detail.
  - supabase/migrations/004_listings_cache.sql — listings_cache table NOT yet
    applied to the remote project. Apply it as part of this work.

## What to do (in this order)

1. **Apply migration 004 to Supabase**
   - Use the Supabase MCP (mcp__claude_ai_Supabase__apply_migration) targeting
     project eefqcgetyxdrvchkwhrq. Migration file:
     supabase/migrations/004_listings_cache.sql.
   - Verify the table appears in list_tables.

2. **Add MLS_GRID_ORIGINATING_SYSTEM filter to lib/mlsgrid.ts**
   - In searchListings(): read process.env.MLS_GRID_ORIGINATING_SYSTEM and
     prepend `OriginatingSystemName eq '<value>'` to the $filter expression.
     If the env var is unset BUT the API key is set, log a warning and proceed
     unfiltered (some accounts only have one MLS).
   - In getListing(): if MLS_GRID_ORIGINATING_SYSTEM is set, after fetching by
     ListingKey, sanity-check the result's OriginatingSystemName matches and
     return null otherwise (prevents cross-MLS lookups).
   - Run `npm run type-check` to confirm clean.

3. **Set Vercel env vars (Production + Preview, NOT Development)**
   - MLS_GRID_API_KEY = <token>
   - MLS_GRID_ORIGINATING_SYSTEM = <value>
   - Use the Vercel MCP if available; otherwise tell me the exact CLI command
     for me to run.
   - Confirm both are flagged as encrypted.

4. **Trigger a Vercel redeploy** of main so the new env vars take effect.
   Watch the build logs — there should be no new errors from lib/mlsgrid.ts.

5. **Smoke test the live feed**
   - Use a curl with the API key to hit
     https://api.mlsgrid.com/v2/Property?$top=3 with the OriginatingSystem
     filter to confirm the credentials work and the originating-system value
     is correct. Show me the count of records and the first listing's
     ListingKey, City, and ListPrice.
   - Visit https://househavenrealty.com/homes-for-sale (or the preview URL)
     and confirm:
     a) Hero subhead reads "Live Realtracs MLS listings…" (NOT
        "tell us what you are looking for") — this is the source-flag flip.
     b) SearchFilters + ListingGrid render with real cards, not the
        HomeSearchForm.
     c) IDXDisclaimer is visible at the bottom (Realtracs copyright +
        commission-negotiable line).
   - Pick one real ListingKey from step 5a and visit
     /homes-for-sale/<that-key>. Confirm:
     a) Renders the detail page (not 404).
     b) "Listing courtesy of <agent> at <office>" appears.
     c) RealEstateListing JSON-LD is in the page source.
     d) The commission-negotiable disclosure card is in the sidebar.

6. **Compliance check (block deploy if any of these fail)**
   - No buyer-agent compensation fields appear anywhere in rendered HTML
     (grep the API response for BuyerAgencyCompensation, sub-agent comp,
     etc. — if any leak through, strip them in mapMLSGridListing).
   - "Information deemed reliable but not guaranteed" present.
   - Realtracs copyright present.
   - "Broker commissions are not set by law and are fully negotiable." present
     verbatim on listing detail and IDX disclaimer.
   - Last-updated timestamp present.
   - Listing brokerage attribution present on every card and detail page.

7. **Restore homepage Featured Listings strip**
   - Spec §6.1 calls for 8 cards on the homepage. We removed the section while
     mocks were the only option. Now that real data is flowing, re-add Section 2
     to app/page.tsx between the hero and the Difference cards. Pull 8 listings
     via searchListings({ limit: 8, propertyType: undefined }) and render with
     ListingCard. Mount IDXDisclaimer below the strip.
   - Match the existing aesthetic — see the prior implementation in git history
     (commit 42db4e2) for reference, but write it fresh against the current
     codebase, not a copy-paste.

8. **Update the tracker**
   - In docs/TODO.md, flip Blocker 1's "AWAITS API KEY" to "LIVE", check off
     the API-key-arrival smoke test box, and add a Change Log entry dated today
     describing what shipped.

9. **Commit and push** (only if all checks pass)
   - Three commits: feat(mlsgrid) for the OriginatingSystem filter, feat for
     restoring the homepage strip, docs for the tracker update. Push to main —
     Vercel auto-deploys.

## Things you must NOT do

- Do not introduce any new typeface or color outside Modulus + Black/Grey/White.
- Do not add a chatbot, sticky CTA, exit-intent popup, or "schedule consultation"
  button — see CLAUDE.md kill list.
- Do not change the locked tagline, the locked stats (500+ / $250M+), or the
  NAR commission disclosure wording.
- Do not display the buyer-agent compensation field even if MLS Grid returns
  it — NAR feed termination risk.
- Do not invent listing detail fields the feed does not return (no "estimated
  monthly payment" calculator, no "walk score" — out of scope).
- Do not commit if any of the compliance checks in step 6 fail. Surface the
  failure, propose a fix, and wait for approval.

## What to surface to me before committing

- The actual MLS Grid OriginatingSystem value (so I can confirm it matches
  what Realtracs assigned).
- The count of active Realtracs listings the search returned (sanity check —
  if it's < 100 something is filtered too aggressively).
- Any field in the API response we read that NAR could consider buyer-agent
  compensation, so we can confirm we are stripping it.
- Any rate-limit warnings (we should be far below 2 req/sec / 7,200/hr but
  flag if not).
- Final route count and bundle size delta.
```

---

## When you've pasted it

The agent should ask clarifying questions if any of the credential placeholders
weren't filled in. Fill them in, hit go, and watch.

If you want it to also wire `lib/mlsgrid.ts` to write through to the
`listings_cache` Supabase table (instead of just relying on Next.js ISR),
add this line to step 2:

> Also write each fetched listing into supabase listings_cache via upsert
> (onConflict: 'mls_id') so we have a Supabase-backed read path if MLS Grid
> rate-limits us.

That's optional — Next.js ISR with `revalidate: 900` is enough for launch.

---

## Reference: known facts (so the next session doesn't re-research them)

- MLS Grid base URL: `https://api.mlsgrid.com/v2`
- Authentication: `Authorization: Bearer <token>` (OAuth 2 long-term)
- Rate limits: 2 req/sec, 7,200 req/hour, 4 GB/hour
- Required NAR IDX disclosure pattern: Realtracs copyright + "deemed reliable"
  + last-updated + listing brokerage attribution per listing
- Required NAR 2026 disclosure (verbatim): "Broker commissions are not set by
  law and are fully negotiable."
- Refresh cadence per spec: every 15 minutes (we use Next.js ISR
  `revalidate: 900` on the fetch call)
- The `OriginatingSystemName` filter is what scopes MLS Grid queries to a
  single MLS (Realtracs) when an account spans multiple MLSs
