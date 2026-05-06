# Phase 2 — Scaffolding pass (libs + DB)

**Date:** 2026-05-06
**Phase:** 2 of 6 (booking flow); scaffolding pass only — UI + API routes + cron in next pass
**Status:** Foundations ready. Booking-flow library, schema, and email templates are in place and developable. The next session lights up the routes/components once Phase 1 smoke-tests pass.

---

## Why scaffolding-first

Stephen's instruction: "develop Phase 2 components in parallel using the dry-run pattern — Stripe and Google Calendar wrappers should mock without keys so components are developable and previewable before vendor credentials land."

This pass delivers exactly the foundational layer. The lib wrappers + DB schema unblock the next pass (UI/API/cron) without depending on Stripe live keys, Google OAuth credentials, or attorney-finalized engagement letter wording.

## What shipped

### Supabase migration `012_advisory_bookings` (applied via MCP)

`public.advisory_bookings` — system of record for paid Decision Brief bookings.

**Lifecycle columns:** `track`, `client_name`, `client_email` (lowercased on insert), `client_phone`, `intake_responses` (jsonb, track-specific shape), `rentcast_prepull` (jsonb, FSBO/Sell-or-Rent only), `amount_cents` (default 20000 = $200), `payment_status` (pending/succeeded/failed/refunded), `stripe_payment_intent_id` (UNIQUE for webhook idempotency), `stripe_charge_id`, `slot_utc`, `slot_central`, `google_calendar_event_id`, `meet_link`, `engagement_letter_status` (not_sent/sent/signed/not_required), `engagement_letter_sent_at`, `engagement_letter_signed_at`, `brief_status` (not_started/drafted/delivered), `brief_delivered_at`, `reminder_48h_sent_at`, `reminder_2h_sent_at`, `canceled_at`, `cancellation_reason`, `admin_notes`.

**Indexes:** lower(client_email), slot_utc, payment_status, track, created_at DESC. Unique on stripe_payment_intent_id (webhook idempotency).

**Triggers:** `set_updated_at()` on every UPDATE. RLS enabled with permissive service-role policy (matches existing migration pattern; the API routes are server-only).

**Approach choices worth flagging:**
- CHECK constraints rather than ENUM types — easier to extend without altering custom types
- All status fields default to safe values (`pending`, `not_required`, `not_started`) so a partial insert during intake never leaves a row in a corrupt state
- `intake_responses` is `jsonb` rather than typed columns because the brief specifies different fields per track; encoding the whole intake as JSON keeps schema migrations small as the intake form evolves

### `lib/stripe.ts` (fetch-based, mock-when-no-key)

Matches the existing `rentcast/hubspot/resend` pattern — no SDK install needed.

- `createPaymentIntent({ amountCents, bookingId, email, description?, metadata? })` — calls `POST /v1/payment_intents` with `automatic_payment_methods[enabled]=true`. Mock: deterministic `pi_mock_<bookingId>` for stable webhook simulation in dev
- `retrievePaymentIntent(intentId)` — for double-checking status on the webhook path. Mock: returns `succeeded` with `ch_mock_<intentId>`
- `verifyWebhookSignature(payload, header, secret, now?)` — manual HMAC-SHA256 verify with the v1 scheme: parses `t=...,v1=...,v1=...`, enforces 300-second timestamp tolerance, supports multiple v1 signatures, uses `crypto.timingSafeEqual` for constant-time comparison. The Stripe SDK's `webhooks.constructEvent` is roughly this same algorithm
- `getPublishableKey()`, `isStripeLive()` — small helpers for the API routes

**Tradeoff:** the SDK does some niceties for free (full type safety on event payloads, retry-with-backoff). For our needs — single product, single PaymentIntent shape, one webhook event we care about (`payment_intent.succeeded`) — the fetch + manual verify path is simpler and consistent with the codebase's existing pattern. If we ever add subscriptions, SetupIntents, or refund automation, revisit.

