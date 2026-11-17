begin;
-- Claim a job and charge global quota together. A stale writer costs nothing;
-- a full quota rolls the state write back before returning the denial marker.
create function public.save_learning_state_with_ai_budget(
 learner uuid, expected_revision bigint, new_data jsonb, daily_limit integer
) returns bigint language plpgsql security definer set search_path = '' as $$
declare saved_revision bigint;
begin
 saved_revision := public.save_learning_state(learner, expected_revision, new_data);
 if saved_revision is null then return null; end if;
 if not public.reserve_ai_attempt(daily_limit) then
  raise sqlstate 'P1001' using message='AI quota exhausted';
 end if;
 return saved_revision;
exception when sqlstate 'P1001' then
 return -1;
end;
$$;
revoke all on function public.save_learning_state_with_ai_budget(uuid,bigint,jsonb,integer)
 from public,anon,authenticated;
grant execute on function public.save_learning_state_with_ai_budget(uuid,bigint,jsonb,integer)
 to service_role;
commit;
