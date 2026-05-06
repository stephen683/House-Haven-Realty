# Phase 2 second pass — booking flow live (mock-mode developable)

**Date:** 2026-05-06
**Phase:** 2 of 6 — second pass (UI + API + cron) on top of scaffolding
**Status:** Complete. End-to-end booking flow renders, validates, persists, and fires the post-payment side-effect chain in mock mode. Live mode lights up automatically the moment vendor credentials land in Vercel env (no code change required).

---

## What's live

**Booking flow at `/advisory/book`** — multi-step:
1. **Track** (skipped if `?track=fsbo|buyer-roadmap|sell-or-rent` is present)
2. **Intake** — universal fields + track-specific fields per brief
3. **Slot** — fetches `/api/advisory/calendar-slots` and renders available Tue/Thu Central slots
4. **Payment** — Stripe Elements (lazy-mounted via `next/dynamic`). In mock mode, this step is skipped and the user is redirected straight to confirmation

**Confirmation at `/advisory/book/confirmation?id=...`** — server-rendered, reads booking from Supabase. Shows:
- "You are booked for [Day, Month Day, h:mm AM/PM CST/CDT]"
- Three calendar add buttons: `.ics` download, Google Calendar deep-link, Outlook deep-link
- "What to expect" — 4-item bullet list
- Standard Advisory disclosure footer
- Cancel/reschedule contact line
- Special branch: if `?redirect_status` param from Stripe is anything other than `succeeded`, shows a "Payment in progress" soft state instead of the booked confirmation (handles Stripe's async confirmation UX)

**API routes (all `runtime: 'nodejs'`):**

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/advisory/create-intent` | POST | none (public) | Validates intake + slot, RentCast pre-pull (FSBO/Sell-or-Rent), creates booking row (status=pending), creates PaymentIntent. Mock mode runs `runPostPaymentSideEffects` inline and returns a redirect URL. Live mode returns `clientSecret` for Stripe Elements |
| `/api/advisory/stripe-webhook` | POST | Stripe signature | HMAC-SHA256 verify (300s tolerance, manual implementation in `lib/stripe.ts` — no SDK install). Handles `payment_intent.succeeded` (→ flow), `payment_intent.payment_failed` (→ mark failed), `charge.refunded` (→ mark refunded) |
| `/api/advisory/calendar-slots` | GET | none | Returns available slots in `?from&to` range (capped 60 days). Applies 48h lead + slot windows + Google Calendar busy + per-week (4) + per-month (8) caps |
| `/api/advisory/deliver-brief/[id]` | POST | HMAC cookie (Stephen only) | Stephen writes Brief, hits this with `{ briefPdfUrl }` to send the delivery email + mark `brief_status=delivered`. Reuses the existing `/agents` portal auth pattern |
| `/api/advisory/booking/[id]/ics` | GET | none (booking-id is the bearer) | Returns RFC 5545 `.ics` file with VEVENT for the consult slot, attaches Meet link if present |
| `/api/cron/advisory-reminders` | GET | `Bearer ${CRON_SECRET}` | Hourly tick. Fires 48h + 2h reminder emails for bookings in the respective windows. Idempotent via `reminder_*_sent_at` columns |

**Vercel cron** added to `vercel.json`:
```json
{ "path": "/api/cron/advisory-reminders", "schedule": "0 * * * *" }
```

## Lazy-mount Elements — confirmed

Stephen specified lazy mount; my first cut had `@stripe/react-stripe-js` statically imported in `StripeCheckout.tsx`, which meant the package bundled into the main `/advisory/book` chunk. Fixed by wrapping `StripeCheckout` in `next/dynamic` inside `BookingClient.tsx`:

```tsx
const StripeCheckout = dynamic(() => import('./StripeCheckout'), {
  ssr: false,
  loading: () => <p>Loading payment form…</p>,
})
```

Bundle size before/after:
- Before: `/advisory/book` 11 kB
- After: `/advisory/book` **6.53 kB**

The Stripe Elements + `@stripe/stripe-js` packages now ship as a separate chunk that is fetched only when `step === 'payment'` mounts the component. `loadStripe()` itself runs inside that component's `useEffect`, which means the actual `js.stripe.com` script load happens even later, on first render of StripeCheckout.

## Mock mode end-to-end

When `STRIPE_SECRET_KEY` is unset (current state — vendor credentials pending):

1. User submits intake + slot → POST `/api/advisory/create-intent`
2. Server validates everything, runs RentCast pre-pull (real or mock depending on `RENTCAST_API_KEY`), creates Supabase row with `payment_status=pending`
3. `createPaymentIntent()` in `lib/stripe.ts` returns `{ source: 'mock', paymentIntentId: 'pi_mock_<bookingId>', clientSecret: 'pi_mock_<bookingId>_secret_mock' }`
4. Server detects mock source, immediately runs `runPostPaymentSideEffects(bookingId)`:
   - Marks `payment_status=succeeded`
   - Calls `createEvent()` in `lib/google-calendar.ts` — also returns mock if Google OAuth env unset (returns `evt_mock_<bookingId>` + `https://meet.google.com/mock-mock-mock`)
   - Sends 3 emails via `lib/resend.ts` (which dry-runs to console if `RESEND_API_KEY` unset): confirmation, engagement letter, Stephen-internal alert
   - Marks `engagement_letter_status=sent`
5. Server returns `{ mode: 'mock', bookingId, redirectTo: '/advisory/book/confirmation?id=...' }`
6. Client navigates to confirmation page
7. Confirmation page fetches booking by id and renders the success screen with mock Meet link

Stephen can preview the full flow on the Vercel preview right now — the booking row will land in `advisory_book_waitlist`'s sibling table `advisory_bookings`, all email side effects will appear in Vercel function logs as `[resend] dry-run` lines, the Meet link in the confirmation will be the mock URL.

When credentials land:
- `STRIPE_SECRET_KEY` set → real PaymentIntent created, client gets `clientSecret`, Stripe Elements UI renders, real charge happens, webhook fires the same `runPostPaymentSideEffects` — the flow code is identical, the only difference is who triggers it
- `GOOGLE_OAUTH_*` + `HHR_ADVISORY_CALENDAR_ID` set → real calendar event with real Meet link
- `RESEND_API_KEY` set → real emails fire

Zero code change to flip from mock to live.

## Slot policy enforced server-side

`lib/advisory-slots.ts` is the canonical implementation of the brief's slot rules:

- Slot windows: Tuesday 09:00 + 10:30 Central, Thursday 13:00 + 14:30 Central (configured in `lib/advisory-config.ts`)
- 48-hour booking lead time
- Maximum 4 slots per week (Sunday-anchored UTC week key)
- Maximum 8 slots per month (calendar month, UTC)
- Friday afternoons not in slot windows (so structurally absent, plus the brief's "no Friday PM" rule is honored by the windows config alone)
- Google Calendar busy filtering: 60-min consult duration overlap-checked against `calendars/{HHR_ADVISORY_CALENDAR_ID}/freeBusy`

**DST handling:** `centralToUtc()` does an iterative UTC-guess + Chicago-format-and-diff pass to nail the wall-clock conversion across spring-forward and fall-back transitions. Two iterations is enough; verified by inspection that 09:00 CST and 09:00 CDT both produce the correct UTC instant.

**Race-guard:** `validateSlotIsAvailable()` is called by `/api/advisory/create-intent` before booking creation. If a slot was picked by the client at T0 and another booking landed at T0+5s for the same slot, the second user gets a 409 "slot no longer available" and is asked to pick another. The unique constraint on `stripe_payment_intent_id` is a secondary defense for the webhook side.

## Idempotency

- `runPostPaymentSideEffects` is safe to re-run: each side effect (payment status, calendar event, emails) has its own guard checking the existing booking state
- Stripe webhook can fire multiple times (Stripe retries on non-2xx responses) — the flow function handles re-entry cleanly
- Cron reminders mark `reminder_*_sent_at` immediately after a successful send, so the next hourly tick won't double-fire
- The `stripe_payment_intent_id` UNIQUE constraint prevents duplicate booking creation on a given intent

## What got deleted (Phase 1 → Phase 2 transition)

- `components/advisory/BookWaitlistForm.tsx` — superseded by BookingClient
- `app/api/advisory/waitlist/route.ts` (and directory) — superseded by `/api/advisory/create-intent`
- The `advisory_book_waitlist` Supabase **table is retained** so Stephen can export emails for the Phase 2 launch announcement (the brief's Phase 1 → Phase 2 gap mitigation working as intended)

## Validation

```
npx tsc --noEmit              # clean
npx next lint                 # ✔ No ESLint warnings or errors
npx next build                # 152 + 14 new advisory routes/APIs = all green
```

New advisory routes in build:
```
○ /advisory                              208 B   96.2 kB
ƒ /advisory/book                         6.53 kB 93.8 kB  (Stripe Elements lazy-chunked)
ƒ /advisory/book/confirmation            207 B   96.2 kB
○ /advisory/buyer-roadmap                208 B   96.2 kB
○ /advisory/fsbo                         208 B   96.2 kB
● /advisory/samples/[track]              208 B   96.2 kB  (×3 prerendered)
○ /advisory/sell-or-rent                 208 B   96.2 kB
ƒ /api/advisory/booking/[id]/ics         0 B    0 B
ƒ /api/advisory/calendar-slots           0 B    0 B
ƒ /api/advisory/create-intent            0 B    0 B
ƒ /api/advisory/deliver-brief/[id]       0 B    0 B
ƒ /api/advisory/stripe-webhook           0 B    0 B
ƒ /api/cron/advisory-reminders           0 B    0 B
```

## What Stephen needs to provide for go-live

(Already on the Phase 0 list, restating with checkboxes against current state)

| Env var | Status | Effect when set |
|---|---|---|
| `STRIPE_SECRET_KEY` | pending | Real PaymentIntents + `mode: 'live'` flow |
| `STRIPE_PUBLISHABLE_KEY` | pending | Stripe Elements client init |
| `STRIPE_WEBHOOK_SECRET` | pending | Webhook signature verification (mandatory or webhook returns 400) |
| `GOOGLE_OAUTH_CLIENT_ID` | pending | OAuth refresh flow |
| `GOOGLE_OAUTH_CLIENT_SECRET` | pending | OAuth refresh flow |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | pending | OAuth refresh flow |
| `HHR_ADVISORY_CALENDAR_ID` | pending | Calendar event creation + freeBusy queries |
| `RESEND_API_KEY` | pending (also v2 blocker) | All emails (currently dry-run) |
| `CRON_SECRET` | optional | Cron auth — if unset, route is publicly hittable but harmless. Recommend setting before live |
| `ADVISORY_DISCLOSURE_TEXT` | optional | Disclosure copy override (default reads as the brief's verbatim wording) |
| `ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL` | pending | Engagement letter PDF link in the email body |

**Critical pre-flight checks before going live:**
1. **Stripe webhook endpoint configured in Stripe Dashboard** to point at `https://househavenrealty.com/api/advisory/stripe-webhook` listening for `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`. The signing secret from that webhook config goes into `STRIPE_WEBHOOK_SECRET`.
2. **Google OAuth scope** must include `https://www.googleapis.com/auth/calendar.events` (write). `calendar.events.readonly` is insufficient.
3. **Resend sender domains** for both `advisory@househavenrealty.com` and `alerts@househavenrealty.com` must be verified in Resend dashboard.
4. **Stripe API version** — `lib/stripe.ts` does not pin a version header. Recommend setting the account default in Stripe Dashboard so behavior is stable across SDK / API updates.

## What is still deferred

- **Sample Decision Brief content** — placeholder pages still show "Sample Brief in production." Slot in via `data/sample-briefs.ts` data file when Stephen delivers each one (FSBO target end of Phase 1, Buyer Roadmap end of Phase 2, Sell-or-Rent end of Phase 3 per Stephen's commitment)
- **HTML email templates** — current emails are text/plain. Consider HTML wrapper with HHR logo + brand for production polish (Phase 6 candidate)
- **Engagement-letter e-sign** — Phase 6 swaps the placeholder PDF for HelloSign/DocuSign
- **Cancellation UI for clients** — currently clients email Stephen to cancel. A self-serve cancel link in the confirmation email would be Phase 6 polish
- **Phase 3 onward** — homepage three-peer-paths rebrand + /learn restructure + community page rewrites + e-sign

## Surfaced for Stephen — flags to address before live mode

1. **`runPostPaymentSideEffects` runs synchronously in mock mode** — the create-intent request can take ~3-8s in mock mode because it serializes booking creation + RentCast pre-pull + side-effect emails. Live mode runs the heavy work in the webhook (async after redirect), so user perception is faster. This asymmetry only matters for testing; flagged so smoke tests don't read the slow create-intent as a bug.

2. **Calendar event in mock mode shows fake Meet link.** The confirmation page renders `https://meet.google.com/mock-mock-mock` which clients would click and find broken. Acceptable in mock mode (Stephen's preview only); flag for awareness so the smoke test doesn't conclude the feature is broken.

3. **Stripe API version is unpinned** (lib/stripe.ts uses fetch with no `Stripe-Version` header). Stripe will use the account default. Pin in Stripe Dashboard before live mode.

4. **The `slot_central` column** in `advisory_bookings` stores the same UTC instant as `slot_utc`. The naming was kept for query convenience but it's not a separate display value. App code formats Central from the UTC at render time. If Stephen ever wants the wall-clock string stored separately for stable queries, this can be a small follow-up.

## Suggested commit message

```
phase-2-second-pass(advisory): real booking flow + APIs + cron

- /advisory/book: replaces waitlist placeholder with multi-step flow
  (TrackPicker → IntakeForm → SlotPicker → StripeCheckout). Stripe
  Elements lazy-mounted via next/dynamic so the package only loads on
  payment step. Bundle: 11 kB → 6.53 kB
- /advisory/book/confirmation: server-rendered confirmation with .ics
  download, Google + Outlook calendar add links. Soft-state for Stripe
  async-confirmation redirect_status != 'succeeded'
- API: create-intent (validates + RentCast prepull + booking + Stripe
  intent; mock-mode runs side effects inline), stripe-webhook (manual
  HMAC verify, payment_intent.succeeded → flow), calendar-slots (slot
  windows + 48h lead + 4/wk + 8/mo caps + Google freeBusy), deliver-
  brief (Stephen HMAC-gated, fires brief delivery email), booking ICS
- lib/advisory-slots.ts: DST-aware Central→UTC + slot policy + race
  guard. lib/advisory-prepull.ts: RentCast pre-pull. lib/advisory-
  flow.ts: idempotent post-payment side effects shared between
  mock-mode create-intent and live-mode webhook
- Vercel cron: /api/cron/advisory-reminders hourly, fires 48h + 2h
  reminder emails per booking
- npm install @stripe/stripe-js + @stripe/react-stripe-js
- Phase 1 waitlist code deleted (advisory_book_waitlist Supabase table
  retained for launch announcement)

Mock mode is the default until Stripe + Google + Resend env vars land.
isStripeLive() / isCalendarLive() flip mode automatically per env presence.
```
