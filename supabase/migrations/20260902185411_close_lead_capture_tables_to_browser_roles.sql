-- Group 2 — lead capture. Written only by server routes on the service role.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['advisory_bookings', 'advisory_book_waitlist', 'cma_requests', 'property_notify_requests'] loop
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
  denied boolean;
begin
  foreach t in array array['advisory_bookings', 'advisory_book_waitlist', 'cma_requests', 'property_notify_requests'] loop
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
      execute format('insert into public.%I default values', t);
      execute 'reset role';
    exception when insufficient_privilege then
      execute 'reset role'; denied := true;
    when others then
      -- a not-null violation would mean the insert was *permitted*; only
      -- insufficient_privilege counts as closed
      execute 'reset role';
      raise exception 'verify failed: anon insert on % reached the table (%)', t, sqlerrm;
    end;
    if not denied then raise exception 'verify failed: anon can write %', t; end if;
  end loop;
  raise notice 'group 2 closed';
end $$;
