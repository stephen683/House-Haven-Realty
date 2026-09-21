-- Group 1 — client PII and TCPA consent records. Every policy on these tables
-- was granted to public with qual true, and anon held full write grants. All
-- access is now server-side via the service role, which bypasses RLS.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['leads', 'contact_submissions', 'contract_submissions'] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('revoke all on public.%I from anon, authenticated, public', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

do $$
declare
  t text;
  n bigint;
  denied boolean;
begin
  -- Data intact, as the owner.
  select count(*) into n from public.leads;
  if n < 100 then raise exception 'verify failed: leads has % rows', n; end if;
  select count(*) into n from public.contract_submissions;
  if n < 5 then raise exception 'verify failed: contract_submissions has % rows', n; end if;

  foreach t in array array['leads', 'contact_submissions', 'contract_submissions'] loop
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

    denied := false;
    begin
      execute 'set local role anon';
      execute format('delete from public.%I where false', t);
      execute 'reset role';
    exception when insufficient_privilege then
      execute 'reset role'; denied := true;
    end;
    if not denied then raise exception 'verify failed: anon can write %', t; end if;
  end loop;

  raise notice 'group 1 closed: leads, contact_submissions, contract_submissions';
end $$;
