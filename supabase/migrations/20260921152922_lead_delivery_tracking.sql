-- Delivery tracking for the lead path.
--
-- 156 leads reached this table between April and September. None was ever
-- routed to HubSpot and none was ever marked anything but 'new', because only
-- two of the nine intake routes called the CRM at all and nothing recorded
-- whether the notification email left the building. A lead could be saved,
-- silently fail to notify anyone, and read as a success in every log.
--
--   notified_at   set only on a confirmed successful send
--   notify_error  set when a send was attempted and failed
--
-- Both null means no attempt was made, which is itself a defect worth seeing.

alter table public.leads
  add column if not exists notified_at  timestamptz,
  add column if not exists notify_error text;

-- cma_requests already stamps hubspot_contact_id but had nowhere to record
-- when the sync happened, so one canary query could not cover all three
-- intake tables. property_notify_requests already has this column.
alter table public.cma_requests
  add column if not exists synced_to_crm_at timestamptz;

-- The canary asks "has every lead from the last 24h reached the CRM?" on every
-- run. Without this it is a sequential scan of the whole table each time.
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

do $$
declare
  missing text;
begin
  select string_agg(c, ', ') into missing from (
    select 'leads.notified_at' as c where not exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name='leads' and column_name='notified_at')
    union all
    select 'leads.notify_error' where not exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name='leads' and column_name='notify_error')
    union all
    select 'cma_requests.synced_to_crm_at' where not exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name='cma_requests' and column_name='synced_to_crm_at')
  ) t;
  if missing is not null then
    raise exception 'migration did not take effect, missing: %', missing;
  end if;
  raise notice 'lead delivery tracking in place';
end $$;
