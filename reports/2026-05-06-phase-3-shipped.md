# Phase 3 — Homepage rebrand to three peer paths

**Date:** 2026-05-06
**Phase:** 3 of 6
**Status:** Shipped. Old homepage commit captured for revert path. Three headline candidates delivered for Stephen to pick before merge.

---

## Revert point

Old homepage HEAD before rewrite: **`57e6a9b`** (phase-2-second-pass, after which Phase 3 begins).

To revert just the homepage rewrite without rolling back any of the booking flow infrastructure:

```bash
# revert the homepage rewrite commit only — keeps Phase 0/1/2 intact
git checkout 57e6a9b -- app/page.tsx components/layout/Header.tsx components/compliance/SiteFooter.tsx
```

The new homepage components live in `components/homepage/` and would simply go unused after revert; safe to leave or `rm -rf` after.

## Three headline candidates

Delivered as `/reports/2026-05-06-homepage-headlines.md`. Default in code is **Option A** ("Real estate has been all-or-nothing. We changed that."). Switching to B or C is a one-line edit in `lib/homepage-config.ts`.

## What changed

### Homepage architecture (8 sections)

```
1. ThreePathsHero                  typography-only, structural-argument lead
2. ThreePathsCards                 DIY tools / Hire by hour / Hire as agent
3. WhatYouWalkAwayWith             Brief explainer + 3 sample snippets (placeholder)
4. ThreeTracks (reused)            Advisory tracks preview
5. WhatWePublish                   3 most recent /blog posts
6. FromStephen                     text-only broker note
7. Testimonials                    kept verbatim from v2 homepage
8. Newsletter                      kept verbatim from v2 homepage
```

What got dropped vs. v2 homepage:
- **Featured Listings strip** — already removed pre-Phase-3 (commit `d0c2878` retired sample listings until Realtracs key arrives; this remains the right state)
- **Pipeline preview section** — Pipeline now lives inside Path 1 ("Use the tools") card text and gets its own top-nav slot. Pipeline is no longer a homepage hero block; it's pervasive infrastructure (per the brief's secondary anchor: "Pipeline is the moat" → flows wherever it adds value, not a feature showcase)
- **Communities grid section** — same logic; Communities mentioned in Path 1 and remains a top-nav peer

What got kept:
- Testimonials section verbatim (7 testimonials still surface via TestimonialCarousel)
- Newsletter section verbatim (Nashville market updates subscribe)
- Locked stats line still reads "500+ homes closed · $250M+ sold · since 2016" in the hero trust line

### Header restructure (per brief)

| Before | After |
|---|---|
| Find Homes (dropdown: 3 items) | Find Homes (no dropdown) |
| Communities | Communities |
| Buyers (dropdown: 2 items) | *demoted to footer Resources* |
| Sellers (dropdown: 3 items) | *demoted to footer Resources* |
| About (dropdown: 2 items) | *demoted to secondary nav* |
| Blog | *demoted to secondary nav* |
| Contact | *demoted to secondary nav* |
| — | **Pipeline** (new top-level peer) |
| — | **Advisory** (new top-level peer) |
| — | **Home Value** (new top-level peer) |

Five top-level peers, no dropdowns. About / Blog / Contact land in a smaller secondary nav row alongside the phone number on desktop. Mobile nav puts primary first, then a divider, then secondary, then the phone.

Buyers / Sellers / Mortgage Calculator / Property Management / Market Reports demoted to the footer's Resources column. All routes still reachable; just less prominent.

### SiteFooter regroup

| Section | Before (3 cols) | After (4 cols) |
|---|---|---|
| Explore | Homes / Pipeline / Communities / Market Reports / Blog | Find Homes / Communities / Pipeline / Home Value / Market Reports |
| Services | Buyers / Sellers / Home Value / Property Mgmt / Mortgage Calc | *renamed to Resources* — Blog / Buyers / Sellers / Mortgage Calc / Property Mgmt |
| **Advisory** *(NEW)* | — | How HHR Advisory works / FSBO / Buyer Roadmap / Sell-or-Rent / Book a Decision Brief |
| Company | About / Team / Contact / Agent Login / Privacy / Terms | unchanged |

Footer grid bumped from `lg:grid-cols-5` (firm-info col-span-2 + 3 nav cols) to `lg:grid-cols-6` (firm-info col-span-2 + 4 nav cols). Compliance bar at the bottom unchanged — TREC firm name + phone + EHO logo + Tennessee licensure line + copyright all preserved verbatim.

## New files

- `lib/homepage-config.ts` — `HOMEPAGE_HEADLINE`, `HOMEPAGE_SUBHEAD`, `HOMEPAGE_EYEBROW`, `HOMEPAGE_TRUST_LINE` constants. Stephen swaps headline by editing one string.
- `data/sample-briefs.ts` — `SAMPLE_BRIEF_SNIPPETS` array, three entries (one per track) all `status: 'placeholder'`. Stephen flips each to `'published'` with a `bottomLine` excerpt as samples ship.
- `components/homepage/ThreePathsHero.tsx` — typography-only hero. Reads from `homepage-config.ts`.
- `components/homepage/ThreePathsCards.tsx` — three peer cards. Advisory featured via `bg-black text-white` weighted-card pattern (same brand-internal "accent" treatment Pipeline uses).
- `components/homepage/WhatYouWalkAwayWith.tsx` — Decision Brief explainer, three sample snippets. Placeholder pattern: when `status === 'placeholder'`, renders "Sample Brief in production" instead of fabricated content.
- `components/homepage/WhatWePublish.tsx` — pulls 3 most recent `/blog` posts. Phase 4 will retarget at `/learn`.
- `components/homepage/FromStephen.tsx` — text-only broker note (no Stephen-on-camera imagery per Phase 0 decision; no Nashville office photo in codebase yet).

