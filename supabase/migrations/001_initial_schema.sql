-- House Haven Realty — Initial Schema
-- Run via: supabase db push

-- Enable PostGIS for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  headshot_url TEXT,
  bio TEXT,
  license_number TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  county TEXT NOT NULL,
  state TEXT DEFAULT 'TN',
  description TEXT,
  highlights TEXT[],
  median_home_price INTEGER,
  avg_days_on_market INTEGER,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  location GEOMETRY(Point, 4326),
  hero_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Valuation requests (lead capture)
CREATE TABLE valuation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'TN',
  zip TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  timeline TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author_id UUID REFERENCES agents(id),
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read for agents, communities, published blog posts
CREATE POLICY "agents_public_read" ON agents FOR SELECT USING (is_active = true);
CREATE POLICY "communities_public_read" ON communities FOR SELECT USING (true);
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (is_published = true);

-- Inserts for lead capture (anyone can submit)
CREATE POLICY "valuation_requests_insert" ON valuation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_submissions_insert" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Service role has full access
CREATE POLICY "agents_service_full" ON agents USING (auth.role() = 'service_role');
CREATE POLICY "communities_service_full" ON communities USING (auth.role() = 'service_role');
CREATE POLICY "valuation_service_full" ON valuation_requests USING (auth.role() = 'service_role');
CREATE POLICY "contact_service_full" ON contact_submissions USING (auth.role() = 'service_role');
CREATE POLICY "blog_service_full" ON blog_posts USING (auth.role() = 'service_role');
