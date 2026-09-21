-- Grouped typeahead over the permit corpus. Aggregation (counts per builder,
-- per ZIP) can't be expressed through PostgREST, so it lives here. Street
-- suggestions deliberately do NOT live here: stripping the house number is a
-- redaction rule that already exists in TypeScript (streetOnly) and must have
-- exactly one implementation.
--
-- Not granted to anon. Called with the service role from the search route,
-- which is where the public/agent split is enforced.
create or replace function public.pipeline_search_suggest(q text, max_each int default 6)
returns jsonb
language sql
stable
as $$
  with needle as (
    select '%' || btrim(coalesce(q, '')) || '%' as pat,
           btrim(coalesce(q, '')) as raw
  ),
  b as (
    select bp.contractor_key as label, count(*) as n
    from public.building_permits bp, needle
    where bp.contractor_key is not null
      and bp.contractor_key <> ''
      and bp.contractor_key not like 'SELF CONTRACTOR%'
      and bp.contractor_key ilike needle.pat
    group by bp.contractor_key
    order by count(*) desc, bp.contractor_key
    limit max_each
  ),
  z as (
    select bp.zip as label, count(*) as n
    from public.building_permits bp, needle
    where bp.zip is not null
      and bp.zip <> ''
      and bp.zip like needle.raw || '%'
    group by bp.zip
    order by count(*) desc, bp.zip
    limit max_each
  )
  select jsonb_build_object(
    'builders', coalesce((select jsonb_agg(jsonb_build_object('label', label, 'count', n)) from b), '[]'::jsonb),
    'zips',     coalesce((select jsonb_agg(jsonb_build_object('label', label, 'count', n)) from z), '[]'::jsonb)
  );
$$;

revoke all on function public.pipeline_search_suggest(text, int) from public, anon, authenticated;

do $$
declare
  res jsonb;
begin
  select public.pipeline_search_suggest('ryan', 6) into res;
  if res is null or not (res ? 'builders') or not (res ? 'zips') then
    raise exception 'verify failed: suggest function returned %', res;
  end if;
  if jsonb_array_length(res->'builders') = 0 then
    raise exception 'verify failed: expected a builder match for "ryan", got %', res->'builders';
  end if;
  raise notice 'suggest ok: %', res;
end $$;
