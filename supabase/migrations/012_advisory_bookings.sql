-- Migration 012 (Phase 2 scaffolding) — advisory_bookings
--
-- The system of record for paid HHR Advisory Decision Brief bookings.
-- One row per consult, written first when intake submits + Stripe intent is
-- created (status pending), updated through the lifecycle: payment succeeded
-- → calendar event created → engagement letter sent → reminders sent →
-- consult happens → Brief drafted → Brief delivered.
--
-- Apply via Supabase MCP. Idempotent (IF NOT EXISTS).
-- Applied: 2026-05-06

CREATE TABLE IF NOT EXISTS public.advisory_bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  -- Track + client identity
  track text NOT NULL CHECK (track IN ('fsbo', 'buyer-roadmap', 'sell-or-rent')),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,

  -- Intake responses (track-specific JSON shape) + RentCast pre-pull for FSBO/Sell-or-Rent
  intake_responses jsonb DEFAULT '{}'::jsonb NOT NULL,
  rentcast_prepull jsonb,

  -- Payment
  amount_cents integer NOT NULL DEFAULT 20000,
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id text UNIQUE,
  stripe_charge_id text,

  -- Calendar slot + Google Calendar event
  slot_utc timestamptz,
  slot_central timestamptz,
  google_calendar_event_id text,
  meet_link text,

  -- Engagement letter (Phase 2: placeholder PDF; Phase 6: e-sign vendor)
  engagement_letter_status text NOT NULL DEFAULT 'not_required'
    CHECK (engagement_letter_status IN ('not_sent', 'sent', 'signed', 'not_required')),
  engagement_letter_sent_at timestamptz,
  engagement_letter_signed_at timestamptz,

  -- Decision Brief lifecycle
  brief_status text NOT NULL DEFAULT 'not_started'
    CHECK (brief_status IN ('not_started', 'drafted', 'delivered')),
  brief_delivered_at timestamptz,

  -- Reminder tracking (cron writes timestamps so we never double-fire)
  reminder_48h_sent_at timestamptz,
  reminder_2h_sent_at timestamptz,

  -- Cancellation + admin
  canceled_at timestamptz,
  cancellation_reason text,
  admin_notes text
);

CREATE INDEX IF NOT EXISTS idx_advisory_bookings_email
  ON public.advisory_bookings (lower(client_email));
CREATE INDEX IF NOT EXISTS idx_advisory_bookings_slot_utc
  ON public.advisory_bookings (slot_utc);
CREATE INDEX IF NOT EXISTS idx_advisory_bookings_payment_status
  ON public.advisory_bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_advisory_bookings_track
  ON public.advisory_bookings (track);
CREATE INDEX IF NOT EXISTS idx_advisory_bookings_created
  ON public.advisory_bookings (created_at DESC);

ALTER TABLE public.advisory_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON public.advisory_bookings;
CREATE POLICY "Service role full access" ON public.advisory_bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS advisory_bookings_set_updated_at ON public.advisory_bookings;
CREATE TRIGGER advisory_bookings_set_updated_at
  BEFORE UPDATE ON public.advisory_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
