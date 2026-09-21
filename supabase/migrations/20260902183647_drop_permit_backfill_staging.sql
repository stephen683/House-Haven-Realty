-- Staging table from the one-off backfills. building_permits now carries
-- unit_count and the daily cron pages the full window itself.
drop table if exists public._permit_backfill_raw;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = '_permit_backfill_raw'
  ) then
    raise exception 'verify failed: _permit_backfill_raw still exists';
  end if;
  -- The data it fed must still be in place.
  if (select count(*) from public.building_permits) < 3000 then
    raise exception 'verify failed: building_permits lost rows';
  end if;
  if (select count(*) from public.building_permits where unit_count > 1) = 0 then
    raise exception 'verify failed: unit_count backfill lost';
  end if;
end $$;
