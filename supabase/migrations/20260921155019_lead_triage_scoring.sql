-- Triage for submissions that survive the spam guard.
--
-- The guard is binary and blocks only patterns with no observed false
-- positives. It cannot touch B2B pitches or offshore realtor bait, which are
-- well-formed prose. Those are scored instead, and the band decides whether
-- the submission is emailed normally, emailed flagged, or filed unread.
--
-- Replayed over all 156 historical rows, exactly three name a place in Middle
-- Tennessee, and they are exactly the three real clients. That signal is what
-- the score is mostly made of.

alter table public.leads
  add column if not exists lead_score     smallint,
  add column if not exists triage_band    text,
  add column if not exists triage_reasons text;

-- The agent queue lists unworked leads worth working, newest first.
create index if not exists leads_triage_idx
  on public.leads (triage_band, created_at desc);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='leads' and column_name='triage_band')
  then
    raise exception 'leads.triage_band was not created';
  end if;
  raise notice 'lead triage columns in place';
end $$;
