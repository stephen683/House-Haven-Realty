# Phase 6 — E-sign abstraction + Stephen admin view

**Date:** 2026-05-06
**Phase:** 6 of 6 (final phase of the autonomous Advisory build)
**Status:** Shipped. Stephen admin lives at `/agents/advisory` (HMAC-gated, reuses /agents auth). E-sign abstraction supports HelloSign and DocuSign; falls back to placeholder PDF email until Stephen picks a vendor.

---

## What changed

### Migration 013 — `advisory_bookings` e-sign columns

Applied to Supabase. Three nullable columns:

- `esign_provider` text — `'hellosign' | 'docusign' | null` (CHECK constraint)
- `esign_signature_request_id` text — vendor's request/envelope ID
- `esign_send_failed_reason` text — diagnostic when send falls back

Plus a partial index on `esign_signature_request_id WHERE NOT NULL` for webhook lookups.

### `lib/esign.ts` — vendor-agnostic abstraction

Single entry point: `sendEngagementLetterForSignature({ bookingId, clientName, clientEmail, trackName, templateRef })`. Routing by `process.env.ESIGN_VENDOR`:

- `ESIGN_VENDOR=hellosign` + `HELLOSIGN_API_KEY` set → HelloSign `signature_request/send` (file URL flow). Optional `HELLOSIGN_TEST_MODE=true` for sandbox.
- `ESIGN_VENDOR=docusign` + `DOCUSIGN_API_KEY` + `DOCUSIGN_ACCOUNT_ID` + `DOCUSIGN_TEMPLATE_ID` set → DocuSign envelopes API with templateRoles. Optional `DOCUSIGN_BASE_URL` override (default `https://na3.docusign.net/restapi`).
- Neither set → returns `{ source: 'fallback', signatureRequestId: null }`. Booking flow continues to send the placeholder PDF email via `sendEngagementLetter` in `lib/advisory-emails.ts`.

Webhook event parsers exposed: `parseHelloSignEvent`, `parseDocuSignEvent`. Both return a normalized `{ bookingId, signatureRequestId, vendor }` shape or null.

### `app/api/advisory/esign-webhook/route.ts`

Single endpoint accepts callbacks from both vendors. Tries HelloSign parse first (event_type `signature_request_all_signed`), falls back to DocuSign parse (event `envelope-completed` with `envelopeSummary.status === 'completed'`). On match, updates the booking:

```
engagement_letter_status = 'signed'
engagement_letter_signed_at = now()
```

Idempotent: re-firing on an already-signed booking returns `{ ok: true, alreadySigned: true }`.

Stephen wires the webhook URL into the vendor's dashboard once activated:
- HelloSign: Settings → API → Event callbacks → `https://househavenrealty.com/api/advisory/esign-webhook`
- DocuSign: Connect → Add Configuration → Same URL, JSON format, send only `envelope-completed` events

### `lib/advisory-flow.ts` — e-sign send wired into post-payment

After the existing engagement-letter email, the flow now also calls `sendEngagementLetterForSignature`. If the call returns a real signature request ID, the booking's `esign_provider` and `esign_signature_request_id` get populated and the webhook will flip `engagement_letter_status` to `signed` once the client signs. If it returns fallback, no change — the placeholder PDF email path (which already shipped in Phase 2) remains the canonical engagement-letter delivery.

The send only happens when `ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL` is set (no template URL = nothing to send).

### `lib/advisory-bookings.ts` extended

`AdvisoryBookingRow` now exposes `esign_provider`, `esign_signature_request_id`, `esign_send_failed_reason`. `UpdateBookingInput` adds the corresponding setters. `toDb` translates them to snake_case columns.

### `/agents/advisory` admin view (HMAC-gated, server components)

New routes:

| Route | Purpose |
|---|---|
| `/agents/advisory` | Booking list. Stats: bookings count + revenue + per-track breakdown. Two tables: upcoming consults (next 30 days, payment_status=succeeded), recent bookings (last 30 days, all statuses) |
| `/agents/advisory/[id]` | Per-booking detail. Status sidebar (payment / brief / engagement letter / canceled), contact card, calendar card with Meet link, Stripe IDs, e-sign IDs, full intake JSON, RentCast prepull JSON, admin notes |

