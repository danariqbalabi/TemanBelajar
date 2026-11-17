begin;
create table public.ai_daily_budget (
 day date primary key,
 attempts integer not null check (attempts >= 0)
);
alter table public.ai_daily_budget enable row level security;
revoke all on public.ai_daily_budget from public, anon, authenticated;
create function public.reserve_ai_attempt(daily_limit integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare reserved integer;
begin
 if daily_limit is null or daily_limit < 1 then
  raise invalid_parameter_value using message='invalid AI limit';
 end if;
 insert into public.ai_daily_budget(day,attempts)
 values ((now() at time zone 'UTC')::date,1)
 on conflict(day) do update set attempts=public.ai_daily_budget.attempts+1
 where public.ai_daily_budget.attempts < daily_limit
 returning attempts into reserved;
 return reserved is not null;
end;
$$;
revoke all on function public.reserve_ai_attempt(integer) from public,anon,authenticated;
grant execute on function public.reserve_ai_attempt(integer) to service_role;
commit;
