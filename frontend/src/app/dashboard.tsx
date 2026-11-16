"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type {
  LearningSession,
  Material,
  Mode,
  Plan,
  Profile,
  Recommendation,
  Preferences,
} from "@/lib/types";
export function Dashboard({
  profile,
  materials,
  sessions,
  plans,
  recommendation,
  start,
  navigate,
}: {
  profile: Profile;
  materials: Material[];
  sessions: LearningSession[];
  plans: Plan[];
  recommendation: Recommendation | null;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
  navigate: (p: string) => void;
  onPreferences?: (p: Partial<Preferences>) => void;
}) {
  const reason = useRef<HTMLDialogElement>(null);
  const [showMimo, setShowMimo] = useState(true);
  const material =
      materials.find((m) => m.id === recommendation?.material_id) ||
      materials[0],
    concept = material?.concepts.find(
      (c) => c.id === recommendation?.concept_id,
    );
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: profile.timezone,
  });
  const day = (d: string) =>
    new Date(d).toLocaleDateString("en-CA", { timeZone: profile.timezone });
  const activities = plans
    .flatMap((p) => p.activities)
    .filter(
      (a) =>
        day(a.start_at) === day(new Date().toISOString()) &&
        a.status !== "skipped",
    )
    .sort((a, b) => a.start_at.localeCompare(b.start_at));
  const completed = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  return (
    <>
      <div className="final-design final-screen-7 w-full pt-20 bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet xl:px-margin pb-space-xl flex flex-col gap-space-xl">
            <section
              aria-labelledby="beranda-greeting"
              className="pt-space-lg flex flex-col md:flex-row md:items-end justify-between gap-space-md"
            >
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter-tint text-primary font-label text-[13px] tracking-wide shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Sore Santai · Target 15 Menit
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mint-tint text-success font-label text-[12px]">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      aria-hidden="true"
                    >
                      spa
                    </span>
                    Bebas Stres &amp; Zero-Streak Penalty
                  </span>
                </div>
                <h1
                  className="font-display text-page-title-mobile md:text-page-title text-primary tracking-tight mt-1"
                  id="beranda-greeting"
                >{`Hai, ${profile.display_name}! Siap belajar santai bareng Mimo?`}</h1>
                <p className="font-body text-body text-on-surface-variant leading-relaxed">
                  Satu langkah kecil hari ini tanpa pusing. Semua jadwal dan
                  materi sudah disesuaikan dengan kenyamanan matamu.
                </p>
              </div>

              <div className="flex items-center gap-space-sm bg-surface p-2 rounded-xl shadow-sm self-start md:self-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mint-tint text-primary">
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    visibility
                  </span>
                  <span className="font-label text-metadata">
                    Focus Ruler: Aktif
                  </span>
                </div>
                <button
                  aria-label="Sesuaikan tampilan fokus"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                  type="button"
                  onClick={() => navigate("Rencana Belajar")}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                </button>
              </div>
            </section>

            <div
              className="hidden flex items-center justify-between gap-space-md p-space-md rounded-xl bg-peach-tint text-primary transition-all duration-300"
              id="reschedule-banner"
            >
              <div className="flex items-center gap-space-sm">
                <span
                  className="material-symbols-outlined text-[24px] text-secondary"
                  aria-hidden="true"
                >
                  hotel_class
                </span>
                <div>
                  <p className="font-label text-label font-bold text-primary">
                    Jadwal dialihkan ke besok tanpa pengurangan skor!
                  </p>
                  <p className="font-body text-metadata text-on-surface-variant">
                    Istirahat itu bagian penting dari daya ingat otakmu. Tarik
                    napas dalam-dalam, ya.
                  </p>
                </div>
              </div>
              <button
                className="px-space-md py-1.5 rounded-lg bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm"
                type="button"
                onClick={() => setShowMimo(false)}
              >
                Tutup
              </button>
            </div>

            <section
              aria-label="Rekomendasi Belajar Utama Hari Ini"
              className="w-full relative overflow-hidden rounded-[24px] bg-secondary-container text-primary p-space-lg md:p-space-xl shadow-md"
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-butter-tint/50 pointer-events-none"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-primary font-label text-[11px] font-bold tracking-wider uppercase shadow-sm border border-secondary/20">
                      <span
                        className="material-symbols-outlined text-[15px] text-secondary"
                        aria-hidden="true"
                      >
                        stars
                      </span>{" "}
                      REKOMENDASI PERSONAL
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-primary font-label text-[11px] border border-secondary/10">
                      {material?.subject || "Materi"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-butter-tint text-primary font-label text-[11px] font-semibold">{`${recommendation?.estimated_minutes || concept?.estimated_minutes || profile.daily_minutes} menit`}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-display text-section-title md:text-[1.85rem] text-primary font-extrabold leading-tight">
                      {recommendation?.title ||
                        concept?.title ||
                        material?.title ||
                        "Mulai dari materi contoh"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-label text-metadata text-primary/90 mt-1">
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[17px] text-secondary"
                          aria-hidden="true"
                        >
                          schedule
                        </span>{" "}
                        Durasi ~10 mnt
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[17px] text-secondary"
                          aria-hidden="true"
                        >
                          menu_book
                        </span>{" "}
                        Mode Teman Baca
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[17px] text-secondary"
                          aria-hidden="true"
                        >
                          psychology
                        </span>{" "}
                        Ramah Beban Kognitif
                      </span>
                    </div>
                  </div>
                  <div className="p-space-md rounded-2xl bg-surface/90 border border-secondary/20 shadow-sm flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-xl bg-mint-tint flex items-center justify-center text-secondary shrink-0">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        insights
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-primary">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-metadata font-bold">
                          Catatan BKT Engine Mimo
                        </span>
                        <span className="px-2 py-0.2 rounded bg-secondary-fixed text-primary font-label text-[10px] font-bold">
                          88% Akurasi Kemarin
                        </span>
                      </div>
                      <p className="font-body text-label text-on-surface-variant leading-relaxed">
                        {recommendation?.reason ||
                          "Pilih satu konsep pendek yang nyaman buatmu hari ini."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-sm pt-1">
                    <a
                      className="inline-flex items-center justify-center gap-2 px-space-xl py-3 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md"
                      data-path="mulai-belajar"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        (() => navigate("Materi Saya"))();
                      }}
                    >
                      <span>{`${recommendation?.estimated_minutes || concept?.estimated_minutes || profile.daily_minutes} menit`}</span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </a>
                    <button
                      className="inline-flex items-center gap-1.5 px-space-md py-3 rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label transition-colors shadow-sm border border-secondary/20"
                      type="button"
                      onClick={() => reason.current?.showModal()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        help_outline
                      </span>
                      <span>Kenapa Materi Ini?</span>
                    </button>
                    <button
                      className="inline-flex items-center gap-1 px-space-md py-3 rounded-xl text-primary hover:bg-surface/50 font-label text-label transition-colors"
                      type="button"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      <span>Nanti Dulu / Tunda</span>
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-surface/60 pointer-events-none ring-4 ring-secondary-fixed/50"></div>
                    <Image
                      alt=""
                      className="w-full h-full object-contain relative z-10 select-none pointer-events-none transform transition-transform hover: object-contain"
                      src="/design/mimo-final.png"
                      width={1408}
                      height={1120}
                      hidden={!showMimo || !profile.preferences.show_mimo}
                    ></Image>
                  </div>
                  <div className="mt-[-8px] relative z-20 px-4 py-2 rounded-full bg-surface border border-secondary/20 shadow-md text-primary font-mimo-voice text-metadata text-center flex items-center gap-1.5">
                    <span className="text-[14px]">🌿</span>
                    <span>
                      &quot;Tenang aja, 10 menit ini cukup banget!&quot;
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col gap-space-xl">
                <section
                  aria-labelledby="schedule-heading"
                  className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm text-text-secondary">{date}</p>
                      <h2
                        className="font-section-title text-section-title text-primary"
                        id="schedule-heading"
                      >
                        Linimasa Belajar Hari Ini
                      </h2>
                    </div>
                    <button
                      className="px-4 py-2 border border-divider rounded-xl"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      Ubah jadwal
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activities.length ? (
                      activities.map((a) => (
                        <article
                          key={a.id}
                          className="flex items-center gap-4 p-4 bg-canvas rounded-xl border border-divider"
                        >
                          <span className="font-bold tabular-nums">
                            {new Date(a.start_at).toLocaleTimeString("id-ID", {
                              timeZone: profile.timezone,
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold">{a.title}</h3>
                            <p className="text-sm">
                              {a.duration_minutes} menit ·{" "}
                              {a.status === "completed"
                                ? "Selesai"
                                : "Terjadwal"}
                            </p>
                          </div>
                          <button
                            className="bg-primary text-white px-4 py-2 rounded-xl"
                            onClick={() => {
                              const selected = materials.find(
                                (m) => m.id === a.material_id,
                              );
                              if (selected)
                                start(
                                  selected,
                                  undefined,
                                  a.concept_id || undefined,
                                );
                            }}
                          >
                            Buka
                          </button>
                        </article>
                      ))
                    ) : (
                      <p className="py-6">
                        Belum ada jadwal hari ini. Kamu tetap bisa mulai dari
                        materi yang tersedia.
                      </p>
                    )}
                  </div>
                </section>

                <section
                  aria-labelledby="ongoing-materials"
                  className="flex flex-col gap-space-md"
                >
                  <h2
                    className="font-section-title text-section-title text-primary"
                    id="ongoing-materials"
                  >
                    Materi yang Sedang Dipelajari
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {materials.slice(0, 2).map((m) => (
                      <article
                        key={m.id}
                        className="bg-surface border border-divider rounded-2xl p-6"
                      >
                        <p className="text-sm text-text-secondary">
                          {m.subject} ·{" "}
                          {m.is_demo ? "Materi contoh" : "Materi kamu"}
                        </p>
                        <h3 className="font-bold text-xl my-3">{m.title}</h3>
                        <p>
                          {completed(m.id)} / {m.concepts.length} konsep dibaca
                        </p>
                        <button
                          className="mt-4 rounded-xl px-4 py-2 bg-primary text-white"
                          onClick={() => start(m)}
                        >
                          Lanjut belajar
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                <section
                  aria-label="Jaminan Belajar Tenang"
                  className="rounded-2xl p-space-lg bg-lavender-tint text-primary shadow-sm flex flex-col sm:flex-row items-center gap-space-md"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface border border-divider flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span
                      className="material-symbols-outlined text-[30px] text-tertiary-container"
                      aria-hidden="true"
                    >
                      spa
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-card-title text-card-title text-primary">
                        Nggak ada streak patah di TemanBelajar
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface text-primary font-label text-[10px] font-bold border border-divider hidden sm:inline-block">
                        Zero-Streak Penalty
                      </span>
                    </div>
                    <p className="font-body text-label text-on-surface-variant">
                      Tubuh dan kesehatan mentalmu selalu yang paling utama.
                      Jika hari ini lelah, jadwal bisa digeser kapan saja tanpa
                      kehilangan jejak prestasi yang sudah kamu raih.
                    </p>
                  </div>
                  <button
                    className="shrink-0 px-space-lg py-2.5 rounded-xl bg-surface text-primary font-label text-metadata hover:bg-surface-container transition-colors shadow-sm border border-divider font-semibold"
                    type="button"
                    onClick={() => navigate("Rencana Belajar")}
                  >
                    Geser Jadwal Hari Ini
                  </button>
                </section>
              </div>

              <aside
                aria-label="Panel Utilitas dan Status Siswa"
                className="lg:col-span-4 flex flex-col gap-space-lg"
              >
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg">Preferensi Belajar</h2>
                    <button onClick={() => navigate("Pengaturan")}>Ubah</button>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <dt>Durasi nyaman</dt>
                      <dd>{profile.daily_minutes} menit</dd>
                    </div>
                    <div>
                      <dt>Hari aktif</dt>
                      <dd>{profile.available_days.length} hari / pekan</dd>
                    </div>
                  </dl>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg">Agenda Terdekat</h2>
                  <p className="mt-3">
                    {profile.goal || "Belajar pelan-pelan sesuai ritmemu"}
                  </p>
                  <p>
                    {profile.exam_date
                      ? `Target: ${profile.exam_date}`
                      : "Belum ada tanggal ujian"}
                  </p>
                  <button
                    className="mt-4"
                    onClick={() => navigate("Rencana Belajar")}
                  >
                    Buka rencana belajar →
                  </button>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg">Progres Belajar</h2>
                  <p className="mt-3">
                    {sessions.filter((s) => s.status === "completed").length}{" "}
                    sesi selesai
                  </p>
                  <p className="text-sm mt-2">
                    Estimasi penguasaan dan dasar rekomendasi bisa kamu lihat di
                    halaman progres.
                  </p>
                  <button className="mt-4" onClick={() => navigate("Progres")}>
                    Lihat progres →
                  </button>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg">Eksplorasi Gaya Belajar</h2>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {(
                      [
                        ["reading", "Teman Baca"],
                        ["focus", "Selangkah demi Selangkah"],
                        ["explore", "Dengar & Jelajah"],
                        ["transcript", "Visual & Teks"],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        className="bg-mint-tint rounded-xl p-3 text-sm"
                        onClick={() => material && start(material, mode)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <div
            aria-labelledby="modal-evidence-title"
            aria-modal="true"
            className="hidden fixed inset-0 z-50 items-center justify-center p-space-md bg-contrast-ink/40"
            id="evidence-modal"
            role="dialog"
          >
            <div className="bg-surface rounded-[24px] max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md relative max-h-[921px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-divider">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-mint-tint flex items-center justify-center text-secondary">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      neurology
                    </span>
                  </div>
                  <h3
                    className="font-card-title text-card-title text-primary"
                    id="modal-evidence-title"
                  >
                    Mengapa Mimo Memilihkan Materi Ini?
                  </h3>
                </div>
                <button
                  aria-label="Tutup Dialog Bukti"
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                  type="button"
                  onClick={() => navigate("Rencana Belajar")}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    close
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-space-sm text-primary">
                <p className="font-body text-label text-on-surface-variant">
                  TemanBelajar tidak memakai tebak-tebakan atau algoritma
                  pemaksa. Kami menggunakan prinsip{" "}
                  <strong>Bayesian Knowledge Tracing (BKT)</strong> untuk
                  memahami penguasaan konsepmu secara jujur.
                </p>

                <div className="p-space-md rounded-xl bg-canvas flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label font-bold">
                      1. Konsep Klorofil
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed text-primary font-label text-[11px] font-bold">
                      88% Paham
                    </span>
                  </div>
                  <p className="font-metadata text-metadata text-on-surface-variant">
                    Kamu menjawab 3 pertanyaan spektrum penyerapan cahaya
                    kemarin dengan sangat lancar tanpa ragu-ragu.
                  </p>
                </div>
                <div className="p-space-md rounded-xl bg-canvas flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label font-bold">
                      2. Jalur Reaksi Terang
                    </span>
                    <span className="px-2 py-0.5 rounded bg-butter-tint text-primary font-label text-[11px] font-bold">
                      54% Perlu Disegarkan
                    </span>
                  </div>
                  <p className="font-metadata text-metadata text-on-surface-variant">
                    Di pertanyaan transfer elektron, kamu membutuhkan waktu jeda
                    sedikit lebih lama. 5 menit membaca santai hari ini akan
                    menguncinya jadi pemahaman jangka panjang.
                  </p>
                </div>
                <div className="p-space-md rounded-xl bg-mint-tint flex items-center gap-space-sm text-primary">
                  <span
                    className="material-symbols-outlined text-secondary text-[24px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  <p className="font-metadata text-metadata text-primary">
                    Sesi ini dirancang hanya <strong>10 menit</strong> agar
                    beban memorimu tetap seimbang dan mata tidak lelah.
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover transition-colors"
                  type="button"
                  onClick={() => navigate("Rencana Belajar")}
                >
                  Paham, Siap Belajar!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog ref={reason} className="stitch-reason">
        <h2>Kenapa ini disarankan?</h2>
        <p>
          {recommendation?.reason ||
            "Mulai satu konsep pendek. Rekomendasi akan menyesuaikan hasil belajarmu."}
        </p>
        <button onClick={() => reason.current?.close()}>Tutup alasan</button>
      </dialog>
    </>
  );
}
