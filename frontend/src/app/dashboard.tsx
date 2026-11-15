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
    <div className="stitch-screen revamp-dashboard" data-show-mimo={showMimo}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <aside
          hidden={!showMimo || !profile.preferences.show_mimo}
          aria-label="Pesan dari Mimo si Bunglon"
          className="relative flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-surface border border-divider shadow-card transition-all"
        >
          <div
            aria-hidden="true"
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#91AF87]/20 border border-[#91AF87]/40 flex items-center justify-center shrink-0 text-2xl select-none"
          >
            <Image
              alt="Mimo si Bunglon menyapa"
              className="w-10 h-10 object-contain drop-shadow-sm"
              src="/design/mimo-0.png"
              width={1024}
              height={1024}
            ></Image>
          </div>
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary mb-1">
              <span className="w-2 h-2 rounded-full bg-mimo-green"></span>
              <span className="uppercase tracking-wider">Mimo si Bunglon</span>
              <span className="text-[10px] text-muted-gray">
                {"Teman belajarmu"}
              </span>
            </div>
            <p className="font-display font-bold text-primary text-sm md:text-base leading-snug">{`Hai ${profile.display_name}! Kita mulai pelan-pelan, ya. Pilih satu langkah kecil yang nyaman untukmu.`}</p>
          </div>
          <button
            aria-label="Tutup pesan Mimo"
            className="absolute top-3 right-3 p-1.5 rounded-lg text-text-secondary hover:bg-canvas focus-visible:outline-2 focus-visible:outline-focus"
            onClick={() => setShowMimo(false)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
        </aside>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <section
              aria-labelledby="rec-heading"
              className="p-6 md:p-8 rounded-3xl bg-mint border border-[#AED6B5] shadow-card flex flex-col justify-between relative overflow-hidden space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface/90 text-primary border border-surface shadow-xs">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 text-mint-dark"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                      Rekomendasi Terbaik Hari Ini
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-surface/60 px-2.5 py-1 rounded-lg">{`${recommendation?.estimated_minutes || profile.daily_minutes} Menit`}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-mint-dark font-bold">{`Topik: ${material?.title || "Pilih materi"}`}</span>
                    <h2
                      className="font-display font-extrabold text-2xl md:text-3xl text-primary mt-1"
                      id="rec-heading"
                    >
                      {recommendation?.title ||
                        concept?.title ||
                        material?.title ||
                        "Mulai satu langkah kecil"}
                    </h2>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface/90 border border-[#BCE0C3] text-sm text-primary space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-mint-dark">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></path>
                        </svg>
                        Kenapa Mimo menyarankan materi ini?
                      </span>
                      <button
                        aria-controls="bkt-detail"
                        aria-expanded="false"
                        className="text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-focus cursor-pointer"
                        id="bkt-toggle-btn"
                        onClick={() => reason.current?.showModal()}
                      >
                        {"Lihat dasar rekomendasi"}
                      </button>
                    </div>
                    <p className="leading-relaxed text-sm text-primary">
                      {recommendation?.reason ||
                        "Pilih materi yang ingin kamu pelajari hari ini. Mimo siap menemani."}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-surface/80 p-2 border border-[#AED6B5] shadow-xs flex items-center justify-center">
                    <Image
                      alt="Mimo si bunglon membimbing langkah belajar"
                      className="w-full h-full object-contain rounded-2xl"
                      src="/design/mimo-0.png"
                      width={1024}
                      height={1024}
                    ></Image>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className="inline-flex items-center justify-center font-medium font-sans px-6 py-3.5 text-base rounded-2xl gap-2.5 bg-primary text-surface hover:bg-primary-hover active:bg-primary-pressed shadow-xs min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-all"
                    onClick={() =>
                      material &&
                      start(material, undefined, recommendation?.concept_id)
                    }
                  >
                    <span>Mulai Sekarang</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="inline-flex items-center justify-center font-medium font-sans px-5 py-3 text-sm rounded-2xl gap-2 bg-surface text-primary border border-control-border hover:bg-canvas active:bg-divider shadow-xs min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-all"
                    onClick={() => navigate("Materi Saya")}
                  >
                    <span>Coba Cara Lain</span>
                  </button>
                </div>
                <button
                  className="text-xs font-semibold text-text-secondary hover:text-primary p-2 min-h-[44px] inline-flex items-center focus-visible:outline-focus"
                  onClick={() => navigate("Materi Saya")}
                >
                  Lewati Dulu Hari Ini
                </button>
              </div>
            </section>

            <section
              aria-labelledby="recent-materials"
              className="p-6 rounded-2xl bg-surface border border-divider shadow-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="font-display font-extrabold text-lg text-primary"
                    id="recent-materials"
                  >
                    Materi yang Sedang Dipelajari
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Pilih materi untuk melanjutkan belajar dengan caramu
                  </p>
                </div>
                <a
                  className="text-xs font-bold text-primary underline underline-offset-2 hover:text-primary-hover"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("Materi Saya");
                  }}
                >{`Lihat Semua (${materials.length} Modul)`}</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {materials.slice(0, 4).map((m) => (
                  <div
                    className="p-4 rounded-xl border border-divider hover:border-primary/40 bg-canvas/30 hover:bg-surface transition-all flex flex-col justify-between space-y-3"
                    key={m.id}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-lavender text-primary border border-lavender">
                          {m.subject}
                        </span>
                        <span className="text-[11px] font-bold text-text-secondary">{`${completed(m.id)} / ${m.concepts.length} konsep dibaca`}</span>
                      </div>
                      <h4 className="font-bold text-sm text-primary">
                        {m.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        {m.is_demo
                          ? "Materi contoh terkurasi"
                          : "Materi unggahanmu"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-gray">
                        {m.generated_by_ai
                          ? "Disusun dengan AI"
                          : "Sumber terkurasi"}
                      </span>
                      <button
                        className="text-xs font-bold text-primary px-3 py-1.5 rounded-lg bg-surface border border-divider hover:bg-canvas min-h-[36px]"
                        onClick={() => start(m)}
                      >
                        Buka Modul
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section
              aria-labelledby="schedule-heading"
              className="p-6 rounded-2xl bg-surface border border-divider shadow-card space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3
                    className="font-display font-extrabold text-lg text-primary"
                    id="schedule-heading"
                  >
                    Rencana Hari Ini
                  </h3>
                  <p className="text-xs text-text-secondary">{`${date} • ${activities.reduce((n, a) => n + a.duration_minutes, 0)} menit terjadwal`}</p>
                </div>

                <button
                  aria-haspopup="dialog"
                  aria-label="Buka form atur jam dan hari belajar sendiri"
                  className="inline-flex items-center justify-center font-medium font-sans px-3.5 py-2 text-xs rounded-xl gap-1.5 bg-surface text-primary border border-control-border hover:bg-canvas min-h-[44px] focus-visible:outline-focus transition-all"
                  onClick={() => navigate("Rencana Belajar")}
                >
                  <svg
                    className="w-3.5 h-3.5 text-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                  <span>Atur Jam Sendiri</span>
                </button>
              </div>

              <ol className="space-y-3" role="list">
                {activities.length ? (
                  activities.map((a) => (
                    <li
                      key={a.id}
                      className="p-3.5 rounded-xl border border-divider bg-canvas/40 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-text-secondary">
                          {new Date(a.start_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: profile.timezone,
                          })}{" "}
                          • {a.duration_minutes} menit
                        </p>
                        <h4 className="text-sm font-bold text-primary">
                          {a.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          const m = materials.find(
                            (m) => m.id === a.material_id,
                          );
                          if (m) start(m, undefined, a.concept_id || undefined);
                          else navigate("Rencana Belajar");
                        }}
                        className="px-3 py-2 rounded-lg bg-primary text-surface text-xs font-bold min-h-[44px]"
                      >
                        {a.status === "completed" ? "Tinjau" : "Buka"}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-4 rounded-xl bg-canvas text-sm text-text-secondary">
                    Belum ada rencana tersimpan hari ini. Atur jadwal saat kamu
                    siap.
                  </li>
                )}
              </ol>

              <div className="pt-2 border-t border-divider flex items-center justify-between text-xs text-text-secondary">
                <span>Belajar fleksibel tanpa rasa bersalah</span>
                <a
                  className="font-bold text-primary underline underline-offset-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("Rencana Belajar");
                  }}
                >
                  {"Lihat rencana"}
                </a>
              </div>
            </section>

            <section className="p-5 rounded-2xl bg-canvas border border-divider space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Preferensi Terpilih
                </span>
                <span className="text-[10px] text-text-secondary">
                  Bisa diubah kapan saja
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs bg-surface border border-divider">
                  {profile.daily_minutes} menit per hari
                </span>
                <button
                  onClick={() => navigate("Pengaturan")}
                  className="px-2.5 py-1 rounded-full text-xs bg-surface border border-divider min-h-[44px]"
                >
                  Sesuaikan preferensi
                </button>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Sistem tidak mendiagnosis dan tidak memberi label kaku pada
                kemampuanmu.
              </p>
            </section>
          </div>
        </div>
      </div>
      <dialog ref={reason} className="stitch-reason">
        <h2>Dasar rekomendasi Mimo</h2>
        <p>
          {recommendation?.reason ||
            "Belum ada hasil latihan untuk rekomendasi personal."}
        </p>
        <p>
          Estimasi model tersedia hanya untuk skill yang dipetakan dan cukup
          data. Hasil latihan tetap ditampilkan terpisah.
        </p>
        <button onClick={() => reason.current?.close()}>Tutup</button>
      </dialog>
    </div>
  );
}
