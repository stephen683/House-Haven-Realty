-- Migration: Agent contract submissions (private agent portal)
-- Applied: 2026-04-29

CREATE TABLE IF NOT EXISTS public.contract_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  agent_name text NOT NULL,
  agent_email text NOT NULL,
  side text NOT NULL,
  property_address text NOT NULL,
  mls_id text,
  buyer_names text,
  seller_names text,
  contract_price numeric NOT NULL,
  earnest_money numeric,
  binding_date date NOT NULL,
  close_date date NOT NULL,
  commission_type text NOT NULL,
  commission_value numeric NOT NULL,
  our_split text,
  title_company text,
  lender text,
  inspection_deadline date,
  financing_deadline date,
  appraisal_deadline date,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contract_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_close_date ON public.contract_submissions (close_date);
CREATE INDEX IF NOT EXISTS idx_contracts_agent_email ON public.contract_submissions (agent_email);

ALTER TABLE public.contract_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.contract_submissions FOR ALL USING (true) WITH CHECK (true);
