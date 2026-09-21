-- Enables server-side HTTP so the permit backfill can pull from the app's
-- public /api/permits endpoint without routing ~1MB of JSON through a client.
-- Temporary: intended to be dropped once building_permits is populated and the
-- daily Vercel cron is confirmed healthy.
create extension if not exists http with schema extensions;

do $$
begin
  if not exists (
    select 1 from pg_extension where extname = 'http'
  ) then
    raise exception 'verify failed: http extension not installed';
  end if;
end $$;
