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
      {session.mode === "reading" && (
        <div className="revamp-reader-body">
          <div className="flex flex-col w-full">
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
              <div className="bg-surface rounded-2xl shadow-sm p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      tune
                    </span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                      Alat Baca Santai
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Kenyamanan membaca ramah fokus
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-surface-container-low rounded-xl p-1 gap-1">
                    <button
                      aria-label="Kecilkan ukuran teks"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-on-surface-variant hover:bg-surface hover:text-primary transition-all"
                      id="btn-font-dec"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({
                          font_size: Math.max(14, preferences.font_size - 2),
                        })
                      }
                    >
                      A-
                    </button>
                    <span
                      className="text-xs font-bold px-2 text-primary"
                      id="font-size-label"
                    >
                      18px
                    </span>
                    <button
                      aria-label="Besarkan ukuran teks"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-on-surface-variant hover:bg-surface hover:text-primary transition-all"
                      id="btn-font-inc"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({
                          font_size: Math.min(32, preferences.font_size + 2),
                        })
                      }
                    >
                      A+
                    </button>
                  </div>

                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface text-xs font-bold text-on-surface-variant hover:text-primary transition-all"
                    id="btn-spacing-toggle"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onPreferences?.({
                        line_height: preferences.line_height === 1.7 ? 2 : 1.7,
                      })
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[17px] text-secondary"
                      aria-hidden="true"
                    >
                      format_line_spacing
                    </span>
                    <span id="spacing-label">Spasi: 1.7x</span>
                  </button>

                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold transition-all shadow-xs"
                    id="btn-ruler-toggle"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onPreferences?.({
                        reading_ruler: !preferences.reading_ruler,
                      })
                    }
                    aria-pressed={preferences.reading_ruler}
                  >
                    <span
                      className="material-symbols-outlined text-[17px] text-primary"
                      aria-hidden="true"
                    >
                      rule
                    </span>
                    <span>Sorot Fokus: Nyala</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-hover text-xs font-bold transition-all shadow-sm"
                    id="btn-audio-speak"
                    type="button"
                    disabled={busy}
                    onClick={() => onSpeak()}
                  >
                    <span
                      className="material-symbols-outlined text-[17px] animate-pulse"
                      aria-hidden="true"
                    >
                      volume_up
                    </span>
                    <span>Dengarkan Paragraf Ini</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <article className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-primary font-bold text-xs tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        <span>{`Konsep ${index + 1} dari ${material.concepts.length}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          aria-hidden="true"
                        >
                          auto_stories
                        </span>
                        <span>Waktu baca santai: ~2 menit</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight leading-snug mb-4">
                      {concept.title}
                    </h1>
                    <p className="text-sm sm:text-base text-text-secondary mb-8 leading-relaxed max-w-xl">
                      {
                        concept.paragraphs[
                          Math.min(
                            session.paragraph,
                            concept.paragraphs.length - 1,
                          )
                        ]
                      }
                    </p>

                    <div
                      className={
                        "reference-reading space-y-6 " +
                        (preferences.reading_ruler ? "reference-ruler" : "")
                      }
                      id="reading-content-pane"
                      style={readingStyle}
                    >
                      {concept.paragraphs.map((p, i) => (
                        <p key={i} tabIndex={0}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span
                        className="material-symbols-outlined text-secondary text-[24px]"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                      <div>
                        <span className="text-xs font-bold text-primary block">{`${displayName}, ambil satu langkah kecil sesuai ritmemu.`}</span>
                        <span className="text-xs text-text-secondary">
                          Kamu bisa menandai bagian ini atau membacanya lagi
                          santai.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-primary transition-colors flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={() => update({})}
                      >
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          aria-hidden="true"
                        >
                          bookmark_border
                        </span>{" "}
                        Simpan Catatan
                      </button>
                      <button
                        className="px-3.5 py-1.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-xs font-bold text-on-secondary-container transition-colors flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={next}
                      >
                        {"Langkah berikutnya"}
                      </button>
                    </div>
                  </div>
                </article>

                <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-peach/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="w-36 h-36 sm:w-40 sm:h-40 relative mb-4 rounded-2xl overflow-hidden flex items-center justify-center">
                      <Image
                        src="/design/mimo-5.png"
                        alt="Mimo membaca ramah"
                        className="w-full h-full object-contain filter drop-shadow-md rounded-2xl"
                        width={1024}
                        height={1024}
                      ></Image>
                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-4 w-full relative mb-4">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-container-low rotate-45"></div>
                      <p className="font-mimo-voice text-xs sm:text-sm text-primary leading-relaxed relative z-10 font-bold">{`${displayName}, ambil satu langkah kecil sesuai ritmemu.`}</p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-secondary text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span>Mimo sedang menemanimu belajar</span>
                    </div>
                  </div>

                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary"
                          aria-hidden="true"
                        >
                          checklist
                        </span>
                        Checklist Pemahaman
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-primary">
                        2 / 2 Terbaca
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low">
                        <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </div>
                        <div className="text-xs text-primary leading-snug">
                          <span className="font-bold block mb-0.5">
                            {concept.title}
                          </span>
                          Selalu tepat berhadapan di depan sudut siku-siku 90°.
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low">
                        <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </div>
                        <div className="text-xs text-primary leading-snug">
                          <span className="font-bold block mb-0.5">
                            Sisi Terpanjang
                          </span>
                          Karena sudut 90° adalah bukaan terbesar pada segitiga
                          siku-siku.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Langkah Selanjutnya
                    </span>
                    <p className="text-xs text-primary leading-relaxed">
                      Yuk uji santai pemahaman barusan lewat kuis ringan 2 soal!
                    </p>
                    <button
                      className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                      data-path="quiz-check-1"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      <span>Lanjut ke Cek Pemahaman Santai (2 Soal)</span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl hover:bg-surface-container text-text-secondary hover:text-primary font-semibold text-xs text-center transition-colors"
                      data-path="learning-hub"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      Simpan &amp; Lanjutkan Nanti
                    </button>
                  </div>
                </aside>
              </div>
            </section>
          </div>
        </div>
      )}
      {session.mode === "focus" && (
        <div className="revamp-reader-body">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
              <div className="w-full max-w-3xl flex items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold font-label">
                    2/4
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary font-label">
                      Fokus Step-by-Step
                    </span>
                    <span className="text-sm font-bold text-primary font-body">
                      {concept.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="Pengaturan Aksesibilitas Sensorik"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-container text-text-secondary hover:text-on-surface text-xs font-label font-semibold shadow-sm transition-all duration-200"
                    id="contrastBtn"
                    type="button"
                    disabled={busy}
                    onClick={onSettings}
                  >
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary"
                      aria-hidden="true"
                    >
                      tune
                    </span>
                    <span className="hidden sm:inline">Aksesibilitas</span>
                  </button>
                  <button
                    aria-label="Ganti Cara Belajar"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-container text-text-secondary hover:text-on-surface text-xs font-label font-semibold shadow-sm transition-all duration-200"
                    type="button"
                    disabled={busy}
                    onClick={chooseMode}
                  >
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary"
                      aria-hidden="true"
                    >
                      swap_horiz
                    </span>
                    <span className="hidden sm:inline">Ganti Cara Belajar</span>
                  </button>
                </div>
              </div>

              <div className="w-full max-w-3xl mb-8">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary mb-2 font-label">
                  <span className="flex items-center gap-1 text-primary font-bold">
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                    {concept.title}
                  </span>
                  <span className="text-muted-gray">50% selesai</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-700 ease-out w-1/2"></div>
                </div>

                <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-muted-gray font-label">
                  <span className="text-secondary font-semibold">
                    1. Bentuk Siku
                  </span>
                  <span className="text-primary font-bold">
                    2. Cari Sudut 90°
                  </span>
                  <span>3. Kuadrat Sisi</span>
                  <span>4. Nilai C</span>
                </div>
              </div>

              <div className="w-full max-w-3xl flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-2xl mb-6 shadow-sm">
                <div className="flex items-center gap-2.5 text-text-secondary font-label text-xs sm:text-sm">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px]"
                    aria-hidden="true"
                  >
                    spa
                  </span>
                  <span
                    className="font-medium text-on-surface"
                    id="mindfulTimerLabel"
                  >
                    Ritme Santai:{" "}
                    <strong className="text-primary font-bold">
                      {preferences.timer_enabled
                        ? `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`
                        : "Tanpa batas waktu"}
                    </strong>{" "}
                    mengalir
                  </span>
                  <span className="hidden md:inline text-muted-gray text-xs">
                    • Tidak ada penalti waktu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-label font-bold transition-colors"
                    id="pauseTimerBtn"
                    type="button"
                    disabled={busy}
                    onClick={pause}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      pause
                    </span>
                    <span>Jeda Dulu</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-fixed font-label text-xs font-bold transition-colors"
                    id="breakBtn"
                    type="button"
                    disabled={busy}
                    onClick={pause}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      coffee
                    </span>
                    <span>Istirahat 3 Mnt</span>
                  </button>
                </div>
              </div>

              <div className="w-full max-w-[760px] bg-surface rounded-3xl p-6 sm:p-10 shadow-xl shadow-surface-dim/30 flex flex-col relative overflow-hidden">
                <h1 className="text-2xl sm:text-3xl font-bold font-page-title text-primary tracking-tight mb-6">
                  {concept.title}
                </h1>
                <p
                  className="reference-reading text-primary"
                  style={readingStyle}
                >
                  {
                    concept.paragraphs[
                      Math.min(session.paragraph, concept.paragraphs.length - 1)
                    ]
                  }
                </p>
                <p className="text-sm text-text-secondary mt-4">
                  Langkah {session.paragraph + 1} dari{" "}
                  {concept.paragraphs.length}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-gray font-label">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>
                <span>
                  Satu konsep dalam satu waktu. Bernapas tenang, pahami
                  perlahan.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {session.mode === "explore" && (
        <div className="revamp-reader-body">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
              <section className="w-full bg-surface shadow-md rounded-2xl p-5 sm:p-6 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <button
                      aria-label="Putar atau jeda audio penjelasan Mimo"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-on-primary hover:bg-primary-hover flex items-center justify-center flex-shrink-0 shadow-md transition-transform active:scale-95"
                      id="audio-play-btn"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[30px]"
                        id="play-icon"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        aria-hidden="true"
                      >
                        pause
                      </span>
                    </button>
                    <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-text-secondary">
                        <span className="flex items-center gap-1.5 text-primary">
                          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                          <span>{concept.title}</span>
                        </span>
                        <span
                          className="font-mono text-contrast-ink"
                          id="audio-timer"
                        >
                          {preferences.timer_enabled
                            ? `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`
                            : "Tanpa batas waktu"}
                        </span>
                      </div>

                      <div
                        className="hidden"
                        id="waveform-track"
                        title="Klik untuk melompat titik audio"
                        aria-hidden="true"
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-secondary-container/40 transition-all duration-300"
                          style={{ width: "38%" }}
                        ></div>
                        <div className="relative z-10 w-full flex items-center justify-between gap-1 h-6">
                          <div className="w-1 bg-secondary rounded-full h-3"></div>
                          <div className="w-1 bg-secondary rounded-full h-5"></div>
                          <div className="w-1 bg-secondary rounded-full h-4"></div>
                          <div className="w-1 bg-secondary rounded-full h-6 animate-pulse"></div>
                          <div className="w-1 bg-secondary rounded-full h-3"></div>
                          <div className="w-1 bg-secondary rounded-full h-5"></div>
                          <div className="w-1 bg-secondary rounded-full h-4"></div>
                          <div className="w-1 bg-secondary rounded-full h-6"></div>
                          <div className="w-1 bg-secondary rounded-full h-5"></div>
                          <div className="w-1 bg-secondary rounded-full h-3"></div>

                          <div className="w-1.5 bg-primary rounded-full h-7 shadow-sm"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-4"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-5"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-3"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-6"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-4"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-5"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-3"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-6"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-4"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-5"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-3"></div>
                          <div className="w-1 bg-outline-variant rounded-full h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-end lg:self-center">
                    <div
                      aria-label="Kecepatan narasi"
                      className="flex items-center bg-surface-container-high p-1 rounded-xl"
                      role="group"
                    >
                      <button
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface/60 transition-colors"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 0.8 })}
                      >
                        0.8x
                      </button>
                      <button
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-surface text-primary shadow-sm"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 1.0 })}
                      >
                        1.0x
                      </button>
                      <button
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface/60 transition-colors"
                        type="button"
                        disabled={busy}
                        onClick={() => onPreferences?.({ speech_rate: 1.2 })}
                      >
                        1.2x
                      </button>
                    </div>

                    <button
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-secondary-container/50 text-contrast-ink text-xs font-semibold transition-all"
                      id="ambient-toggle"
                      type="button"
                      disabled={true}
                      title="Audio latar belum tersedia"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        rainy
                      </span>
                      <span id="ambient-label">Hujan Santai: Off</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <section className="lg:col-span-7 flex flex-col gap-5">
                  <div className="bg-surface shadow-md rounded-2xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-primary">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          touch_app
                        </span>
                        Eksplorasi Sentuh Aktif
                      </span>
                      <span className="text-xs text-text-secondary tracking-wider font-mono">
                        MODEL 2D · SKALA ASLI
                      </span>
                    </div>

                    <div className="w-full max-w-lg aspect-square sm:aspect-[4/3] relative flex items-center justify-center my-3 select-none">
                      <div aria-live="polite" className="sr-only" role="region">
                        Diagram menampilkan segitiga siku-siku ABC dengan
                        panjang alas a=6 cm, tinggi b=8 cm, dan hipotenusa c=10
                        cm. Sudut siku-siku berada di titik B dengan tanda bujur
                        sangkar 90 derajat. Sisi C sedang disorot.
                      </div>

                      <svg
                        id="geom-canvas"
                        viewBox="0 0 420 340"
                        aria-hidden="true"
                        className={
                          material.id !== "demo-pythagoras"
                            ? "hidden"
                            : "w-full h-full"
                        }
                        style={{ transform: `rotate(${selectedPart * 90}deg)` }}
                      >
                        <defs>
                          <linearGradient
                            id="hypoGlow"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#496550"></stop>
                            <stop offset="100%" stopColor="#91AF87"></stop>
                          </linearGradient>
                          <pattern
                            height="20"
                            id="squareGrid"
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
                        </defs>

                        <rect
                          fill="url(#squareGrid)"
                          height="300"
                          opacity="0.6"
                          rx="16"
                          width="380"
                          x="20"
                          y="20"
                        ></rect>

                        <g
                          className="opacity-0 transition-opacity duration-300"
                          id="square-c-area"
                        >
                          <polygon
                            fill="#FFE7A3"
                            fillOpacity="0.25"
                            points="90,70 170,-36 330,84 250,190"
                          ></polygon>
                          <text
                            fill="#61450E"
                            fontSize="12"
                            fontWeight="700"
                            textAnchor="middle"
                            x="210"
                            y="70"
                          >
                            Luas c² = 100 cm²
                          </text>
                        </g>

                        <polygon
                          fill="#F5F4EF"
                          points="90,70 90,270 330,270"
                          stroke="#496550"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        ></polygon>

                        <g
                          className="transition-all duration-300"
                          id="angle-90-highlight"
                        >
                          <rect
                            fill="#C8E8CE"
                            fillOpacity="0.8"
                            height="24"
                            stroke="#496550"
                            strokeWidth="1.5"
                            width="24"
                            x="90"
                            y="246"
                          ></rect>
                          <circle
                            cx="102"
                            cy="258"
                            fill="#112520"
                            r="2.5"
                          ></circle>
                        </g>

                        <text
                          fill="#424846"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          x="64"
                          y="175"
                        >
                          b = 8 cm
                        </text>

                        <text
                          fill="#424846"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          x="210"
                          y="295"
                        >
                          a = 6 cm
                        </text>

                        <line
                          stroke="url(#hypoGlow)"
                          strokeLinecap="round"
                          strokeWidth="7"
                          x1="90"
                          x2="330"
                          y1="70"
                          y2="270"
                        ></line>
                        <line
                          stroke="#FFFFFF"
                          strokeDasharray="6,4"
                          strokeLinecap="round"
                          strokeWidth="2"
                          x1="90"
                          x2="330"
                          y1="70"
                          y2="270"
                        ></line>

                        <g transform="translate(230, 145)">
                          <rect
                            fill="#112520"
                            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                            height="34"
                            rx="17"
                            width="168"
                            x="-10"
                            y="-22"
                          ></rect>
                          <circle
                            className="animate-ping"
                            cx="8"
                            cy="-5"
                            fill="#C8E8CE"
                            r="5"
                          ></circle>
                          <circle cx="8" cy="-5" fill="#C8E8CE" r="5"></circle>
                          <text
                            fill="#FFFFFF"
                            fontSize="12"
                            fontWeight="700"
                            x="22"
                            y="0"
                          >
                            {concept.title}
                          </text>
                        </g>

                        <g
                          aria-label="Titik Sudut A"
                          className="cursor-pointer group"
                          role="button"
                          tabIndex={0}
                        >
                          <circle
                            className="group-hover:stroke-primary group-hover:scale-110 transition-transform"
                            cx="90"
                            cy="70"
                            fill="#F5F4EF"
                            r="16"
                            stroke="#727875"
                            strokeWidth="1.5"
                          ></circle>
                          <circle cx="90" cy="70" fill="#112520" r="6"></circle>
                          <text
                            fill="#112520"
                            fontSize="13"
                            fontWeight="800"
                            textAnchor="middle"
                            x="90"
                            y="44"
                          >
                            A
                          </text>
                        </g>

                        <g
                          aria-label="Titik Sudut B Siku-siku 90 derajat"
                          className="cursor-pointer group"
                          role="button"
                          tabIndex={0}
                        >
                          <circle
                            className="group-hover:stroke-primary group-hover:scale-110 transition-transform"
                            cx="90"
                            cy="270"
                            fill="#F5F4EF"
                            r="16"
                            stroke="#727875"
                            strokeWidth="1.5"
                          ></circle>
                          <circle
                            cx="90"
                            cy="270"
                            fill="#112520"
                            r="6"
                          ></circle>
                          <text
                            fill="#112520"
                            fontSize="13"
                            fontWeight="800"
                            textAnchor="middle"
                            x="70"
                            y="285"
                          >
                            B
                          </text>
                        </g>

                        <g
                          aria-label="Titik Sudut C"
                          className="cursor-pointer group"
                          role="button"
                          tabIndex={0}
                        >
                          <circle
                            className="animate-pulse"
                            cx="330"
                            cy="270"
                            fill="#C8E8CE"
                            fillOpacity="0.5"
                            r="22"
                          ></circle>
                          <circle
                            cx="330"
                            cy="270"
                            fill="#28583E"
                            r="15"
                          ></circle>
                          <circle
                            cx="330"
                            cy="270"
                            fill="#FFFFFF"
                            r="6"
                          ></circle>
                          <text
                            fill="#112520"
                            fontSize="14"
                            fontWeight="800"
                            x="355"
                            y="275"
                          >
                            C
                          </text>
                        </g>
                      </svg>
                    </div>

                    <div
                      className="w-full bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between text-xs text-contrast-ink"
                      id="hotspot-status-card"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                        <span className="font-bold">Fokus Aktif:</span>
                        <span id="active-hotspot-text">
                          {note ||
                            concept.diagram_description ||
                            "Deskripsi diagram belum tersedia."}
                        </span>
                      </div>
                      <span className="text-text-secondary hidden sm:inline text-[11px]">
                        {"Target aksesibilitas WCAG 2.2 AA"}
                      </span>
                    </div>

                    <div className="w-full grid grid-cols-3 gap-2.5 pt-4">
                      <button
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-contrast-ink text-xs font-bold transition-all active:scale-95"
                        id="btn-rotate"
                        type="button"
                        disabled={busy}
                        onClick={() => setSelectedPart((selectedPart + 1) % 4)}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          rotate_right
                        </span>
                        <span>Putar Segitiga</span>
                      </button>
                      <button
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-fixed text-xs font-bold transition-all active:scale-95"
                        id="btn-highlight-90"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          setNote(
                            concept.diagram_description ||
                              "Deskripsi diagram belum tersedia.",
                          )
                        }
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          square_foot
                        </span>
                        <span>Sorot Sudut 90°</span>
                      </button>
                      <button
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-contrast-ink text-xs font-bold transition-all active:scale-95"
                        id="btn-toggle-squares"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          setNote(
                            concept.diagram_description ||
                              "Deskripsi diagram belum tersedia.",
                          )
                        }
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          shapes
                        </span>
                        <span id="square-btn-text">Tampilkan Luas</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-peach/40 flex items-center justify-center text-warning flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-on-surface">
                        Tips Sensorik:
                      </strong>{" "}
                      Kamu bisa menyentuh titik huruf di diagram untuk
                      memindahkan fokus suara narasi langsung ke bagian tersebut
                      tanpa perlu membaca banyak teks.
                    </p>
                  </div>
                </section>

                <section className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-surface shadow-md rounded-2xl p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-contrast-ink"
                        style={{ backgroundColor: "#A8B7F5" }}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          record_voice_over
                        </span>
                        Segmen 2 dari 3 · Suara Sedang Membahas Sisi C
                      </span>
                      <span className="text-xs font-mono text-secondary">
                        Sinkron Otomatis
                      </span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-muted-gray leading-relaxed transition-opacity">
                        {
                          concept.paragraphs[
                            Math.min(
                              session.paragraph,
                              concept.paragraphs.length - 1,
                            )
                          ]
                        }
                      </p>

                      <div className="p-3.5 rounded-xl bg-butter/30 transition-all shadow-sm">
                        <p className="text-base sm:text-lg font-bold text-contrast-ink leading-relaxed flex items-start gap-2">
                          <span
                            className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          >
                            volume_up
                          </span>
                          <span>
                            “Sekarang lihat tepat ke seberangnya! Garis miring
                            terpanjang ini namanya{" "}
                            <mark className="bg-peach/60 text-contrast-ink px-1 rounded">
                              {concept.title}
                            </mark>{" "}
                            (sisi c = 10 cm).”
                          </span>
                        </p>
                      </div>

                      <p className="text-sm text-muted-gray/70 leading-relaxed">
                        {
                          concept.paragraphs[
                            Math.min(
                              session.paragraph,
                              concept.paragraphs.length - 1,
                            )
                          ]
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[11px] text-text-secondary">
                      <span
                        className="material-symbols-outlined text-[14px] text-secondary"
                        aria-hidden="true"
                      >
                        verified
                      </span>
                      <span>
                        Kalimat diringkas ramah beban kognitif (No cognitive
                        overload).
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface shadow-md rounded-2xl p-6 sm:p-7 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-[22px]"
                          aria-hidden="true"
                        >
                          smart_toy
                        </span>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-primary">
                          Tanya Mimo tentang Bagian Ini
                        </h2>
                        <p className="text-xs text-text-secondary">
                          Jawaban instan ramah teman belajar tanpa rumus rumit
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary-container text-xs font-semibold text-primary transition-colors text-left flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          setNote(
                            concept.diagram_description ||
                              concept.paragraphs[0],
                          )
                        }
                      >
                        <span>💡 Kenapa sisi C paling panjang?</span>
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary-container text-xs font-semibold text-primary transition-colors text-left flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          setNote(
                            concept.diagram_description ||
                              concept.paragraphs[0],
                          )
                        }
                      >
                        <span>📐 Selalu miring?</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
                      <input
                        className="flex-1 bg-transparent px-3 py-1.5 text-xs text-contrast-ink placeholder:text-muted-gray focus:outline-none"
                        id="mimo-question-input"
                        placeholder="Ketik pertanyaan santaimu ke Mimo..."
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        aria-label="Bagian diagram yang ingin ditinjau"
                      />
                      <button
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        id="ask-btn"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          setNote(
                            concept.diagram_description ||
                              concept.paragraphs[0],
                          )
                        }
                      >
                        {"Lihat penjelasan sumber"}
                      </button>
                    </div>

                    <div
                      className="mt-2 p-4 rounded-xl bg-surface-container-low flex items-start gap-4 transition-all"
                      id="mimo-response-area"
                    >
                      {note ||
                        concept.diagram_description ||
                        "Deskripsi diagram belum tersedia."}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      className="w-full py-3.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm shadow-md transition-all flex items-center justify-between group"
                      data-path="pythagoras-concept-2"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      <span>{`Konsep ${index + 1} dari ${material.concepts.length}`}</span>
                      <span
                        className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                    <button
                      className="w-full py-3 px-5 rounded-xl bg-surface hover:bg-surface-container-high text-contrast-ink font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                      data-path="quiz-pythagoras"
                      type="button"
                      onClick={onPractice}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        psychology_alt
                      </span>
                      <span>Selesai Jelajah, Mulai Latihan Santai</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <p
            className="max-w-6xl mx-auto p-6 rounded-2xl bg-surface text-primary"
            style={readingStyle}
          >
            {concept.diagram_description}
          </p>
        </div>
      )}
      {session.mode === "transcript" && (
        <div className="revamp-reader-body">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
              <section className="bg-surface rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-secondary px-2.5 py-1 bg-surface-container rounded-full">
                    Tampilan Belajar
                  </span>

                  <div className="inline-flex p-1 bg-surface-container-low rounded-xl">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-surface text-primary shadow-sm transition-all"
                      id="viewStepBtn"
                      type="button"
                      disabled={busy}
                      onClick={() => setSelectedPart(0)}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        view_carousel
                      </span>
                      <span>Kartu Langkah Bergambar</span>
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-on-surface-variant hover:text-on-surface transition-all"
                      id="viewTranscriptBtn"
                      type="button"
                      disabled={busy}
                      onClick={() => setSelectedPart(1)}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        article
                      </span>
                      <span>Transkrip Lengkap</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-container-high px-3 py-1.5 rounded-xl">
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary"
                      aria-hidden="true"
                    >
                      closed_caption
                    </span>
                    <span className="font-bold text-on-surface">Takarir:</span>
                    <button
                      className="ml-1 px-2 py-0.5 rounded bg-surface text-primary font-bold shadow-xs hover:bg-surface-container transition-colors"
                      id="fontToggle"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({
                          font_size: Math.min(32, preferences.font_size + 2),
                        })
                      }
                    >
                      Teks Sangat Jelas (18px)
                    </button>
                    <button
                      className="px-2 py-0.5 rounded bg-surface text-primary font-semibold hover:bg-surface-container transition-colors flex items-center gap-1"
                      id="contrastToggle"
                      type="button"
                      disabled={busy}
                      onClick={onSettings}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                      <span>Kontras Tinggi</span>
                    </button>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 text-xs text-secondary hover:text-primary font-bold px-2 py-1 rounded-lg hover:bg-surface-container-low transition-colors"
                    type="button"
                    disabled={busy}
                    onClick={() => onSpeak()}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      help
                    </span>
                    <span>Bantuan Visual</span>
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  {(selectedPart === 1
                    ? (
                        concept.transcript || concept.paragraphs.join("\n\n")
                      ).split(/\n\n/)
                    : concept.paragraphs
                  ).map((p, i) => (
                    <article
                      className="bg-surface-container-low rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                      key={i}
                      style={readingStyle}
                    >
                      <span className="text-xs font-bold text-text-secondary">
                        Bagian {i + 1}
                      </span>
                      <p className="mt-3">{p}</p>
                    </article>
                  ))}
                </div>

                <aside className="lg:col-span-4 flex flex-col space-y-6">
                  <div className="bg-gradient-to-br from-surface to-surface-container-low rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-butter text-warning font-extrabold text-xs inline-flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          lightbulb
                        </span>
                        Mimo Eureka!
                      </span>
                      <span className="text-[11px] font-semibold text-muted-gray">
                        Teman Belajar 2D
                      </span>
                    </div>

                    <div className="relative bg-surface p-4 rounded-2xl shadow-sm text-sm sm:text-base font-semibold text-primary leading-snug mb-3">
                      “Keren Manda! Dengan melihat luas perseginya, rumus{" "}
                      <span className="font-extrabold text-secondary">
                        a² + b² = c²
                      </span>{" "}
                      jadi kelihatan masuk akal banget kan?”
                      <div className="absolute -bottom-2 right-12 w-4 h-4 bg-surface transform rotate-45"></div>
                    </div>

                    <div className="flex justify-end pr-4 pt-2">
                      <div className="w-36 h-36 relative flex-shrink-0 transition-transform hover:scale-105 duration-300">
                        <Image
                          alt="Mimo Si Bunglon Lucu pose Eureka merayakan penemuan konsep visual teorema pythagoras"
                          className="w-full h-full object-contain filter drop-shadow-sm rounded-2xl"
                          src="/design/mimo-5.png"
                          width={1024}
                          height={1024}
                        ></Image>
                      </div>
                    </div>
                    <div className="mt-2 pt-3 bg-surface-container/50 rounded-xl p-3 flex items-center justify-between text-xs text-text-secondary">
                      <span>Apakah penjelasan visual ini pas?</span>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Bagus"
                          className="w-7 h-7 rounded-lg bg-surface hover:bg-secondary-container text-on-surface flex items-center justify-center transition-colors"
                          type="button"
                          disabled={busy}
                          onClick={() => onSpeak()}
                        >
                          👍
                        </button>
                        <button
                          aria-label="Terlalu cepat"
                          className="w-7 h-7 rounded-lg bg-surface hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors"
                          type="button"
                          disabled={busy}
                          onClick={() => onSpeak()}
                        >
                          🤔
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl p-5 shadow-xs space-y-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        bookmark_border
                      </span>
                      Ringkasan Cepat Langkah Ini
                    </h4>
                    <ul className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-peach mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>a² (Peach):</strong> Persegi dari tinggi
                          segitiga = 9 satuan.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>b² (Lavender):</strong> Persegi dari alas
                          segitiga = 16 satuan.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>c² (Soft Mint):</strong> Persegi hipotenusa =
                          9 + 16 = 25 satuan.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-sm sm:text-base shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      type="button"
                      onClick={onPractice}
                      disabled={busy}
                    >
                      <span>Lanjut ke Latihan Santai (2 Soal)</span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface hover:bg-surface-container text-text-secondary hover:text-primary font-semibold text-xs sm:text-sm transition-colors"
                      id="replayBtn"
                      type="button"
                      disabled={busy}
                      onClick={() => onSpeak()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        replay
                      </span>
                      <span>{"Bacakan penjelasan konsep"}</span>
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
      {session.mode === "standard" && (
        <div className="revamp-reader-body">
          <div className="flex flex-col w-full">
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
              <div className="bg-surface rounded-2xl shadow-sm p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      tune
                    </span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                      Alat Baca Santai
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Kenyamanan membaca ramah fokus
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-surface-container-low rounded-xl p-1 gap-1">
                    <button
                      aria-label="Kecilkan ukuran teks"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-on-surface-variant hover:bg-surface hover:text-primary transition-all"
                      id="btn-font-dec"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({
                          font_size: Math.max(14, preferences.font_size - 2),
                        })
                      }
                    >
                      A-
                    </button>
                    <span
                      className="text-xs font-bold px-2 text-primary"
                      id="font-size-label"
                    >
                      18px
                    </span>
                    <button
                      aria-label="Besarkan ukuran teks"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-on-surface-variant hover:bg-surface hover:text-primary transition-all"
                      id="btn-font-inc"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPreferences?.({
                          font_size: Math.min(32, preferences.font_size + 2),
                        })
                      }
                    >
                      A+
                    </button>
                  </div>

                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface text-xs font-bold text-on-surface-variant hover:text-primary transition-all"
                    id="btn-spacing-toggle"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onPreferences?.({
                        line_height: preferences.line_height === 1.7 ? 2 : 1.7,
                      })
                    }
                  >
                    <span
                      className="material-symbols-outlined text-[17px] text-secondary"
                      aria-hidden="true"
                    >
                      format_line_spacing
                    </span>
                    <span id="spacing-label">Spasi: 1.7x</span>
                  </button>

                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold transition-all shadow-xs"
                    id="btn-ruler-toggle"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      onPreferences?.({
                        reading_ruler: !preferences.reading_ruler,
                      })
                    }
                    aria-pressed={preferences.reading_ruler}
                  >
                    <span
                      className="material-symbols-outlined text-[17px] text-primary"
                      aria-hidden="true"
                    >
                      rule
                    </span>
                    <span>Sorot Fokus: Nyala</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-hover text-xs font-bold transition-all shadow-sm"
                    id="btn-audio-speak"
                    type="button"
                    disabled={busy}
                    onClick={() => onSpeak()}
                  >
                    <span
                      className="material-symbols-outlined text-[17px] animate-pulse"
                      aria-hidden="true"
                    >
                      volume_up
                    </span>
                    <span>Dengarkan Paragraf Ini</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <article className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-primary font-bold text-xs tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        <span>{`Konsep ${index + 1} dari ${material.concepts.length}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          aria-hidden="true"
                        >
                          auto_stories
                        </span>
                        <span>Waktu baca santai: ~2 menit</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight leading-snug mb-4">
                      {concept.title}
                    </h1>
                    <p className="text-sm sm:text-base text-text-secondary mb-8 leading-relaxed max-w-xl">
                      {
                        concept.paragraphs[
                          Math.min(
                            session.paragraph,
                            concept.paragraphs.length - 1,
                          )
                        ]
                      }
                    </p>

                    <div
                      className={
                        "reference-reading space-y-6 " +
                        (preferences.reading_ruler ? "reference-ruler" : "")
                      }
                      id="reading-content-pane"
                      style={readingStyle}
                    >
                      {concept.paragraphs.map((p, i) => (
                        <p key={i} tabIndex={0}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span
                        className="material-symbols-outlined text-secondary text-[24px]"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                      <div>
                        <span className="text-xs font-bold text-primary block">{`${displayName}, ambil satu langkah kecil sesuai ritmemu.`}</span>
                        <span className="text-xs text-text-secondary">
                          Kamu bisa menandai bagian ini atau membacanya lagi
                          santai.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-primary transition-colors flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={() => update({})}
                      >
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          aria-hidden="true"
                        >
                          bookmark_border
                        </span>{" "}
                        Simpan Catatan
                      </button>
                      <button
                        className="px-3.5 py-1.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-xs font-bold text-on-secondary-container transition-colors flex items-center gap-1.5"
                        type="button"
                        disabled={busy}
                        onClick={next}
                      >
                        {"Langkah berikutnya"}
                      </button>
                    </div>
                  </div>
                </article>

                <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-peach/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="w-36 h-36 sm:w-40 sm:h-40 relative mb-4 rounded-2xl overflow-hidden flex items-center justify-center">
                      <Image
                        src="/design/mimo-5.png"
                        alt="Mimo membaca ramah"
                        className="w-full h-full object-contain filter drop-shadow-md rounded-2xl"
                        width={1024}
                        height={1024}
                      ></Image>
                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-4 w-full relative mb-4">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-container-low rotate-45"></div>
                      <p className="font-mimo-voice text-xs sm:text-sm text-primary leading-relaxed relative z-10 font-bold">{`${displayName}, ambil satu langkah kecil sesuai ritmemu.`}</p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-secondary text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span>Mimo sedang menemanimu belajar</span>
                    </div>
                  </div>

                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary"
                          aria-hidden="true"
                        >
                          checklist
                        </span>
                        Checklist Pemahaman
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-primary">
                        2 / 2 Terbaca
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low">
                        <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </div>
                        <div className="text-xs text-primary leading-snug">
                          <span className="font-bold block mb-0.5">
                            {concept.title}
                          </span>
                          Selalu tepat berhadapan di depan sudut siku-siku 90°.
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low">
                        <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </div>
                        <div className="text-xs text-primary leading-snug">
                          <span className="font-bold block mb-0.5">
                            Sisi Terpanjang
                          </span>
                          Karena sudut 90° adalah bukaan terbesar pada segitiga
                          siku-siku.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Langkah Selanjutnya
                    </span>
                    <p className="text-xs text-primary leading-relaxed">
                      Yuk uji santai pemahaman barusan lewat kuis ringan 2 soal!
                    </p>
                    <button
                      className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                      data-path="quiz-check-1"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      <span>Lanjut ke Cek Pemahaman Santai (2 Soal)</span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl hover:bg-surface-container text-text-secondary hover:text-primary font-semibold text-xs text-center transition-colors"
                      data-path="learning-hub"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      Simpan &amp; Lanjutkan Nanti
                    </button>
                  </div>
                </aside>
              </div>
            </section>
          </div>
        </div>
      )}
      <section className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex gap-2 items-center">
            Format belajar
            <select
              aria-label="Format belajar"
              ref={modeSelect}
              value={session.mode}
              disabled={busy}
              onChange={(e) =>
                update({ mode: e.target.value as LearningSession["mode"] })
              }
            >
              {[
                ["standard", "Teks & Visual"],
                ["reading", "Teman Baca"],
                ["focus", "Langkah demi Langkah"],
                ["explore", "Jelajahi Diagram"],
                ["transcript", "Audio & Transkrip"],
              ].map(([v, t]) => (
                <option
                  key={v}
                  value={v}
                  disabled={
                    (v === "explore" && !concept.diagram_description) ||
                    (v === "transcript" && !concept.transcript)
                  }
                >
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => setZen(!zen)} aria-pressed={zen}>
            Mode fokus penuh
          </button>
          <button onClick={copyText}>Salin bacaan</button>
          <button onClick={() => sourcesDialog.current?.showModal()}>
            Lihat sumber
          </button>
          <button onClick={() => onSpeak()}>
            {speaking ? "Hentikan bacaan" : "Bacakan konsep"}
          </button>
        </div>
        <label className="block">
          Catatan sesi
          <textarea
            value={draft}
            maxLength={3000}
            onChange={(e) => setDraft(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={onBack}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Kembali ke materi
          </button>
          <button
            disabled={busy}
            onClick={onSettings}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Pengaturan
          </button>
          <button
            disabled={busy}
            onClick={() => update({})}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Simpan posisi dan catatan
          </button>
          <button
            disabled={busy}
            onClick={pause}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Jeda dulu
          </button>
          <button
            disabled={busy}
            onClick={onPractice}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Latihan pemahaman
          </button>
          <button
            disabled={busy}
            onClick={previous}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Sebelumnya
          </button>
          <button
            disabled={busy}
            onClick={next}
            className="min-h-[44px] px-4 rounded-xl bg-surface border border-divider"
          >
            Berikutnya
          </button>{" "}
        </div>
        {(feedback || note) && <p role="status">{feedback || note}</p>}
      </section>
      <dialog ref={pauseDialog} className="stitch-reason">
        <Image
          src="/design/mimo-3.png"
          width={200}
          height={200}
          alt="Mimo menemani istirahat"
        />
        <h2>Ambil jeda sebentar</h2>
        <p>Posisi dan catatan yang berhasil disimpan bisa dilanjutkan nanti.</p>
        <button onClick={() => pauseDialog.current?.close()}>
          Lanjutkan belajar
        </button>
      </dialog>
      <dialog ref={sourcesDialog} className="stitch-reason">
        {sources.map((s) => (
          <article key={s.id}>
            <h3>{s.label}</h3>
            <p className="whitespace-pre-wrap">{s.text}</p>
          </article>
        ))}
        <button onClick={() => sourcesDialog.current?.close()}>
          Tutup sumber
        </button>
      </dialog>
    </div>
  );
}
