# Phase 10 shipped — homepage rebuild (brokerage-first)

**Branch:** `claude/advisory-rebuild` (preview-only)
**Type-check / lint / build:** all green

## What this phase did

Phase 10 rebuilt the homepage from the Phase 3 three-paths layout to the brokerage-first layout per the v2 pivot. The brokerage is the headline; Advisory is one service line among four.

### Hero candidates + primary CTA

`reports/2026-05-08-homepage-hero-candidates.md` ships three hero candidates with rationale and two primary-CTA options. **Candidate A** ("A small Nashville brokerage. Five hundred clients in. Still picky about the next one.") + **"Talk to Stephen"** as primary CTA / **"See homes for sale in Nashville"** as secondary shipped by default. All swappable from `lib/homepage-config.ts` without touching component code.

### Sections, in order

1. **Hero** — typography-only. Eyebrow / headline / subhead / two CTAs / trust line.
2. **Stephen's story** — text-only broker note, slightly longer than the prior `FromStephen`. Origin (2016), team size (eleven agents in The Nations), 500+ closings claim, phone number.
3. **Four service lines** — Buyer rep / Seller rep / HHR Advisory / Door Collectors. Equal visual weight, no card featured.
4. **What we built for Nashville** — four free tools (Find Homes / Pipeline / Value / Communities). Black panel, frames the tools as something the brokerage built for the city, not a peer offering.
5. **Recent transactions** — three placeholder cards flagged as "anonymized · representative · published cases coming." Stephen swaps with real anonymized closings when he writes them.
6. **Testimonials** — kept from prior homepage.
7. **Newsletter** — kept from prior homepage.

### New components

- `components/homepage/BrokerageHero.tsx` — replaces `ThreePathsHero`. Reads CTAs from `homepage-config`.
- `components/homepage/StephenStory.tsx` — replaces `FromStephen`. Longer, story-focused.
- `components/homepage/ServiceLines.tsx` — replaces `ThreePathsCards`. Four cards, equal weight.
- `components/homepage/WhatWeBuilt.tsx` — new. Four-tool grid on black.
- `components/homepage/RecentTransactions.tsx` — new. Three placeholder cards.

### Removed components

- `components/homepage/ThreePathsHero.tsx` (replaced by BrokerageHero)
- `components/homepage/ThreePathsCards.tsx` (replaced by ServiceLines)
- `components/homepage/FromStephen.tsx` (folded into StephenStory)
- `components/homepage/WhatWePublish.tsx` (not in Phase 10 spec; Phase 11 cleanup can decide whether to bring it back lower)

### Config

`lib/homepage-config.ts` now exports `HOMEPAGE_PRIMARY_CTA` and `HOMEPAGE_SECONDARY_CTA` alongside the existing copy constants. The `tel:` href triggers the global `phone_click` analytics event.

## Verification

- `npm run type-check` — clean
- `npm run lint` — no warnings/errors
- `npm run build` — green; homepage renders all 7 sections

## Stephen-pending content

- Real anonymized recent transactions (3 entries in `RecentTransactions.tsx`).
- Final hero pick (default A; B/C in candidates report).
- Final primary CTA pick (default "Talk to Stephen"; alternate "See homes for sale").
- Eventually a Nashville-location photo of Stephen for the hero.

## What ships next

**Phase 11** — cleanup + final shipped report:
- Remove dead components left over from prior phases (e.g. `WhyThisExists`, `HonestFraming` if they have no live consumer).
- Verify no orphan imports.
- Write `reports/2026-05-08-advisory-v2-shipped.md` summarizing the diff against Phase 0–6.
