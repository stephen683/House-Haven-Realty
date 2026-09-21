
-- Cached building permits from Nashville Socrata API
-- Decouples the permit map from live API availability
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

-- Indexes for map queries
CREATE INDEX IF NOT EXISTS idx_permits_date_issued ON public.building_permits (date_issued DESC);
CREATE INDEX IF NOT EXISTS idx_permits_zip ON public.building_permits (zip);
CREATE INDEX IF NOT EXISTS idx_permits_geo ON public.building_permits (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_permits_number ON public.building_permits (permit_number);

-- Enable RLS
ALTER TABLE public.building_permits ENABLE ROW LEVEL SECURITY;

-- Public read access (permits are public data)
CREATE POLICY "Public read access" ON public.building_permits
  FOR SELECT
  USING (true);

-- Service role write access
CREATE POLICY "Service role write access" ON public.building_permits
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.building_permits IS 'Cached Nashville building permits from Socrata open data API';
