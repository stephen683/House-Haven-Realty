# Phase 7 shipped — Advisory v2 foundation (no UX visible)

**Branch:** `claude/advisory-rebuild` (preview-only; never merges to `main` without Stephen's explicit greenlight)
**Migration:** 014 applied to `eefqcgetyxdrvchkwhrq` (Supabase)
**Type-check / lint / build:** all green

## What this phase did

Phase 7 strips the three-track architecture (FSBO / Buyer Roadmap / Sell-or-Rent) so Phase 8 can rewrite `/advisory` as a single cold-traffic conversion page. No new UX shipped — this is plumbing.

### Routes deleted
- `app/advisory/fsbo/page.tsx`
- `app/advisory/buyer-roadmap/page.tsx`
- `app/advisory/sell-or-rent/page.tsx`
- `app/advisory/samples/[track]/page.tsx` (and parent `samples/` directory)

### Components deleted
- `components/advisory/ThreeTracks.tsx`
- `components/advisory/booking/TrackPicker.tsx`
- `components/homepage/WhatYouWalkAwayWith.tsx`
- `data/sample-briefs.ts`

### Configuration stripped
`lib/advisory-config.ts` no longer exports `ADVISORY_TRACKS`, `AdvisoryTrack`, `AdvisoryTrackSlug`, or `getTrack`. Pricing, slot windows, timezone, and the disclosure paragraph remain. The `track` column on `advisory_bookings` is preserved (writes default to `'general'`); Phase 11 cleanup will revisit whether to drop it.

### Booking flow simplified
- `/advisory/book` is now a single path: intake → slot → payment.
- Track pre-selection (`?track=`) and the TrackPicker step are gone.
- `IntakeForm` collects universal fields plus one freeform "what is the decision in front of you?" textarea (replacing the per-track conditional sections).
- `create-intent` API drops track validation and writes `booking_type='paid_brief'`.

### Migration 014
Adds `booking_type text NOT NULL DEFAULT 'paid_brief' CHECK (booking_type IN ('paid_brief', 'discovery_call'))` plus a covering index. Applied; idempotent (`IF NOT EXISTS`). Phase 9 discovery-call flow writes `'discovery_call'`; everything existing stays `'paid_brief'`.

### Header — 5 primary nav items
**Primary:** Find Homes / Communities / Pipeline / Advisory / **About**
**Secondary:** Learn (only)
**Footer-only:** Home Value, Contact, social, disclosures (already there; just dropped from header)

### Other consumer updates (track-typed → universal)
- `lib/advisory-bookings.ts` — `track: string`, new `booking_type: BookingType`, write default `'general'` track on create
- `lib/advisory-emails.ts` — track-specific subject lines collapsed to "Decision Brief"
- `lib/advisory-flow.ts` — drop ADVISORY_TRACKS lookup; calendar event title uses "Decision Brief"
- `lib/learn-taxonomy.ts` — drop `advisoryTrack` field; CTA on every article instead of conditional
- `components/advisory/AdvisoryCTA.tsx` — drop `track` prop; always points to `/advisory`
- `app/agents/advisory/page.tsx` — replace per-track stats with paid_brief / discovery_call counts; "Track" column → "Type"
- `app/agents/advisory/[id]/page.tsx` — show booking-type label instead of track name
- `app/api/agents/advisory/[id]/cancel/route.ts` — generic "Decision Brief" copy
- `app/sitemap.ts` — drop the per-track loop
- `app/page.tsx` — temporarily slim (Phase 10 rebuilds homepage)
- `app/advisory/page.tsx` — temporarily slim with universal framing (Phase 8 rewrites for cold traffic)
- `components/compliance/SiteFooter.tsx` — drop dead `/advisory/{fsbo,buyer-roadmap,sell-or-rent}` links

## Verification
- `npm run type-check` — clean
- `npm run lint` — no warnings/errors
- `npm run build` — 175-route count preserved minus the 4 deleted routes; no broken imports
- Migration listed in remote project after apply

## What ships next

**Phase 8** — `/advisory` cold-traffic rewrite:
- Hero candidates → `reports/2026-05-08-advisory-hero-candidates.md` (Stephen picks one)
- Money-back-guarantee draft same doc
- Sections per spec: Hero / Who-this-is-for (3 audience paragraphs) / What-you-get / Why-this-is-safe (6 cards) / How-it-works (4 steps) / Recent client examples (placeholder) / Pricing / FAQ (≥12) / Final CTA
- Primary CTA → `/advisory/discovery-call` (placeholder route in Phase 8)
- Secondary CTA → existing `/advisory/book`

**Phase 9** — discovery-call flow (real route, slot picker, calendar/email plumbing).
**Phase 10** — homepage rebuild.
**Phase 11** — cleanup + final shipped report.

## Open decisions for Stephen (tracked in memory)
1. Discovery-call route: `/advisory/discovery-call` vs `/advisory/intro-call` — defaulting to discovery-call unless he says otherwise; will ask before Phase 9.
2. Homepage primary CTA — "See homes for sale in Nashville" vs "Talk to Stephen" — will ask at Phase 10.
