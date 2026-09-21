-- dedupeByBuilding collapses per-unit permit rows (a condo conversion files one
-- permit per unit) into one marker carrying unitCount. The sync dropped that
-- number on the way into the table; the map and detail panel need it back.
alter table public.building_permits
  add column if not exists unit_count integer not null default 1;

-- Backfill from the most recent staged /api/permits payload, which carries it.
update public.building_permits bp
set unit_count = greatest(1, (src.p->>'unitCount')::int)
from (
  select p
  from public._permit_backfill_raw r,
       lateral jsonb_array_elements(r.body->'permits') p
  where r.id = (select max(id) from public._permit_backfill_raw)
) src
where bp.permit_number = src.p->>'permitNumber'
  and (src.p->>'unitCount')::int > 1;

do $$
declare multi bigint;
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='building_permits' and column_name='unit_count'
  ) then
    raise exception 'verify failed: unit_count missing';
  end if;
  select count(*) into multi from public.building_permits where unit_count > 1;
  raise notice 'unit_count ok: % multi-unit buildings', multi;
end $$;
