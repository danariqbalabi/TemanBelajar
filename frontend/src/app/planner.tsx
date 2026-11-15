"use client";
import { useState } from "react";
import { api, mutation } from "@/lib/api";
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
}: {
  plans: Plan[];
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
  const plan = detail || plans.find((p) => p.id === selected) || plans[0];
  async function load(id: string) {
    setSelected(id);
    setDetail(await api<Plan>(`/plans/${id}`));
    setActivities(null);
    setProposal(null);
  }
  function suggest() {
    if (!date || !material) return;
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
    const save = mutation<Plan>("/plans", {
      timezone: profile.timezone,
      daily_minutes: profile.daily_minutes,
      activities: activities || [],
    });
    run(async () => {
      const p = await save();
      await refresh();
      await load(p.id);
      setMessage("Rencana tersimpan. Kamu tetap bebas mengubah ritme.");
    });
  }
  function propose() {
    if (!plan || !activities) return;
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
    });
  }
  function recompute() {
    if (!plan || !date || !material) return;
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
    if (!date || !title.trim()) return;
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
  return (
    <>
      <div className="section-title">
        <div>
          <h1>Rencana Belajar</h1>
          <p>
            Rencana adalah teman, bukan beban. Tinjau setiap perubahan sebelum
            diterapkan.
          </p>
        </div>
        {plan && <span className="pill">Versi {plan.version}</span>}
      </div>
      {message && (
        <p role="status" className="success">
          {message}
        </p>
      )}
      <section>
        <h2>{plan ? "Sesuaikan langkah berikutnya" : "Buat rencana ringan"}</h2>
        {plans.length > 1 && (
          <label>
            Pilih rencana
            <select
              value={plan?.id}
              onChange={(e) => run(() => load(e.target.value))}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  Rencana {p.id.slice(0, 8)} • versi {p.version}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="form-grid">
          <label>
            Materi
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Waktu mulai
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <p>
          Waktu harian tersedia: {plan?.daily_minutes || profile.daily_minutes}{" "}
          menit. Zona rencana: {plan?.timezone || profile.timezone}. Waktu isian
          mengikuti perangkatmu.
        </p>
        <div className="actions">
          {!plan ? (
            <button disabled={busy || !date || !material} onClick={suggest}>
              Susun usulan awal
            </button>
          ) : (
            <>
              <button
                disabled={busy}
                onClick={() => {
                  setActivities(plan.activities.map((a) => ({ ...a })));
                  setMessage(
                    "Edit kegiatan yang belum berjalan, lalu buat usulan.",
                  );
                }}
              >
                Edit rencana manual
              </button>
              <button disabled={busy || !date || !material} onClick={recompute}>
                Minta saran dari hasil belajar
              </button>
              <button disabled={busy} onClick={() => run(() => load(plan.id))}>
                Perbarui rencana
              </button>
            </>
          )}
        </div>
        <details>
          <summary>Tambah kegiatan sendiri</summary>
          <label>
            Judul
            <input
              value={title}
              maxLength={160}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Durasi (menit)
            <input
              type="number"
              min={1}
              max={240}
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
            />
          </label>
          <button disabled={!date || !title.trim()} onClick={addManual}>
            Tambahkan ke draf
          </button>
        </details>
      </section>
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
      {plan && (
        <section>
          <h2>Rencana aktif</h2>
          {plan.activities.length === 0 && (
            <p>Belum ada kegiatan. Tambahkan satu langkah kecil lewat draf.</p>
          )}
          {plan.activities.map((a) => (
            <div className={`schedule status-${a.status}`} key={a.id}>
              <div>
                <span className="pill">
                  {
                    (
                      {
                        pending: "Siap dijalani",
                        active: "Sedang berjalan",
                        completed: "Selesai",
                        skipped: "Dilewati",
                      } as Record<string, string>
                    )[a.status]
                  }
                </span>
                <h3>{a.title}</h3>
                <p>
                  {new Date(a.start_at).toLocaleString("id-ID", {
                    timeZone: plan.timezone,
                  })}{" "}
                  • {a.duration_minutes} menit
                </p>
              </div>
              <div className="actions">
                {a.material_id && (
                  <button
                    disabled={busy}
                    onClick={() => {
                      const m = materials.find((m) => m.id === a.material_id);
                      if (m) start(m, undefined, a.concept_id || undefined);
                    }}
                  >
                    Buka materi
                  </button>
                )}
                {a.status === "pending" && (
                  <>
                    <button disabled={busy} onClick={() => status(a, "active")}>
                      Mulai kegiatan
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => status(a, "skipped")}
                    >
                      Lewati
                    </button>
                  </>
                )}
                {a.status === "active" && (
                  <button
                    disabled={busy}
                    onClick={() => status(a, "completed")}
                  >
                    Tandai selesai
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      {proposal && (
        <ProposalCard
          proposal={proposal}
          busy={busy}
          accept={() => decide("accept")}
          dismiss={() => decide("dismiss")}
        />
      )}
      {plan?.proposals
        ?.filter((p) => p.status === "pending" && p.id !== proposal?.id)
        .map((p) => (
          <ProposalCard
            key={p.id}
            proposal={p}
            busy={busy}
            accept={() => decide("accept", p)}
            dismiss={() => decide("dismiss", p)}
          />
        ))}
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
}
function ProposalCard({
  proposal,
  busy,
  accept,
  dismiss,
}: {
  proposal: Proposal;
  busy: boolean;
  accept: () => void;
  dismiss: () => void;
}) {
  return (
    <section className="proposal">
      <span className="pill">USULAN • BELUM DITERAPKAN</span>
      <h2>Rencana bisa menyesuaikanmu</h2>
      <p>{proposal.reason}</p>
      {proposal.changes.map((c) => (
        <div className="change" key={c.activity_id}>
          <h3>{c.after?.title || c.before?.title}</h3>
          <p>
            Sebelum:{" "}
            {c.before
              ? `${new Date(c.before.start_at).toLocaleString("id-ID")} • ${c.before.duration_minutes} menit`
              : "Belum ada"}
          </p>
          <p>
            Sesudah:{" "}
            {c.after
              ? `${new Date(c.after.start_at).toLocaleString("id-ID")} • ${c.after.duration_minutes} menit`
              : "Dihapus dari rencana"}
          </p>
        </div>
      ))}
      {proposal.changes.length === 0 && <p>Tidak ada perubahan jadwal.</p>}
      <div className="actions">
        <button className="primary" disabled={busy} onClick={accept}>
          Terima perubahan
        </button>
        <button disabled={busy} onClick={dismiss}>
          Nanti dulu
        </button>
      </div>
    </section>
  );
}
function localDate(value: string) {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
