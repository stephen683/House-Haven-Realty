CREATE POLICY "Service role full access permit_stages"
  ON public.permit_stages FOR ALL
  USING (true)
  WITH CHECK (true);
