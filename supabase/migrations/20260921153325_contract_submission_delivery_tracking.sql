-- A contract submission is a deal under contract: binding date, close date,
-- inspection and financing deadlines. The route inserted it, logged any error,
-- and returned 201 regardless — then posted the notification to Resend with a
-- raw fetch and never read the response. An agent could file a contract, see
-- success, and have neither the row nor the email exist.
--
-- Same two columns as public.leads, same meaning.

alter table public.contract_submissions
  add column if not exists notified_at  timestamptz,
  add column if not exists notify_error text;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='contract_submissions'
      and column_name='notified_at')
  then
    raise exception 'contract_submissions.notified_at was not created';
  end if;
  raise notice 'contract submission delivery tracking in place';
end $$;
