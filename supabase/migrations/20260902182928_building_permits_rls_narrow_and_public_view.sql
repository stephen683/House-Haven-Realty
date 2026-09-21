-- The anon key shipped in the browser bundle could read every column of
-- building_permits (parcel, full address, coordinates) AND, through a policy
-- misnamed "Service role write access" but granted to public, insert, update
-- and delete rows. Browser reads move to a redacted view; the table itself
-- becomes service-role only. The service role bypasses RLS, so the cron,
-- search, suggest, geojson and canary paths are unaffected.

-- 1. Redacted public view. Street-only address: same two-step rule as
--    streetOnly() in lib/permit-search.ts (house number, then a lone unit
--    letter before a letter). Parity is pinned by tests/street-parity.test.ts
--    over 200 real addresses.
create or replace view public.building_permits_public
with (security_invoker = false) as
select
  permit_number,
  permit_type,
  subtype,
  date_issued,
  btrim(regexp_replace(
    regexp_replace(btrim(address), '^\d+\s*([-/]\s*\d+)?\s*', ''),
    '^[A-Za-z]\s+([A-Za-z])', '\1')) as street,
  city,
  zip,
  construction_cost,
  contractor,
  contractor_key,
  status,
  sqft,
  bedrooms,
  bathrooms,
  property_type,
  unit_count,
  updated_at
from public.building_permits;

grant select on public.building_permits_public to anon, authenticated;

-- 2. Close the table to the browser roles.
drop policy if exists "Public read access" on public.building_permits;
drop policy if exists "Service role write access" on public.building_permits;
revoke all on public.building_permits from anon, authenticated;
alter table public.building_permits enable row level security;

-- 3. Verify, as the anon role would experience it.
do $$
declare
  n bigint;
  denied boolean := false;
begin
  select count(*) into n from public.building_permits_public;
  if n < 3000 then
    raise exception 'verify failed: view returned only % rows', n;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'building_permits_public'
      and column_name in ('address', 'parcel', 'lat', 'lng', 'description', 'subdivision')
  ) then
    raise exception 'verify failed: view exposes a private column';
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'building_permits') then
    raise exception 'verify failed: a policy still exists on building_permits';
  end if;

  begin
    execute 'set local role anon';
    perform count(*) from public.building_permits;
    execute 'reset role';
  exception when insufficient_privilege then
    execute 'reset role';
    denied := true;
  end;
  if not denied then
    raise exception 'verify failed: anon can still read building_permits directly';
  end if;

  execute 'set local role anon';
  select count(*) into n from public.building_permits_public;
  execute 'reset role';
  if n < 3000 then
    raise exception 'verify failed: anon sees only % rows through the view', n;
  end if;

  raise notice 'rls ok: table closed to anon/authenticated, view serves % rows', n;
end $$;
