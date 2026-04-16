-- Migration: Unified leads table + building permits cache
-- Applied: 2026-04-16 via Supabase MCP

-- Unified lead capture table for all House Haven Realty forms
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  source text NOT NULL DEFAULT 'website',
  form_type text NOT NULL,
  page_url text,
  form_data jsonb DEFAULT '{}'::jsonb,
  interest text,
  message text,
  timeline text,
  property_address text,
  tcpa_consent boolean DEFAULT false NOT NULL,
  tcpa_consent_at timestamptz,
  status text DEFAULT 'new' NOT NULL,
  assigned_agent text,
  notes text,
  hubspot_contact_id text,
  synced_to_crm_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_form_type ON public.leads (form_type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Cached building permits from Nashville Socrata API
CREATE TABLE IF NOT EXISTS public.building_permits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_number text UNIQUE NOT NULL,
  permit_type text,
  date_issued timestamptz,
  address text,
  city text DEFAULT 'Nashville',
  zip text,
  description text,
  construction_cost numeric,
  contractor text,
  status text,
  lat double precision,
  lng double precision,
  raw_data jsonb DEFAULT '{}'::jsonb,
  fetched_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_permits_date_issued ON public.building_permits (date_issued DESC);
CREATE INDEX IF NOT EXISTS idx_permits_zip ON public.building_permits (zip);
CREATE INDEX IF NOT EXISTS idx_permits_geo ON public.building_permits (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_permits_number ON public.building_permits (permit_number);

ALTER TABLE public.building_permits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.building_permits FOR SELECT USING (true);
CREATE POLICY "Service role write access" ON public.building_permits FOR ALL USING (true) WITH CHECK (true);
