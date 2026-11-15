begin;
-- Answer keys and scoring state are only exposed through the backend API.
revoke all on public.learning_states from authenticated;
grant select on public.learning_states to service_role;
drop function public.save_learning_state(bigint, jsonb);

create function public.save_learning_state(learner uuid, expected_revision bigint, new_data jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare saved_revision bigint;
begin
    if learner is null or expected_revision is null or expected_revision < 0
       or new_data is null or jsonb_typeof(new_data) <> 'object' then
        raise invalid_parameter_value using message = 'invalid state';
    end if;
    if expected_revision = 0 then
        insert into public.learning_states(user_id, revision, data)
        values (learner, 1, new_data) on conflict do nothing
        returning revision into saved_revision;
    else
        update public.learning_states
        set revision = revision + 1, data = new_data, updated_at = now()
        where user_id = learner and revision = expected_revision
        returning revision into saved_revision;
    end if;
    return saved_revision;
end;
$$;
revoke all on function public.save_learning_state(uuid,bigint,jsonb) from public, anon, authenticated;
grant execute on function public.save_learning_state(uuid,bigint,jsonb) to service_role;
commit;
