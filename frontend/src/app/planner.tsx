"use client";
import { useState } from "react";
import { api, mutation } from "@/lib/api";
import { PlanDesign } from "./design-plan";
import { ProposalDesign } from "./design-proposal";
import { reactMimo } from "@/lib/mimo";
import type {
  Activity,
  Material,
  Mode,
  Plan,
  Profile,
  Proposal,
} from "@/lib/types";
import type { Run } from "./page";
export function Planner({
  plans,
  materials,
  profile,
  run,
  busy,
  refresh,
  start,
  onMaterials = () => {},
  onBack = () => {},
}: {
  plans: Plan[];
  onMaterials?: () => void;
  onBack?: () => void;
  materials: Material[];
  profile: Profile;
  run: Run;
  busy: boolean;
  refresh: () => Promise<void>;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    [detail, setDetail] = useState<Plan | null>(null),
    [material, setMaterial] = useState(materials[0]?.id || ""),
    [date, setDate] = useState(""),
    [activities, setActivities] = useState<Activity[] | null>(null),
    [proposal, setProposal] = useState<Proposal | null>(null),
    [title, setTitle] = useState(""),
    [duration, setDuration] = useState(10),
    [message, setMessage] = useState("");
  const plan =
    selected === ""
      ? undefined
      : detail || plans.find((p) => p.id === selected) || plans[0];
  function validStart() {
    if (!date || !Number.isFinite(new Date(date).getTime())) {
      setMessage("Pilih tanggal dan waktu mulai terlebih dahulu.");
      return false;
    }
    return true;
  }
  function validDraft() {
    if (!activities?.length) {
      setMessage("Tambahkan atau susun kegiatan sebelum menyimpan rencana.");
      return false;
    }
    if (
      activities.some(
        (activity) =>
          !activity.title.trim() ||
          activity.title.length > 160 ||
          !Number.isInteger(activity.duration_minutes) ||
          activity.duration_minutes < 1 ||
          activity.duration_minutes > 240 ||
          !Number.isFinite(Date.parse(activity.start_at)),
      )
    ) {
      setMessage(
        "Periksa judul, waktu mulai, dan durasi kegiatan (1?240 menit).",
      );
      return false;
    }
    return true;
  }
  async function load(id: string) {
    setSelected(id);
    if (!id) {
      setDetail(null);
      setActivities(null);
      setProposal(null);
      setMessage("Rencana baru. Tambahkan kegiatan lalu simpan.");
      return;
    }
    setDetail(await api<Plan>(`/plans/${id}`));
    setActivities(null);
    setProposal(null);
  }
  function suggest() {
    if (!validStart()) return;
    if (!material) {
      setMessage("Pilih materi terlebih dahulu.");
      return;
    }
    run(async () => {
      const d = await api<{ activities: Activity[] }>("/plans/suggest", {
        material_id: material,
        start_at: new Date(date).toISOString(),
        available_minutes: profile.daily_minutes,
      });
      setActivities(d.activities);
      setMessage("Usulan awal siap ditinjau. Belum disimpan sebagai rencana.");
    });
  }
  function create() {
    if (!validDraft()) return;
    const save = mutation<Plan>("/plans", {
      timezone: profile.timezone,
      daily_minutes: profile.daily_minutes,
      activities: activities || [],
    });
    run(async () => {
      const p = await save();
      setSelected(p.id);
      setDetail({ ...p, proposals: [] });
      setActivities(null);
      setProposal(null);
      void refresh().catch(() => {});
      setMessage("Rencana tersimpan. Kamu tetap bebas mengubah ritme.");
      reactMimo({
        mood: "cheer",
        message: "Rencanamu siap. Jangan lupa sisakan ruang untuk jeda!",
      });
    });
  }
  function propose() {
    if (!plan || !activities || !validDraft()) return;
    const send = mutation<Proposal>(`/plans/${plan.id}/proposals`, {
      expected_version: plan.version,
      activities,
      reason: "Penyesuaian waktu dan kegiatan oleh pengguna.",
    });
    run(async () => {
      setProposal(await send());
      setMessage("Perubahan siap ditinjau. Rencana aktif belum berubah.");
    });
  }
  function decide(action: "accept" | "dismiss", p = proposal) {
    if (!plan || !p) return;
    const send = mutation(`/plans/${plan.id}/proposals/${p.id}/${action}`, {
      expected_version: plan.version,
    });
    run(async () => {
      await send();
      await refresh();
      await load(plan.id);
      if (action === "accept")
        reactMimo({
          mood: "wave",
          message: "Jadwal baru sudah dipakai. Kita ikuti ritmemu.",
        });
      setMessage(
        action === "accept"
          ? "Perubahan diterapkan."
          : "Usulan ditunda. Rencana sebelumnya tetap berlaku.",
      );
    });
  }
  function status(a: Activity, next: Activity["status"]) {
    if (!plan) return;
    const send = mutation<Plan>(`/plans/${plan.id}/activities/${a.id}/status`, {
      expected_version: plan.version,
      status: next,
    });
    run(async () => {
      await send();
      await refresh();
      await load(plan.id);
      if (next === "completed")
        reactMimo({
          mood: "cheer",
          message: "Satu kegiatan selesai. Sekarang boleh tarik napas dulu.",
        });
    });
  }
  function recompute() {
    if (!plan || !validStart()) return;
    if (!material) {
      setMessage("Pilih materi terlebih dahulu.");
      return;
    }
    const send = mutation<Proposal>(`/plans/${plan.id}/recompute`, {
      expected_version: plan.version,
      material_id: material,
      start_at: new Date(date).toISOString(),
    });
    run(async () => {
      setProposal(await send());
      setMessage("Saran baru berdasarkan hasil belajarmu siap ditinjau.");
    });
  }
  function addManual() {
    if (!validStart()) return;
    if (!title.trim() || title.trim().length > 160) {
      setMessage("Isi judul kegiatan (maksimal 160 karakter).");
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 240) {
      setMessage("Durasi harus berupa bilangan bulat 1?240 menit.");
      return;
    }
    setActivities([
      ...(activities || plan?.activities || []),
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        start_at: new Date(date).toISOString(),
        duration_minutes: duration,
        status: "pending",
        locked: false,
        prerequisites: [],
        material_id: null,
        concept_id: null,
        kind: "custom",
      },
    ]);
    setTitle("");
  }
  function restore(version: number) {
    if (!plan) return;
    const send = mutation(`/plans/${plan.id}/restore`, {
      expected_version: plan.version,
      target_version: version,
    });
    run(async () => {
      await send();
      await refresh();
      await load(plan.id);
      setMessage("Versi dipulihkan dengan menjaga kegiatan terlindungi.");
    });
  }
  const editorPanel = (
    <>
      {" "}
      {activities && (
        <section>
          <h2>Tinjau draf kegiatan</h2>
          <p>Kegiatan selesai, berjalan, atau terkunci tetap dilindungi.</p>
          {activities.map((a) => {
            const protectedItem =
              a.locked || ["active", "completed"].includes(a.status);
            return (
              <div className="schedule" key={a.id}>
                <div>
                  <h3>{a.title}</h3>
                  <label>
                    Mulai
                    <input
                      type="datetime-local"
                      disabled={protectedItem}
                      value={localDate(a.start_at)}
                      onChange={(e) => {
                        if (e.target.value)
                          setActivities(
                            activities.map((x) =>
                              x.id === a.id
                                ? {
                                    ...x,
                                    start_at: new Date(
                                      e.target.value,
                                    ).toISOString(),
                                  }
                                : x,
                            ),
                          );
                      }}
                    />
                  </label>
                  <label>
                    Durasi
                    <input
                      type="number"
                      disabled={protectedItem}
                      min={1}
                      max={240}
                      value={a.duration_minutes}
                      onChange={(e) =>
                        setActivities(
                          activities.map((x) =>
                            x.id === a.id
                              ? { ...x, duration_minutes: +e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </label>
                </div>
                <button
                  disabled={protectedItem}
                  onClick={() =>
                    setActivities(activities.filter((x) => x.id !== a.id))
                  }
                >
                  Hapus dari draf
                </button>
              </div>
            );
          })}
          <div className="actions">
            <button
              className="primary"
              disabled={busy}
              onClick={plan ? propose : create}
            >
              {plan ? "Buat usulan perubahan" : "Simpan rencana ini"}
            </button>
            <button onClick={() => setActivities(null)}>Batalkan draf</button>
          </div>
        </section>
      )}
    </>
  );
  const historyPanel = (
    <>
      {" "}
      {plan && (
        <section>
          <h2>Riwayat versi</h2>
          <p>
            Pemulihan memeriksa kembali jadwal dan mempertahankan kegiatan yang
            sudah dilindungi.
          </p>
          {Object.keys(plan.history || {}).map((v) => (
            <div className="history-row" key={v}>
              <span>
                Versi {v} • {plan.history[v].length} kegiatan
              </span>
              <button
                disabled={busy || +v === plan.version}
                onClick={() => {
                  const restore = mutation(`/plans/${plan.id}/restore`, {
                    expected_version: plan.version,
                    target_version: +v,
                  });
                  run(async () => {
                    await restore();
                    await refresh();
                    await load(plan.id);
                    setMessage(
                      "Versi dipulihkan dengan tetap menjaga kegiatan terlindungi.",
                    );
                  });
                }}
              >
                Pulihkan versi {v}
              </button>
            </div>
          ))}
        </section>
      )}
    </>
  );
  if (plan && proposal)
    return (
      <>
        <p role="status" className="success">
          {message}
        </p>
        <ProposalDesign
          plan={plan}
          proposal={proposal}
          busy={busy}
          onAccept={() => decide("accept")}
          onDismiss={() => decide("dismiss")}
          onBack={() => run(() => load(plan.id))}
          onEdit={() => {
            setActivities(proposal.activities.map((a) => ({ ...a })));
            setProposal(null);
          }}
          onRestore={restore}
          onRefresh={() =>
            run(async () => setDetail(await api<Plan>(`/plans/${plan.id}`)))
          }
        />
      </>
    );
  return (
    <>
      <PlanDesign
        message={message}
        key={plan?.id || "new"}
        plans={plans}
        plan={plan}
        materials={materials}
        profile={profile}
        busy={busy}
        date={date}
        materialId={material}
        title={title}
        duration={duration}
        setDate={setDate}
        setMaterialId={setMaterial}
        setTitle={setTitle}
        setDuration={setDuration}
        onSelectPlan={(id) => run(() => load(id))}
        onSuggest={suggest}
        onRecompute={recompute}
        onEdit={() => {
          if (plan) setActivities(plan.activities.map((a) => ({ ...a })));
        }}
        onAddManual={addManual}
        onSave={plan ? propose : create}
        onRefresh={() =>
          run(async () => {
            await refresh();
            if (plan) await load(plan.id);
          })
        }
        onReview={setProposal}
        onOpen={(a) => {
          const m = materials.find((m) => m.id === a.material_id);
          if (m) start(m, undefined, a.concept_id || undefined);
        }}
        onStatus={status}
        onMaterials={onMaterials}
        onBack={onBack}
        editor={editorPanel}
        history={historyPanel}
        hasDraft={activities !== null}
      />
    </>
  );
}

function localDate(value: string) {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
