-- Supabase default privileges grant ALL on new public objects to anon and
-- authenticated. This view is auto-updatable and runs as its owner, so a
-- DELETE through it would bypass the table's RLS. Read-only, explicitly.
revoke insert, update, delete, truncate, references, trigger
  on public.building_permits_public from anon, authenticated, public;
grant select on public.building_permits_public to anon, authenticated;

do $$
declare
  n bigint;
  denied boolean := false;
begin
  execute 'set local role anon';
  select count(*) into n from public.building_permits_public;
  execute 'reset role';
  if n < 3000 then
    raise exception 'verify failed: anon reads only % rows through the view', n;
  end if;

  begin
    execute 'set local role anon';
    delete from public.building_permits_public where permit_number = '__none__';
    execute 'reset role';
  exception when insufficient_privilege then
    execute 'reset role';
    denied := true;
  end;
  if not denied then
    raise exception 'verify failed: anon can still delete through the view';
  end if;

  if exists (
    select 1 from information_schema.role_table_grants
    where table_schema = 'public' and table_name = 'building_permits_public'
      and grantee in ('anon', 'authenticated') and privilege_type <> 'SELECT'
  ) then
    raise exception 'verify failed: non-SELECT grant remains on the view';
  end if;

  raise notice 'view read-only ok: anon selects % rows, writes denied', n;
end $$;
