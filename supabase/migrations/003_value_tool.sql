-- Migration 003 — House Haven Value tool: AVM cache + CMA request log
-- Apply via Supabase MCP. Targets project eefqcgetyxdrvchkwhrq.

-- 30-day TTL cache for RentCast AVM responses keyed on normalized address.
CREATE TABLE IF NOT EXISTS public.valuation_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  address_normalized text UNIQUE NOT NULL,
  latitude double precision,
  longitude double precision,
  estimate_low numeric,
  estimate_mid numeric,
  estimate_high numeric,
  comps jsonb DEFAULT '[]'::jsonb,
  confidence_note text,
  fetched_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_valuation_cache_address ON public.valuation_cache (address_normalized);
CREATE INDEX IF NOT EXISTS idx_valuation_cache_fetched ON public.valuation_cache (fetched_at DESC);

ALTER TABLE public.valuation_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.valuation_cache FOR ALL USING (true) WITH CHECK (true);

-- CMA request log — every form submission lands here (source of truth on HubSpot failure).
CREATE TABLE IF NOT EXISTS public.cma_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  estimated_value_low numeric,
  estimated_value_mid numeric,
  estimated_value_high numeric,
  timeline text,
  tcpa_consent boolean DEFAULT false NOT NULL,
  tcpa_consent_at timestamptz,
  page_url text,
  hubspot_contact_id text,
  notified_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_cma_requests_created_at ON public.cma_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cma_requests_email ON public.cma_requests (email);

ALTER TABLE public.cma_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.cma_requests FOR ALL USING (true) WITH CHECK (true);
