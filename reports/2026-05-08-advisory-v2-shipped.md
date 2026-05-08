# Advisory v2 — fully shipped (Phases 7–11)

**Branch:** `claude/advisory-rebuild` (preview-only; never merges to `main` without Stephen's explicit greenlight)
**Migrations applied to remote:** 014, 015 (`eefqcgetyxdrvchkwhrq`)
**Final state:** type-check / lint / build all green; 172 routes; mock-mode flips live when env vars land

This is the consolidated diff against the Phase 0–6 build that lives at `reports/2026-05-06-advisory-build-complete.md`. If you only read one report, read this one.

---

## Why we did this rebuild

Phase 0–6 shipped the original three-track Advisory product as a peer-positioning bet: the homepage offered three paths (DIY tools / hire by the hour / hire as agent), and `/advisory` argued the structural case for each track separately (FSBO / Buyer Roadmap / Sell-or-Rent).

Stephen gated further Advisory scaling on whether **cold strangers from TikTok/Reels/Shorts convert**. The peer-positioning structure didn't fit that bar — too many decisions on the page, too much "which lane am I in" friction, no obvious entry point for someone who doesn't yet know HHR.

The pivot:
- **Brokerage is the headline.** Advisory is one service among four (buyer rep, seller rep, Advisory, Door Collectors property mgmt).
- **One Advisory page.** Reader self-identifies via three audience paragraphs; no track sub-pages.
- **Free 15-min discovery call** is the cold-traffic conversion mechanism. Paid Decision Brief is the secondary CTA for visitors who don't need the call first.
- **Brand stays locked.** Modulus typography, black/grey/white palette, existing logo. No accent colors introduced.

---

## What changed at the top, by phase

### Phase 7 — Foundation (no UX visible)
Track architecture stripped from the codebase. `ADVISORY_TRACKS`, `AdvisoryTrack`, `AdvisoryTrackSlug`, `getTrack` all gone from `lib/advisory-config.ts`. The `track` DB column stays put non-destructively (writes default `'general'`). Migration 014 added `booking_type` (`paid_brief` | `discovery_call`). Header collapsed to 5 primary nav items: Find Homes / Communities / Pipeline / Advisory / **About**. Three deleted routes: `/advisory/{fsbo,buyer-roadmap,sell-or-rent}` and the `/advisory/samples/[track]` SSG generator.

### Phase 8 — `/advisory` cold-traffic rewrite
Full rebuild. Sections in order: Hero (Candidate A: "Pay for the advice, not the transaction.") / Who-this-is-for (3 audience paragraphs) / What-you-get (Brief preview + sample placeholder) / Why-this-is-safe (6 cards led by money-back guarantee) / How-it-works (4 steps) / Recent client examples (placeholder) / Pricing / FAQ (13 questions) / Final CTA (primary discovery call, secondary Decision Brief). `/advisory/discovery-call` shipped as a styled placeholder routed to email Stephen + the paid Brief.

### Phase 9 — Discovery-call flow
Real `/advisory/discovery-call` flow. Slot picker (Mon/Wed/Fri 9–11 AM CT, 15-min slots, 6/wk cap, 48h lead), simpler intake (name/email/phone/situation/buying-or-selling/how-heard), Google Calendar event with Meet link, three Resend templates (confirm + 24h + 1h), DB write to `advisory_bookings` with `booking_type='discovery_call'`. Cron `advisory-reminders` extended to fire 4 windows (paid: 48h+2h, discovery: 24h+1h). `lib/advisory-slots.ts` refactored to take a `SlotConfig` so the same machinery serves both flows; cross-type conflicts use each booking's actual duration. Migration 015 added `reminder_24h_sent_at` and `reminder_1h_sent_at`. Stephen-only `convert-to-paid` admin endpoint stamps an audit note and emails the prospect a `/advisory/book` link.

### Phase 10 — Homepage rebuild
Brokerage-first layout. Hero (Candidate A: "A small Nashville brokerage. Five hundred clients in. Still picky about the next one.") with "Talk to Stephen" / "See homes for sale" CTAs. Stephen's story (text-only, longer than the prior `FromStephen`). Four service-line cards with equal weight: Buyer rep / Seller rep / HHR Advisory / Door Collectors. "What we built for Nashville" tools panel. Recent transactions placeholder. Testimonials and newsletter kept from the prior homepage.

### Phase 11 — Cleanup
Three orphan components deleted (`HonestFraming`, `WhyThisExists`, `SampleBanner` — all keyed off track sub-pages). Back-compat constants stripped from `lib/advisory-config.ts`. No dead code remaining.

---

## Routes (final state)

**Customer-facing**
- `/` — brokerage-first homepage
- `/advisory` — cold-traffic conversion page
- `/advisory/discovery-call` + `/advisory/discovery-call/confirmation` — free 15-min call flow
- `/advisory/book` + `/advisory/book/confirmation` — paid Decision Brief flow

**Admin (Stephen only, behind agent auth)**
- `/agents/advisory` — booking dashboard with paid/discovery/30d/revenue stats
- `/agents/advisory/[id]` — per-booking detail with type-specific actions (Deliver Brief for paid; Convert to Paid for discovery; Cancel for both)

**APIs**
- `POST /api/advisory/create-intent` — paid Brief: validates slot, creates booking, returns Stripe client secret (or mock-mode redirect)
- `POST /api/advisory/discovery-call` — discovery call: validates slot, creates booking, runs side effects inline
- `GET /api/advisory/calendar-slots?type=` — slot availability for paid_brief or discovery_call
- `GET /api/advisory/booking/[id]/ics` — calendar download
- `POST /api/advisory/stripe-webhook` — Stripe → side effects
- `POST /api/advisory/esign-webhook` — e-sign → status
- `POST /api/advisory/deliver-brief/[id]` — Stephen-only Brief delivery
- `POST /api/agents/advisory/[id]/cancel` — Stephen-only cancellation
- `POST /api/agents/advisory/[id]/convert-to-paid` — Stephen-only discovery → paid conversion
- `GET /api/cron/advisory-reminders` — 15-min cron, fires 4 reminder windows

---

## Mock-mode integration matrix (unchanged from Phase 0–6 pattern)

| Vendor | Required env vars | Mock behavior | Live trigger |
|---|---|---|---|
| Supabase | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | (always required — already set) | already live |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | mock checkout flips straight to confirmation; runs side effects inline | env vars present → real Stripe Elements + webhook |
| Google Calendar | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `HHR_ADVISORY_CALENDAR_ID` | freeBusy returns empty; events return mock IDs + mock Meet link | env vars present → real calendar |
| Resend | `RESEND_API_KEY` | dry-run logs to Vercel function output | env var present → real sends |
| RentCast | `RENTCAST_API_KEY` | pre-pull skipped | env var present → live AVM data on bookings with property addresses |
| E-sign | `ADVISORY_ESIGN_PROVIDER` + provider-specific keys | placeholder PDF email (Phase 2 fallback) | env vars present → real HelloSign/DocuSign |

No code changes needed for any of the above to flip live — same pattern as the original Phase 0–6 build. See `reports/2026-05-06-advisory-build-complete.md` for the original integration architecture (still accurate).

---

## What Stephen still owes (placeholder content shipped)

Each of these has a placeholder shipped today; swapping in real content is a data-file edit, not a code change.

- **Hero pick on `/advisory`** — default Candidate A; alternates B, C in `reports/2026-05-08-advisory-hero-candidates.md`.
- **Hero pick on `/`** — default Candidate A; alternates B, C in `reports/2026-05-08-homepage-hero-candidates.md`.
- **Primary CTA on `/`** — default "Talk to Stephen"; alternate "See homes for sale" in same report.
- **Recent client examples on `/advisory`** — 3 placeholder paragraphs in `components/advisory/RecentExamples.tsx`, flagged "anonymized · representative · published cases coming."
- **Recent transactions on `/`** — 3 placeholder cards in `components/homepage/RecentTransactions.tsx`, same flag.
- **Sample Brief on `/advisory`** — placeholder card in `components/advisory/SamplePreview.tsx`. When Stephen finishes a real anonymized sample document, swap in the link.
- **Stephen photo (Nashville location)** — typography-only on `/` and `/advisory` until the shoot lands; data-file slot ready.

---

## Open decisions still pending Stephen

- **Discovery-call route name** — defaulted to `/advisory/discovery-call`. If Stephen prefers `/advisory/intro-call`, it's a one-line rename + footer + sitemap + page-CTA update. Tracked in memory.

---

## Diff vs Phase 0–6 (consolidated summary)

| Concern | Before (Phase 0–6) | After (Phase 7–11) |
|---|---|---|
| Homepage frame | "Three paths" peer positioning | Brokerage-first; Advisory is one of four service lines |
| `/advisory` page | Track-explainer plus three sample preview cards | Cold-traffic conversion target; 9 sections |
| Track sub-pages | `/advisory/fsbo`, `/advisory/buyer-roadmap`, `/advisory/sell-or-rent` + `/advisory/samples/[track]` | Deleted. One universal page. |
| Booking flow | Track picker → intake (track-conditional fields) → slot → payment | Intake (universal freeform) → slot → payment |
| Conversion mechanism | Direct $200 purchase only | Free 15-min discovery call → optional convert to paid Brief |
| Slot system | Static globals (Tue/Thu, 60-min, 4/wk, 8/mo) | `SlotConfig`-driven; paid + discovery configs; cross-type conflict detection |
| Reminders | 48h, 2h (paid only) | 48h, 24h, 2h, 1h (per-type) |
| Header primary nav | Find Homes / Communities / Pipeline / Advisory / Home Value | Find Homes / Communities / Pipeline / Advisory / About |
| Footer Advisory section | 5 entries (3 deleted track pages) | 3 entries (Advisory, discovery call, book) |
| DB columns added | (Phase 6: e-sign columns) | `booking_type`, `reminder_24h_sent_at`, `reminder_1h_sent_at` |
| Compliance footer | unchanged | unchanged |

---

## Verification

- `npm run type-check` — clean
- `npm run lint` — no warnings/errors
- `npm run build` — green; 172 routes
- Migrations 014, 015 listed in remote project after apply
- All 5 Phase reports (7, 8, 9, 10, 11) committed under `reports/2026-05-08-*`

Branch is preview-only. When Stephen greenlights, the merge to `main` is straightforward — no schema migration required beyond what's already applied.
