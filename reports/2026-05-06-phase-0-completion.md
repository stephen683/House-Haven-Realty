# Phase 0 — Completion report

**Date:** 2026-05-06
**Branch:** main (no branch yet — Phase 0 is foundational, no Advisory code shipped)
**Status:** Phase 0 unblocks Phase 1 once Stephen confirms env-var items below.

---

## What changed in code

### `/value` ↔ `/home-valuation` consolidation
The old v1 `/home-valuation` page (CMA-request form, no inline AVM) ran in parallel with the v2-spec `/value` page (RentCast inline AVM, live in prod since 2026-05-04). Stephen approved consolidation onto `/value`. Touched:

| File | Change |
|---|---|
| `app/home-valuation/page.tsx` | **Deleted** — replaced by `/value` |
| `components/forms/ValuationForm.tsx` | **Deleted** — only consumer was the deleted page |
| `app/api/valuation/route.ts` | **Deleted** — only consumer was the deleted form |
| `next.config.mjs` | Added `301 /home-valuation → /value`. Updated existing `301 /whats-my-home-worth → /home-valuation` to point at `/value` |
| `app/sitemap.ts` | Removed `/home-valuation` entry; `/value` already listed |
| `components/layout/Header.tsx` | 3 references → `/value` (dropdown link, desktop CTA, mobile CTA) |
| `components/compliance/SiteFooter.tsx` | 1 reference → `/value` |
| `app/sellers/page.tsx` | 2 references → `/value` |
| `app/communities/[slug]/page.tsx` | 1 reference → `/value` |

Verified: `grep -rn "home-valuation\|ValuationForm\|api/valuation"` returns no leftovers across `app/`, `components/`, `lib/`. `npx tsc --noEmit` clean. `npx next lint` clean.

### Tracking docs updated
- `docs/ROADMAP.md` — banner added at top noting v2 § 6.1 (homepage) and § 13 (the `/learn` kill-list item) are superseded by the 2026-05-06 Advisory pivot. Other v2 sections still authoritative.
- `docs/TODO.md` — Advisory build phases tracker added near the top, before existing v2 launch tracker.

### `/reports/` directory created
This file is the first entry. All future per-session work logs land here as `YYYY-MM-DD-[brief-title].md`.

---

## Brand tokens used / found
None added or modified in Phase 0 — this was a code-cleanup phase. For the Advisory build the locked palette is verified:

- Black `#000000` — Tailwind token `househaven-navy` (historically named, value is locked black per `feedback_brand_kit.md`)
- Grey `#C6C4C4` — `househaven-accent`
- White `#FFFFFF` — base
- Surface `#F5F5F5` — `househaven-surface`
- Body text muted `#6b6b6b` — `househaven-text-muted`
- Modulus Bold (700) + Modulus Medium (500) — wired in `app/layout.tsx:10-22` via `next/font/local`

The Advisory peer card visual featuring (Phase 3 homepage) will use the existing `bg-black text-white` weighted-card pattern — same treatment Pipeline currently uses on the homepage. No new tokens.

---

## What Stephen needs to provide / verify before Phase 1 starts

Phase 1 ships `/advisory/*` argument pages with no booking/payment, so it has fewer credential dependencies than Phase 2. Phase 1 only needs:

1. **`ADVISORY_DISCLOSURE_TEXT`** — the standard disclosure paragraph for every `/advisory/*` page. Default in code will use the wording from the brief verbatim ("Stephen Delahoussaye is a licensed real estate broker in Tennessee. HHR Advisory provides general real estate consulting and is not legal, financial, or tax advice. For specific legal, financial, or tax questions, consult a licensed professional in those fields."). Editable via Vercel env var when the attorney delivers final language.

