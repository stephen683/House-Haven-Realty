-- Migration 014 (Phase 7) — booking_type on advisory_bookings
--
-- Phase 7 of the v2 pivot folds the three Advisory tracks (FSBO /
-- Buyer Roadmap / Sell-or-Rent) into one universal Decision Brief and
-- introduces a free 15-minute discovery call as the cold-traffic
-- conversion mechanism. Both flows write the same advisory_bookings
-- row; this column distinguishes which one.
--
-- The legacy `track` column stays put non-destructively — older rows
-- keep their values and new rows write 'general'. Phase 11 cleanup
-- will revisit whether to drop it.
--
-- Apply via Supabase MCP. Idempotent.
-- Target: 2026-05-08

ALTER TABLE public.advisory_bookings
  ADD COLUMN IF NOT EXISTS booking_type text NOT NULL DEFAULT 'paid_brief'
    CHECK (booking_type IN ('paid_brief', 'discovery_call'));

CREATE INDEX IF NOT EXISTS idx_advisory_bookings_booking_type
  ON public.advisory_bookings (booking_type);
