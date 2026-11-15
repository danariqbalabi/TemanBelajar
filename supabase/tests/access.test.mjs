import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

test('migrasi, akses antar akun, dan konflik versi berjalan di postgres', async () => {
  const db = await PGlite.create();
  const first = '00000000-0000-4000-8000-000000000001';
  const second = '00000000-0000-4000-8000-000000000002';
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to anon, authenticated, service_role;
      grant execute on function auth.uid() to anon, authenticated, service_role;
    `);
    await db.query('insert into auth.users values ($1), ($2)', [first, second]);
    const directory = new URL('../migrations/', import.meta.url);
    for (const filename of (await readdir(directory)).filter(name => name.endsWith('.sql')).sort()) {
      await db.exec(await readFile(new URL(filename, directory), 'utf8'));
    }
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.learner_profiles'), /permission denied/);
    await assert.rejects(db.query("select public.save_learning_state(null, 0, '{}'::jsonb)"), /permission denied/);

    await db.exec('set role authenticated');
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [first]);
    await db.query('insert into public.learner_profiles(id, display_name) values ($1, $2)', [first, 'Manda']);
    await assert.rejects(db.query('insert into public.learner_profiles(id, display_name) values ($1, $2)', [second, 'Orang lain']), /row-level security/);
    await assert.rejects(db.query('select * from public.learning_states'), /permission denied/);
    await assert.rejects(db.query("select public.save_learning_state(null, 0, '{}'::jsonb)"), /permission denied/);
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [second]);
    assert.equal((await db.query('select * from public.learner_profiles')).rows.length, 0);
    const changed = await db.query('update public.learner_profiles set display_name = $1 where id = $2 returning id', ['diganti', first]);
    assert.equal(changed.rows.length, 0);
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [first]);
    assert.equal((await db.query('select revision from public.learner_profiles where id=$1',[first])).rows[0].revision,1);
    assert.equal((await db.query('update public.learner_profiles set display_name=$1 where id=$2 and revision=1 returning revision',['Manda baru',first])).rows[0].revision,2);
    assert.equal((await db.query('update public.learner_profiles set display_name=$1 where id=$2 and revision=1 returning revision',['tab lama',first])).rows.length,0);
    await assert.rejects(db.query('select public.reserve_ai_attempt(2)'), /permission denied/);
    await db.exec('set role service_role');
    assert.equal((await db.query('select public.reserve_ai_attempt(2) as allowed')).rows[0].allowed,true);
    assert.equal((await db.query('select public.reserve_ai_attempt(2) as allowed')).rows[0].allowed,true);
    assert.equal((await db.query('select public.reserve_ai_attempt(2) as allowed')).rows[0].allowed,false);

    const save = (learner, version, data) => db.query(
      'select public.save_learning_state($1, $2, $3::jsonb) as revision',
      [learner, version, JSON.stringify(data)],
    );
    assert.equal(Number((await save(first, 0, { sessions: {} })).rows[0].revision), 1);
    assert.equal((await save(first, 0, {})).rows[0].revision, null);
    assert.equal(Number((await save(first, 1, { saved: true })).rows[0].revision), 2);
    assert.equal((await save(first, 1, {})).rows[0].revision, null);
    await save(second, 0, { second: true });
    const own = await db.query('select data from public.learning_states where user_id = $1', [first]);
    assert.deepEqual(own.rows[0].data, { saved: true });
    await assert.rejects(save(null, 0, {}), /invalid state/);

  } finally {
    await db.close();
  }
});
