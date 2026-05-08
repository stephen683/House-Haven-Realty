# Advisory page — hero candidates + money-back guarantee draft

For the Phase 8 `/advisory` rewrite (cold-traffic conversion target — TikTok/Reels/Shorts).

This phase shipped **Candidate A** by default. To swap, edit the `<AdvisoryHero>` props at the top of `app/advisory/page.tsx` — eyebrow / headline / lede. Wholesale revisions can also pull from the rationale below.

---

## Hero candidates

### Candidate A — Honest exchange (SHIPPED)

> **Eyebrow:** HHR Advisory · Pay for the advice, not the transaction
> **Headline:** Pay for the advice, not the transaction.
> **Lede:** One hour with a Nashville broker. Written Decision Brief in 48 hours. $200 flat, pre-paid. The advice is honest in a way a free consultation cannot be.

**Rationale.** This is the strongest cold-traffic opener because it names the *structural* objection a skeptical viewer has — "free consultations are just sales meetings" — and sets the page up to argue the structural answer. It works for someone who has never heard of HHR Advisory and has thirty seconds to decide whether to keep scrolling. The headline-as-thesis lets the rest of the page deliver the proof.

**Risk.** Slightly abstract — "transaction" is broker jargon. Mitigated by the lede, which reduces it to concrete numbers ($200, one hour, 48 hours).

---

### Candidate B — Service framing

> **Eyebrow:** HHR Advisory
> **Headline:** Hire a Nashville broker by the hour.
> **Lede:** $200, one hour, written Decision Brief in 48 hours. No commission, no pitch, no email funnel. Pay for the advice, keep the document.

**Rationale.** "By the hour" is concrete and immediately legible — anyone who has ever hired a lawyer or accountant gets it instantly. Frames Advisory as a familiar professional service, not a novel product. Strong if Stephen wants the page to read as "we built a thing that obviously should already exist."

**Risk.** Slightly buries the structural argument. Doesn't clearly differentiate from a generic paid consultation. Better as a B-test if A doesn't convert.

---

### Candidate C — Decision-first

> **Eyebrow:** HHR Advisory
> **Headline:** Before you sign anything, get a second opinion that isn't selling you something.
> **Lede:** One hour with a Nashville broker. Written Decision Brief in 48 hours. $200 flat. We will never list your house, sell you a tour, or chase your transaction.

**Rationale.** Targets the specific moment of decision-fear ("I'm about to make a big choice and I don't trust the person advising me"). The negative framing ("isn't selling you something") may convert better with the audiences most burned by free consultations.

**Risk.** Long headline. Negative framing can read as combative or score-settling — wrong tone for cold traffic that doesn't yet know HHR. Keep this one in reserve for retargeting traffic that has already seen a generic "free consultation" pitch.

---

## Money-back guarantee draft

The guarantee renders as one of six "Why this is safe" cards on the page, with this exact wording:

> **If you don't believe you got $200 of value.**
> Request a refund within 7 days of the consult. No questions asked, no hoops. The Decision Brief is yours to keep regardless.

This sits alongside the standard cancellation policy (24h+ before consult = full refund; inside 24h = no refund). The guarantee is about *value*; the cancellation policy is about *whether the consult happened*. Both true at once — the FAQ ("What is your refund policy?") covers the combined picture.

---

## What this phase actually did to /advisory

The page was rebuilt from the ground up for cold-traffic conversion. Sections, in order:

1. **Hero** — Candidate A copy, black background, typography-only.
2. **Who this is for** — three audience paragraphs (FSBO seller / future buyer 6–18 months out / sell-or-rent decider). The page is universal but the reader self-identifies in this section.
3. **What you get** — the Decision Brief as the tangible artifact, with a four-section structure preview (Bottom Line / Recommendations / Framework / Action Items). A sample-Brief placeholder card flags Stephen's pending content delivery.
4. **Why this is safe** — six cards: money-back guarantee, no commission attached, written deliverable, real licensed broker, no CRM funnel, independence by design.
5. **How it works** — four numbered steps (intake → pre-pay → 1 hr Google Meet → Brief in 48h).
6. **Recent client examples** — three anonymized one-paragraph placeholders. Stephen will replace with real anonymized cases when he writes them.
7. **Pricing** — $200 flat / one hour / Brief in 48 hours.
8. **FAQ** — 13 questions. NAR commission disclosure card and the standard HHR Advisory legal disclosure follow.
9. **Final CTA** — primary: "Book a free 15-min discovery call →" (`/advisory/discovery-call`). Secondary: "Or skip the call — book a Decision Brief →" (`/advisory/book`).

---

## Stephen-pending content (placeholder until delivered)

- Real anonymized client examples (3 paragraphs in `RecentExamples.tsx`).
- Sample Brief preview document (visual placeholder card in `WhatYouGet`).
- Final hero pick (default A; B/C above as alternates).
