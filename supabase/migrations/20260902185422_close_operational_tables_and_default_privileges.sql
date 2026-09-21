-- Group 3 — operational and cache tables, plus the root cause: default
-- privileges in public grant ALL on every new table to anon/authenticated,
-- which is how each of these was born open. Nothing in the browser reads any
-- table directly (the one browser read is the building_permits_public view).
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['permit_stages', 'canary_runs', 'canary_state', 'valuation_cache',
                           'listings_cache', 'agents', 'blog_posts', 'communities'] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('revoke all on public.%I from anon, authenticated, public', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Future tables created by migrations (role postgres) start closed.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;

do $$
declare
  t text;
  n bigint;
  denied boolean;
begin
  select count(*) into n from public.permit_stages;
  if n < 150 then raise exception 'verify failed: permit_stages has % rows', n; end if;
  select count(*) into n from public.canary_runs;
  if n < 70000 then raise exception 'verify failed: canary_runs has % rows', n; end if;

  foreach t in array array['permit_stages', 'canary_runs', 'canary_state', 'valuation_cache',
                           'listings_cache', 'agents', 'blog_posts', 'communities'] loop
    if exists (select 1 from pg_policies where schemaname = 'public' and tablename = t) then
      raise exception 'verify failed: policy remains on %', t;
    end if;
    if exists (select 1 from information_schema.role_table_grants
               where table_schema = 'public' and table_name = t and grantee in ('anon', 'authenticated')) then
      raise exception 'verify failed: grant remains on % for a browser role', t;
    end if;
    denied := false;
    begin
      execute 'set local role anon';
      execute format('select count(*) from public.%I', t);
      execute 'reset role';
    exception when insufficient_privilege then
      execute 'reset role'; denied := true;
    end;
    if not denied then raise exception 'verify failed: anon can read %', t; end if;
  end loop;

  -- Probe: a brand-new table must not receive browser grants any more.
  create table public.__rls_probe (id int);
  if exists (select 1 from information_schema.role_table_grants
             where table_schema = 'public' and table_name = '__rls_probe' and grantee in ('anon', 'authenticated')) then
    drop table public.__rls_probe;
    raise exception 'verify failed: default privileges still grant new tables to browser roles';
  end if;
  drop table public.__rls_probe;

  -- The one browser read must survive.
  execute 'set local role anon';
  select count(*) into n from public.building_permits_public;
  execute 'reset role';
  if n < 3000 then raise exception 'verify failed: public view broken (% rows)', n; end if;

  raise notice 'group 3 closed; default privileges revoked; view intact';
end $$;
