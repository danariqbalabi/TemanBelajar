begin;

create table public.learning_states (
    user_id uuid primary key references auth.users(id) on delete cascade,
    revision bigint not null check (revision > 0),
    data jsonb not null check (jsonb_typeof(data) = 'object'),
    updated_at timestamptz not null default now()
);
alter table public.learning_states enable row level security;
revoke all on public.learning_states from anon, authenticated;
grant select on public.learning_states to authenticated;
create policy read_own_learning_state on public.learning_states
for select to authenticated using ((select auth.uid()) = user_id);

-- The function owns writes and obtains the user from the verified JWT.
-- Direct table writes are revoked so callers cannot bypass the revision check.
create function public.save_learning_state(expected_revision bigint, new_data jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare
    learner uuid := auth.uid();
    saved_revision bigint;
begin
    if learner is null then
        raise insufficient_privilege using message = 'authentication required';
    end if;
    if expected_revision < 0 or jsonb_typeof(new_data) <> 'object'
       or new_data is null or expected_revision is null then
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
revoke all on function public.save_learning_state(bigint,jsonb) from public, anon;
grant execute on function public.save_learning_state(bigint,jsonb) to authenticated;

commit;
