-- Migration 005 — permit_stages: cached ePermits inspection data per permit,
-- plus Stephen-ground-truth overrides. Apply via Supabase MCP.

CREATE TABLE IF NOT EXISTS public.permit_stages (
  permit_number         text PRIMARY KEY,
  case_id               bigint,
  status_code           text,
  current_stage         text NOT NULL,
  stages_json           jsonb NOT NULL,
  tasks_json            jsonb NOT NULL,
  unmapped_codes        text[] DEFAULT '{}',
  fetched_at            timestamptz NOT NULL DEFAULT now(),
  source                text NOT NULL DEFAULT 'epermits',
  fetch_error           text,
  -- Manual override: written via Supabase Studio in v1 (no write UI yet).
  -- Always wins as effectiveStage in the panel; auto stepper still renders.
  override_stage        text,
  override_note         text,
  override_confidence   text CHECK (override_confidence IN ('drove_by','photo','builder_confirmed')),
  override_by_email     text,
  override_at           timestamptz,
  override_expires_at   timestamptz
);

CREATE INDEX IF NOT EXISTS idx_permit_stages_current ON public.permit_stages (current_stage);
CREATE INDEX IF NOT EXISTS idx_permit_stages_fetched ON public.permit_stages (fetched_at);

ALTER TABLE public.permit_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read permit_stages"
  ON public.permit_stages FOR SELECT
  USING (true);

CREATE POLICY "Service role full access permit_stages"
  ON public.permit_stages FOR ALL
  USING (true)
  WITH CHECK (true);