2. **Email-capture sink for the `/advisory/book` placeholder** (Stephen's tightening item 7). Phase 1 will:
   - Render `/advisory/book` as a placeholder page reading "Booking opens [date], we'll notify you when it goes live"
   - Capture `email + track + opt-in_marketing` into a new Supabase table `advisory_book_waitlist` (migration ships with Phase 1)
   - On Phase 2 launch, blast announcement to the waitlist via Resend audience export
   - **No env decision needed** from Stephen — this reuses Supabase + the existing `lib/resend.ts` dry-run pattern

That's it for Phase 1 prerequisites. Everything else (Stripe, Google Calendar, e-sign) is Phase 2+.

## What Stephen needs to provide before Phase 2 starts

Per Stephen's answers in the approval message, these are tracked but not blocking Phase 1:

| Item | Owner | Status |
|---|---|---|
| Stephen-OS Cloud Console OAuth in "Published" status (or stephen@househavenrealty.com pinned as permanent Test user) | Stephen | Pending verification before Phase 2 |
| `HHR Advisory` Google Calendar created inside `stephen@househavenrealty.com`; calendar ID captured | Stephen | Pending; create during Phase 0/1 window |
| Stripe $200 product created in live mode | Stephen | Live keys ready; product creation pending |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` in Vercel env | Stephen | Confirm before Phase 2 |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `HHR_ADVISORY_CALENDAR_ID` in Vercel env | Stephen | Confirm before Phase 2 |
| Resend sender domain `alerts@househavenrealty.com` verified | Stephen | Already flagged in TODO.md as pending |
| Engagement letter v1 draft text (placeholder) | Attorney → Stephen | Drafting now per Stephen's answer (item 7) |
| Sample Decision Brief — FSBO | Stephen | Target: end of Phase 1 |
| Sample Decision Brief — Buyer Roadmap | Stephen | Target: end of Phase 2 |
| Sample Decision Brief — Sell-or-Rent | Stephen | Target: end of Phase 3 |
| Top-10 Tier-1 community list with transaction-history rationale | Stephen | Before Phase 5 |

---

## Tightening items captured for later phases

Stephen's tightening list (replied to approval message), now baked into phase plans:

| # | Item | Phase | How it's handled |
|---|---|---|---|
| 1 | `WhatYouWalkAwayWith.tsx` — placeholder via data file, swap-in not code change | Phase 3 | Component reads from `data/sample-briefs.ts`; sample slots are `{title, coverSnippet, fullBriefMarkdown, status: 'draft'\|'published'}`. Status flag controls whether the snippet shows or shows the placeholder banner |
| 2 | Three homepage headline candidates | Phase 3 | Will deliver `/reports/[date]-homepage-headlines.md` with rationale per option; Stephen picks before merge |
| 3 | Greatest Hits curation list | Phase 4 | Scaffold ships with `data/greatest-hits.ts` empty array; ask in `/reports/[date]-greatest-hits-curation-ask.md` for 8–12 pieces with reader job-to-be-done |
| 4 | FSBO/Sell-or-Rent /learn topic scaffolding | Phase 4 | New posts get `status: 'publishing-soon'` flag; library shows the placeholder card. **No invented content** |
| 5 | Old hero archive — note commit hash for clean revert | Phase 3 | Phase 3 PR includes the commit hash of pre-rebrand homepage in its `/reports/` doc |
| 6 | SiteFooter.tsx changes — list added/removed/regrouped | Phase 3 | Phase 3 `/reports/` doc will include a diff-summary table |
| 7 | `/advisory/book` placeholder email capture | Phase 1 | Covered above (new `advisory_book_waitlist` Supabase table) |

---

## What's deferred / blocked

**Deferred (intentional, by phase plan):**
- Booking flow, Stripe, Google Calendar — Phase 2
- Homepage rebrand to three peer paths — Phase 3
- `/blog` → `/learn` restructure — Phase 4
- Community page rewrite + RentCast/Pipeline cross-links — Phase 5
- E-sign integration (HelloSign or DocuSign) — Phase 6

**Blocked (waiting on Stephen):**
- Phase 2 cannot start until Stephen-OS OAuth status is confirmed published. If still in Testing mode, refresh tokens expire in 7 days and the booking flow will brick post-launch.
- Stephen-photo-at-Nashville-location: Phase 3 ships typography-only hero per Stephen's answer; the photo slots in via `data/homepage-hero.ts` change once the shoot is delivered. **Will not substitute existing CDN headshot.**

---

## What Stephen should look at first

1. **Verify `/value` is still working in production.** The consolidation removed `/home-valuation` and redirected to `/value`. Hit https://househavenrealty.com/home-valuation and confirm it 301s to `/value` after deploy (Vercel preview will show this in the deployment URL too). RentCast already live there.

2. **Verify Header still navigates correctly.** The "What's My Home Worth?" dropdown item, the desktop "Home Value" CTA button, and the mobile "Home Value" CTA all now point at `/value`.

3. **Sanity-check the supersession banners** in `docs/ROADMAP.md` and `docs/TODO.md` — they should accurately capture that v2 § 6.1 and the /learn kill-list item are superseded, while Pipeline/Value/IDX moats and all other v2 sections remain authoritative.

4. **Sign off on Phase 1 starting.** Once Stephen confirms the env-var disclosure default text is acceptable (or hands me his preferred default), I will proceed to Phase 1 — `/advisory` argument surface + tracks + sample placeholders + book-waitlist capture.

---

## Build & lint state at end of Phase 0

```
npx tsc --noEmit  # clean
npx next lint     # ✔ No ESLint warnings or errors
```

No commits made yet. Phase 0 changes sit in working tree; recommend committing as a single "phase-0: /value consolidation + Advisory tracking docs" commit before Phase 1 starts.
