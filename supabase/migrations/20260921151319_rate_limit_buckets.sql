-- Per-IP, per-endpoint rate limiting for public form submissions.
--
-- 156 submissions reached the leads table with no throttle of any kind; three
-- were real clients. A single bot could also hammer /api/value, which bills a
-- RentCast call per request.
--
-- One row per bucket with a rolling window, incremented atomically in the
-- function so concurrent lambdas cannot both read a stale count.

create table if not exists public.rate_limit_buckets (
  bucket        text primary key,
  window_start  timestamptz not null default now(),
  hits          integer     not null default 0,
  updated_at    timestamptz not null default now()
);

create index if not exists rate_limit_buckets_updated_idx
  on public.rate_limit_buckets (updated_at);

alter table public.rate_limit_buckets enable row level security;
revoke all on public.rate_limit_buckets from anon, authenticated, public;

create or replace function public.rate_limit_take(
  p_bucket text, p_max_hits integer, p_window_seconds integer
) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_hits integer;
begin
  insert into public.rate_limit_buckets as b (bucket, window_start, hits, updated_at)
  values (p_bucket, now(), 1, now())
  on conflict (bucket) do update
    set hits = case when b.window_start < now() - make_interval(secs => p_window_seconds)
                    then 1 else b.hits + 1 end,
        window_start = case when b.window_start < now() - make_interval(secs => p_window_seconds)
                    then now() else b.window_start end,
        updated_at = now()
  returning b.hits into v_hits;
  return v_hits <= p_max_hits;
end; $$;

revoke all on function public.rate_limit_take(text, integer, integer)
  from public, anon, authenticated;

create or replace function public.rate_limit_sweep(p_older_than_hours integer default 24)
returns integer
language plpgsql security definer set search_path = public as $$
declare v_deleted integer;
begin
  delete from public.rate_limit_buckets
  where updated_at < now() - make_interval(hours => p_older_than_hours);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end; $$;

revoke all on function public.rate_limit_sweep(integer) from public, anon, authenticated;

do $$
declare allowed boolean; open_fns text;
begin
  if not public.rate_limit_take('verify:probe', 3, 60) then raise exception 'verify failed: 1st call refused'; end if;
  if not public.rate_limit_take('verify:probe', 3, 60) then raise exception 'verify failed: 2nd call refused'; end if;
  if not public.rate_limit_take('verify:probe', 3, 60) then raise exception 'verify failed: 3rd call refused'; end if;
  select public.rate_limit_take('verify:probe', 3, 60) into allowed;
  if allowed then raise exception 'verify failed: 4th call was allowed past the limit'; end if;
  if not public.rate_limit_take('verify:other', 3, 60) then raise exception 'verify failed: buckets leak into each other'; end if;
  delete from public.rate_limit_buckets where bucket like 'verify:%';

  select string_agg(p.proname, ', ') into open_fns
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in ('rate_limit_take','rate_limit_sweep')
    and has_function_privilege('anon', p.oid, 'execute');
  if open_fns is not null then raise exception 'verify failed: anon can execute %', open_fns; end if;

  raise notice 'rate limiter ok: window enforced, buckets isolated, closed to anon';
end $$;
