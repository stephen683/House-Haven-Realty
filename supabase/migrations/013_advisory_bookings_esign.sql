-- Migration 013 (Phase 6) — e-sign columns on advisory_bookings
--
-- Phase 6 introduces a vendor-agnostic e-sign abstraction (HelloSign or
-- DocuSign). Until Stephen picks a vendor and sets env vars, behavior
-- falls back to the placeholder PDF flow shipped in Phase 2 — these
-- columns stay null and the existing engagement_letter_status flow keeps
-- working.
--
-- Apply via Supabase MCP. Idempotent.
-- Applied: 2026-05-06

ALTER TABLE public.advisory_bookings
  ADD COLUMN IF NOT EXISTS esign_provider text
    CHECK (esign_provider IS NULL OR esign_provider IN ('hellosign', 'docusign')),
  ADD COLUMN IF NOT EXISTS esign_signature_request_id text,
  ADD COLUMN IF NOT EXISTS esign_send_failed_reason text;

CREATE INDEX IF NOT EXISTS idx_advisory_bookings_esign_request
  ON public.advisory_bookings (esign_signature_request_id)
  WHERE esign_signature_request_id IS NOT NULL;
