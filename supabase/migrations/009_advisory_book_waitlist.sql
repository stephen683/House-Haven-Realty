-- Migration: Advisory book waitlist
-- Phase 1 captures intent-to-book before the booking flow ships in Phase 2.
-- On Phase 2 launch, blast launch announcement to this list via Resend.
-- Applied: 2026-05-06

CREATE TABLE IF NOT EXISTS public.advisory_book_waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  email text NOT NULL,
  track text,
  source text,
  tcpa_consent boolean DEFAULT false NOT NULL,
  tcpa_consent_at timestamptz,
  page_url text,
  notified_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_advisory_waitlist_email
  ON public.advisory_book_waitlist (lower(email));
CREATE INDEX IF NOT EXISTS idx_advisory_waitlist_created
  ON public.advisory_book_waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_advisory_waitlist_track
  ON public.advisory_book_waitlist (track);

ALTER TABLE public.advisory_book_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.advisory_book_waitlist
  FOR ALL USING (true) WITH CHECK (true);
