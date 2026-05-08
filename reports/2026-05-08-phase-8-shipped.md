# Phase 8 shipped — /advisory cold-traffic rewrite

**Branch:** `claude/advisory-rebuild` (preview-only)
**Type-check / lint / build:** all green
**Routes:** `/advisory` rebuilt; `/advisory/discovery-call` placeholder added (Phase 9 replaces with real flow).

## What this phase did

Phase 8 rebuilt `/advisory` from the ground up as a cold-traffic conversion target — the page someone arriving from a TikTok/Reels/Short can read in two minutes and decide whether to book.

### Hero + money-back guarantee

`reports/2026-05-08-advisory-hero-candidates.md` ships three hero candidates with rationale per option and the verbatim money-back-guarantee draft. Candidate A ("Pay for the advice, not the transaction.") is what shipped by default; alternates B and C are documented for swap-in if Stephen wants a different opener.

### Page sections, in order

1. **Hero** — Candidate A copy.
2. **Who this is for** — three audience paragraphs (FSBO seller / future buyer 6–18 months out / sell-or-rent decider). Reader self-identifies.
3. **What you get** — Decision Brief explained in four sections (Bottom Line / Recommendations / Framework / Action Items) plus a sample Brief placeholder card flagging Stephen's pending content.
4. **Why this is safe** — six cards: money-back guarantee · no commission attached · written deliverable · real licensed broker · no CRM funnel · independence by design.
5. **How it works** — four steps. Universalized — no "pick a track" copy.
6. **Recent client examples** — three anonymized one-paragraph placeholders, labeled as such ("representative of real consults · published cases coming"). Stephen replaces with real anonymized cases when he writes them.
7. **Pricing** — flat $200, one hour, Brief in 48 hours. Followed by NAR commission disclosure card and the standard HHR Advisory legal disclosure.
8. **FAQ** — 13 questions, including the value-guarantee + cancellation policy combined.
9. **Final CTA** — primary: "Book a free 15-min discovery call →" (`/advisory/discovery-call`). Secondary: "Skip the call — book a Decision Brief →" (`/advisory/book`).

### New components

- `components/advisory/WhoThisIsFor.tsx`
- `components/advisory/WhyThisIsSafe.tsx`
- `components/advisory/RecentExamples.tsx`
- `components/advisory/SamplePreview.tsx` (rendered inside `WhatsInTheBrief`)
- `components/advisory/FinalCTA.tsx`

### Updated components

- `components/advisory/HowItWorks.tsx` — dropped "Pick a track" copy; step 1 is now a universal intake description.
- `components/advisory/WhatsInTheBrief.tsx` — composes `SamplePreview` after the four-section preview.

### Discovery-call placeholder

`app/advisory/discovery-call/page.tsx` ships a fully styled placeholder so the primary CTA on `/advisory` lands somewhere coherent. The page tells visitors real-time slot booking is in production and offers two interim paths: email Stephen for a hand-scheduled 15-min call, or skip the call and go straight to the paid Decision Brief.

### Ancillary updates

- `app/sitemap.ts` — added `/advisory/discovery-call`.
- `components/compliance/SiteFooter.tsx` — added "Free 15-min discovery call" to the Advisory footer column.

### What got removed from /advisory

`WhyThisExists` is no longer rendered on `/advisory`. Its argument folds into `WhyThisIsSafe` (the "no commission attached" + "independence by design" cards) and the Hero lede. The component file stays around in case Phase 11 cleanup wants to keep it elsewhere, but no live page imports it now.

## Verification

- `npm run type-check` — clean
- `npm run lint` — no warnings/errors
- `npm run build` — 170 routes, all green; `/advisory`, `/advisory/discovery-call`, `/advisory/book`, `/advisory/book/confirmation` all rendering

## Stephen-pending content (placeholders shipped)

- Final hero pick (default A; B/C in candidates report).
- Real anonymized client examples (3 paragraphs in `RecentExamples.tsx`).
- Sample Brief preview document.

## What ships next

**Phase 9** — replace `/advisory/discovery-call` with real flow:
- Slot picker (no Stripe; free)
- Intake form (name/email/phone/situation/buying-or-selling/how-heard)
- Google Calendar event tagged to distinguish from paid bookings
- Three Resend templates (confirm + 24h + 1h reminder)
- DB write to `advisory_bookings` with `booking_type='discovery_call'`
- Cron `advisory-reminders` extended for both types
- Stephen-admin endpoint to convert discovery → paid
- Slot windows: Mon/Wed/Fri 9–11 AM CT, 15-min slots, 4–6/week, 48h minimum booking window

**Phase 10** — homepage rebuild.
**Phase 11** — cleanup + final report.

## Open decision

Discovery-call route default `/advisory/discovery-call` is shipped. If Stephen prefers `/advisory/intro-call`, swap during Phase 9 (one rename + footer/sitemap/page-CTA update — small).
