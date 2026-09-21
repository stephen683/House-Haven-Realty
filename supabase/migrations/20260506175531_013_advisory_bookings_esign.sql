ALTER TABLE public.advisory_bookings
  ADD COLUMN IF NOT EXISTS esign_provider text
    CHECK (esign_provider IS NULL OR esign_provider IN ('hellosign', 'docusign')),
  ADD COLUMN IF NOT EXISTS esign_signature_request_id text,
  ADD COLUMN IF NOT EXISTS esign_send_failed_reason text;

CREATE INDEX IF NOT EXISTS idx_advisory_bookings_esign_request
  ON public.advisory_bookings (esign_signature_request_id)
  WHERE esign_signature_request_id IS NOT NULL;
