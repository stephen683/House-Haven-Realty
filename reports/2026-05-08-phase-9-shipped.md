# Phase 9 shipped — discovery-call flow

**Branch:** `claude/advisory-rebuild` (preview-only)
**Migration:** 015 applied to `eefqcgetyxdrvchkwhrq` (Supabase)
**Type-check / lint / build:** all green

## What this phase did

Phase 9 replaces the Phase 8 discovery-call placeholder with a real, end-to-end booking flow. Free 15-minute calls book the same way paid Decision Briefs do — slot picker, intake, calendar event, confirmation page — but skip the Stripe leg.

### New routes

- `app/advisory/discovery-call/page.tsx` — replaces placeholder. Hosts the real intake → slot flow.
- `app/advisory/discovery-call/confirmation/page.tsx` — post-booking confirmation page (noindex). Includes a CTA card pointing already-decided visitors to `/advisory/book`.
- `app/api/advisory/discovery-call/route.ts` — POST endpoint that validates the slot, creates the `advisory_bookings` row with `booking_type='discovery_call'`, and runs side effects inline.
- `app/api/agents/advisory/[id]/convert-to-paid/route.ts` — Stephen-only endpoint. Stamps an admin note and emails the prospect a one-click link to `/advisory/book`. New paid_brief row is created when they complete the form there.

### New components

- `components/advisory/discovery/IntakeForm.tsx` — discovery intake (name / email / phone / situation / buying-or-selling / how-heard).
- `components/advisory/discovery/BookingClient.tsx` — orchestrator: intake → slot.
- `app/agents/advisory/[id]/ConvertToPaidForm.tsx` — admin button that POSTs to convert-to-paid.

### Slot system refactor

`lib/advisory-config.ts` now exports two `SlotConfig` objects: `PAID_BRIEF_SLOT_CONFIG` (Tue/Thu, 60-min, 4/wk, 8/mo, 48h lead) and `DISCOVERY_CALL_SLOT_CONFIG` (Mon/Wed/Fri 9–11 AM CT, 15-min, 6/wk, 24/mo, 48h lead). `lib/advisory-slots.ts` was refactored from static globals to take a `SlotConfig` parameter. Cross-type conflict detection uses each booking's actual duration (60-min paid blocks any overlapping 15-min discovery call and vice versa).

`/api/advisory/calendar-slots?type=discovery_call|paid_brief` selects the right config. `SlotPicker` now takes `slotType`, `info`, `ctaLabel`, and `ctaSubmittingLabel` props so both flows share the component.

### Email templates (3 new)

- `sendDiscoveryCallConfirmation` — confirms time + Meet link, names what the call covers.
- `sendDiscoveryReminder24h` — 24h pre-call reminder.
- `sendDiscoveryReminder1h` — 1h pre-call reminder.
- `notifyStephenOfDiscoveryCall` — internal alert with intake JSON and convert-to-paid link.

### Side-effects flow

`runPostDiscoveryBookingSideEffects` (parallel to the paid-brief `runPostPaymentSideEffects`): creates a 15-min Google Calendar event with Meet link, sends client confirmation, alerts Stephen. Idempotent via `engagement_letter_sent_at` stamp.

### Cron extension

`app/api/cron/advisory-reminders/route.ts` now fires four reminder windows:
- `paid_brief` — 48h, 2h
- `discovery_call` — 24h, 1h

`listBookingsForReminderWindow(windowHours, bookingType)` was generalized; `payment_status='succeeded'` is enforced only for paid bookings (discovery has no payment).

### Migration 015

Adds `reminder_24h_sent_at` and `reminder_1h_sent_at` columns to `advisory_bookings`. Idempotent. Applied to remote.

### Admin view

`/agents/advisory/[id]` now branches on `booking_type`:
- paid_brief → "Deliver Decision Brief" form (existing).
- discovery_call → "Convert to paid Decision Brief" form (new).
- Both → "Cancel booking" form (existing).

## Verification

- `npm run type-check` — clean
- `npm run lint` — no warnings/errors
- `npm run build` — green; `/advisory/discovery-call`, `/advisory/discovery-call/confirmation`, and the API routes all render

## Mock-mode behavior

When Google OAuth env vars are unset (current state), the discovery flow:
1. Shows the slot-picker mock-mode banner.
2. Books the row in Supabase.
3. `createEvent` returns a mock event ID + mock Meet link.
4. Confirmation + alert emails dry-run to Vercel function logs (RESEND_API_KEY unset).

When Stephen sets `GOOGLE_OAUTH_*` + `HHR_ADVISORY_CALENDAR_ID` + `RESEND_API_KEY`, the flow flips to live without code changes — same pattern as Phase 6.

## What ships next

**Phase 10** — homepage rebuild:
- Hero (typography-only, 3 candidates → `reports/2026-05-08-homepage-hero-candidates.md`)
- Stephen's story
- Four service-line cards: Buyer rep / Seller rep / Advisory / Door Collectors property mgmt
- "What we built for Nashville"
- Recent transactions placeholder
- Kept testimonials + newsletter

**Phase 11** — cleanup + final shipped report.