Both pages reuse the existing `/agents` HMAC auth (`isAgentAuthed`) — the same shared password that gates `/agents/contract`. New `<AgentNav>` component links Stephen between contract submission and advisory bookings on every portal page. Old `/agents` page now renders a chooser after auth instead of immediately redirecting to `/agents/contract`.

### Admin actions

`/agents/advisory/[id]` ships two action forms:

1. **Deliver Decision Brief** — paste a Brief PDF URL. Posts to existing `/api/advisory/deliver-brief/[id]` (already HMAC-gated from Phase 2 second pass). Sets `brief_status = delivered`, fires the delivery email via `sendBriefDelivery`. Idempotent re-send works (the form re-labels as "Re-send Brief email" if already delivered).

2. **Cancel booking** — confirm-button pattern (first click sets `confirming`, second click submits). Posts to new `/api/agents/advisory/[id]/cancel`:
   - Sets `canceled_at` + `cancellation_reason`
   - Deletes Calendar event (best-effort; ignores 410 already-gone)
   - Sends cancellation email to client with the reason
   - Stripe refund **NOT automated** — Stephen handles via Stripe Dashboard (per the brief's refund policy: full refund 24h+ before, none inside 24h, exceptional cases by email)

Cancellation form copy spells this out so Stephen does not skip the Stripe step.

### `/agents/page.tsx` updated

After-auth redirect to `/agents/contract` replaced by an in-page chooser with two cards (Contracts + Advisory). Stephen lands on the chooser, picks a tool, navigates via `<AgentNav>` between them. `robots: { index: false }` on every `/agents/*` page (was missing on a couple — fixed).

## Brand tokens

Existing only — no new tokens. Admin uses light surface backgrounds (`bg-househaven-surface`) and white cards with `border-black/10` for an internal-tool look that's clearly distinct from the public site's heavier section alternation.

Status badges use Tailwind palette grays/greens/ambers/reds — these are functional UI signals, not brand colors. Acceptable per the brand kit (functional supporting tones are explicitly allowed for status indicators).

## What's live in production right now

- ✅ The full booking flow (Phase 2) continues to work as before — Phase 6 doesn't change client-facing behavior in fallback mode
- ✅ Stephen can sign in at `/agents`, click Advisory bookings, see all current bookings, drill into any one, deliver a Brief, or cancel
- ✅ Webhook endpoint is live and silently ignores non-matching payloads — safe to leave running

## What activates when Stephen sets env vars

| Env var | Effect when set |
|---|---|
| `ESIGN_VENDOR=hellosign` + `HELLOSIGN_API_KEY` | Engagement letter sent via HelloSign signature request. Webhook flips `engagement_letter_status` to `signed` on completion |
| `ESIGN_VENDOR=docusign` + `DOCUSIGN_API_KEY` + `DOCUSIGN_ACCOUNT_ID` + `DOCUSIGN_TEMPLATE_ID` | Same but via DocuSign Connect / envelopes |
| `HELLOSIGN_TEST_MODE=true` | HelloSign sandbox (no real signing) — useful while configuring |
| `DOCUSIGN_BASE_URL=...` | Override the assumed `na3.docusign.net` if Stephen's DocuSign account is on a different shard |
| `ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL` | Required for either vendor — without a template URL/file ref, the send is skipped |

The placeholder PDF email path stays alive even after a vendor activates — the e-sign send is additive, not replacement, until Stephen explicitly removes the placeholder email call. This is intentional: a client gets both the email and the signature request, so the engagement letter content is unambiguous either way.

## Validation

```
npx tsc --noEmit              # clean
npx next lint                 # ✔ No ESLint warnings or errors
npx next build                # 175 routes total (Phase 0–6 cumulative), all green
```

New routes:
```
ƒ /agents/advisory              211 B    96.2 kB
ƒ /agents/advisory/[id]         1.54 kB  97.5 kB
ƒ /api/advisory/esign-webhook   0 B      0 B
ƒ /api/agents/advisory/[id]/cancel  0 B  0 B
```

Migration 013 applied to Supabase project `eefqcgetyxdrvchkwhrq`.

## What's left (Phase 6 follow-ups, not blockers)

1. **Vendor pick** — Stephen chooses HelloSign or DocuSign, sets the env vars. Until then, e-sign is dormant; placeholder PDF email continues to do the job.
2. **Stripe refund automation** — currently Stephen handles refunds in the Stripe Dashboard manually. A future polish would auto-issue refunds via `POST /v1/refunds` from the cancel endpoint when the cancel time is more than 24 hours before the slot. Out of scope for Phase 6.
3. **Admin notes editing** — current `/agents/advisory/[id]` shows admin_notes if present but no inline editor. A small follow-up adds a textarea + save endpoint.
4. **Bulk operations** — listing view doesn't have bulk actions (mark multiple delivered, etc.). Steady-state Advisory volume is single-digit per week, so per-booking actions are sufficient.

## Phase 6 closes the autonomous Advisory build

All six phases of the strategic Advisory rebuild are now shipped:

| Phase | Focus | Status |
|---|---|---|
| 0 | Foundations: /value consolidation, v2.1 amendment | ✅ Shipped |
| 1 | /advisory argument surface + waitlist | ✅ Shipped |
| 1.5 | Supabase cleanup (migrations 003+004 applied, valuation_requests dropped) | ✅ Shipped |
| 1.5b | spatial_ref_sys RLS migration file | ⚠️ Manual apply pending Stephen |
| 2 (scaffolding) | bookings schema + 4 lib wrappers | ✅ Shipped |
| 2 (second pass) | full booking flow (BookingClient + APIs + cron) | ✅ Shipped |
| 3 | homepage rebrand to three peer paths | ✅ Shipped |
| 4 | /blog → /learn with category × stage taxonomy | ✅ Shipped |
| 5 | RentCast + Pipeline cross-links across community pages, listings, per-ZIP Pipeline | ✅ Shipped |
| 6 | E-sign abstraction + Stephen admin view | ✅ Shipped |

Stephen's pending items (none block the launch):
- Stephen-Nashville hero photo (slots in via `lib/homepage-config.ts` data change)
- Top-10 Tier-1 communities list (set `tier: 1` in data/communities.ts)
- Greatest Hits curation 8–12 entries (edit `GREATEST_HITS` in lib/learn-taxonomy.ts)
- FSBO topic list for /learn (add entries to data/learn.ts + LEARN_TAXONOMY)
- Sample Decision Briefs × 3 tracks (flip status to `published` + add bottomLine in data/sample-briefs.ts)
- Vendor pick (Stripe live keys, Google OAuth, Resend domain, e-sign vendor)
- Apply migration 011 via Supabase Dashboard SQL Editor

## Suggested commit message

```
phase-6(advisory): e-sign abstraction + Stephen admin view

- Migration 013: advisory_bookings.esign_provider, _signature_request_id,
  _send_failed_reason. Applied to Supabase
- lib/esign.ts: vendor-agnostic sendEngagementLetterForSignature() with
  HelloSign + DocuSign fetch implementations + parseHelloSignEvent /
  parseDocuSignEvent webhook parsers. Falls back when neither vendor
  configured (placeholder PDF email path remains canonical)
- /api/advisory/esign-webhook: single endpoint handles both vendors,
  flips engagement_letter_status to 'signed' on completion. Idempotent
- lib/advisory-flow.ts: post-payment side effects now also attempt
  e-sign send; stores signature_request_id on booking when live
- /agents/advisory list view: stats + upcoming/recent tables
- /agents/advisory/[id] detail view: status sidebar, intake JSON,
  RentCast prepull, deliver-Brief form, cancel-booking form
- /api/agents/advisory/[id]/cancel: HMAC-gated, sets canceled_at,
  deletes Calendar event, emails client. Stripe refund stays manual
- AgentNav component links contract + advisory in /agents/* pages
- /agents auth chooser replaces blanket redirect to /agents/contract
- robots: noindex on every /agents/* page

Activates when Stephen sets ESIGN_VENDOR + vendor API keys; placeholder
PDF flow remains the fallback until then.
```
