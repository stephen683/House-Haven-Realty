-- Grouping key for contractor search. Metro sends the same builder under
-- multiple casings (377 raw variants collapse to 368 on upper(btrim())), so
-- exact-contractor filtering has to run on the normalized value, not the raw
-- text. Generated + stored so PostgREST can filter and index it directly.
alter table public.building_permits
  add column if not exists contractor_key text
  generated always as (upper(btrim(contractor))) stored;

create index if not exists building_permits_contractor_key_idx
  on public.building_permits (contractor_key);

create index if not exists building_permits_date_issued_idx
  on public.building_permits (date_issued desc);

create index if not exists building_permits_zip_idx
  on public.building_permits (zip);

do $$
declare
  raw_n bigint;
  key_n bigint;
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'building_permits'
      and column_name = 'contractor_key'
  ) then
    raise exception 'verify failed: contractor_key column missing';
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'building_permits_contractor_key_idx'
  ) then
    raise exception 'verify failed: contractor_key index missing';
  end if;

  select count(distinct contractor), count(distinct contractor_key)
    into raw_n, key_n
  from public.building_permits;

  if key_n > raw_n then
    raise exception 'verify failed: contractor_key (%) should collapse variants, not expand them (raw %)', key_n, raw_n;
  end if;

  raise notice 'contractor_key ok: % raw variants -> % grouped', raw_n, key_n;
end $$;
