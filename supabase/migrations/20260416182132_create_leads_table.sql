
-- Unified lead capture table for all House Haven Realty forms
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,

  -- Contact info
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,

  -- Lead source and context
  source text NOT NULL DEFAULT 'website',
  -- e.g. 'contact', 'valuation', 'newsletter', 'permit_alert', 'community:joelton'
  form_type text NOT NULL,
  page_url text,

  -- Form-specific data (flexible JSON for different form types)
  form_data jsonb DEFAULT '{}'::jsonb,

  -- Interest / intent
  interest text,
  -- e.g. 'buying', 'selling', 'investing', 'renting', 'general'
  message text,
  timeline text,

  -- Address (for valuation requests)
  property_address text,

  -- TCPA consent
  tcpa_consent boolean DEFAULT false NOT NULL,
  tcpa_consent_at timestamptz,

  -- Processing status
  status text DEFAULT 'new' NOT NULL,
  -- 'new', 'contacted', 'qualified', 'closed'
  assigned_agent text,
  notes text,

  -- CRM sync
  hubspot_contact_id text,
  synced_to_crm_at timestamptz
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_form_type ON public.leads (form_type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON public.leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add a comment for documentation
COMMENT ON TABLE public.leads IS 'Unified lead capture from all House Haven Realty website forms';
