-- The app owns two functions in public. pipeline_search_suggest was closed
-- when it was created; set_updated_at (a trigger function) was still
-- executable by anon. Close it. Default privileges for functions could not be
-- made to exclude PUBLIC on this instance (a probe function still receives
-- =X at creation with the stored default already lacking it), so any future
-- function must be closed explicitly in its own migration — this verify
-- block doubles as the audit.
revoke execute on function public.set_updated_at() from public, anon, authenticated;

do $$
declare
  open_fns text;
begin
  select string_agg(p.proname, ', ' order by p.proname) into open_fns
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and pg_get_userbyid(p.proowner) = 'postgres'
    and has_function_privilege('anon', p.oid, 'execute');
  if open_fns is not null then
    raise exception 'verify failed: anon can execute app functions: %', open_fns;
  end if;
  -- Trigger still fires (owner context), suggest still callable by the service role.
  if not has_function_privilege('service_role', 'public.pipeline_search_suggest(text, int)', 'execute') then
    raise exception 'verify failed: service_role lost pipeline_search_suggest';
  end if;
  raise notice 'app functions closed to browser roles';
end $$;
