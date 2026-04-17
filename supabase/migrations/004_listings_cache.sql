-- Migration 004 — IDX listings cache for Realtracs MLS via MLS Grid
-- 15-minute TTL per spec §3.1. Apply via Supabase MCP.

CREATE TABLE IF NOT EXISTS public.listings_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mls_id text UNIQUE NOT NULL,
  status text,
  property_type text,
  list_price numeric,
  street_number text,
  street_name text,
  city text,
  state text DEFAULT 'TN',
  zip text,
  bedrooms integer,
  bathrooms numeric,
  square_feet integer,
  lot_size_sqft integer,
  year_built integer,
  list_date date,
  modification_timestamp timestamptz,
  primary_photo_url text,
  photos jsonb DEFAULT '[]'::jsonb,
  list_agent_full_name text,
  list_office_name text,
  public_remarks text,
  raw_data jsonb DEFAULT '{}'::jsonb,
  fetched_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listings_cache_status ON public.listings_cache (status);
CREATE INDEX IF NOT EXISTS idx_listings_cache_city ON public.listings_cache (city);
CREATE INDEX IF NOT EXISTS idx_listings_cache_zip ON public.listings_cache (zip);
CREATE INDEX IF NOT EXISTS idx_listings_cache_price ON public.listings_cache (list_price);
CREATE INDEX IF NOT EXISTS idx_listings_cache_modification ON public.listings_cache (modification_timestamp DESC);

ALTER TABLE public.listings_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.listings_cache FOR SELECT USING (true);
CREATE POLICY "Service role write" ON public.listings_cache FOR ALL USING (true) WITH CHECK (true);
