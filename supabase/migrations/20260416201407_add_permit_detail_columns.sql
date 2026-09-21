
-- Add enriched property detail columns to building_permits
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS subtype text;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS sqft integer;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS bedrooms integer;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS bathrooms numeric;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS parcel text;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS subdivision text;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS council_district integer;
ALTER TABLE public.building_permits ADD COLUMN IF NOT EXISTS census_tract numeric;

-- Index for property type filtering
CREATE INDEX IF NOT EXISTS idx_permits_property_type ON public.building_permits (property_type);
CREATE INDEX IF NOT EXISTS idx_permits_bedrooms ON public.building_permits (bedrooms) WHERE bedrooms IS NOT NULL;
