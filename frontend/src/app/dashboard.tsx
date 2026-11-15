"use client";
import { useRef } from "react";
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
  onPreferences,
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
  const material =
    materials.find((m) => m.id === recommendation?.material_id) || materials[0];
  const concept = material?.concepts.find(
    (c) => c.id === recommendation?.concept_id,
  );
  const activities = plans.flatMap((p) => p.activities),
    completed = activities.filter((a) => a.status === "completed").length,
    total = activities.filter((a) => a.status !== "skipped").length,
    percent = total ? Math.round((completed / total) * 100) : 0;
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: profile.timezone,
  });
  const completedConcepts = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  const scheduleItems = activities.length
    ? activities.map((a) => ({ ...a, preview: false }))
    : material?.concepts.map((c) => ({
        id: c.id,
        title: `Membaca Santai: ${c.title}`,
        duration_minutes: c.estimated_minutes,
        start_at: "",
        material_id: material.id,
        concept_id: c.id,
        status: "pending",
        preview: true,
      })) || [];
  return (
    <div className="stitch-dashboard">
      <div className="flex flex-col w-full">
        <div className="w-full mb-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-fixed/60 text-on-secondary-fixed-variant mb-space-xs">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[16px] text-secondary"
                >
                  spa
                </span>
                <span className="font-metadata text-metadata font-semibold">{`Mode Tenang: Aktif • Ritme Santai ${profile.daily_minutes} Menit`}</span>
              </div>
              <h1 className="font-display text-display-mobile lg:text-[44px] text-primary tracking-tight leading-tight">{`Pagi, ${profile.display_name}! Siap belajar bareng Mimo hari ini?`}</h1>
              <p className="font-reading text-reading text-text-secondary mt-1">{`${date} • Ritme belajarmu dirancang seringan mungkin tanpa target yang menumpuk.`}</p>
            </div>

            <div className="relative bg-surface rounded-2xl p-space-md shadow-sm max-w-md flex items-start gap-space-sm">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary shadow-inner">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 34C14 26 20 16 30 16C38 16 41 22 41 26C41 33 34 38 25 38C20 38 14 34 14 34Z"
                      fill="#91AF87"
                    ></path>
                    <path
                      d="M19 28C21 24 25 22 30 22C33 22 36 24 37 27"
                      stroke="#435A49"
                      strokeLinecap="round"
                      strokeWidth="2"
                    ></path>
                    <circle cx="34" cy="22" fill="#C8D8AD" r="4"></circle>
                    <circle cx="35" cy="21" fill="#112520" r="1.8"></circle>
                    <circle cx="36" cy="20.2" fill="#FFFFFF" r="0.6"></circle>
                    <circle
                      cx="30"
                      cy="26"
                      fill="#E8A69A"
                      fillOpacity="0.8"
                      r="2.2"
                    ></circle>
                    <path
                      d="M22 36C22 36 20 40 16 41C13 41.7 9 40 8 36C7 32 10 30 13 30C15 30 18 32 18 32"
                      stroke="#435A49"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                    <path
                      d="M26 38C28 41 32 41 35 39"
                      stroke="#435A49"
                      strokeLinecap="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-butter flex items-center justify-center text-[10px] text-primary shadow-sm font-bold">
                  ✨
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[13px] text-primary">
                    Mimo • Teman Belajarmu
                  </span>
                  <span className="font-metadata text-[11px] text-muted-gray">
                    Online &amp; Sabar
                  </span>
                </div>
                <p className="font-mimo-voice text-[15px] leading-snug text-primary mt-1">
                  “Hari ini kita punya 1 misi seru yang ringan tentang
                  fotosintesis. Nggák usah buru-buru, nikmati aja langkah demi
                  langkahnya ya!”
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <section className="bg-secondary-container rounded-[24px] p-space-lg lg:p-space-xl text-primary shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-12 w-64 h-64 opacity-15 pointer-events-none text-primary">
                <svg fill="currentColor" viewBox="0 0 200 200">
                  <path
                    d="M42.7,-64C55.6,-57.8,66.7,-46.8,73.5,-33.5C80.3,-20.1,82.8,-4.4,79.5,10.2C76.2,24.8,67.1,38.4,56,49.4C44.8,60.4,31.6,68.9,16.8,73.2C2.1,77.5,-14.2,77.7,-28.7,72.4C-43.2,67.1,-56,56.3,-65.4,43C-74.8,29.7,-80.9,13.8,-79.8,-1.5C-78.7,-16.8,-70.5,-31.6,-59.5,-42.6C-48.5,-53.7,-34.7,-61,-20.6,-66.2C-6.5,-71.4,7.8,-74.5,21.8,-72.1C35.8,-69.8,49.5,-62,42.7,-64Z"
                    transform="translate(100 100)"
                  ></path>
                </svg>
              </div>
              <div className="relative z-10 flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label text-[12px] tracking-wide uppercase">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[15px] text-butter"
                    >
                      auto_awesome
                    </span>
                    Rekomendasi Adaptif Utama Hari Ini
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface/70 text-on-secondary-container font-metadata text-[13px]">{`~${recommendation?.estimated_minutes || 10} Menit • Membaca Santai (Reading Companion)`}</span>
                </div>

                <div>
                  <span className="font-metadata text-[13px] text-secondary font-semibold uppercase tracking-wider block">{`${material?.subject || "Materi"} • ${material?.is_demo ? "Materi contoh" : "Materi kamu"}`}</span>
                  <h2 className="font-section-title text-[24px] lg:text-[28px] text-primary leading-tight mt-0.5">{`Langkah terbaikmu hari ini: ${concept?.title || material?.title || "Pilih materi belajarmu"}`}</h2>
                </div>

                <div className="bg-surface/85 backdrop-blur-sm rounded-xl p-space-md shadow-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="p-2 rounded-lg bg-secondary-fixed text-primary mt-0.5 flex-shrink-0">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px]"
                      >
                        psychology_alt
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label text-label text-primary">
                        Kenapa Mimo menyarankan langkah ini?
                      </span>
                      <p className="font-reading text-[15px] leading-relaxed text-text-secondary mt-1">
                        {recommendation?.reason ||
                          "Mulai satu konsep pendek. Hasil latihanmu membantu Mimo memilih langkah berikutnya."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-space-sm pt-2">
                  <a
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover shadow-sm transition-all active:scale-[0.98]"
                    data-path="mulai-belajar"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (material)
                        start(material, undefined, recommendation?.concept_id);
                    }}
                  >
                    <span>Mulai Sekarang (10 Menit)</span>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      arrow_forward
                    </span>
                  </a>
                  <button
                    className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm"
                    id="open-reason-modal"
                    type="button"
                    onClick={() => reason.current?.showModal()}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-secondary"
                    >
                      info
                    </span>
                    <span>Lihat Detail Alasan</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm"
                    type="button"
                    onClick={() => material && start(material, "transcript")}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-secondary"
                    >
                      headphones
                    </span>
                    <span>Coba Format Audio</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface/50 font-label text-[13px] ml-auto transition-colors"
                    type="button"
                    onClick={() => navigate("Materi Saya")}
                  >
                    <span>Lewati Dulu (Tanpa Penalti)</span>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[16px]"
                    >
                      skip_next
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-secondary text-[22px]"
                    >
                      calendar_month
                    </span>
                    <h2 className="font-section-title text-section-title text-primary">
                      Jadwal Belajar Hari Ini
                    </h2>
                  </div>
                  <p className="font-metadata text-metadata text-text-secondary mt-0.5">{`${date} • ${activities.length ? "Rencana belajarmu" : "Contoh alur belajar, waktu fleksibel"} • ${profile.daily_minutes} menit`}</p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container text-primary font-label text-[13px] hover:bg-surface-container-high transition-colors"
                    type="button"
                    onClick={() => navigate("Rencana Belajar")}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[16px]"
                    >
                      edit_calendar
                    </span>
                    <span>Ubah Waktu</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-low text-text-secondary hover:text-primary hover:bg-surface-container transition-colors font-label text-[13px]"
                    type="button"
                    onClick={() => navigate("Rencana Belajar")}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[16px]"
                    >
                      snooze
                    </span>
                    <span>Geser ke Sore / Besok</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm relative">
                {scheduleItems.slice(0, 2).map((activity) => (
                  <div
                    className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container/70 transition-all"
                    key={activity.id}
                  >
                    <div className="flex items-start gap-space-md">
                      <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex flex-col items-center justify-center flex-shrink-0 shadow-sm z-10">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[20px]"
                        >
                          menu_book
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-label text-[12px] px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-bold">{`${activity.preview ? "Waktu fleksibel" : new Date(activity.start_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone })} (${activity.duration_minutes} Mnt)`}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                          <span className="font-metadata text-[12px] text-success font-semibold">
                            Prioritas Hari Ini
                          </span>
                        </div>
                        <h3 className="font-card-title text-card-title text-primary mt-1">
                          {activity.title}
                        </h3>
                        <p className="font-metadata text-metadata text-text-secondary">
                          {activity.preview
                            ? "Bacaan singkat dengan sumber dan panduan Mimo."
                            : new Date(activity.start_at).toLocaleString(
                                "id-ID",
                                { timeZone: profile.timezone },
                              )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className="hidden md:inline-flex items-center gap-1 text-[12px] text-text-secondary bg-surface px-2.5 py-1 rounded-lg">
                        {activity.status === "completed"
                          ? "Selesai"
                          : "Siap Dimulai"}
                      </span>
                      <a
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label text-[13px] hover:bg-primary-hover shadow-sm"
                        data-path="mulai-belajar"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const m =
                            materials.find(
                              (m) => m.id === activity.material_id,
                            ) || material;
                          if (m)
                            start(
                              m,
                              undefined,
                              activity.concept_id || undefined,
                            );
                        }}
                      >
                        <span>Mulai Sesi</span>
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[16px]"
                        >
                          play_arrow
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-space-xs flex items-center justify-between text-text-secondary font-metadata text-[13px]">
                <div className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary text-[16px]"
                  >
                    sentiment_satisfied
                  </span>
                  <span>
                    Jadwal ini bersifat saran lembut. Kamu bebas menyesuaikan
                    ritme kapan saja.
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  Target hari ini: 15 Menit saja
                </span>
              </div>
            </section>

            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-section-title text-section-title text-primary">
                  Materi Aktif Lainnya
                </h2>
                <a
                  className="font-label text-[13px] text-secondary hover:text-primary transition-colors flex items-center gap-1"
                  data-path="materi-saya"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("Materi Saya");
                  }}
                >
                  <span>{`Buka Semua Materi (${materials.length})`}</span>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[16px]"
                  >
                    chevron_right
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {materials.slice(0, 2).map((m) => (
                  <div
                    className="p-space-md rounded-2xl bg-surface shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                    key={m.id}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-10 h-10 rounded-xl bg-peach/40 flex items-center justify-center text-primary">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            calculate
                          </span>
                        </div>
                        <div>
                          <span className="font-metadata text-[12px] text-text-secondary">{`${m.subject} • ${m.concepts.length} konsep`}</span>
                          <h4 className="font-card-title text-card-title text-primary">
                            {m.title}
                          </h4>
                        </div>
                      </div>
                      <span className="font-label text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-text-secondary">
                        {m.is_demo ? "Contoh" : "Materi kamu"}
                      </span>
                    </div>
                    <div className="mt-space-md pt-space-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="bg-secondary h-full rounded-full"
                            style={{
                              width: `${(completedConcepts(m.id) / m.concepts.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-metadata text-[12px] text-text-secondary">{`${completedConcepts(m.id)} / ${m.concepts.length} Konsep`}</span>
                      </div>
                      <a
                        className="font-label text-[12px] text-primary hover:text-secondary inline-flex items-center gap-0.5"
                        data-path="materi-saya"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          start(m);
                        }}
                      >
                        <span>Lanjutkan</span>
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[14px]"
                        >
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            <section className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary text-[20px]"
                  >
                    flag
                  </span>
                  <h3 className="font-section-title text-[18px] text-primary">
                    Target Minggumu
                  </h3>
                </div>
                <span className="font-label text-[12px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                  Ritme Tenang
                </span>
              </div>

              <div className="flex items-center gap-space-md bg-surface-container-low rounded-xl p-space-md">
                <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.8"
                    ></path>
                    <path
                      className="text-secondary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${percent}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.8"
                    ></path>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-display text-[18px] font-extrabold text-primary leading-none">{`${completed}/${total}`}</span>
                    <span className="font-metadata text-[10px] text-text-secondary">
                      Sesi
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label text-label text-primary">
                    {total ? `${percent}% Tercapai` : "Mulai pelan-pelan"}
                  </span>
                  <p className="font-metadata text-[13px] leading-snug text-text-secondary mt-0.5">
                    {total
                      ? "Cukup satu langkah ringan hari ini. Kamu bebas menyesuaikan ritme."
                      : "Belum ada target tersimpan. Susun rencana ringan saat kamu siap."}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-xs text-center">
                <div className="p-2.5 rounded-xl bg-surface-container">
                  <span className="font-metadata text-[11px] text-text-secondary block">
                    Waktu Fokus
                  </span>
                  <span className="font-display text-[18px] font-bold text-primary">{`${profile.daily_minutes} Menit`}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container">
                  <span className="font-metadata text-[11px] text-text-secondary block">
                    Status Beban
                  </span>
                  <span className="font-display text-[18px] font-bold text-success">
                    Sangat Ringan
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-secondary text-[20px]"
                >
                  note_add
                </span>
                <h3 className="font-section-title text-[18px] text-primary">
                  Unggah Materi Ujian
                </h3>
              </div>
              <p className="font-reading text-[14px] text-text-secondary leading-snug">
                Ingin Mimo bikinin ringkasan santai dari PR atau catatan guru di
                sekolah?
              </p>

              <div className="mt-1 p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-secondary mb-2 group-hover:scale-105 transition-transform shadow-sm">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[20px]"
                  >
                    upload_file
                  </span>
                </div>
                <span className="font-label text-[13px] text-primary">
                  {"Tambahkan file PDF atau teks materi"}
                </span>
                <span className="font-metadata text-[11px] text-muted-gray mt-0.5">
                  {"PDF berbasis teks (Maks. 10 MB) atau teks tempel"}
                </span>
                <button
                  className="mt-3 px-3 py-1.5 rounded-lg bg-surface text-primary font-label text-[12px] shadow-sm hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => navigate("Materi Saya")}
                >
                  + Tambah Materi Baru
                </button>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary text-[20px]"
                  >
                    tune
                  </span>
                  <h3 className="font-section-title text-[18px] text-primary">
                    Pintasan Aksesibilitas
                  </h3>
                </div>
                <a
                  className="font-metadata text-[12px] text-secondary hover:underline"
                  data-path="pengaturan-aksesibilitas"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("Pengaturan");
                  }}
                >
                  Semua →
                </a>
              </div>
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-text-secondary"
                    >
                      horizontal_rule
                    </span>
                    <span className="font-label text-[13px] text-primary">
                      Penggaris Baca (Ruler)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer stitch-switch">
                    <input
                      checked={profile.preferences.reading_ruler}
                      className="sr-only peer"
                      id="ruler-toggle"
                      type="checkbox"
                      onChange={(e) =>
                        onPreferences?.({ reading_ruler: e.target.checked })
                      }
                      aria-label="Penggaris Baca"
                    />
                    <div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-text-secondary"
                    >
                      filter_vintage
                    </span>
                    <span className="font-label text-[13px] text-primary">
                      Redam Animasi &amp; Distraksi
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer stitch-switch">
                    <input
                      checked={profile.preferences.reduced_motion}
                      className="sr-only peer"
                      id="distraction-toggle"
                      type="checkbox"
                      onChange={(e) =>
                        onPreferences?.({ reduced_motion: e.target.checked })
                      }
                      aria-label="Redam Animasi dan Distraksi"
                    />
                    <div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-text-secondary"
                    >
                      format_size
                    </span>
                    <span className="font-label text-[13px] text-primary">
                      Ukuran Baca
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg">
                    <button
                      className="w-6 h-6 rounded flex items-center justify-center font-label text-[11px] text-text-secondary hover:bg-surface-container"
                      type="button"
                      onClick={() => onPreferences?.({ font_size: 16 })}
                      aria-pressed={profile.preferences.font_size === 16}
                    >
                      16
                    </button>
                    <button
                      className="w-6 h-6 rounded flex items-center justify-center font-label text-[11px] bg-secondary text-on-secondary font-bold"
                      type="button"
                      onClick={() => onPreferences?.({ font_size: 18 })}
                      aria-pressed={profile.preferences.font_size === 18}
                    >
                      18
                    </button>
                    <button
                      className="w-6 h-6 rounded flex items-center justify-center font-label text-[11px] text-text-secondary hover:bg-surface-container"
                      type="button"
                      onClick={() => onPreferences?.({ font_size: 20 })}
                      aria-pressed={profile.preferences.font_size === 20}
                    >
                      20
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-surface flex-shrink-0 flex items-center justify-center text-secondary shadow-sm">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[24px]"
                >
                  workspace_premium
                </span>
              </div>
              <div>
                <span className="font-label text-[13px] text-primary block leading-tight">
                  Pencapaian Tanpa Beban
                </span>
                <p className="font-metadata text-[12px] text-text-secondary mt-0.5">
                  {sessions.length
                    ? `${sessions.filter((s) => s.status === "completed").length} sesi selesai. Setiap langkahmu berarti bagi Mimo!`
                    : "Langkah pertamamu bisa dimulai kapan saja. Mimo siap menemani."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-space-lg w-full rounded-2xl bg-surface-container-low p-space-md lg:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant flex-shrink-0">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[22px]"
              >
                favorite
              </span>
            </div>
            <div>
              <h4 className="font-label text-label text-primary">
                Prinsip Nol Rasa Bersalah (Zero-Guilt Learning)
              </h4>
              <p className="font-reading text-[14px] text-text-secondary mt-0.5">
                {
                  "Hari ini capek atau ada ulangan dadakan di sekolah? Tinjau dan geser jadwal tanpa pengurangan nilai. Istirahat juga bagian dari belajar."
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-secondary text-[18px]"
            >
              verified
            </span>
            <span className="font-metadata text-[12px] text-text-secondary">
              {"Standar Ramah Neurodiversitas • Target WCAG 2.2 AA"}
            </span>
          </div>
        </section>
      </div>
      <dialog ref={reason} className="stitch-reason">
        <h2>Transparansi Rekomendasi Mimo</h2>
        <p>
          {recommendation?.reason ||
            "Hasil latihanmu akan membantu menyusun rekomendasi berikutnya."}
        </p>
        <p>
          Estimasi penguasaan hanya ditampilkan pada skill yang didukung model.
          Pilihan format dan jeda tidak mengurangi nilai.
        </p>
        <button onClick={() => reason.current?.close()}>
          Paham, terima kasih Mimo!
        </button>
      </dialog>
    </div>
  );
}
