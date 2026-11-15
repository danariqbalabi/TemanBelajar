"use client";
import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Material, LearningSession, Preferences } from "@/lib/types";
export function ReaderDesign({
  material,
  session,
  preferences,
  draft,
  setDraft,
  busy,
  feedback,
  speaking,
  onSpeak,
  update,
  onPractice,
  onSettings,
  onBack,
  onPreferences,
  elapsed,
  displayName,
}: {
  material: Material;
  session: LearningSession;
  preferences: Preferences;
  draft: string;
  setDraft: (s: string) => void;
  busy: boolean;
  feedback: string | null;
  speaking: boolean;
  onSpeak: (text?: string) => void;
  update: (patch: Partial<LearningSession>) => Promise<void>;
  onPractice: () => void;
  onSettings: () => void;
  onBack: () => void;
  onPreferences?: (p: Partial<Preferences>) => void;
  elapsed: number;
  displayName: string;
}) {
  const concept =
      material.concepts.find((c) => c.id === session.concept_id) ||
      material.concepts[0],
    index = material.concepts.indexOf(concept),
    sources = material.sources.filter((s) => concept.source_ids.includes(s.id));
  const [zen, setZen] = useState(false),
    [selectedPart, setSelectedPart] = useState(0),
    [note, setNote] = useState("");
  const modeSelect = useRef<HTMLSelectElement>(null);
  function chooseMode() {
    modeSelect.current?.scrollIntoView({ block: "center" });
    modeSelect.current?.focus();
  }
  const pauseDialog = useRef<HTMLDialogElement>(null),
    sourcesDialog = useRef<HTMLDialogElement>(null);
  const diagramParts = (concept.diagram_description || "")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const readingStyle: CSSProperties = {
    fontSize: preferences.font_size,
    lineHeight: preferences.line_height,
    letterSpacing: `${preferences.letter_spacing}em`,
    fontFamily:
      preferences.font_family === "nunito"
        ? "Nunito"
        : preferences.font_family === "system"
          ? "system-ui"
          : "Plus Jakarta Sans",
  };
  function next() {
    if (
      session.mode === "focus" &&
      session.paragraph < concept.paragraphs.length - 1
    ) {
      update({ paragraph: session.paragraph + 1 });
      return;
    }
    const completed = Array.from(
      new Set([...session.completed_concepts, concept.id]),
    );
    update({
      completed_concepts: completed,
      ...(index < material.concepts.length - 1
        ? { concept_id: material.concepts[index + 1].id, paragraph: 0 }
        : {
            status:
              completed.length === material.concepts.length
                ? "completed"
                : "active",
          }),
    });
  }
  function previous() {
    if (session.mode === "focus" && session.paragraph > 0)
      update({ paragraph: session.paragraph - 1 });
    else if (index > 0)
      update({ concept_id: material.concepts[index - 1].id, paragraph: 0 });
  }
  function pause() {
    update({ status: session.status === "completed" ? "completed" : "paused" });
    pauseDialog.current?.showModal();
  }
  async function copyText() {
    try {
      await navigator.clipboard.writeText(
        concept.transcript ||
          concept.diagram_description ||
          concept.paragraphs.join("\n\n"),
      );
      setNote("Teks disalin.");
    } catch {
      setNote(
        "Teks belum bisa disalin. Kamu tetap dapat memilih dan menyalinnya secara manual.",
      );
    }
  }
  return (
    <div className="stitch-screen stitch-reader" data-zen={zen}>
      {session.mode === "focus" ? (
        <div className="flex flex-col w-full">
          <div className="w-full bg-surface shadow-sm">
            <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <button
                    className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                    data-path="learning-hub"
                    disabled={busy}
                    onClick={onBack}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span className="hidden sm:inline">Keluar Sesi</span>
                  </button>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-label">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="font-bold">Focus Navigator</span>
                    <span className="hidden md:inline font-normal">
                      • Selangkah demi Selangkah
                    </span>
                  </span>
                  <button
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-secondary hover:text-primary font-metadata text-metadata transition-colors"
                    data-path="mode-selector"
                    disabled={busy}
                    onClick={chooseMode}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      tune
                    </span>
                    <span>Ganti Mode Belajar</span>
                  </button>
                </div>

                <div className="flex items-center gap-space-xs">
                  <button
                    className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-all"
                    id="btn-pause"
                    title="Jeda latihan sejenak"
                    type="button"
                    disabled={busy}
                    onClick={pause}
                  >
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      self_improvement
                    </span>
                    <span className="hidden lg:inline">Jeda Sesi</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-all"
                    id="btn-zen"
                    title="Fokus Penuh tanpa distraksi"
                    type="button"
                    disabled={busy}
                    onClick={() => setZen(!zen)}
                    aria-pressed={zen}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      fullscreen
                    </span>
                    <span className="hidden md:inline">Layar Bersih</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-xl bg-secondary-fixed hover:bg-secondary-container text-primary font-label text-label transition-all"
                    id="btn-toggle-voice"
                    type="button"
                    disabled={busy}
                    onClick={() => onSpeak()}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      volume_up
                    </span>
                    <span className="hidden sm:inline font-bold">
                      Narasi Mimo: Aktif
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pt-space-xs">
                <div>
                  <span className="font-metadata text-metadata text-text-secondary block">
                    LANGKAH 2 DARI 4
                  </span>
                  <h2 className="font-card-title text-card-title text-primary">
                    {concept.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 min-w-[240px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="grid grid-cols-4 gap-1.5 w-full h-2">
                      <div className="bg-secondary rounded-full h-full"></div>

                      <div className="bg-primary rounded-full h-full ring-2 ring-primary/20"></div>

                      <div className="bg-surface-container-high rounded-full h-full"></div>

                      <div className="bg-surface-container-high rounded-full h-full"></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-text-secondary font-metadata">
                      <span className="text-secondary font-bold">
                        {concept.title}
                      </span>
                      <span className="text-primary font-bold">
                        2. Kuadrat Ubin
                      </span>
                      <span>3. Hitung Sisi</span>
                      <span>4. Refleksi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              <article
                className="lg:col-span-8 flex flex-col gap-space-lg bg-surface rounded-[24px] p-space-lg md:p-space-xl shadow-md transition-all"
                id="zen-content-card"
              >
                <div className="flex items-center justify-between gap-space-md">
                  <span className="font-label text-label text-secondary">{`LANGKAH ${session.paragraph + 1} DARI ${concept.paragraphs.length}`}</span>
                  {preferences.timer_enabled && (
                    <span className="font-metadata text-metadata text-text-secondary">
                      Waktu fokus {Math.floor(elapsed / 60)}:
                      {String(elapsed % 60).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-page-title text-primary mt-space-lg">
                  {concept.title}
                </h1>
                <p
                  className="font-reading text-reading text-primary my-space-lg"
                  style={readingStyle}
                >
                  {concept.paragraphs[session.paragraph]}
                </p>
                <figure className="rounded-2xl bg-surface-container-low p-space-lg my-space-md">
                  {material.is_demo && material.subject === "Matematika" ? (
                    <svg
                      className="w-full h-full select-none"
                      viewBox="0 0 420 420"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          height="12"
                          id="grid-pattern-sage"
                          patternUnits="userSpaceOnUse"
                          width="12"
                        >
                          <path
                            d="M 12 0 L 0 0 0 12"
                            fill="none"
                            stroke="#28583E"
                            strokeOpacity="0.25"
                            strokeWidth="0.75"
                          ></path>
                        </pattern>
                        <pattern
                          height="12"
                          id="grid-pattern-lavender"
                          patternUnits="userSpaceOnUse"
                          width="12"
                        >
                          <path
                            d="M 12 0 L 0 0 0 12"
                            fill="none"
                            stroke="#243469"
                            strokeOpacity="0.25"
                            strokeWidth="0.75"
                          ></path>
                        </pattern>
                        <pattern
                          height="12"
                          id="grid-pattern-peach"
                          patternUnits="userSpaceOnUse"
                          width="12"
                        >
                          <path
                            d="M 12 0 L 0 0 0 12"
                            fill="none"
                            stroke="#61450E"
                            strokeOpacity="0.25"
                            strokeWidth="0.75"
                          ></path>
                        </pattern>
                      </defs>

                      <g
                        className="transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        id="tile-a"
                      >
                        <rect
                          fill="#C8E8CE"
                          fillOpacity="0.65"
                          height="90"
                          rx="6"
                          stroke="#496550"
                          strokeWidth="2"
                          width="90"
                          x="180"
                          y="270"
                        ></rect>
                        <rect
                          fill="url(#grid-pattern-sage)"
                          height="90"
                          rx="6"
                          width="90"
                          x="180"
                          y="270"
                        ></rect>

                        <line
                          stroke="#496550"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="210"
                          x2="210"
                          y1="270"
                          y2="360"
                        ></line>
                        <line
                          stroke="#496550"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="240"
                          x2="240"
                          y1="270"
                          y2="360"
                        ></line>
                        <line
                          stroke="#496550"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="180"
                          x2="270"
                          y1="300"
                          y2="300"
                        ></line>
                        <line
                          stroke="#496550"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="180"
                          x2="270"
                          y1="330"
                          y2="330"
                        ></line>
                        <text
                          fill="#112520"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          x="225"
                          y="320"
                        >
                          a² = 9 ubin
                        </text>
                        <text
                          fill="#496550"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          x="225"
                          y="336"
                        >
                          (Sisi a = 3)
                        </text>
                      </g>

                      <g
                        className="transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        id="tile-b"
                      >
                        <rect
                          fill="#DCE1FF"
                          fillOpacity="0.6"
                          height="120"
                          rx="6"
                          stroke="#243469"
                          strokeWidth="2"
                          width="120"
                          x="60"
                          y="150"
                        ></rect>
                        <rect
                          fill="url(#grid-pattern-lavender)"
                          height="120"
                          rx="6"
                          width="120"
                          x="60"
                          y="150"
                        ></rect>

                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="90"
                          x2="90"
                          y1="150"
                          y2="270"
                        ></line>
                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="120"
                          x2="120"
                          y1="150"
                          y2="270"
                        ></line>
                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="150"
                          x2="150"
                          y1="150"
                          y2="270"
                        ></line>
                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="60"
                          x2="180"
                          y1="180"
                          y2="180"
                        ></line>
                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="60"
                          x2="180"
                          y1="210"
                          y2="210"
                        ></line>
                        <line
                          stroke="#243469"
                          strokeDasharray="2,2"
                          strokeWidth="1"
                          x1="60"
                          x2="180"
                          y1="240"
                          y2="240"
                        ></line>
                        <text
                          fill="#0B1D53"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          x="120"
                          y="214"
                        >
                          b² = 16 ubin
                        </text>
                        <text
                          fill="#243469"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          x="120"
                          y="230"
                        >
                          (Sisi b = 4)
                        </text>
                      </g>

                      <polygon
                        fill="#112520"
                        fillOpacity="0.1"
                        points="180,270 270,270 180,150"
                        stroke="#112520"
                        strokeWidth="3"
                      ></polygon>

                      <path
                        d="M 180 256 L 194 256 L 194 270"
                        fill="none"
                        stroke="#112520"
                        strokeWidth="2"
                      ></path>
                      <circle cx="187" cy="263" fill="#112520" r="2"></circle>

                      <g
                        className="transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        id="tile-c"
                      >
                        <polygon
                          fill="#FFCA9D"
                          fillOpacity="0.65"
                          points="180,150 270,270 390,180 300,60"
                          stroke="#61450E"
                          strokeWidth="2"
                        ></polygon>
                        <polygon
                          fill="url(#grid-pattern-peach)"
                          points="180,150 270,270 390,180 300,60"
                        ></polygon>
                        <text
                          fill="#61450E"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="15"
                          fontWeight="700"
                          textAnchor="middle"
                          x="285"
                          y="166"
                        >
                          c² = 25 ubin
                        </text>
                        <text
                          fill="#112520"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontSize="11"
                          fontWeight="600"
                          textAnchor="middle"
                          x="285"
                          y="184"
                        >
                          (Sisi miring c = 5)
                        </text>
                      </g>

                      <rect
                        fill="#112520"
                        height="34"
                        rx="8"
                        width="150"
                        x="135"
                        y="375"
                      ></rect>
                      <text
                        fill="#FFFFFF"
                        fontFamily="'Plus Jakarta Sans', sans-serif"
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                        x="210"
                        y="397"
                      >
                        9 + 16 = 25 Ubin!
                      </text>
                    </svg>
                  ) : (
                    <Image
                      src="/design/subject-science.png"
                      alt="Ilustrasi pendamping materi"
                      width={1024}
                      height={1024}
                      className="w-full h-52 object-cover rounded-xl"
                    />
                  )}
                  <figcaption className="font-metadata text-metadata text-text-secondary mt-space-md">
                    {concept.diagram_description ||
                      "Ilustrasi pendamping. Periksa teks sumber untuk penjelasan konsep."}
                  </figcaption>
                </figure>
                <button
                  disabled={busy}
                  onClick={onPractice}
                  className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
                >
                  Coba latihan
                </button>
              </article>

              <aside className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="bg-surface rounded-[24px] p-space-lg shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between mb-space-sm">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container text-text-secondary">
                      <span className="w-2 h-2 rounded-full bg-mimo-body"></span>
                      Teman Setiamu
                    </span>
                    <span className="font-metadata text-metadata text-text-secondary text-xs">
                      Mimo Si Bunglon
                    </span>
                  </div>

                  <div className="w-44 h-44 rounded-2xl overflow-hidden bg-surface-container-low flex items-center justify-center mb-space-md shadow-inner">
                    <Image
                      alt="Mimo, teman belajarmu"
                      className="w-full h-full object-contain p-2"
                      src="/design/mimo.png"
                      width={1024}
                      height={1024}
                    />
                  </div>

                  <div className="relative bg-secondary-container text-primary p-space-md rounded-2xl w-full text-left shadow-sm">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container rotate-45"></div>
                    <p className="font-mimo-voice text-mimo-voice leading-snug relative z-10 text-base">
                      “Nggak usah terburu-buru, {displayName}. Kalau matamu
                      terasa lelah atau pikiran mulai melayang, tekan tombol{" "}
                      <span className="font-bold underline cursor-pointer">
                        Jeda Sesi
                      </span>{" "}
                      di atas. Belajarmu akan Mimo simpan persis di langkah
                      ini.”
                    </p>
                  </div>

                  <div className="w-full mt-space-md pt-space-md border-t border-divider flex items-center justify-between text-left">
                    <div>
                      <span className="font-metadata text-metadata text-text-secondary block text-xs">
                        Irama Belajar
                      </span>
                      <span className="font-label text-label text-primary font-bold">
                        Tenang &amp; Mengalir
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        spa
                      </span>
                      <span className="text-xs font-bold">Bebas Stres</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-[24px] p-space-lg shadow-sm space-y-space-md">
                  <h4 className="font-card-title text-card-title text-primary flex items-center gap-space-xs">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      checklist
                    </span>
                    <span>Rangkaian Langkah Sesi Ini</span>
                  </h4>
                  <div className="space-y-space-sm">
                    <div className="flex items-start gap-space-sm p-space-sm rounded-xl bg-surface-container-low">
                      <span
                        className="material-symbols-outlined text-success text-[20px] mt-0.5"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      <div>
                        <span className="font-label text-label text-primary block leading-tight">
                          {concept.title}
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary text-xs">
                          Selesai dalam 3 menit
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm p-space-sm rounded-xl bg-secondary-container/40">
                      <span
                        className="material-symbols-outlined text-primary text-[20px] mt-0.5"
                        aria-hidden="true"
                      >
                        play_circle
                      </span>
                      <div>
                        <span className="font-label text-label text-primary font-bold block leading-tight">
                          Langkah 2: Hubungan Kuadrat Sisi
                        </span>
                        <span className="font-metadata text-metadata text-secondary font-bold text-xs">
                          Sedang dikerjakan sekarang
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm p-space-sm rounded-xl text-muted-gray">
                      <span
                        className="material-symbols-outlined text-outline-variant text-[20px] mt-0.5"
                        aria-hidden="true"
                      >
                        radio_button_unchecked
                      </span>
                      <div>
                        <span className="font-label text-label block leading-tight">
                          Langkah 3: Hitung Panjang Sisi Sebenarnya
                        </span>
                        <span className="font-metadata text-metadata text-xs">
                          Contoh segitiga tangga gedung
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm p-space-sm rounded-xl text-muted-gray">
                      <span
                        className="material-symbols-outlined text-outline-variant text-[20px] mt-0.5"
                        aria-hidden="true"
                      >
                        radio_button_unchecked
                      </span>
                      <div>
                        <span className="font-label text-label block leading-tight">
                          Langkah 4: Refleksi &amp; Ringkasan Pribadi
                        </span>
                        <span className="font-metadata text-metadata text-xs">
                          Menyimpan kartu ke jurnal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <div className="w-full bg-surface shadow-[0_-2px_12px_rgba(0,0,0,0.04)] sticky bottom-0 z-30">
            <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                data-path="pythagoras-step-1"
                disabled={busy}
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>{concept.title}</span>
              </button>

              <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata">
                <span
                  className="material-symbols-outlined text-success text-[18px]"
                  aria-hidden="true"
                >
                  cloud_done
                </span>
                <span>Progres tersimpan otomatis di awan</span>
              </div>

              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm transition-all"
                data-path="pythagoras-step-3"
                disabled={busy}
                onClick={next}
              >
                {
                  <>
                    Lanjutkan langkah belajar
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      arrow_forward
                    </span>
                  </>
                }
              </button>
            </div>
          </div>
        </div>
      ) : session.mode === "explore" ? (
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md md:py-space-lg flex flex-col gap-space-lg">
            <div className="w-full bg-surface rounded-xl shadow-sm p-space-md flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center flex-wrap gap-space-sm min-w-0">
                <button
                  className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded-lg px-2 py-1"
                  data-path="learning-hub"
                  disabled={busy}
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Ringkasan Bab 4</span>
                </button>
                <span className="hidden sm:inline text-outline-variant font-bold">
                  •
                </span>
                <div className="inline-flex items-center gap-space-xs bg-secondary-container/60 text-on-secondary-container px-3 py-1 rounded-full font-metadata text-metadata font-bold">
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    explore
                  </span>
                  <span className="truncate">
                    Mode Aktif: Dengarkan &amp; Jelajahi (Audio &amp; Visual
                    Explorer)
                  </span>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-primary hover:bg-surface-container px-2.5 py-1 rounded-lg font-metadata text-metadata font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={chooseMode}
                >
                  <span>Ganti Cara Belajar</span>
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    swap_horiz
                  </span>
                </button>
              </div>

              <div className="flex items-center flex-wrap gap-space-xs ml-auto">
                <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg text-primary text-xs font-label">
                  <button
                    className="px-2 py-1 rounded hover:bg-surface text-text-secondary transition-colors"
                    title="Kecepatan 0.8x"
                    type="button"
                    disabled={busy}
                    onClick={() => onPreferences?.({ speech_rate: 0.8 })}
                  >
                    0.8x
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-surface shadow-xs font-bold text-primary"
                    title="Kecepatan Normal"
                    type="button"
                    disabled={busy}
                    onClick={() => onPreferences?.({ speech_rate: 1.0 })}
                  >
                    1.0x
                  </button>
                  <button
                    className="px-2 py-1 rounded hover:bg-surface text-text-secondary transition-colors"
                    title="Kecepatan 1.2x"
                    type="button"
                    disabled={busy}
                    onClick={() => onPreferences?.({ speech_rate: 1.2 })}
                  >
                    1.2x
                  </button>
                </div>
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-metadata text-metadata transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  id="btn-high-contrast"
                  title="Aktifkan Kontras Ramah Mata"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    onPreferences?.({
                      high_contrast: !preferences.high_contrast,
                    })
                  }
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    contrast
                  </span>
                  <span className="hidden md:inline">Kontras Mata</span>
                </button>
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-metadata text-metadata font-bold hover:bg-secondary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={() => onSpeak()}
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    aria-hidden="true"
                  >
                    record_voice_over
                  </span>
                  <span className="hidden md:inline">Suara Mimo Aktif</span>
                </button>
                <button
                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-secondary text-xs font-metadata transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  title="Pintasan Keyboard Alt+A"
                  type="button"
                  disabled={busy}
                  onClick={chooseMode}
                >
                  <span
                    className="material-symbols-outlined text-[14px]"
                    aria-hidden="true"
                  >
                    keyboard
                  </span>
                  <span className="hidden lg:inline">Alt+A</span>
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="px-3 py-1 rounded-full bg-butter/60 text-warning font-label text-label font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  Konsep 1 dari 3 • Audio 4:12 Menit • Diagram Interaktif
                </span>
              </div>
              <h1 className="font-page-title text-page-title text-primary tracking-tight">
                {concept.title}
              </h1>
              <p className="font-reading text-reading text-text-secondary max-w-4xl">
                {concept.transcript || concept.paragraphs[0]}
              </p>
            </div>

            <div className="w-full bg-surface rounded-2xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <button
                    aria-label="Baca ulang dari awal"
                    className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onSpeak(
                        concept.transcript || concept.paragraphs.join(" "),
                      )
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      replay_10
                    </span>
                  </button>
                  <button
                    aria-label="Putar atau hentikan bacaan"
                    className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary flex items-center gap-2 font-label text-label transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                    id="audio-play-toggle"
                    type="button"
                    disabled={busy}
                    onClick={() => onSpeak()}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      id="play-icon"
                      aria-hidden="true"
                    >
                      pause
                    </span>
                    <span id="play-label">
                      {speaking ? "Hentikan audio" : "Dengarkan konsep"}
                    </span>
                  </button>
                  <button
                    aria-label="Lanjut ke konsep berikutnya"
                    className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                    type="button"
                    disabled={busy}
                    onClick={next}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      forward_10
                    </span>
                  </button>

                  <div className="flex items-baseline gap-1 font-label text-label ml-space-xs text-primary font-bold">
                    <span id="current-time">
                      {preferences.timer_enabled
                        ? `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`
                        : "Tanpa batas waktu"}
                    </span>
                    <span className="text-text-secondary font-normal">/</span>
                    <span className="text-text-secondary font-normal">
                      {"Suara perangkat"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <button
                    type="button"
                    className="h-10 px-space-sm rounded-xl bg-surface-container-low text-primary font-label text-label"
                    aria-pressed={preferences.captions}
                    onClick={() =>
                      onPreferences?.({ captions: !preferences.captions })
                    }
                  >
                    {preferences.captions
                      ? "Sembunyikan transkrip"
                      : "Tampilkan transkrip"}
                  </button>
                </div>
              </div>

              <div
                className="w-full rounded-xl p-space-sm bg-surface-container-low font-metadata text-metadata text-text-secondary"
                role="status"
              >
                {speaking
                  ? "Sedang membacakan konsep dengan suara peramban."
                  : "Siap membacakan konsep. Kecepatan dapat diatur di bawah."}
              </div>
              <div
                hidden={!preferences.captions}
                className="w-full bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-sm"
              >
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-primary">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    graphic_eq
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-metadata text-metadata font-bold text-secondary uppercase tracking-wider text-xs">
                      Transkrip Materi
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>
                  </div>
                  <p className="font-reading text-reading text-on-surface leading-relaxed">
                    {concept.transcript || concept.paragraphs[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-7 bg-surface rounded-2xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-xs">
                  <div>
                    <h2 className="font-card-title text-card-title text-primary">
                      {"Jelajahi Diagram & Penjelasan"}
                    </h2>
                    <p className="font-metadata text-metadata text-text-secondary">
                      {concept.transcript || concept.paragraphs[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                      title="Perbesar Ukuran Diagram"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        zoom_in
                      </span>
                    </button>
                    <button
                      className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                      title="Mode Kontras Tinggi Diagram"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        tonality
                      </span>
                    </button>
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-metadata text-metadata transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                      title="Salin Deskripsi Teks Alternatif"
                      type="button"
                      disabled={busy}
                      onClick={copyText}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        content_copy
                      </span>
                      <span className="hidden sm:inline">Salin Alt Teks</span>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-surface-bright rounded-xl p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden select-none">
                  <figure className="rounded-2xl bg-surface-container-low p-space-lg my-space-md">
                    {material.is_demo && material.subject === "Matematika" ? (
                      <svg
                        aria-label="Diagram interaktif segitiga siku-siku ABC dengan perbandingan sisi 3m tinggi dinding, 4m jarak lantai, dan 5m tangga hipotenusa"
                        className="w-full max-w-lg aspect-[4/3] drop-shadow-sm"
                        role="img"
                        viewBox="0 0 500 380"
                      >
                        <defs>
                          <pattern
                            height="20"
                            id="mathGrid"
                            patternUnits="userSpaceOnUse"
                            width="20"
                          >
                            <path
                              d="M 20 0 L 0 0 0 20"
                              fill="none"
                              stroke="#E5E8E1"
                              strokeWidth="0.8"
                            ></path>
                          </pattern>

                          <pattern
                            height="10"
                            id="hatchOrange"
                            patternTransform="rotate(45 0 0)"
                            patternUnits="userSpaceOnUse"
                            width="10"
                          >
                            <line
                              stroke="#FFCA9D"
                              strokeWidth="3"
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="10"
                            ></line>
                          </pattern>
                          <pattern
                            height="10"
                            id="hatchGreen"
                            patternTransform="rotate(-45 0 0)"
                            patternUnits="userSpaceOnUse"
                            width="10"
                          >
                            <line
                              stroke="#C8E8CE"
                              strokeWidth="3"
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="10"
                            ></line>
                          </pattern>
                        </defs>

                        <rect
                          fill="url(#mathGrid)"
                          height="100%"
                          rx="12"
                          width="100%"
                        ></rect>

                        <rect
                          fill="#E3E3DE"
                          height="270"
                          rx="3"
                          width="16"
                          x="70"
                          y="30"
                        ></rect>
                        <text
                          fill="#737B75"
                          fontFamily="Plus Jakarta Sans"
                          fontSize="11"
                          fontWeight="bold"
                          x="50"
                          y="45"
                        >
                          DINDING TEGAK
                        </text>

                        <rect
                          fill="#E9E8E3"
                          height="14"
                          rx="3"
                          width="370"
                          x="70"
                          y="296"
                        ></rect>
                        <text
                          fill="#737B75"
                          fontFamily="Plus Jakarta Sans"
                          fontSize="11"
                          fontWeight="bold"
                          x="350"
                          y="330"
                        >
                          LANTAI DATAR
                        </text>

                        <g
                          aria-label="Sudut 90 Derajat di pertemuan dinding dan lantai"
                          className="cursor-pointer group"
                        >
                          <path
                            d="M 86 270 L 112 270 L 112 296"
                            fill="#F8F7F2"
                            stroke="#273B35"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                          ></path>
                          <circle
                            cx="99"
                            cy="283"
                            fill="#273B35"
                            r="3"
                          ></circle>
                          <rect
                            fill="#112520"
                            height="22"
                            rx="6"
                            width="62"
                            x="118"
                            y="266"
                          ></rect>
                          <text
                            fill="#FFFFFF"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="11"
                            fontWeight="700"
                            textAnchor="middle"
                            x="149"
                            y="281"
                          >
                            Sudut 90°
                          </text>
                        </g>

                        <g
                          aria-label="Sisi b Dinding Tegak 3 meter"
                          className="cursor-pointer group"
                        >
                          <line
                            stroke="#496550"
                            strokeLinecap="round"
                            strokeWidth="7"
                            x1="86"
                            x2="86"
                            y1="70"
                            y2="296"
                          ></line>

                          <rect
                            fill="#FFFFFF"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                            height="28"
                            rx="8"
                            width="64"
                            x="15"
                            y="170"
                          ></rect>
                          <text
                            fill="#112520"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="12"
                            fontWeight="800"
                            textAnchor="middle"
                            x="47"
                            y="188"
                          >
                            b = 3 m
                          </text>
                        </g>

                        <g
                          aria-label="Sisi a Lantai Mendatar 4 meter"
                          className="cursor-pointer group"
                        >
                          <line
                            stroke="#496550"
                            strokeLinecap="round"
                            strokeWidth="7"
                            x1="86"
                            x2="386"
                            y1="296"
                            y2="296"
                          ></line>

                          <rect
                            fill="#FFFFFF"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                            height="28"
                            rx="8"
                            width="64"
                            x="200"
                            y="306"
                          ></rect>
                          <text
                            fill="#112520"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="12"
                            fontWeight="800"
                            textAnchor="middle"
                            x="232"
                            y="324"
                          >
                            a = 4 m
                          </text>
                        </g>

                        <g
                          aria-label="Sisi c Hipotenusa Tangga 5 meter, sedang aktif terpilih"
                          className="cursor-pointer group"
                        >
                          <line
                            opacity="0.85"
                            stroke="#FFE7A3"
                            strokeLinecap="round"
                            strokeWidth="18"
                            x1="86"
                            x2="386"
                            y1="70"
                            y2="296"
                          ></line>

                          <line
                            stroke="#FFCA9D"
                            strokeLinecap="round"
                            strokeWidth="8"
                            x1="86"
                            x2="386"
                            y1="70"
                            y2="296"
                          ></line>

                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="130"
                            x2="142"
                            y1="103"
                            y2="112"
                          ></line>
                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="175"
                            x2="187"
                            y1="137"
                            y2="146"
                          ></line>
                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="220"
                            x2="232"
                            y1="171"
                            y2="180"
                          ></line>
                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="265"
                            x2="277"
                            y1="205"
                            y2="214"
                          ></line>
                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="310"
                            x2="322"
                            y1="239"
                            y2="248"
                          ></line>
                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="3"
                            x1="355"
                            x2="367"
                            y1="273"
                            y2="282"
                          ></line>

                          <rect
                            fill="#112520"
                            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
                            height="34"
                            rx="10"
                            width="134"
                            x="230"
                            y="130"
                          ></rect>
                          <text
                            fill="#FFFFFF"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="13"
                            fontWeight="800"
                            textAnchor="middle"
                            x="297"
                            y="152"
                          >
                            ★ c = 5 m (Hipotenusa)
                          </text>
                        </g>

                        <path
                          d="M 125 255 Q 185 220 220 185"
                          fill="none"
                          stroke="#28583E"
                          strokeDasharray="4,4"
                          strokeWidth="2"
                        ></path>
                        <polygon
                          fill="#28583E"
                          points="220,185 212,192 216,198"
                        ></polygon>
                        <text
                          fill="#28583E"
                          fontFamily="Plus Jakarta Sans"
                          fontSize="10"
                          fontWeight="700"
                          x="145"
                          y="215"
                        >
                          Tepat Menghadap Sudut 90°
                        </text>
                      </svg>
                    ) : (
                      <Image
                        src="/design/subject-science.png"
                        alt="Ilustrasi pendamping materi"
                        width={1024}
                        height={1024}
                        className="w-full h-52 object-cover rounded-xl"
                      />
                    )}
                    <figcaption className="font-metadata text-metadata text-text-secondary mt-space-md">
                      {concept.diagram_description ||
                        "Ilustrasi pendamping. Periksa teks sumber untuk penjelasan konsep."}
                    </figcaption>
                  </figure>

                  <div className="w-full mt-4 pt-3 flex flex-wrap items-center justify-center gap-2"></div>
                </div>

                <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-butter flex items-center justify-center flex-shrink-0 text-warning font-black text-lg">
                      25
                    </div>
                    <div>
                      <div className="font-label text-label text-primary font-bold">{`Santai aja, ${displayName}. Satu langkah kecil sudah berarti.`}</div>
                      <p className="font-metadata text-metadata text-text-secondary">
                        {concept.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs bg-surface px-3 py-1.5 rounded-lg text-primary font-bold">
                    <span>4² + 3² = 16 + 9 = 25 = 5²</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-space-lg">
                <div className="w-full bg-surface rounded-2xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-peach/40 text-primary font-label text-label text-xs font-bold">
                      Bagian Terpilih Saat Ini
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 text-text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded-lg"
                        title="Dengarkan Ulang Bagian Ini"
                        type="button"
                        disabled={busy}
                        onClick={() => onSpeak()}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          volume_up
                        </span>
                      </button>
                      <button
                        className="p-1.5 text-text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded-lg"
                        title="Salin Catatan Elemen Ini"
                        type="button"
                        disabled={busy}
                        onClick={() => onSpeak()}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          bookmark_add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-card-title text-card-title text-primary">
                      {concept.title}
                    </h3>
                    <p className="font-reading text-reading text-text-secondary">
                      {concept.diagram_description}
                    </p>
                    <div className="flex flex-col gap-space-sm">
                      {diagramParts.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedPart(i)}
                          aria-pressed={selectedPart === i}
                          className="rounded-xl p-space-sm text-left bg-surface-container text-primary font-label text-label"
                        >
                          {i + 1}. {p}
                        </button>
                      ))}
                    </div>
                    <p className="font-body text-body text-primary mt-space-md">
                      {diagramParts[selectedPart]}
                    </p>
                    <button
                      onClick={() => onSpeak(diagramParts[selectedPart])}
                      className="h-11 px-space-md rounded-xl bg-secondary-container text-primary font-label text-label"
                    >
                      Dengarkan bagian ini
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="bg-surface-container-low p-3 rounded-xl flex flex-col">
                      <span className="font-metadata text-metadata text-text-secondary text-xs">
                        Peran Geometris
                      </span>
                      <span className="font-label text-label text-primary font-bold">
                        Di Seberang 90°
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl flex flex-col">
                      <span className="font-metadata text-metadata text-text-secondary text-xs">
                        Panjang Nyata
                      </span>
                      <span className="font-label text-label text-primary font-bold">
                        5 Meter (25 Ubin)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-secondary-container/40 rounded-xl p-space-md flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        record_voice_over
                      </span>
                      <span className="font-mimo-voice text-mimo-voice text-xs text-primary font-bold uppercase tracking-wider">
                        Penjelasan Suara Mimo:
                      </span>
                    </div>
                    <p className="font-reading text-reading text-on-surface text-sm leading-relaxed">{`Santai aja, ${displayName}. Satu langkah kecil sudah berarti.`}</p>
                  </div>
                  <div className="flex items-center gap-space-sm pt-space-xs">
                    <button
                      className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-focus"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        play_circle
                      </span>
                      <span>Dengarkan Ulang</span>
                    </button>
                    <button
                      className="py-2 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                      type="button"
                      disabled={busy}
                      onClick={copyText}
                    >
                      Salin Catatan
                    </button>
                  </div>
                </div>

                <div className="w-full bg-surface rounded-2xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
                  <h3 className="font-card-title text-card-title text-primary">
                    Catatan tentang diagram
                  </h3>
                  <p className="font-body text-body text-text-secondary">
                    Tuliskan bagian yang ingin kamu ingat, lalu simpan
                    catatanmu.
                  </p>
                  <textarea
                    aria-label="Catatan diagram"
                    value={draft}
                    maxLength={3000}
                    onChange={(e) => setDraft(e.target.value)}
                    className="rounded-xl p-space-md bg-surface-container-low w-full"
                  />
                  <button
                    disabled={busy}
                    onClick={() => update({})}
                    className="h-11 px-space-md rounded-xl bg-primary text-on-primary font-label text-label"
                  >
                    Simpan catatan
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full bg-surface rounded-2xl shadow-sm p-space-md md:p-space-lg grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
              <div className="md:col-span-5 flex items-center gap-space-md">
                <div className="relative w-28 h-28 flex-shrink-0 bg-surface-container-low rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    alt="Mimo, teman belajarmu"
                    className="w-full h-full object-contain p-1"
                    src="/design/mimo.png"
                    width={1024}
                    height={1024}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary uppercase font-metadata">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      support_agent
                    </span>
                    <span>Co-Pilot Mimo</span>
                  </div>
                  <p className="font-mimo-voice text-mimo-voice text-sm text-primary leading-snug">
                    {concept.transcript || concept.paragraphs[0]}
                  </p>
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col gap-space-xs">
                <span className="font-metadata text-metadata text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Urutan Segmen Audio Bab Ini
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2.5 text-left">
                    <span
                      className="material-symbols-outlined text-success text-[18px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-label text-label text-xs text-primary font-bold truncate">
                        1. Analogi Tangga Rumah
                      </div>
                      <div className="text-[11px] font-metadata text-text-secondary">
                        00:00 - Selesai disimak
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-secondary-container/70 flex items-center gap-2.5 text-left ring-2 ring-primary">
                    <span
                      className="material-symbols-outlined text-primary text-[18px] animate-pulse"
                      aria-hidden="true"
                    >
                      radio_button_checked
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-label text-label text-xs text-primary font-bold truncate">
                        {concept.title}
                      </div>
                      <div className="text-[11px] font-metadata text-on-secondary-container font-semibold">
                        01:15 - Sedang Berjalan
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2.5 text-left opacity-75">
                    <span
                      className="material-symbols-outlined text-text-secondary text-[18px]"
                      aria-hidden="true"
                    >
                      lock_clock
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-label text-label text-xs text-primary truncate">
                        3. Kenapa Sudut 90 Derajat?
                      </div>
                      <div className="text-[11px] font-metadata text-text-secondary">
                        02:40 - Berikutnya
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2.5 text-left opacity-75">
                    <span
                      className="material-symbols-outlined text-text-secondary text-[18px]"
                      aria-hidden="true"
                    >
                      lock_clock
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-label text-label text-xs text-primary truncate">
                        4. Rangkuman &amp; Ubin
                      </div>
                      <div className="text-[11px] font-metadata text-text-secondary">
                        03:30 - Berikutnya
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-surface rounded-2xl shadow-sm p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md mb-space-lg">
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                data-path="teman-baca"
                disabled={busy}
                onClick={chooseMode}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  menu_book
                </span>
                <span>Ganti ke Mode Teman Baca</span>
              </button>
              <div className="flex items-center gap-2 font-label text-label text-secondary font-bold">
                <span
                  className="material-symbols-outlined text-[18px] text-success"
                  aria-hidden="true"
                >
                  task_alt
                </span>
                <span>2 dari 4 segmen audio telah disimak</span>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                <button
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={next}
                >
                  Tandai Paham
                </button>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  data-path="pythagoras-concept-1-segment-3"
                  disabled={busy}
                  onClick={next}
                >
                  {
                    <>
                      Lanjutkan langkah belajar
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        arrow_forward
                      </span>
                    </>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : session.mode === "transcript" ? (
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface shadow-sm py-space-sm px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-sm">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label text-label">
                  <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                  <span>
                    Sedang Aktif: Teks &amp; Visual Bergambar (Visual &amp;
                    Caption Learning)
                  </span>
                </span>
                <button
                  className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                  id="switch-mode-btn"
                  disabled={busy}
                  onClick={chooseMode}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    sync_alt
                  </span>
                  <span>Ganti Cara Belajar ⇄</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
                  <span className="text-xs font-metadata text-text-secondary px-2 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      subtitles
                    </span>{" "}
                    Takarir:
                  </span>
                  <button
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-surface text-primary shadow-sm transition-all"
                    id="cap-normal"
                    disabled={busy}
                    onClick={() => onPreferences?.({ font_size: 18 })}
                  >
                    Normal
                  </button>
                  <button
                    className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-surface text-on-surface-variant transition-all"
                    id="cap-large"
                    disabled={busy}
                    onClick={() => onPreferences?.({ font_size: 22 })}
                  >
                    Besar
                  </button>
                  <button
                    className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-surface text-on-surface-variant transition-all"
                    id="cap-xl"
                    disabled={busy}
                    onClick={() => onPreferences?.({ font_size: 28 })}
                  >
                    Sangat Jelas
                  </button>
                </div>

                <button
                  className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-label transition-colors"
                  id="contrast-toggle"
                  disabled={busy}
                  onClick={() =>
                    onPreferences?.({
                      high_contrast: !preferences.high_contrast,
                    })
                  }
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    contrast
                  </span>
                  <span id="contrast-label">Kontras: Standar</span>
                </button>
                <span className="hidden 2xl:inline-block text-xs font-metadata text-text-secondary pl-space-xs">
                  Ramah pembelajar mandiri tanpa audio
                </span>
              </div>
            </div>
          </section>

          <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-lg pb-space-md">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs text-xs font-metadata text-text-secondary">
                <button
                  className="hover:text-primary transition-colors flex items-center gap-1 font-label"
                  disabled={busy}
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Ringkasan Bab 4</span>
                </button>
                <span className="text-muted-gray">•</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label">
                  Konsep 2 dari 3: Membuktikan Hubungan Kuadrat Sisi a² + b² =
                  c²
                </span>
              </div>
              <div className="mt-space-xs flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="max-w-4xl">
                  <h1 className="font-page-title text-page-title text-primary tracking-tight">
                    {concept.title}
                  </h1>
                  <p className="mt-space-xs font-reading text-reading text-on-surface-variant">
                    Penjelasan visual bergaya infografis zine edukatif dengan
                    takarir teks terstruktur di setiap langkah pembuktian.
                    Belajar nyaman tanpa suara, ramah pembelajar visual dan tuna
                    rungu.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface shadow-sm text-xs font-label text-secondary">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      visibility
                    </span>{" "}
                    Bebas Audio
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface shadow-sm text-xs font-label text-secondary">
                    <span
                      className="material-symbols-outlined text-[16px] text-tertiary"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    Terverifikasi Kurikulum Merdeka
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                {concept.paragraphs.map((p, i) => (
                  <article
                    className="bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col gap-space-md transition-all duration-200"
                    key={i}
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-full bg-secondary-container text-primary font-label text-label flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-label text-label text-text-secondary">
                        Penjelasan konsep
                      </span>
                    </div>
                    <h2 className="font-section-title text-section-title text-primary mt-space-md">
                      {concept.title}
                    </h2>
                    <p
                      className="font-reading text-reading text-primary mt-space-md"
                      style={readingStyle}
                    >
                      {p}
                    </p>
                  </article>
                ))}
              </div>

              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <article className="bg-secondary-container/40 rounded-2xl p-space-md shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center gap-space-md">
                    <div className="w-28 h-28 flex-shrink-0 rounded-2xl bg-surface p-1 shadow-sm overflow-hidden flex items-center justify-center">
                      <Image
                        alt="Mimo, teman belajarmu"
                        className="w-full h-full object-contain"
                        src="/design/mimo.png"
                        width={1024}
                        height={1024}
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-label text-sm font-bold text-primary">
                          Mimo si Teman Belajar
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface text-[10px] font-metadata text-secondary font-bold">
                          Mode Visual
                        </span>
                      </div>
                      <div className="bg-surface p-space-sm rounded-xl shadow-xs text-on-surface relative">
                        <p className="font-mimo-voice text-sm md:text-base leading-relaxed text-primary">
                          &quot;Bagi teman-teman yang lebih suka membaca dan
                          melihat gambar tanpa gangguan suara, format ini
                          dirancang khusus untukmu! Setiap detail gambar punya
                          teks takarir yang runtut.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between gap-space-xs flex-wrap pb-space-xs border-b border-divider">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-secondary text-[20px]"
                        aria-hidden="true"
                      >
                        description
                      </span>
                      <h3 className="font-section-title text-base font-bold text-primary">
                        Transkrip &amp; Alur Berpikir
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label text-primary transition-colors flex items-center gap-1"
                        title="Salin seluruh teks"
                        disabled={busy}
                        onClick={copyText}
                      >
                        <span
                          className="material-symbols-outlined text-[14px]"
                          aria-hidden="true"
                        >
                          content_copy
                        </span>
                        <span id="copy-btn-text">Salin</span>
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label text-primary transition-colors flex items-center gap-1"
                        title="Cetak ringkasan PDF"
                        disabled={busy}
                        onClick={() => window.print()}
                      >
                        <span
                          className="material-symbols-outlined text-[14px]"
                          aria-hidden="true"
                        >
                          print
                        </span>
                        <span>Cetak</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex flex-col gap-space-xs max-h-[380px] overflow-y-auto pr-1"
                    id="transcript-container"
                  >
                    {preferences.captions && (
                      <p
                        className="font-reading text-reading text-primary"
                        style={readingStyle}
                      >
                        {concept.transcript}
                      </p>
                    )}
                    <button
                      onClick={() => onSpeak()}
                      className="h-11 px-space-md rounded-xl bg-secondary-container text-primary font-label text-label"
                    >
                      {speaking ? "Hentikan audio" : "Bacakan transkrip"}
                    </button>
                  </div>
                </article>

                <article className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                  <h3 className="font-card-title text-card-title text-primary">
                    Sumber Konsep
                  </h3>
                  {sources.map((s) => (
                    <div key={s.id} className="mt-space-sm">
                      <h4 className="font-label text-label text-primary">
                        {s.label}
                      </h4>
                      <p className="font-metadata text-metadata text-text-secondary">
                        {s.text}
                      </p>
                    </div>
                  ))}
                </article>
              </div>
            </div>
          </section>

          <section className="sticky bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md shadow-[0_-2px_12px_rgba(0,0,0,0.06)] py-space-sm px-margin-mobile md:px-margin-tablet lg:px-margin z-30 mt-space-lg">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-between sm:justify-start">
                <button
                  className="inline-flex items-center gap-1 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                  disabled={busy || (index === 0 && session.paragraph === 0)}
                  onClick={previous}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Langkah Sebelumnya</span>
                </button>
                <div className="hidden md:flex flex-col">
                  <span className="font-label text-xs text-primary font-bold">
                    Langkah 2 dari 3 Selesai Dipelajari
                  </span>
                  <span className="font-metadata text-xs text-text-secondary">
                    Teks &amp; Gambar Siap Disimpan ke Catatan
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                <button
                  className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label transition-colors shadow-xs"
                  id="save-note-btn"
                  disabled={busy}
                  onClick={() => update({})}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    bookmark_add
                  </span>
                  <span id="save-note-text">Simpan ke Catatan Zine</span>
                </button>
                <button
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors shadow-sm text-center"
                  disabled={busy}
                  onClick={next}
                >
                  {
                    <>
                      Lanjutkan langkah belajar
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        arrow_forward
                      </span>
                    </>
                  }
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface shadow-sm">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <div className="flex flex-wrap items-center gap-space-xs md:gap-space-sm">
                <span className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-label">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping"></span>
                  <span>Sedang Aktif: Mode Teman Baca (Reading Companion)</span>
                </span>
                <span className="text-text-secondary hidden sm:inline">•</span>
                <span className="font-metadata text-metadata text-text-secondary flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    spa
                  </span>
                  Bebas Timer Ujian • Santai &amp; Ramah Sensoris
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-dim text-primary font-label text-label transition-colors"
                  data-path="learning-mode-selector"
                  disabled={busy}
                  onClick={chooseMode}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    swap_horiz
                  </span>
                  <span>Ganti Cara Belajar</span>
                </button>
                <span className="font-metadata text-metadata text-text-secondary bg-surface-container-low px-2.5 py-1 rounded-lg hidden lg:inline">
                  Posisi tersimpan otomatis
                </span>
              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div
                    aria-label="Pengaturan ukuran teks baca"
                    className="flex items-center bg-surface p-1 rounded-xl shadow-sm"
                    role="group"
                  >
                    <span className="font-metadata text-metadata text-text-secondary px-2 hidden sm:inline">
                      Ukuran:
                    </span>
                    <button
                      className="px-2.5 py-1 rounded-lg font-label text-label hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      id="btn-font-sm"
                      title="Ukuran 16px"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ font_size: 16 })}
                    >
                      A-
                    </button>
                    <button
                      className="px-2.5 py-1 rounded-lg font-label text-label bg-secondary-container text-primary font-bold shadow-sm transition-colors"
                      id="btn-font-md"
                      title="Ukuran 18px (Aktif)"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ font_size: 18 })}
                    >
                      A
                    </button>
                    <button
                      className="px-2.5 py-1 rounded-lg font-label text-label hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      id="btn-font-lg"
                      title="Ukuran 22px"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ font_size: 22 })}
                    >
                      A+
                    </button>
                  </div>

                  <div className="relative inline-block">
                    <label className="sr-only" htmlFor="font-family-select">
                      Jenis Huruf
                    </label>
                    <select
                      className="h-9 px-3 pr-8 rounded-xl bg-surface text-primary font-label text-label cursor-pointer appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                      id="font-family-select"
                      value={preferences.font_family}
                      onChange={(e) =>
                        onPreferences?.({
                          font_family: e.target
                            .value as Preferences["font_family"],
                        })
                      }
                    >
                      <option value="jakarta">Huruf: Plus Jakarta Sans</option>
                      <option value="nunito">Huruf: Nunito</option>
                      <option value="system">Huruf: Sistem</option>
                    </select>
                    <span
                      className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-[18px] text-text-secondary"
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </div>

                  <div className="hidden xl:flex items-center bg-surface p-1 rounded-xl shadow-sm">
                    <span className="font-metadata text-metadata text-text-secondary px-2">
                      Spasi:
                    </span>
                    <button
                      className="px-2 py-1 rounded-lg font-metadata text-metadata text-on-surface-variant hover:bg-surface-container"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ line_height: 1.5 })}
                    >
                      1.5x
                    </button>
                    <button
                      className="px-2 py-1 rounded-lg font-metadata text-metadata bg-secondary-container text-primary font-bold shadow-sm"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ line_height: 1.8 })}
                    >
                      1.8x
                    </button>
                    <button
                      className="px-2 py-1 rounded-lg font-metadata text-metadata text-on-surface-variant hover:bg-surface-container"
                      type="button"
                      disabled={busy}
                      onClick={() => onPreferences?.({ line_height: 2.2 })}
                    >
                      2.2x
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    aria-pressed={preferences.reading_ruler}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-primary hover:bg-surface-container font-label text-label shadow-sm transition-colors"
                    id="toggle-ruler-btn"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onPreferences?.({
                        reading_ruler: !preferences.reading_ruler,
                      })
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      straighten
                    </span>
                    <span className="hidden sm:inline">Penggaris Baca:</span>
                    <span className="font-bold text-success" id="ruler-status">
                      {preferences.reading_ruler ? "Aktif" : "Nonaktif"}
                    </span>
                  </button>

                  <div className="flex items-center bg-surface p-1 rounded-xl shadow-sm">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors"
                      id="tts-play-btn"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        id="tts-icon"
                        aria-hidden="true"
                      >
                        play_circle
                      </span>
                      <span id="tts-label">
                        {speaking ? "Hentikan audio" : "Dengarkan konsep"}
                      </span>
                    </button>
                    <div className="hidden md:flex items-center pl-2 pr-1 gap-1">
                      <button
                        className="px-1.5 py-0.5 rounded text-xs text-text-secondary hover:bg-surface-container"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 0.8 })}
                      >
                        0.8x
                      </button>
                      <button
                        className="px-1.5 py-0.5 rounded text-xs bg-secondary-container text-primary font-bold"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 1.0 })}
                      >
                        1.0x
                      </button>
                      <button
                        className="px-1.5 py-0.5 rounded text-xs text-text-secondary hover:bg-surface-container"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 1.2 })}
                      >
                        1.2x
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div
            className="w-full bg-butter/40 pointer-events-none transition-all duration-300 py-1 flex items-center justify-center"
            id="dyslexia-reading-ruler"
            hidden={!preferences.reading_ruler}
          >
            <div className="max-w-7xl w-full px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between text-warning font-metadata text-xs font-bold">
              <span className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px]"
                  aria-hidden="true"
                >
                  visibility
                </span>
                Fokus Aktif: Paragraf 1 • Tangga dan Dinding Siku-Siku
              </span>
              <span className="opacity-80 hidden sm:inline">
                Gunakan tombol arah panah atau ketuk kalimat untuk memindahkan
                penanda baca
              </span>
            </div>
          </div>

          <div className="max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <article className="lg:col-span-8 flex flex-col gap-space-lg">
                <header className="flex flex-col gap-space-xs bg-surface p-space-md md:p-space-lg rounded-2xl shadow-sm">
                  <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata">
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      description
                    </span>
                    <span className="truncate">
                      Berdasarkan Catatan_Bab4_Teorema_Pythagoras_SMP8.pdf •
                      Halaman 1 dari 4
                    </span>
                  </div>
                  <h1 className="font-page-title text-page-title text-primary tracking-tight">
                    {concept.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-space-sm pt-space-xs text-text-secondary font-metadata text-metadata">
                    <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-0.5 rounded-full font-bold text-primary">
                      <span
                        className="material-symbols-outlined text-[15px] text-secondary"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                      Konsep 1: Geometri Dasar
                    </span>
                    <span>•</span>
                    <span>Target: 3 Paragraf Santai</span>
                    <span>•</span>
                    <span className="text-success font-bold flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      Tingkat Kesulitan: Ramah Pemula
                    </span>
                  </div>
                </header>

                <article
                  className="bg-surface p-space-md md:p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-lg relative overflow-hidden"
                  id="reader-content-box"
                >
                  <div
                    className={
                      "reference-reading " +
                      (preferences.reading_ruler ? "reference-ruler" : "")
                    }
                    style={readingStyle}
                  >
                    {concept.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        tabIndex={preferences.reading_ruler ? 0 : undefined}
                        className="font-reading text-reading text-primary mb-space-lg"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <figure className="rounded-2xl bg-surface-container-low p-space-lg my-space-md">
                    {material.is_demo && material.subject === "Matematika" ? (
                      <svg
                        className="absolute -right-16 -top-16 w-64 h-64 text-surface-container-low opacity-60 pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 200 200"
                      >
                        <polygon points="20,180 180,180 180,20"></polygon>
                      </svg>
                    ) : (
                      <Image
                        src="/design/subject-science.png"
                        alt="Ilustrasi pendamping materi"
                        width={1024}
                        height={1024}
                        className="w-full h-52 object-cover rounded-xl"
                      />
                    )}
                    <figcaption className="font-metadata text-metadata text-text-secondary mt-space-md">
                      {concept.diagram_description ||
                        "Ilustrasi pendamping. Periksa teks sumber untuk penjelasan konsep."}
                    </figcaption>
                  </figure>
                </article>
              </article>

              <aside className="lg:col-span-4 flex flex-col gap-space-lg sticky top-24">
                <div className="bg-surface p-space-md md:p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none"></div>

                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-success"></span>
                      <span className="font-label text-label text-primary font-bold">
                        Teman Belajar Mimo
                      </span>
                    </div>
                    <button
                      className="text-text-secondary hover:text-primary text-xs font-metadata flex items-center gap-0.5"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({ show_mimo: !preferences.show_mimo })
                      }
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        aria-hidden="true"
                      >
                        visibility_off
                      </span>
                      <span>Sembunyikan</span>
                    </button>
                  </div>

                  <div
                    className="flex flex-col items-center gap-space-md"
                    id="mimo-companion-body"
                    hidden={!preferences.show_mimo}
                  >
                    <div className="w-40 h-40 relative flex items-center justify-center p-2 rounded-2xl bg-surface-container-low transition-transform hover:scale-105">
                      <Image
                        className="w-full h-full object-contain drop-shadow-sm"
                        data-alt="Illustration of Mimo the friendly green chameleon student mascot sitting peacefully on a small stack of pastel-colored hardcover books, holding a magnifying glass in a picture-book zine editorial style, clean lines, warm cream background #FAF9F4 with soft sage green #91AF87 and peach #FFCA9D tones, cozy relaxed study atmosphere for high school students."
                        src="/design/mimo.png"
                        width={1024}
                        height={1024}
                        alt="Mimo, teman belajarmu"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface text-primary font-metadata text-[11px] font-bold shadow-sm">
                        Mimo Baca
                      </span>
                    </div>

                    <div className="w-full relative bg-secondary-container/50 p-space-md rounded-2xl text-primary font-mimo-voice text-mimo-voice leading-snug">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container/50 rotate-45"></div>
                      <p className="relative z-10">
                        {concept.transcript || concept.paragraphs[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                      type="button"
                      disabled={busy}
                      onClick={() => sourcesDialog.current?.showModal()}
                    >
                      {"Lihat sumber penjelasan"}
                    </button>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface hover:bg-surface-container-low text-text-secondary hover:text-primary font-metadata text-metadata transition-colors"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        record_voice_over
                      </span>
                      <span>Dengarkan ringkasan 30 detik</span>
                    </button>
                  </div>
                </div>

                <div className="bg-surface p-space-md rounded-2xl shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label text-primary font-bold">
                      Peta Belajar Bab 4
                    </span>
                    <span className="font-metadata text-xs font-bold text-success bg-secondary-container px-2 py-0.5 rounded-full">{`${Math.round((session.completed_concepts.length / material.concepts.length) * 100)}% konsep dibaca`}</span>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2 font-metadata text-metadata">
                    <div className="flex items-center gap-2.5 text-primary">
                      <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </span>
                      <span className="font-bold flex-1">{concept.title}</span>
                      <span className="text-xs text-secondary font-bold">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-text-secondary opacity-80">
                      <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary font-bold text-xs">
                        2
                      </span>
                      <span className="flex-1">
                        Rumus Pythagoras: a² + b² = c²
                      </span>
                      <span className="text-xs">Berikutnya</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-text-secondary opacity-60">
                      <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary font-bold text-xs">
                        3
                      </span>
                      <span className="flex-1">
                        Tripel Pythagoras &amp; Soal Cerita
                      </span>
                      <span className="text-xs">Terkunci</span>
                    </div>
                  </div>
                </div>

                <div className="bg-butter/30 p-space-md rounded-2xl flex items-start gap-space-sm text-warning font-metadata text-metadata">
                  <span
                    className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    tips_and_updates
                  </span>
                  <p className="leading-relaxed">
                    <strong>{`Santai aja, ${displayName}. Satu langkah kecil sudah berarti.`}</strong>{" "}
                    Jika matamu lelah, kamu bisa mengaktifkan mode Suara Mimo di
                    atas dan memejamkan mata sambil mendengarkan narasi buku.
                  </p>
                </div>
              </aside>
            </div>
          </div>

          <section className="max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pb-space-lg">
            <div className="bg-surface p-space-md md:p-space-lg rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    aria-hidden="true"
                  >
                    done_all
                  </span>
                </div>
                <div>
                  <h4 className="font-card-title text-card-title text-primary">
                    Kamu membaca dengan sangat baik!
                  </h4>
                  <p className="font-metadata text-metadata text-text-secondary">
                    Konsep 1 berhasil dituntaskan dengan tenang tanpa
                    terburu-buru.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto justify-end">
                <button
                  className="px-space-md py-2.5 rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label transition-colors"
                  data-path="bab4-overview"
                  disabled={busy || (index === 0 && session.paragraph === 0)}
                  onClick={previous}
                >
                  ← Halaman Sebelumnya
                </button>
                <button
                  className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors inline-flex items-center gap-1"
                  data-path="pythagoras-practice-screen17"
                  disabled={busy}
                  onClick={onPractice}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    quiz
                  </span>
                  <span>Latihan Cek Pemahaman</span>
                </button>
                <button
                  className="px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  data-path="pythagoras-concept-2"
                  disabled={busy}
                  onClick={next}
                >
                  {
                    <>
                      Lanjutkan langkah belajar
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        arrow_forward
                      </span>
                    </>
                  }
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
      <div className="bg-surface rounded-2xl p-space-lg mt-space-lg">
        <div className="flex flex-wrap items-center gap-space-md justify-between">
          <span className="font-metadata text-metadata text-text-secondary">
            {material.subject} • {index + 1}/{material.concepts.length} konsep
          </span>
          <label className="font-label text-label text-primary">
            Format belajar
            <select
              ref={modeSelect}
              aria-label="Format belajar"
              value={session.mode}
              disabled={busy}
              onChange={(e) =>
                update({ mode: e.target.value as LearningSession["mode"] })
              }
              className="ml-space-sm h-11 px-space-md bg-surface-container-low rounded-xl"
            >
              {(
                [
                  "standard",
                  "reading",
                  "focus",
                  "explore",
                  "transcript",
                ] as const
              )
                .filter(
                  (m) =>
                    (m !== "explore" && m !== "transcript") ||
                    material.concepts.every((c) =>
                      m === "explore" ? c.diagram_description : c.transcript,
                    ),
                )
                .map((m) => (
                  <option key={m} value={m}>
                    {
                      {
                        standard: "Belajar standar",
                        reading: "Membaca santai",
                        focus: "Fokus satu langkah",
                        explore: "Jelajah visual",
                        transcript: "Transkrip & audio",
                      }[m]
                    }
                  </option>
                ))}
            </select>
          </label>
        </div>
        <details className="p-space-md rounded-xl bg-surface-container-low mt-space-md">
          <summary className="font-label text-label text-primary">
            Sumber bacaan
          </summary>
          {sources.map((s) => (
            <article key={s.id} className="mt-space-md">
              <h3 className="font-label text-label text-primary">{s.label}</h3>
              <p className="font-body text-body text-text-secondary">
                {s.text}
              </p>
            </article>
          ))}
        </details>
        <label className="flex flex-col gap-space-sm font-label text-label text-primary mt-space-md">
          Catatan kecilmu
          <textarea
            value={draft}
            maxLength={3000}
            onChange={(e) => setDraft(e.target.value)}
            className="p-space-md rounded-xl bg-surface-container-low w-full"
          />
        </label>
        <div className="flex flex-wrap gap-space-sm mt-space-md">
          <button
            disabled={busy}
            onClick={onSettings}
            className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
          >
            Pengaturan bacaan
          </button>
          <button
            disabled={busy}
            onClick={() => update({})}
            className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
          >
            Simpan catatan
          </button>
          <button
            disabled={busy}
            onClick={pause}
            className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
          >
            Simpan & jeda
          </button>
          <button
            disabled={busy}
            onClick={onPractice}
            className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
          >
            Latihan cek pemahaman
          </button>
          <button
            disabled={busy || (index === 0 && session.paragraph === 0)}
            onClick={previous}
            className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
          >
            Langkah sebelumnya
          </button>
          <button
            disabled={busy}
            onClick={next}
            className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
          >
            Tandai selesai & lanjut
          </button>
        </div>
        {(feedback || note) && (
          <p
            role="status"
            className="mt-space-md font-body text-body text-secondary"
          >
            {note || feedback}
          </p>
        )}
      </div>
      <dialog ref={pauseDialog} className="stitch-reason">
        <h2>Istirahat sejenak, {displayName}</h2>
        <p>
          Kamu boleh mengambil jeda. Posisi dan catatan yang berhasil disimpan
          bisa dilanjutkan kapan saja.
        </p>
        <button onClick={() => pauseDialog.current?.close()}>
          Sudah siap melanjutkan
        </button>
      </dialog>
      <dialog ref={sourcesDialog} className="stitch-reason">
        <h2>Sumber penjelasan</h2>
        {sources.map((s) => (
          <p key={s.id}>
            {s.label}: {s.text}
          </p>
        ))}
        <button onClick={() => sourcesDialog.current?.close()}>
          Tutup sumber
        </button>
      </dialog>
    </div>
  );
}
