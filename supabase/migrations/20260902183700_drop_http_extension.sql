-- Enabled for the one-off server-side backfills and live verification. It
-- lets SQL make outbound web requests; nothing in the app depends on it.
drop extension if exists http;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'http') then
    raise exception 'verify failed: http extension still installed';
  end if;
  -- The one SQL function the app calls must survive the drop.
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'pipeline_search_suggest'
  ) then
    raise exception 'verify failed: pipeline_search_suggest missing';
  end if;
end $$;
