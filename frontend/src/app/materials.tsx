"use client";
import { useEffect, useRef, useState } from "react";
import { api, mutation } from "@/lib/api";
import { Catalog } from "./design-catalog";
import { UploadDesign } from "./design-upload";
import { SummaryDesign } from "./design-summary";
import { ModePicker } from "./design-modes";
import { JobDesign } from "./design-job";
import { userMessage } from "@/lib/errors";
import type { Job, Material, Mode, LearningSession } from "@/lib/types";
import type { Run } from "./page";
export function Materials({
  materials,
  run,
  busy,
  refresh,
  start,
  sessions = [],
  onSettings = () => {},
  onPlan = () => {},
  onDefaultMode,
}: {
  materials: Material[];
  sessions?: LearningSession[];
  onSettings?: () => void;
  onPlan?: () => void;
  onDefaultMode?: (mode: Mode) => Promise<void>;
  run: Run;
  busy: boolean;
  refresh: () => Promise<void>;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
}) {
  const [query, setQuery] = useState(""),
    [upload, setUpload] = useState(false),
    [title, setTitle] = useState(""),
    [text, setText] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [jobs, setJobs] = useState<Job[]>([]),
    [activeJob, setActiveJob] = useState<Job | null>(null),
    [detail, setDetail] = useState<Material | null>(null),
    [choosing, setChoosing] = useState(false),
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
    setActiveJob({ ...job, status: "processing" });
    await run(async () => {
      try {
        const result = await api<Job>(`/jobs/${job.id}/process`, {});
        if (mounted.current) {
          setJobs((items) => items.map((j) => (j.id === job.id ? result : j)));
          setActiveJob((current) =>
            current?.id === job.id ? result : current,
          );
        }
        await refresh();
      } finally {
        const latest = await api<Job>(`/jobs/${job.id}`).catch(() => null);
        if (latest && mounted.current) {
          setJobs((items) => items.map((j) => (j.id === job.id ? latest : j)));
          setActiveJob((current) =>
            current?.id === job.id ? latest : current,
          );
        }
      }
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
  if (activeJob)
    return (
      <JobDesign
        job={activeJob}
        busy={busy}
        onBack={() => {
          setActiveJob(null);
          setSource(null);
        }}
        onProcess={() => process(activeJob)}
        onRefresh={() =>
          run(async () => {
            const j = await api<Job>(`/jobs/${activeJob.id}`);
            setActiveJob(j);
            setJobs((items) => items.map((x) => (x.id === j.id ? j : x)));
            await refresh();
          })
        }
        onOpen={() =>
          run(async () => {
            if (!activeJob.material_id) return;
            setDetail(
              await api<Material>(`/materials/${activeJob.material_id}`),
            );
            setActiveJob(null);
          })
        }
        onSource={() =>
          run(async () => {
            const result = await api<{ sources: Material["sources"] }>(
              `/jobs/${activeJob.id}/source`,
            );
            setSource(result.sources);
          })
        }
        source={source}
        onCloseSource={() => setSource(null)}
      />
    );
  if (detail && choosing)
    return (
      <ModePicker
        material={detail}
        busy={busy}
        onBack={() => setChoosing(false)}
        canSaveDefault={!!onDefaultMode}
        onSelect={async (mode, remember) => {
          if (remember && onDefaultMode) {
            let saved = false;
            await run(async () => {
              await onDefaultMode(mode);
              saved = true;
            });
            if (!saved) return;
          }
          start(detail, mode);
        }}
      />
    );
  if (detail)
    return (
      <SummaryDesign
        material={detail}
        onBack={() => setDetail(null)}
        onChoose={() => setChoosing(true)}
        onPlan={onPlan}
      />
    );
  if (upload)
    return (
      <UploadDesign
        title={title}
        text={text}
        file={file}
        validation={validation}
        busy={busy}
        setTitle={setTitle}
        setText={setText}
        setFile={setFile}
        onSubmit={submit}
        onBack={() => setUpload(false)}
      />
    );
  return (
    <Catalog
      materials={materials}
      sessions={sessions}
      jobs={jobs}
      query={query}
      setQuery={setQuery}
      onUpload={() => setUpload(true)}
      onDetail={setDetail}
      onSettings={onSettings}
      errorsPanel={
        <>
          {" "}
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
        </>
      }
      uploadPanel={null}
      jobsPanel={
        <>
          {" "}
          {jobs.length > 0 && (
            <section>
              <h2>Pemrosesan materi</h2>
              {jobs.map((j) => (
                <div className="job" key={j.id}>
                  <div>
                    <h3>{j.title}</h3>
                    <button
                      className="text-button"
                      onClick={() => setActiveJob(j)}
                    >
                      Lihat detail proses
                    </button>
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
                            materials.find((m) => m.id === j.material_id) ||
                              null,
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
                Pemrosesan dapat memerlukan sekitar 90 detik. Sumber tetap
                tersimpan bila proses perlu diulang.
              </p>
            </section>
          )}
        </>
      }
    />
  );
}

export const modeNames: Record<Mode, string> = {
  standard: "Belajar standar",
  reading: "Membaca santai",
  focus: "Fokus satu langkah",
  explore: "Jelajah visual",
  transcript: "Transkrip & audio",
};
