// Temporary account credentials arrive only through stdin from the backend runner.
import { loadEnvFile } from "node:process";
import assert from "node:assert/strict";
try {
  loadEnvFile(".env.local");
} catch {}
let input = "";
for await (const chunk of process.stdin) input += chunk;
const credentials = JSON.parse(input);
const { api, auth, mutation } = await import("../src/lib/api.ts");
const { defaultProfile } = await import("../src/lib/types.ts");
assert.ok(auth, "konfigurasi publik supabase diperlukan");
const { error } = await auth.auth.setSession(credentials);
assert.equal(error, null, "sesi pengujian harus valid");
try {
  await api("/profile", { ...defaultProfile, onboarding_step: 4 }, "PUT");
  const profile = await api("/profile");
  assert.equal(profile.display_name, "Manda");
  const changed = await api("/profile", {...defaultProfile, display_name:"Manda tes", expected_revision:profile.revision}, "PUT");
  assert.equal(changed.revision, profile.revision+1);
  await assert.rejects(api("/profile", {...defaultProfile, expected_revision:profile.revision}, "PUT"), e=>e.status===409);
  assert.equal((await api("/profile")).display_name,"Manda tes");
  const { items } = await api("/materials");
  const material = items.find((m) => m.id === "demo-fotosintesis");
  assert.ok(material);
  const create = mutation("/sessions", {
    material_id: material.id,
    mode: "focus",
  });
  let session = await create();
  assert.deepEqual(await create(), session);
  session = await mutation(
    `/sessions/${session.id}`,
    {
      expected_version: session.version,
      concept_id: session.concept_id,
      paragraph: 1,
      mode: "reading",
      status: "active",
      completed_concepts: [],
      draft: "catatan smoke test",
    },
    "PUT",
  )();
  assert.equal(session.paragraph, 1);
  assert.equal(session.draft, "catatan smoke test");
  assert.equal(await api(`/sessions/${session.id}/attempts/active`), null);
  let attempt = await mutation("/attempts", { session_id: session.id })();
  assert.equal((await api(`/sessions/${session.id}/attempts/active`)).id, attempt.id);
  assert.equal((await mutation("/attempts", { session_id: session.id })()).id, attempt.id);
  for (const question of attempt.questions) {
    const answer = mutation(`/attempts/${attempt.id}/answers`, {
      expected_version: attempt.version,
      question_id: question.id,
      selected_index: 0,
    });
    attempt = await answer();
    assert.deepEqual(await answer(), attempt);
  }
  assert.equal(attempt.status, "completed");
  assert.equal(await api(`/sessions/${session.id}/attempts/active`), null);
  await api(`/progress?material_id=${material.id}`);
  await api(`/recommendations?material_id=${material.id}&available_minutes=15`);
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);
  const suggestion = await api("/plans/suggest", {
    material_id: material.id,
    start_at: start.toISOString(),
    available_minutes: 15,
  });
  let plan = await mutation("/plans", {
    timezone: "Asia/Jakarta",
    daily_minutes: 15,
    activities: suggestion.activities,
  })();
  const proposal = await mutation(`/plans/${plan.id}/recompute`, {
    expected_version: plan.version,
    material_id: material.id,
    start_at: start.toISOString(),
  })();
  const decision = await mutation(
    `/plans/${plan.id}/proposals/${proposal.id}/accept`,
    { expected_version: plan.version },
  )();
  plan = decision.plan;
  assert.equal(decision.proposal.status, "accepted");
  assert.ok((await api(`/plans/${plan.id}`)).history);
  const job = await mutation("/materials/text", {
    title: "Catatan pengujian frontend",
    text: "Fotosintesis menggunakan energi cahaya untuk mengubah air dan karbon dioksida menjadi gula. Klorofil menyerap cahaya. Proses ini menghasilkan oksigen.",
  })();
  assert.equal((await api(`/jobs/${job.id}`)).status, "queued");
  if (credentials.gemini) {
    const result = await api(`/jobs/${job.id}/process`, {});
    assert.equal(result.status, "ready");
    assert.equal(
      (await api(`/materials/${result.material_id}`)).generated_by_ai,
      true,
    );
  }
  console.log(
    "sdk auth, profil, katalog, sesi, catatan, latihan, retry, progres, rekomendasi, planner, dan unggahan: lolos",
  );
} finally {
  await auth.auth.signOut({ scope: "local" });
}
