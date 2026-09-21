-- The agent queue.
--
-- All 156 leads sat at status 'new' for five months, which means the status
-- column was decoration: nothing set it and nobody read it. A queue needs to
-- know when a lead last moved, not just where it is, so "sitting untouched for
-- eight weeks" is answerable.

alter table public.leads
  add column if not exists status_changed_at timestamptz;

-- Existing rows have never moved; created_at is the honest answer for how long
-- they have been sitting.
update public.leads
   set status_changed_at = created_at
 where status_changed_at is null;

-- The queue's default view: unworked leads, best first.
create index if not exists leads_status_idx
  on public.leads (status, lead_score desc nulls last, created_at desc);

do $$
declare unmoved int;
begin
  select count(*) into unmoved from public.leads where status_changed_at is null;
  if unmoved > 0 then
    raise exception 'status_changed_at left null on % row(s)', unmoved;
  end if;
  raise notice 'lead queue workflow columns in place';
end $$;
