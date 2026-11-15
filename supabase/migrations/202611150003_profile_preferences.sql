begin;
alter table public.learner_profiles
    add column subjects jsonb not null default '[]'::jsonb
        check (jsonb_typeof(subjects) = 'array'),
    add column available_days jsonb not null default '[0,1,2,3,4]'::jsonb
        check (jsonb_typeof(available_days) = 'array'),
    add column exam_date date,
    add column onboarding_step integer not null default 0
        check (onboarding_step between 0 and 4);
commit;
