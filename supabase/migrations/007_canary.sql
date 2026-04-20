-- Migration 007 — canary monitoring. Two tables:
--   canary_runs   append-only audit log, one row per check per run
--   canary_state  current status per endpoint, for alert transitions + cooldown

CREATE TABLE IF NOT EXISTS public.canary_runs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at          timestamptz NOT NULL DEFAULT now(),
  endpoint        text NOT NULL,
  ok              boolean NOT NULL,
  http_status     integer,
  response_ms     integer,
  assertion       text,
  error_excerpt   text,
  commit_sha      text
);
CREATE INDEX IF NOT EXISTS idx_canary_runs_endpoint_at ON public.canary_runs (endpoint, run_at DESC);
CREATE INDEX IF NOT EXISTS idx_canary_runs_ok ON public.canary_runs (ok);

CREATE TABLE IF NOT EXISTS public.canary_state (
  endpoint          text PRIMARY KEY,
  current_ok        boolean NOT NULL,
  status_since      timestamptz NOT NULL DEFAULT now(),
  last_checked_at   timestamptz NOT NULL DEFAULT now(),
  last_alerted_at   timestamptz,
  last_error        text
);

ALTER TABLE public.canary_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canary_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access canary_runs"
  ON public.canary_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access canary_state"
  ON public.canary_state FOR ALL USING (true) WITH CHECK (true);
