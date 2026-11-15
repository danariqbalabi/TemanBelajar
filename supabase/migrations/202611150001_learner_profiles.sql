begin;

create table public.learner_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null check (length(trim(display_name)) between 1 and 80),
    timezone text not null default 'Asia/Jakarta',
    daily_minutes integer not null default 15 check (daily_minutes between 5 and 240),
    goal text not null default '' check (length(goal) <= 500),
    preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(preferences) = 'object')
);

alter table public.learner_profiles enable row level security;
revoke all on public.learner_profiles from anon;
grant select, insert, update, delete on public.learner_profiles to authenticated;

create policy own_profile on public.learner_profiles
for all to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

commit;
