-- Migration 006 — property_notify_requests: per-property "notify me when this
-- lists" leads from the pipeline detail panel. Apply via Supabase MCP.

CREATE TABLE IF NOT EXISTS public.property_notify_requests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  email                 text NOT NULL,
  permit_number         text NOT NULL,
  address               text,
  zip                   text,
  tcpa_consent          boolean NOT NULL,
  tcpa_consent_at       timestamptz NOT NULL DEFAULT now(),
  hubspot_contact_id    text,
  synced_to_crm_at      timestamptz,
  notified_at           timestamptz
);

CREATE INDEX IF NOT EXISTS idx_property_notify_permit ON public.property_notify_requests (permit_number);
CREATE INDEX IF NOT EXISTS idx_property_notify_email ON public.property_notify_requests (email);

ALTER TABLE public.property_notify_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role writes property_notify_requests"
  ON public.property_notify_requests FOR ALL
  USING (true)
  WITH CHECK (true);
