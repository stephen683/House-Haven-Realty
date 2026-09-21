ALTER TABLE public.advisory_bookings
  ADD COLUMN IF NOT EXISTS booking_type text NOT NULL DEFAULT 'paid_brief'
    CHECK (booking_type IN ('paid_brief', 'discovery_call'));

CREATE INDEX IF NOT EXISTS idx_advisory_bookings_booking_type
  ON public.advisory_bookings (booking_type);