## Reused

- `components/advisory/ThreeTracks.tsx` — reused on the homepage as the "Three tracks" section. Already had the variant + heading props; passed `heading="Three tracks. Pick the one that matches where you are."`
- `components/sections/TestimonialCarousel.tsx` — kept untouched
- `components/forms/NewsletterSignup.tsx` — kept untouched

## Voice / banned-words audit

All new copy passes the rules:
- ❌ No "luxury", "world-class", "premier", "trusted", "boutique luxury", "white-glove", "concierge"
- ❌ No exclamation marks in headlines
- ❌ No "Music City", "It City", "Athens of the South", honky-tonk / hot-chicken / cowboy-boot / guitar / music-note clichés
- ❌ No "your dream home", "let us guide you home", "your real estate journey"
- ❌ No fake urgency ("act now", "limited time")
- ❌ No "we sell answers" / "we built a second product" / "alongside, not in charge"
- ✅ Lead with the structural shift in the hero (Option A: "Real estate has been all-or-nothing. We changed that.")
- ✅ Keep stats verbatim ("500+ homes closed · $250M+ sold · since 2016")
- ✅ One primary CTA per peer card (each card has one `<Link>`)

## Brand tokens used

Existing only — no new tokens added.
- `bg-white`, `bg-househaven-surface` (#F5F5F5), `bg-black` — section backgrounds
- `text-househaven-navy` (#000), `text-househaven-text` (#000), `text-househaven-text-muted` (#6b6b6b) — text
- `font-serif` (Modulus Bold) for headlines; default sans (Modulus Medium) for body
- The "Hire us by the hour" peer card uses `bg-black text-white` (existing brand-internal weighted treatment)

## Validation

```
npx tsc --noEmit              # clean
npx next lint                 # ✔ No ESLint warnings or errors
npx next build                # 171 routes, all green
```

Bundle:
- Homepage `/` was 3.57 kB on v2; now **3.28 kB** (slightly smaller because old hero photo + dropdown menu logic were removed; new components are simpler).
- First Load JS shared: **87.3 kB** unchanged.

## What ships pending Stephen

- **Headline pick** — default is Option A in code. If Stephen picks B or C, edit `HOMEPAGE_HEADLINE` and `HOMEPAGE_SUBHEAD` in `lib/homepage-config.ts`.
- **Stephen-Nashville photo** — slots into `ThreePathsHero.tsx` as a data-file change once the shoot lands. Ship is typography-only until then per Phase 0 decision.
- **Sample Brief content** — Stephen writes anonymized excerpts and swaps each `status: 'placeholder'` to `status: 'published'` with a `bottomLine` string in `data/sample-briefs.ts`. Until then, homepage cards show the "in production" banner.

## What's next (Phases 4–6 sequencing)

- **Phase 4** — `/learn` library: rename `/blog` → `/learn`, add category + stage taxonomy, scaffold FSBO + Sell-or-Rent topic placeholders, Greatest Hits page, RSS feed. Update homepage `WhatWePublish` to point at `/learn` and Header secondary nav from "Blog" → "Learn".
- **Phase 5** — RentCast on community pages + Pipeline cross-links: rewrite 57 community pages to brief's 10-section structure, add `<NeighborhoodPipeline>` + `<NeighborhoodRental>` reusable components, cross-links on listing detail and Pipeline pages.
- **Phase 6** — E-sign integration + admin polish: HelloSign or DocuSign for engagement letters; Stephen admin view at `/agents/advisory`.

## Suggested commit message

```
phase-3(homepage): three peer paths rebrand + Header/Footer restructure

- New hero leading with structural argument (Option A default; Stephen
  picks final via /reports/2026-05-06-homepage-headlines.md)
- Three peer cards: DIY tools / Hire by hour / Hire as agent. Advisory
  featured via existing bg-black weighted-card pattern
- Below-fold: WhatYouWalkAwayWith (Brief explainer + 3 sample snippet
  cards in placeholder mode), ThreeTracks (reused from /advisory),
  WhatWePublish (3 recent /blog posts; Phase 4 retargets at /learn),
  FromStephen (text-only — Nashville-location photo slots in via
  data file when shoot lands), Testimonials + Newsletter kept verbatim
- Header: 5 top-level peers (Find Homes / Communities / Pipeline /
  Advisory / Home Value), dropdowns dropped. About / Blog / Contact
  in secondary nav. Buyers / Sellers / etc demoted to footer
- Footer: 4-column nav with new Advisory column. lg:grid-cols-6 with
  firm-info col-span-2. Compliance bar unchanged
- New: lib/homepage-config.ts (swappable copy constants), data/
  sample-briefs.ts (placeholder pattern). 7 new components in
  components/homepage/

Old homepage commit hash for revert: 57e6a9b. Locked stats verbatim.
Banned-words audit clean.
```
