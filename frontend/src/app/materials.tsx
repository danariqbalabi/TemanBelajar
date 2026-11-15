"use client";
import { useEffect, useRef, useState } from "react";
import { api, mutation } from "@/lib/api";
import { userMessage } from "@/lib/errors";
import type { Job, Material, Mode } from "@/lib/types";
import type { Run } from "./page";
export function Materials({
  materials,
  run,
  busy,
  refresh,
  start,
}: {
  materials: Material[];
  run: Run;
  busy: boolean;
  refresh: () => Promise<void>;
  start: (m: Material, mode?: Mode) => void;
}) {
  const [query, setQuery] = useState(""),
    [upload, setUpload] = useState(false),
    [title, setTitle] = useState(""),
    [text, setText] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [jobs, setJobs] = useState<Job[]>([]),
    [detail, setDetail] = useState<Material | null>(null),
    [validation, setValidation] = useState(""),
    [loadError, setLoadError] = useState(""),
    [source, setSource] = useState<Material["sources"] | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    api<{ items: Job[] }>("/jobs")
      .then((d) => {
        if (mounted.current) setJobs(d.items);
      })
      .catch((e) => {
        if (mounted.current) setLoadError(userMessage(e));
      });
    return () => {
      mounted.current = false;
    };
  }, []);
  async function process(job: Job) {
    await run(async () => {
      const processing = await api<Job>(`/jobs/${job.id}/process`, {});
      if (mounted.current)
        setJobs((items) =>
          items.map((j) => (j.id === job.id ? processing : j)),
        );
      await refresh();
    });
  }
  function submit() {
    setValidation("");
    if (!title.trim()) {
      setValidation("Beri judul materi terlebih dahulu.");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setValidation("Ukuran PDF maksimal 10 MB.");
      return;
    }
    if (!file && !text.trim()) {
      setValidation("Pilih PDF atau tempel teks materi.");
      return;
    }
    let request: () => Promise<Job>;
    if (file) {
      const form = new FormData();
      form.set("request_id", crypto.randomUUID());
      form.set("title", title.trim());
      form.set("file", file);
      request = () => api<Job>("/materials/pdf", form);
    } else
      request = mutation<Job>("/materials/text", { title: title.trim(), text });
    run(async () => {
      const job = await request();
      setJobs((items) => [job, ...items.filter((x) => x.id !== job.id)]);
      setUpload(false);
      setTitle("");
      setText("");
      setFile(null);
    });
  }
  if (detail)
    return (
      <>
        <button onClick={() => setDetail(null)}>← Semua materi</button>
        <section className="material-summary">
          <span className="pill">
            {detail.subject} •{" "}
            {detail.is_demo ? "Materi contoh" : "Materi kamu"}
          </span>
          <h1>{detail.title}</h1>
          <p>
            {detail.concepts.length} konsep • {detail.question_count} soal •{" "}
            {detail.concepts.reduce((n, c) => n + c.estimated_minutes, 0)} menit
            bacaan
          </p>
          {detail.generated_by_ai && (
            <p className="notice">
              Materi disusun AI dari sumber unggahanmu. Periksa penjelasan dan
              rujukan sebelum menggunakannya untuk ujian.
            </p>
          )}
          <h2>Peta konsep</h2>
          {detail.concepts.map((c, i) => (
            <div key={c.id} className="schedule">
              <b>{i + 1}</b>
              <div>
                <h3>{c.title}</h3>
                <p>
                  {c.estimated_minutes} menit •{" "}
                  {c.prerequisites.length
                    ? "Melanjutkan konsep sebelumnya"
                    : "Konsep awal"}
                </p>
              </div>
            </div>
          ))}
          <h2>Pilih cara belajar</h2>
          <div className="mode-grid">
            {(
              [
                "standard",
                "reading",
                "focus",
                "explore",
                "transcript",
              ] as Mode[]
            ).map((mode) => {
              const available =
                !["explore", "transcript"].includes(mode) ||
                detail.concepts.every((c) =>
                  mode === "explore" ? c.diagram_description : c.transcript,
                );
              return (
                <button
                  key={mode}
                  disabled={!available || busy}
                  onClick={() => start(detail, mode)}
                >
                  <b>{modeNames[mode]}</b>
                  <small>
                    {available
                      ? modeDescriptions[mode]
                      : "Belum tersedia untuk materi ini"}
                  </small>
                </button>
              );
            })}
          </div>
          <details>
            <summary>Sumber materi</summary>
            {detail.sources.map((s) => (
              <article key={s.id}>
                <h3>{s.label}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </details>
        </section>
      </>
    );
  return (
    <>
      {loadError && (
        <div role="alert" className="notice">
          <p>{loadError}</p>
          <button
            onClick={() =>
              run(async () => {
                const result = await api<{ items: Job[] }>("/jobs");
                setJobs(result.items);
                setLoadError("");
              })
            }
          >
            Muat pemrosesan lagi
          </button>
        </div>
      )}
      {source && (
        <section>
          <div className="section-title">
            <h2>Sumber tersimpan</h2>
            <button onClick={() => setSource(null)}>Tutup sumber</button>
          </div>
          {source.map((s) => (
            <article key={s.id}>
              <h3>{s.label}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{s.text}</p>
            </article>
          ))}
        </section>
      )}
      <div className="section-title">
        <div>
          <h1>Materi Saya</h1>
          <p>Satu tempat untuk semua langkah belajarmu.</p>
        </div>
        <button className="primary" onClick={() => setUpload(!upload)}>
          + Tambah materi
        </button>
      </div>
      {upload && (
        <section>
          <h2>Unggah materi baru</h2>
          <p>
            PDF berbasis teks maksimal 10 MB / 50 halaman, atau teks hingga
            100.000 karakter. PDF pindai perlu diubah menjadi teks terlebih
            dahulu.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label>
              Judul
              <input
                required
                maxLength={160}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              File PDF
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {!file && (
              <label>
                Teks materi
                <textarea
                  rows={8}
                  maxLength={100000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tempel materi dari catatan sekolah..."
                />
              </label>
            )}
            {validation && <p role="alert">{validation}</p>}
            <button className="primary" disabled={busy}>
              Simpan sumber materi
            </button>
          </form>
        </section>
      )}
      {jobs.length > 0 && (
        <section>
          <h2>Pemrosesan materi</h2>
          {jobs.map((j) => (
            <div className="job" key={j.id}>
              <div>
                <h3>{j.title}</h3>
                <span className="pill">
                  {(
                    {
                      queued: "Siap diproses",
                      processing: "Sedang menyusun materi",
                      failed: "Perlu dicoba kembali",
                      ready: "Materi siap",
                    } as Record<string, string>
                  )[j.status] || j.status}
                </span>
                <p>{j.error || j.stage}</p>
              </div>
              <div className="actions">
                {j.status === "ready" ? (
                  <button
                    onClick={() =>
                      setDetail(
                        materials.find((m) => m.id === j.material_id) || null,
                      )
                    }
                  >
                    Buka ringkasan
                  </button>
                ) : (
                  <button disabled={busy} onClick={() => process(j)}>
                    {j.status === "processing"
                      ? "Coba lanjutkan proses"
                      : j.status === "failed"
                        ? "Ulang pemrosesan"
                        : "Susun bersama Mimo"}
                  </button>
                )}
                <button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      const d = await api<Job>(`/jobs/${j.id}`);
                      setJobs((items) =>
                        items.map((x) => (x.id === j.id ? d : x)),
                      );
                      await refresh();
                    })
                  }
                >
                  Perbarui status
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      const result = await api<{
                        sources: Material["sources"];
                      }>(`/jobs/${j.id}/source`);
                      setSource(result.sources);
                    })
                  }
                >
                  Lihat sumber tersimpan
                </button>
              </div>
            </div>
          ))}
          <p className="footnote">
            Pemrosesan dapat memerlukan sekitar 90 detik. Sumber tetap tersimpan
            bila proses perlu diulang.
          </p>
        </section>
      )}
      <label className="search-label">
        Cari materi
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Judul atau pelajaran"
        />
      </label>
      <div className="material-grid">
        {materials
          .filter((m) =>
            (m.title + " " + m.subject)
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((m) => (
            <button
              className="material-card"
              key={m.id}
              onClick={() => setDetail(m)}
            >
              <span className="pill">{m.subject}</span>
              <h2>{m.title}</h2>
              <p>
                {m.concepts.length} konsep • {m.question_count} soal
              </p>
              <small>
                {m.is_demo
                  ? "Materi contoh terkurasi"
                  : "Dari sumber unggahanmu"}
              </small>
              <span>Buka ringkasan →</span>
            </button>
          ))}
      </div>
      {!materials.some((m) =>
        (m.title + " " + m.subject).toLowerCase().includes(query.toLowerCase()),
      ) && (
        <section>
          <h2>Belum ada materi yang cocok</h2>
          <p>Coba kata lain atau tambahkan materi sekolahmu.</p>
        </section>
      )}
    </>
  );
}
export const modeNames: Record<Mode, string> = {
  standard: "Belajar standar",
  reading: "Membaca santai",
  focus: "Fokus satu langkah",
  explore: "Jelajah visual",
  transcript: "Transkrip & audio",
};
const modeDescriptions: Record<Mode, string> = {
  standard: "Semua paragraf dalam satu konsep",
  reading: "Bacaan lapang dan sumber yang jelas",
  focus: "Satu paragraf setiap langkah",
  explore: "Penjelasan diagram dengan teks",
  transcript: "Dengarkan sambil mengikuti teks",
};
