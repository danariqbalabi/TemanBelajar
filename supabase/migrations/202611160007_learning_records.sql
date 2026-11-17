begin;
-- Keep the old table as a migration backup; only the new RPC writes live data.
alter table public.learning_states rename to learning_states_backup;
create table public.learning_revisions (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null check(revision>0),
 updated_at timestamptz not null default now()
);
create table public.learning_records (
 user_id uuid not null references auth.users(id) on delete cascade,
 collection text not null,
 item_id text not null,
 value jsonb not null,
 primary key(user_id,collection,item_id)
);
alter table public.learning_revisions enable row level security;
alter table public.learning_records enable row level security;
revoke all on public.learning_revisions,public.learning_records from public,anon,authenticated;
grant select on public.learning_revisions,public.learning_records to service_role;
insert into public.learning_revisions select user_id,revision,updated_at from public.learning_states_backup;
-- An empty item id stores a top-level value; object members use prefixed ids.
insert into public.learning_records
 select s.user_id,c.key,'',c.value from public.learning_states_backup s,
 lateral jsonb_each(s.data) c where jsonb_typeof(c.value)<>'object' or c.value='{}'::jsonb;
insert into public.learning_records
 select s.user_id,c.key,'k:'||i.key,i.value from public.learning_states_backup s,
 lateral jsonb_each(s.data) c,
 lateral jsonb_each(case when jsonb_typeof(c.value)='object' then c.value else '{}'::jsonb end) i;
create view public.learning_states with (security_invoker=true) as
 select r.user_id,r.revision,coalesce((
 select jsonb_object_agg(c.collection,c.value) from (
 select collection,case when bool_or(item_id='') then max(value::text) filter(where item_id='')::jsonb
 else jsonb_object_agg(substring(item_id from 3),value) end as value
 from public.learning_records where user_id=r.user_id group by collection
 ) c),'{}'::jsonb) as data,r.updated_at from public.learning_revisions r;
revoke all on public.learning_states from public,anon,authenticated;
grant select on public.learning_states to service_role;
create or replace function public.save_learning_state(learner uuid,expected_revision bigint,new_data jsonb)
returns bigint language plpgsql security definer set search_path='' as $$
declare saved_revision bigint;
begin
 if learner is null or expected_revision is null or expected_revision<0 or new_data is null or jsonb_typeof(new_data)<>'object' then
 raise invalid_parameter_value using message='invalid state'; end if;
 if expected_revision=0 then
 insert into public.learning_revisions(user_id,revision) values(learner,1) on conflict do nothing returning revision into saved_revision;
 else
 update public.learning_revisions set revision=revision+1,updated_at=now()
 where user_id=learner and revision=expected_revision returning revision into saved_revision;
 end if;
 if saved_revision is null then return null; end if;
 -- Delta writes preserve unchanged records, including their TOAST payloads.
 with incoming as (
 select c.key as collection,'' as item_id,c.value from jsonb_each(new_data) c
 where jsonb_typeof(c.value)<>'object' or c.value='{}'::jsonb
 union all
 select c.key,'k:'||i.key,i.value from jsonb_each(new_data) c,
 lateral jsonb_each(case when jsonb_typeof(c.value)='object' then c.value else '{}'::jsonb end) i
 )
 insert into public.learning_records(user_id,collection,item_id,value)
 select learner,collection,item_id,value from incoming
 on conflict(user_id,collection,item_id) do update set value=excluded.value
 where public.learning_records.value is distinct from excluded.value;
 delete from public.learning_records r where r.user_id=learner and (
 not(new_data ? r.collection) or
 case when r.item_id='' then jsonb_typeof(new_data->r.collection)='object' and new_data->r.collection<>'{}'::jsonb
 else jsonb_typeof(new_data->r.collection)<>'object' or not((new_data->r.collection) ? substring(r.item_id from 3)) end
 );
 return saved_revision;
end;
$$;
commit;