### `lib/google-calendar.ts` (fetch-based, mock-when-no-OAuth)

OAuth refresh token → access token caching with 60-second buffer before expiry.

- `listBusy(start, end)` — `POST /freeBusy` for the configured calendar. Mock: empty busy array (so all slot-window slots show available)
- `createEvent({ startUtc, endUtc, summary, description, attendeeEmails, conferenceRequestId })` — `POST /calendars/.../events?conferenceDataVersion=1&sendUpdates=all`. Creates the Google Meet conference inline via `conferenceData.createRequest` with the bookingId-stable requestId for idempotency. Returns `eventId`, `meetLink`, `htmlLink`. Mock: returns stable `evt_mock_<requestId>` and `https://meet.google.com/mock-mock-mock`
- `deleteEvent(eventId)` — for cancellation flow. Treats 410 (already gone) as success
- `isCalendarLive()` — checks all four required env vars are set

**Setup notes** (already on Stephen's Phase 0 list, restating for completeness):
- Stephen-OS Cloud Console OAuth client must be in "Published" status, OR `stephen@househavenrealty.com` pinned as permanent Test user. Token caching here will not save Stephen if the refresh token expires every 7 days
- HHR Advisory calendar must exist inside `stephen@househavenrealty.com`. Calendar ID is the email-style format (e.g. `c_xxxxx@group.calendar.google.com`)
- OAuth scopes needed: `https://www.googleapis.com/auth/calendar.events` (write) — read-only `calendar.events.readonly` is insufficient for `createEvent`

### `lib/advisory-bookings.ts` (Supabase CRUD)

Full type model (`AdvisoryBookingRow` with all 24 columns), strict input types (`CreateBookingInput` / `UpdateBookingInput`).

- `createBooking()` — inserts new row, lowercases email
- `getBookingById(id)`, `getBookingByPaymentIntent(intentId)` — single-row lookups
- `updateBooking(id, patch)` — partial update, only sends columns that are explicitly defined in the patch (so `null` and `undefined` are distinguishable: `null` clears the column, `undefined` leaves it untouched)
- `listBookingsForReminderWindow(48 | 2)` — used by the cron route in next pass. Looks for bookings between `windowHours - 0.5` and `windowHours + 0.5` from now, filtered to `payment_status = 'succeeded'` AND `canceled_at IS NULL` AND the relevant `reminder_*_sent_at IS NULL`. The 30-min tolerance window means a 15-min cron tick will catch each booking exactly once

### `lib/advisory-emails.ts` (uses lib/resend.ts)

Six email functions, all flow through `sendEmail()` which dry-runs to console when `RESEND_API_KEY` is unset.

- `sendBookingConfirmation` — sent immediately on `payment_intent.succeeded`
- `sendEngagementLetter` — separate email, links to `ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL` placeholder PDF
- `sendReminder48h` / `sendReminder2h` — fired by cron
- `sendBriefDelivery(booking, briefPdfUrl)` — fired by Stephen-only admin route after he writes the Brief
- `notifyStephenOfNewBooking` — internal alert with full intake responses and RentCast pre-pull JSON for prep

All copy is operator-voice, no exclamation points, no "luxury/world-class/premier", no Music City clichés. Every email is text/plain (HTML emails come later if Stephen wants them).

**From addresses:**
- Client-facing: `House Haven Advisory <advisory@househavenrealty.com>`
- Stephen-internal: `House Haven Alerts <alerts@househavenrealty.com>` (matches existing /value alert pattern)

Both subdomains need to be verified in the Resend dashboard before real sends fire. Already on Stephen's pending list.

## What is NOT in this pass (next session)

The brief-flow components and API routes will land in the next pass after Stephen smoke-tests Phase 1:

- `app/advisory/book/BookingClient.tsx` (multi-step: TrackPicker → IntakeForm → SlotPicker → StripeCheckout)
- `app/advisory/book/confirmation/page.tsx`
- API: `create-intent`, `stripe-webhook`, `calendar-slots`, `deliver-brief`
- Cron: `app/api/cron/advisory-reminders/route.ts` + `vercel.json` cron entry
- npm install: `@stripe/stripe-js` + `@stripe/react-stripe-js` (Stripe Elements client)

The Phase 1 `/advisory/book` waitlist placeholder stays live throughout — the swap to the real flow happens in a single page-file change in the next pass.

## Validation

```
npx tsc --noEmit                  # clean
npx next lint                     # ✔ No ESLint warnings or errors
mcp__Supabase__list_tables       # advisory_bookings present, RLS enabled
```

The four lib files compile, lint, and type-check. None are imported anywhere yet (next pass wires them up); they exist as a clean foundation.

## Brand tokens used

None — this pass is data + lib only. Phase 2 second pass will use existing `bg-black text-white`, `bg-househaven-surface`, Modulus, etc. for the booking flow UI. No new tokens needed.

## Surfaced for Stephen — flagged from this pass

1. **Stripe API version pinning.** `lib/stripe.ts` does not pin `Stripe-Version` header — Stripe will use the account default (set in Dashboard). Recommend pinning the version in the Stripe Dashboard before enabling live mode so behavior is stable across SDK / API updates.

2. **Resend sender domain verification.** Two subdomains used: `advisory@` and `alerts@`. Already on Stephen's list, restating because both need DNS records set in Resend before live sends.

3. **OAuth scope.** Stephen-OS OAuth client may currently have only `calendar.events.readonly` if it was added casually. Verify `calendar.events` (write) is in the scope set when re-checking the Cloud Console OAuth status.

4. **Resend HTML emails.** Current templates are text/plain. Real HHR Advisory emails will probably benefit from a basic HTML wrapper with HHR logo + brand. Not blocking; punt to Phase 2 second pass or Phase 6 polish.

5. **Migration 011 (spatial_ref_sys) not applied yet.** Surfaced in `phase-1.5b` commit — Stephen needs to paste the SQL from the migration file header into Supabase Dashboard SQL Editor (MCP role can't ALTER the supabase_admin-owned table).

## What's next

After Stephen smoke-tests Phase 1 and signals go:

**Phase 2 second pass (next session):**
1. BookingClient + step components
2. API routes (create-intent, stripe-webhook, calendar-slots, deliver-brief)
3. Confirmation page
4. Vercel cron for reminders
5. npm install Stripe Elements client packages
6. Replace `/advisory/book/page.tsx` placeholder with real flow

When vendor credentials land (Stripe live keys + Google OAuth refresh token + HHR Advisory calendar ID), nothing in code changes — the `isStripeLive()` and `isCalendarLive()` checks flip mock-mode off automatically per env presence. That's the dry-run pattern paying off.

## Suggested commit message

```
phase-2-scaffolding(advisory): bookings schema + 4 lib wrappers

- migration 012 applied: advisory_bookings table with full lifecycle
  columns (payment, calendar event, engagement letter, brief, reminders,
  cancellation), CHECK constraints in lieu of ENUM types, set_updated_at
  trigger, lower(email) + slot_utc + payment_status + track indexes
- lib/stripe.ts: fetch-based PaymentIntent + manual webhook signature
  verify (HMAC-SHA256, 300s tolerance, timing-safe). Deterministic mock
  when no key
- lib/google-calendar.ts: fetch-based OAuth refresh + freeBusy + event
  create/delete with Google Meet conferenceData. Mock when OAuth env unset
- lib/advisory-bookings.ts: full Supabase CRUD with type model and
  reminder-window query helper
- lib/advisory-emails.ts: 6 email templates via lib/resend.ts (confirm,
  engagement letter, 48h/2h reminders, brief delivery, Stephen alert)
- TODO updated with Phase 2 scaffolding shipped + second-pass items
- Phase 2 second pass (UI + API + cron) ships next session after Phase 1
  smoke-tests pass
```
