begin;
alter table public.learner_profiles add column revision integer not null default 1 check (revision > 0);
create function public.bump_profile_revision() returns trigger language plpgsql set search_path = public as $$
begin
  new.revision := old.revision + 1;
  return new;
end;
$$;
create trigger profile_revision before update on public.learner_profiles for each row execute function public.bump_profile_revision();
commit;
