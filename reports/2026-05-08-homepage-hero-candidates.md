# Homepage hero candidates — Phase 10

For the brokerage-first homepage rebuild. Phase 10 shipped **Candidate A** by default (typography-only) plus **"Talk to Stephen"** as the primary CTA. Both are swappable from `lib/homepage-config.ts` without touching component code.

---

## Hero candidates

### Candidate A — Brokerage-first (SHIPPED)

> **Eyebrow:** House Haven Realty · Nashville, Tennessee
> **Headline:** A small Nashville brokerage. Five hundred clients in. Still picky about the next one.
> **Subhead:** We've closed 500+ homes and $250M in volume since 2016. We work as full-representation buyer's and seller's agents, hire-by-the-hour Advisory, and (with our sister company Door Collectors) property management. Nashville-based, Stephen-owned.
> **Trust line:** Licensed Tennessee brokerage · 500+ homes closed · $250M+ sold · Nashville-based since 2016

**Rationale.** Foregrounds the brokerage as a brokerage. The Phase 3 headline ("Real estate has been all-or-nothing. We changed that.") was structural-argument framing — pre-pivot, it implied Advisory was the headline. The new copy reverses that: brokerage is the headline, "still picky about the next one" is the voice signal that this isn't a churn shop. Confident without bragging.

**Risk.** "Five hundred clients in" might sound humble-brag to a viewer not familiar with the volume. Trust line backstops the claim.

---

### Candidate B — Anchored on people

> **Eyebrow:** House Haven Realty · Nashville, Tennessee
> **Headline:** Nashville real estate, done by people who live here.
> **Subhead:** We are an eleven-agent boutique brokerage in The Nations. 500+ closings, $250M in volume, every transaction worked from this office. We handle buying, selling, advisory, and (with Door Collectors) the property after.
> **Trust line:** (same)

**Rationale.** Local-trust play. Geographic + small-team framing reads as warmer than Candidate A. Stronger if the homepage is taking a lot of out-of-state relocation traffic and wants to land "we are not the chain you've talked to."

---

### Candidate C — Service breadth

> **Eyebrow:** House Haven Realty · Nashville, Tennessee
> **Headline:** Buy. Sell. Advise. Hold.
> **Subhead:** A Nashville brokerage that handles the four real-estate decisions you actually have. Buyer representation. Seller representation. Hire-by-the-hour Advisory. Property management through our sister company Door Collectors.
> **Trust line:** (same)

**Rationale.** Makes the four service lines the headline. Strong if Stephen wants the homepage to read like an architecture diagram of what House Haven offers — visitors know within 2 seconds whether their question fits.

**Risk.** Reads cold without the rest of the page. Less voice, more directory.

---

## Primary CTA candidates

### A. "Talk to Stephen" (SHIPPED)

> Primary button → `tel:+16156244766`
> Secondary button → `/homes-for-sale`

**Rationale.** Brokerage-led framing wants the primary CTA to reach the broker, not the inventory. Phone tap is the lowest-friction commitment from someone who is genuinely interested. Inventory is the secondary path for visitors who want to look around first.

### B. "See homes for sale in Nashville"

> Primary button → `/homes-for-sale`
> Secondary button → `/contact` or `tel:+16156244766`

**Rationale.** Pure volume-of-leads play. Listing pages convert better than phone CTAs cold. Use this if the homepage is taking a lot of "Nashville homes for sale" SEO traffic and the goal is to keep them on-site browsing.

---

## What this phase actually did to /

The homepage was rebuilt from the Phase 3 three-paths layout to the brokerage-first layout per the v2 pivot.

### Sections, in order

1. **Hero** — Candidate A copy + "Talk to Stephen" / "See homes for sale" CTAs.
2. **Stephen's story** — text-only broker note, slightly longer than Phase 3's `FromStephen`. Origin + values.
3. **Four service lines** — Buyer Representation · Seller Representation · HHR Advisory · Door Collectors (property management). Each card has price/time framing and a destination link.
4. **What we built for Nashville** — the four tools (Find Homes / Pipeline / Home Value / Communities). Frames the tools as something the brokerage built, not a peer offering.
5. **Recent transactions** — placeholder grid (3 cards). Stephen will replace with anonymized recent closings when he writes them.
6. **Testimonials** — kept from prior homepage.
7. **Newsletter** — kept from prior homepage.

### What got removed from /

- `ThreePathsHero` — superseded by `BrokerageHero` (Candidate A).
- `ThreePathsCards` — superseded by `ServiceLines` (4 cards).
- `WhatWePublish` — not in Phase 10 spec; removed. Phase 11 cleanup can decide whether to bring it back lower in the page.
- `FromStephen` — content folded into the new `StephenStory` section.

## Stephen-pending content

- Real anonymized recent transactions (3 entries in `RecentTransactions.tsx`).
- Hero pick (default A; B/C as alternates).
- Primary CTA pick (default "Talk to Stephen"; alternate "See homes for sale").
- Eventually a Nashville-location photo of Stephen for the hero — until then, typography-only.
