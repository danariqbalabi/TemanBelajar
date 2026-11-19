"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { readingStyle } from "./reading-style";
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
    [note, setNote] = useState("");
  const modeSelect = useRef<HTMLSelectElement>(null);

  const pauseDialog = useRef<HTMLDialogElement>(null),
    sourcesDialog = useRef<HTMLDialogElement>(null);
  const textStyle = readingStyle(preferences);

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
    <>
      <div className="stitch-reader" data-zen={zen}>
        {session.mode === "reading" || session.mode === "standard" ? (
          <div className="final-design final-screen-13 w-full bg-canvas flex-1 final-reader screen-page">
            <div className="flex flex-col w-full">
              <section className="w-full bg-surface shadow-sm">
                <div className="max-w-[1200px] mx-auto px-margin py-space-sm flex flex-col md:flex-row items-center justify-between gap-space-md ui-container">
                  <div className="flex items-center gap-space-sm w-full md:w-auto justify-between md:justify-start">
                    <a
                      className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:bg-surface-container px-space-sm py-space-xs rounded-xl transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_back
                      </span>
                      <span>Kembali ke Materi Saya</span>
                    </a>
                    <div className="flex items-center gap-space-xs px-space-sm py-1 bg-mint-tint rounded-full">
                      <span
                        className="material-symbols-outlined text-[16px] text-success"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                      <span className="text-metadata font-label font-bold text-success text-[12px]">
                        Mode:{" "}
                        {session.mode === "standard"
                          ? "Belajar standar"
                          : "Teman Baca"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center w-full md:w-80 gap-1.5">
                    <div className="flex items-center justify-between w-full text-metadata font-metadata text-[13px] text-on-surface-variant">
                      <span className="font-bold text-primary">
                        {`Paragraf ${session.paragraph + 1} dari ${concept.paragraphs.length}`}
                      </span>
                      <span className="text-outline">
                        Estimasi konsep {concept.estimated_minutes} menit
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{
                          width: `${((session.paragraph + 1) / concept.paragraphs.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs w-full md:w-auto justify-end">
                    <button
                      className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-xl text-primary font-label text-label hover:bg-surface-container transition-colors"
                      type="button"
                      onClick={pause}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        pause_circle
                      </span>
                      <span className="hidden sm:inline">Jeda Belajar</span>
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm"
                      type="button"
                      onClick={next}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      <span>Tandai Selesai</span>
                    </button>
                  </div>
                </div>
              </section>

              <section className="reader-toolbar sticky top-20 z-40 w-full bg-surface/95 backdrop-blur-md shadow-sm">
                <div className="max-w-[1200px] mx-auto px-margin py-space-sm flex items-center justify-between gap-space-md overflow-x-auto ui-container">
                  <div className="flex items-center gap-space-sm min-w-max">
                    <button
                      className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-secondary-container text-primary font-label text-label transition-colors"
                      id="ruler-toggle-btn"
                      type="button"
                      aria-pressed={preferences.reading_ruler}
                      onClick={() =>
                        onPreferences?.({
                          reading_ruler: !preferences.reading_ruler,
                        })
                      }
                      disabled={busy}
                    >
                      {preferences.reading_ruler
                        ? "Penggaris Baca: Aktif"
                        : "Penggaris Baca: Nonaktif"}
                    </button>

                    <div className="flex items-center bg-surface-container p-0.5 rounded-full text-label font-label text-[13px]">
                      <button
                        className="px-space-md py-1 rounded-full bg-surface text-primary font-bold shadow-sm transition-all"
                        id="font-btn-jakarta"
                        type="button"
                        aria-pressed={preferences.font_family === "jakarta"}
                        onClick={() =>
                          onPreferences?.({ font_family: "jakarta" })
                        }
                        disabled={busy}
                      >
                        Jakarta Sans
                      </button>
                      <button
                        className="px-space-md py-1 rounded-full text-on-surface-variant hover:text-primary transition-all"
                        id="font-btn-nunito"
                        type="button"
                        aria-pressed={preferences.font_family === "nunito"}
                        onClick={() =>
                          onPreferences?.({ font_family: "nunito" })
                        }
                        disabled={busy}
                      >
                        Nunito
                      </button>
                      <button
                        className="px-space-md py-1 rounded-full text-on-surface-variant hover:text-primary transition-all"
                        id="font-btn-system"
                        type="button"
                        aria-pressed={preferences.font_family === "system"}
                        onClick={() =>
                          onPreferences?.({ font_family: "system" })
                        }
                        disabled={busy}
                      >
                        Sistem
                      </button>
                    </div>

                    <div className="flex items-center bg-surface-container rounded-full p-0.5">
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors font-bold text-[14px]"
                        title="Kecilkan Teks"
                        type="button"
                        onClick={() =>
                          onPreferences?.({
                            font_size: Math.max(14, preferences.font_size - 2),
                          })
                        }
                        disabled={busy}
                      >
                        A-
                      </button>
                      <span
                        className="px-space-xs text-metadata font-label text-primary font-bold text-[13px]"
                        id="font-size-label"
                      >
                        {preferences.font_size}px
                      </span>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors font-bold text-[16px]"
                        title="Besarkan Teks"
                        type="button"
                        onClick={() =>
                          onPreferences?.({
                            font_size: Math.min(32, preferences.font_size + 2),
                          })
                        }
                        disabled={busy}
                      >
                        A+
                      </button>
                    </div>

                    <div className="flex items-center bg-surface-container p-0.5 rounded-full text-label font-label text-[13px]">
                      <button
                        className="px-space-md py-1 rounded-full bg-surface text-primary font-bold shadow-sm transition-all"
                        id="spacing-btn-1"
                        aria-pressed={preferences.line_height === 1.7}
                        type="button"
                        onClick={() => onPreferences?.({ line_height: 1.7 })}
                        disabled={busy}
                      >
                        1.7x Santai
                      </button>
                      <button
                        className="px-space-md py-1 rounded-full text-on-surface-variant hover:text-primary transition-all"
                        id="spacing-btn-2"
                        aria-pressed={preferences.line_height === 2}
                        type="button"
                        onClick={() => onPreferences?.({ line_height: 2 })}
                        disabled={busy}
                      >
                        2.0x Longgar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs min-w-max pl-space-md">
                    <button
                      className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-lavender-tint hover:bg-lavender text-primary font-label text-label transition-colors"
                      id="tts-play-btn"
                      type="button"
                      onClick={() => onSpeak()}
                      disabled={busy}
                    >
                      {speaking ? "Hentikan bacaan" : "Bacakan teks"}
                    </button>
                  </div>
                </div>
              </section>

              <div className="w-full max-w-[1200px] mx-auto px-margin py-space-xl ui-container">
                <div className="reader-content-grid grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                  <article className="lg:col-span-8 flex flex-col gap-space-lg max-w-[740px] mx-auto w-full">
                    <p className="text-sm text-text-secondary">
                      {material.title} · Konsep {index + 1}/
                      {material.concepts.length}
                    </p>
                    <h1 className="text-3xl font-bold ui-page-title">
                      {concept.title}
                    </h1>
                    <div
                      className="reference-reading space-y-6"
                      style={textStyle}
                    >
                      {concept.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          className={
                            preferences.reading_ruler && j === session.paragraph
                              ? "bg-mint-tint p-4 rounded-xl"
                              : ""
                          }
                          onClick={() => update({ paragraph: j })}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={previous}
                        disabled={busy || index === 0}
                        className="border border-divider px-5 py-3 rounded-xl"
                      >
                        Sebelumnya
                      </button>
                      <button
                        onClick={next}
                        disabled={busy}
                        className="bg-primary text-white px-5 py-3 rounded-xl"
                      >
                        Tandai selesai & lanjut →
                      </button>
                    </div>
                  </article>

                  <aside className="reader-sidebar lg:col-span-4 flex flex-col gap-space-lg sticky top-36">
                    <div
                      hidden={zen || !preferences.show_mimo}
                      className="reader-companion bg-mint-tint border border-divider rounded-2xl p-6"
                    >
                      <Image
                        src="/design/mimo-final.png"
                        alt=""
                        width={1408}
                        height={1120}
                        className="w-40 h-auto object-contain mx-auto"
                      />
                      <h2 className="font-display font-bold text-lg mt-3 ui-section-title">
                        Mimo Menemanimu
                      </h2>
                      <p className="mt-3">
                        {displayName}, pelajari satu bagian dulu. Kamu bebas
                        mengganti cara belajar.
                      </p>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Format belajar
                        <select
                          aria-label="Format belajar"
                          ref={modeSelect}
                          value={session.mode}
                          disabled={busy}
                          onChange={(e) =>
                            update({
                              mode: e.target.value as LearningSession["mode"],
                            })
                          }
                          className="block w-full mt-2"
                        >
                          {(
                            [
                              ["reading", "Teman Baca"],
                              ["focus", "Selangkah demi Selangkah"],
                              ["explore", "Jelajah visual"],
                              ["transcript", "Transkrip & audio"],
                              ["standard", "Belajar standar"],
                            ] as const
                          ).map(([v, t]) => (
                            <option
                              key={v}
                              value={v}
                              disabled={
                                (v === "explore" &&
                                  !concept.diagram_description) ||
                                (v === "transcript" && !concept.transcript)
                              }
                            >
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button onClick={onSettings} className="block">
                        Atur aksesibilitas →
                      </button>
                      <button
                        onClick={() => sourcesDialog.current?.showModal()}
                        className="block"
                      >
                        Lihat sumber asli →
                      </button>
                      <button onClick={copyText} className="block">
                        Salin bacaan
                      </button>
                      <button
                        onClick={() => setZen(!zen)}
                        aria-pressed={zen}
                        className="block"
                      >
                        Mode fokus penuh
                      </button>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Catatan sesi
                        <textarea
                          className="block w-full mt-2"
                          value={draft}
                          maxLength={3000}
                          rows={5}
                          onChange={(e) => setDraft(e.target.value)}
                        />
                      </label>
                      <button
                        disabled={busy}
                        onClick={() => update({})}
                        className="w-full bg-primary text-white px-4 py-3 rounded-xl"
                      >
                        Simpan posisi dan catatan
                      </button>
                      <button
                        disabled={busy}
                        onClick={onPractice}
                        className="w-full bg-mint-tint px-4 py-3 rounded-xl"
                      >
                        Latihan pemahaman
                      </button>
                      {(feedback || note) && (
                        <p role="status">{feedback || note}</p>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {session.mode === "focus" ? (
          <div className="final-design final-screen-14 w-full bg-canvas flex-1 final-reader screen-page">
            <div className="flex flex-col w-full">
              <section className="reader-toolbar sticky top-20 z-40 bg-surface/95 backdrop-blur-sm border-b border-divider px-margin py-3">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ui-container">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <a
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors font-label text-label group"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1"
                        aria-hidden="true"
                      >
                        arrow_back
                      </span>
                      <span>Ganti Cara Belajar</span>
                    </a>
                    <div className="hidden sm:inline-block h-4 w-[1px] bg-divider"></div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter-tint text-primary font-label text-[13px] border border-butter">
                      <span
                        className="material-symbols-outlined text-[16px] text-warning"
                        aria-hidden="true"
                      >
                        splitscreen
                      </span>
                      <span className="font-bold">
                        Mode: Selangkah demi Selangkah
                      </span>
                      <span className="text-on-surface-variant font-normal hidden lg:inline">
                        (Focus Navigator)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-space-md flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface-variant font-metadata text-[13px] font-medium hidden sm:inline">{`${index + 1} / ${material.concepts.length} konsep`}</span>
                      <div
                        aria-label={`Progres langkah ${session.paragraph + 1} dari ${concept.paragraphs.length}`}
                        className="flex items-center gap-1.5"
                      >
                        <span className="w-6 h-2 rounded-full bg-secondary"></span>
                        <span className="w-8 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
                        <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-mint-tint px-3 py-1 rounded-full text-secondary font-metadata text-[13px] border border-secondary-container">
                      <span
                        className="material-symbols-outlined text-[17px] text-success"
                        aria-hidden="true"
                      >
                        timer
                      </span>
                      <span
                        className="font-bold text-primary font-mono"
                        id="gentle-timer"
                      >{`${index + 1} / ${material.concepts.length} konsep`}</span>
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">
                        santai
                      </span>
                      <button
                        className="ml-1 text-[12px] font-label text-secondary hover:text-primary underline cursor-pointer"
                        id="toggle-timer-btn"
                        type="button"
                        onClick={pause}
                        disabled={busy}
                      >
                        Jeda
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg border border-control-border text-primary hover:bg-canvas font-label text-label transition-colors"
                        type="button"
                        onClick={pause}
                        disabled={busy}
                      >
                        Jeda Belajar
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="w-full max-w-[1200px] mx-auto px-margin py-8 md:py-12 ui-container">
                <div className="reader-content-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 flex flex-col items-center">
                    <article className="w-full max-w-[720px] bg-surface rounded-3xl p-6 sm:p-10 border border-divider shadow-[0_3px_0_rgba(39,59,53,0.06)] flex flex-col gap-6">
                      <p className="text-sm text-text-secondary">
                        Langkah {session.paragraph + 1} dari{" "}
                        {concept.paragraphs.length} ·{" "}
                        {preferences.timer_enabled
                          ? `${Math.floor(elapsed / 60)} menit belajar`
                          : "Tanpa batas waktu"}
                      </p>
                      <h1 className="text-3xl font-bold my-5 ui-page-title">
                        {concept.title}
                      </h1>
                      <div
                        className="bg-mint-tint p-6 rounded-2xl reference-reading"
                        style={textStyle}
                      >
                        <p>
                          {concept.paragraphs[session.paragraph] ||
                            concept.paragraphs[0]}
                        </p>
                      </div>
                      <div className="flex justify-between gap-3 mt-6">
                        <button
                          onClick={previous}
                          disabled={
                            busy || (index === 0 && session.paragraph === 0)
                          }
                          className="border border-divider px-5 py-3 rounded-xl"
                        >
                          Sebelumnya
                        </button>
                        <button
                          onClick={next}
                          disabled={busy}
                          className="bg-primary text-white px-5 py-3 rounded-xl"
                        >
                          Lanjutkan →
                        </button>
                      </div>
                    </article>
                  </div>

                  <aside className="lg:col-span-4 flex flex-col gap-6">
                    <div
                      hidden={zen || !preferences.show_mimo}
                      className="reader-companion bg-mint-tint border border-divider rounded-2xl p-6"
                    >
                      <Image
                        src="/design/mimo-final.png"
                        alt=""
                        width={1408}
                        height={1120}
                        className="w-40 h-auto object-contain mx-auto"
                      />
                      <h2 className="font-display font-bold text-lg mt-3 ui-section-title">
                        Mimo Menemanimu
                      </h2>
                      <p className="mt-3">
                        {displayName}, pelajari satu bagian dulu. Kamu bebas
                        mengganti cara belajar.
                      </p>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Format belajar
                        <select
                          aria-label="Format belajar"
                          ref={modeSelect}
                          value={session.mode}
                          disabled={busy}
                          onChange={(e) =>
                            update({
                              mode: e.target.value as LearningSession["mode"],
                            })
                          }
                          className="block w-full mt-2"
                        >
                          {(
                            [
                              ["reading", "Teman Baca"],
                              ["focus", "Selangkah demi Selangkah"],
                              ["explore", "Jelajah visual"],
                              ["transcript", "Transkrip & audio"],
                              ["standard", "Belajar standar"],
                            ] as const
                          ).map(([v, t]) => (
                            <option
                              key={v}
                              value={v}
                              disabled={
                                (v === "explore" &&
                                  !concept.diagram_description) ||
                                (v === "transcript" && !concept.transcript)
                              }
                            >
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button onClick={onSettings} className="block">
                        Atur aksesibilitas →
                      </button>
                      <button
                        onClick={() => sourcesDialog.current?.showModal()}
                        className="block"
                      >
                        Lihat sumber asli →
                      </button>
                      <button onClick={copyText} className="block">
                        Salin bacaan
                      </button>
                      <button
                        onClick={() => setZen(!zen)}
                        aria-pressed={zen}
                        className="block"
                      >
                        Mode fokus penuh
                      </button>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Catatan sesi
                        <textarea
                          className="block w-full mt-2"
                          value={draft}
                          maxLength={3000}
                          rows={5}
                          onChange={(e) => setDraft(e.target.value)}
                        />
                      </label>
                      <button
                        disabled={busy}
                        onClick={() => update({})}
                        className="w-full bg-primary text-white px-4 py-3 rounded-xl"
                      >
                        Simpan posisi dan catatan
                      </button>
                      <button
                        disabled={busy}
                        onClick={onPractice}
                        className="w-full bg-mint-tint px-4 py-3 rounded-xl"
                      >
                        Latihan pemahaman
                      </button>
                      {(feedback || note) && (
                        <p role="status">{feedback || note}</p>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {session.mode === "explore" ? (
          <div className="final-design final-screen-15 w-full bg-canvas flex-1 final-reader screen-page">
            <div className="flex flex-col w-full pb-16">
              <section className="w-full bg-surface-container-low/60 py-space-sm px-margin">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-space-sm ui-container">
                  <div className="flex items-center gap-space-sm">
                    <a
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-primary font-label text-label transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_back
                      </span>
                      <span>Ganti Cara Belajar</span>
                    </a>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-tint text-primary font-label text-label">
                      <span
                        className="material-symbols-outlined text-[18px] text-tertiary"
                        aria-hidden="true"
                      >
                        headphones
                      </span>
                      <span>Mode: Dengarkan &amp; Jelajahi</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm ml-auto">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-surface text-primary font-metadata text-metadata">
                      <span className="w-2.5 h-2.5 rounded-full bg-lavender"></span>
                      <span>
                        Segmen {index + 1} dari {material.concepts.length}:{" "}
                        <strong>{concept.title}</strong>
                      </span>
                      <span className="text-on-surface-variant font-mono text-xs">{`${index + 1} / ${material.concepts.length} konsep`}</span>
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface-variant hover:text-primary font-label text-label transition-colors flex items-center gap-1"
                      type="button"
                      onClick={pause}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        pause_circle
                      </span>
                      <span className="hidden sm:inline">Jeda Belajar</span>
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-label text-label transition-colors flex items-center gap-1"
                      type="button"
                      onClick={next}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      <span>Tandai Selesai</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="reader-content-grid w-full max-w-[1200px] mx-auto px-margin pt-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-lg ui-container">
                <div className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
                  <section
                    aria-label="Pemutar Audio Materi"
                    className="rounded-3xl bg-lavender-tint/70 p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden"
                  >
                    <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-lavender/25 pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm relative z-10">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                          <span
                            className="material-symbols-outlined text-[24px]"
                            aria-hidden="true"
                          >
                            graphic_eq
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-label uppercase tracking-wider text-secondary font-bold">
                            Narasi Santai Bersama Mimo
                          </span>
                          <h1 className="font-section-title text-section-title text-primary tracking-tight ui-page-title">
                            Pabrik Penyaring Ajaib di Tubuh Kita
                          </h1>
                          <p className="font-metadata text-metadata text-on-surface-variant mt-0.5">
                            {concept.title}
                          </p>
                        </div>
                      </div>
                      <div className="self-start sm:self-center inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/80 text-success text-xs font-label">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                        <span>Audio Sinkron Aktif</span>
                      </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-xs relative z-10">
                      <div className="flex items-center justify-between font-metadata text-metadata text-on-surface-variant font-mono text-xs mb-1">
                        <span
                          className="text-primary font-bold"
                          id="current-timestamp"
                        >{`${index + 1} / ${material.concepts.length} konsep`}</span>
                        <span className="font-label text-on-surface-variant text-[12px]">
                          {concept.title}
                        </span>
                        <span>{`${index + 1} / ${material.concepts.length} konsep`}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-y-3 pt-2 mt-1">
                        <div className="flex items-center gap-1 bg-canvas rounded-xl p-1">
                          <button
                            className="speed-btn px-2.5 py-1 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-colors"
                            data-speed="0.8"
                            type="button"
                            aria-pressed={preferences.speech_rate === 0.8}
                            onClick={() =>
                              onPreferences?.({ speech_rate: 0.8 })
                            }
                            disabled={busy}
                          >
                            0.8x
                          </button>
                          <button
                            className="speed-btn px-2.5 py-1 rounded-lg bg-surface text-primary font-bold shadow-xs text-xs font-label"
                            data-speed="1.0"
                            type="button"
                            aria-pressed={preferences.speech_rate === 1.0}
                            onClick={() =>
                              onPreferences?.({ speech_rate: 1.0 })
                            }
                            disabled={busy}
                          >
                            1.0x (Normal)
                          </button>
                          <button
                            className="speed-btn px-2.5 py-1 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-colors"
                            data-speed="1.2"
                            type="button"
                            aria-pressed={preferences.speech_rate === 1.2}
                            onClick={() =>
                              onPreferences?.({ speech_rate: 1.2 })
                            }
                            disabled={busy}
                          >
                            1.2x
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            aria-label="Mundur 10 detik"
                            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-all active:scale-95"
                            type="button"
                            disabled={true}
                            title="Kontrol ini belum tersedia untuk materi ini."
                          >
                            <span
                              className="material-symbols-outlined text-[20px]"
                              aria-hidden="true"
                            >
                              replay_10
                            </span>
                          </button>
                          <button
                            aria-label="Jeda atau Putar Audio"
                            className="w-13 h-13 px-4 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary flex items-center justify-center shadow-md transition-all active:scale-95"
                            id="play-toggle-btn"
                            type="button"
                            onClick={() => onSpeak()}
                            disabled={busy}
                          >
                            {speaking ? "Hentikan bacaan" : "Bacakan teks"}
                          </button>
                          <button
                            aria-label="Maju 10 detik"
                            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-all active:scale-95"
                            type="button"
                            disabled={true}
                            title="Kontrol ini belum tersedia untuk materi ini."
                          >
                            <span
                              className="material-symbols-outlined text-[20px]"
                              aria-hidden="true"
                            >
                              forward_10
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-canvas">
                            <span
                              className="material-symbols-outlined text-[18px] text-on-surface-variant"
                              aria-hidden="true"
                            >
                              volume_up
                            </span>
                            <input
                              aria-label="Kontrol Volume"
                              className="w-16 accent-primary h-1 bg-surface-dim rounded-lg cursor-pointer"
                              max="100"
                              min="0"
                              type="range"
                              value="80"
                              disabled={true}
                            />
                          </div>
                          <button
                            aria-label="Kamus Istilah Cepat"
                            className="p-1.5 rounded-xl bg-canvas hover:bg-surface-container text-primary transition-colors"
                            title="Kontrol ini belum tersedia untuk materi ini."
                            type="button"
                            disabled={true}
                          >
                            <span
                              className="material-symbols-outlined text-[20px]"
                              aria-hidden="true"
                            >
                              dictionary
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    aria-labelledby="diagram-title"
                    className="rounded-3xl bg-surface p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md"
                  >
                    <h2
                      id="diagram-title"
                      className="font-bold text-xl ui-section-title"
                    >
                      {concept.title}
                    </h2>
                    <p className="text-sm mt-3">
                      Deskripsi diagram dari materi. Gambar diagram belum
                      tersedia.
                    </p>
                    <div className="bg-lavender-tint rounded-2xl p-6 my-5">
                      <p
                        className="whitespace-pre-wrap reference-reading"
                        style={textStyle}
                      >
                        {concept.diagram_description ||
                          concept.paragraphs.join("\n\n")}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onSpeak(concept.diagram_description || undefined)
                      }
                      className="bg-primary text-white px-5 py-3 rounded-xl"
                    >
                      Bacakan deskripsi
                    </button>
                  </section>

                  <section
                    aria-labelledby="transcript-title"
                    className="rounded-3xl bg-surface p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md"
                  >
                    <div className="flex items-center justify-between border-b-0 pb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-[22px] text-tertiary"
                          aria-hidden="true"
                        >
                          subtitles
                        </span>
                        <h2
                          className="font-section-title text-section-title text-primary ui-section-title"
                          id="transcript-title"
                        >
                          Transkrip
                        </h2>
                      </div>
                      <span className="text-xs font-label text-on-surface-variant bg-canvas px-3 py-1 rounded-full">
                        Transkrip materi
                      </span>
                    </div>
                    <div
                      className="flex flex-col gap-space-sm text-reading font-reading"
                      id="transcript-flow"
                    >
                      <div style={textStyle} className="whitespace-pre-wrap">
                        {concept.transcript || concept.paragraphs.join("\n\n")}
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-space-lg">
                  <div
                    hidden={zen || !preferences.show_mimo}
                    className="reader-companion bg-mint-tint border border-divider rounded-2xl p-6"
                  >
                    <Image
                      src="/design/mimo-final.png"
                      alt=""
                      width={1408}
                      height={1120}
                      className="w-40 h-auto object-contain mx-auto"
                    />
                    <h2 className="font-display font-bold text-lg mt-3 ui-section-title">
                      Mimo Menemanimu
                    </h2>
                    <p className="mt-3">
                      {displayName}, pelajari satu bagian dulu. Kamu bebas
                      mengganti cara belajar.
                    </p>
                  </div>
                  <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                    <label className="block font-bold">
                      Format belajar
                      <select
                        aria-label="Format belajar"
                        ref={modeSelect}
                        value={session.mode}
                        disabled={busy}
                        onChange={(e) =>
                          update({
                            mode: e.target.value as LearningSession["mode"],
                          })
                        }
                        className="block w-full mt-2"
                      >
                        {(
                          [
                            ["reading", "Teman Baca"],
                            ["focus", "Selangkah demi Selangkah"],
                            ["explore", "Jelajah visual"],
                            ["transcript", "Transkrip & audio"],
                            ["standard", "Belajar standar"],
                          ] as const
                        ).map(([v, t]) => (
                          <option
                            key={v}
                            value={v}
                            disabled={
                              (v === "explore" &&
                                !concept.diagram_description) ||
                              (v === "transcript" && !concept.transcript)
                            }
                          >
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button onClick={onSettings} className="block">
                      Atur aksesibilitas →
                    </button>
                    <button
                      onClick={() => sourcesDialog.current?.showModal()}
                      className="block"
                    >
                      Lihat sumber asli →
                    </button>
                    <button onClick={copyText} className="block">
                      Salin bacaan
                    </button>
                    <button
                      onClick={() => setZen(!zen)}
                      aria-pressed={zen}
                      className="block"
                    >
                      Mode fokus penuh
                    </button>
                  </div>
                  <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                    <label className="block font-bold">
                      Catatan sesi
                      <textarea
                        className="block w-full mt-2"
                        value={draft}
                        maxLength={3000}
                        rows={5}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                    </label>
                    <button
                      disabled={busy}
                      onClick={() => update({})}
                      className="w-full bg-primary text-white px-4 py-3 rounded-xl"
                    >
                      Simpan posisi dan catatan
                    </button>
                    <button
                      disabled={busy}
                      onClick={onPractice}
                      className="w-full bg-mint-tint px-4 py-3 rounded-xl"
                    >
                      Latihan pemahaman
                    </button>
                    {(feedback || note) && (
                      <p role="status">{feedback || note}</p>
                    )}
                  </div>
                </aside>
              </div>

              <section className="w-full max-w-[1200px] mx-auto px-margin pt-space-xl ui-container">
                <div className="w-full rounded-2xl bg-surface p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <button
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-canvas hover:bg-surface-container text-primary font-label text-label transition-colors flex items-center justify-center gap-2"
                    type="button"
                    onClick={onBack}
                    disabled={busy}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span>Kembali ke Ringkasan Materi</span>
                  </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                      type="button"
                      onClick={next}
                      disabled={busy}
                    >
                      <span>{concept.title}</span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : null}
        {session.mode === "transcript" ? (
          <div className="final-design final-screen-16 w-full bg-canvas flex-1 final-reader screen-page">
            <div className="flex flex-col w-full">
              <section className="w-full bg-surface-container-low px-margin py-space-sm">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-space-md ui-container">
                  <div className="flex items-center flex-wrap gap-space-sm">
                    <a
                      className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-primary-hover transition-colors px-space-xs py-1 rounded-lg"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_back
                      </span>
                      <span>Ganti Cara Belajar</span>
                    </a>
                    <span className="text-outline-variant">•</span>
                    <div className="inline-flex items-center gap-space-xs bg-peach-tint px-space-sm py-1 rounded-full">
                      <span
                        className="material-symbols-outlined text-primary text-[16px]"
                        aria-hidden="true"
                      >
                        palette
                      </span>
                      <span className="font-label text-[13px] text-primary font-bold">
                        Mode Teks &amp; Visual
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-space-md">
                    <div className="flex items-center gap-space-xs bg-surface px-space-md py-1.5 rounded-full shadow-sm">
                      <span className="font-label text-label text-on-surface-variant font-semibold">{`${index + 1} / ${material.concepts.length} konsep`}</span>
                      <span className="font-label text-label text-primary font-bold">
                        {concept.title}
                      </span>
                      <div className="flex items-center gap-1 ml-space-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label transition-colors"
                        type="button"
                        onClick={pause}
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          pause_circle
                        </span>
                        <span>Jeda Belajar</span>
                      </button>
                      <button
                        className="inline-flex items-center gap-space-xs px-space-lg py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label font-bold transition-colors shadow-sm"
                        type="button"
                        onClick={next}
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          task_alt
                        </span>
                        <span>Tandai Selesai</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="w-full max-w-[1200px] mx-auto px-margin py-space-lg ui-container">
                <div className="reader-content-grid grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  <div className="lg:col-span-8 flex flex-col gap-space-lg">
                    <section className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-wrap items-center justify-between gap-space-md">
                      <div className="flex items-center flex-wrap gap-space-md">
                        <label className="inline-flex items-center gap-space-xs cursor-pointer select-none">
                          <input
                            checked={preferences.captions}
                            className="sr-only peer"
                            id="toggle-caption"
                            type="checkbox"
                            onChange={(e) =>
                              onPreferences?.({ captions: e.target.checked })
                            }
                          />
                          <div className="w-10 h-6 bg-surface-container-highest peer-checked:bg-secondary rounded-full transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
                          <span className="font-label text-label text-primary font-bold">
                            Caption Diagram
                          </span>
                        </label>

                        <label className="inline-flex items-center gap-space-xs cursor-pointer select-none">
                          <input
                            checked={preferences.captions}
                            className="sr-only peer"
                            id="toggle-transcript"
                            type="checkbox"
                            onChange={(e) =>
                              onPreferences?.({ captions: e.target.checked })
                            }
                          />
                          <div className="w-10 h-6 bg-surface-container-highest peer-checked:bg-secondary rounded-full transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
                          <span className="font-label text-label text-on-surface-variant font-medium">
                            Baca Mandiri
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-space-sm">
                        <span className="font-metadata text-[13px] text-outline">
                          Ukuran Teks:
                        </span>
                        <div className="inline-flex bg-surface-container p-0.5 rounded-lg">
                          <button
                            className="px-space-sm py-1 rounded-md bg-surface text-primary font-label text-[13px] font-bold shadow-sm"
                            id="btn-text-std"
                            type="button"
                            onClick={() =>
                              onPreferences?.({
                                font_size: Math.max(
                                  14,
                                  preferences.font_size - 2,
                                ),
                              })
                            }
                            disabled={busy}
                          >
                            Standar
                          </button>
                          <button
                            className="px-space-sm py-1 rounded-md text-on-surface-variant font-label text-[13px] hover:text-primary"
                            id="btn-text-lg"
                            type="button"
                            onClick={() =>
                              onPreferences?.({
                                font_size: Math.min(
                                  32,
                                  preferences.font_size + 2,
                                ),
                              })
                            }
                            disabled={busy}
                          >
                            Lebih Besar
                          </button>
                        </div>
                      </div>
                    </section>

                    <article className="bg-surface rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-md">
                      <h1 className="text-2xl font-bold ui-page-title">
                        {concept.title}
                      </h1>
                      <p className="text-sm text-text-secondary">
                        Kartu konsep dari sumber materi
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {concept.paragraphs.map((p, j) => (
                          <section
                            key={j}
                            className="bg-peach-tint p-5 rounded-2xl"
                          >
                            <span className="font-bold">{j + 1}</span>
                            <p style={textStyle}>{p}</p>
                          </section>
                        ))}
                      </div>
                    </article>

                    <section className="flex flex-col gap-space-md">
                      <h2 className="font-bold text-xl ui-section-title">
                        Intisari Konsep Penting
                      </h2>
                      <p className="whitespace-pre-wrap" style={textStyle}>
                        {concept.diagram_description || concept.paragraphs[0]}
                      </p>
                    </section>

                    <section
                      className="bg-surface rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-md"
                      id="independent-transcript-container"
                      hidden={!preferences.captions}
                    >
                      <h2 className="font-bold text-xl ui-section-title">
                        Transkrip Mandiri
                      </h2>
                      <p
                        className="whitespace-pre-wrap reference-reading"
                        style={textStyle}
                      >
                        {concept.transcript || concept.paragraphs.join("\n\n")}
                      </p>
                    </section>
                  </div>

                  <aside className="lg:col-span-4 flex flex-col gap-space-lg">
                    <div
                      hidden={zen || !preferences.show_mimo}
                      className="reader-companion bg-mint-tint border border-divider rounded-2xl p-6"
                    >
                      <Image
                        src="/design/mimo-final.png"
                        alt=""
                        width={1408}
                        height={1120}
                        className="w-40 h-auto object-contain mx-auto"
                      />
                      <h2 className="font-display font-bold text-lg mt-3 ui-section-title">
                        Mimo Menemanimu
                      </h2>
                      <p className="mt-3">
                        {displayName}, pelajari satu bagian dulu. Kamu bebas
                        mengganti cara belajar.
                      </p>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Format belajar
                        <select
                          aria-label="Format belajar"
                          ref={modeSelect}
                          value={session.mode}
                          disabled={busy}
                          onChange={(e) =>
                            update({
                              mode: e.target.value as LearningSession["mode"],
                            })
                          }
                          className="block w-full mt-2"
                        >
                          {(
                            [
                              ["reading", "Teman Baca"],
                              ["focus", "Selangkah demi Selangkah"],
                              ["explore", "Jelajah visual"],
                              ["transcript", "Transkrip & audio"],
                              ["standard", "Belajar standar"],
                            ] as const
                          ).map(([v, t]) => (
                            <option
                              key={v}
                              value={v}
                              disabled={
                                (v === "explore" &&
                                  !concept.diagram_description) ||
                                (v === "transcript" && !concept.transcript)
                              }
                            >
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button onClick={onSettings} className="block">
                        Atur aksesibilitas →
                      </button>
                      <button
                        onClick={() => sourcesDialog.current?.showModal()}
                        className="block"
                      >
                        Lihat sumber asli →
                      </button>
                      <button onClick={copyText} className="block">
                        Salin bacaan
                      </button>
                      <button
                        onClick={() => setZen(!zen)}
                        aria-pressed={zen}
                        className="block"
                      >
                        Mode fokus penuh
                      </button>
                    </div>
                    <div className="bg-surface border border-divider rounded-2xl p-6 space-y-4">
                      <label className="block font-bold">
                        Catatan sesi
                        <textarea
                          className="block w-full mt-2"
                          value={draft}
                          maxLength={3000}
                          rows={5}
                          onChange={(e) => setDraft(e.target.value)}
                        />
                      </label>
                      <button
                        disabled={busy}
                        onClick={() => update({})}
                        className="w-full bg-primary text-white px-4 py-3 rounded-xl"
                      >
                        Simpan posisi dan catatan
                      </button>
                      <button
                        disabled={busy}
                        onClick={onPractice}
                        className="w-full bg-mint-tint px-4 py-3 rounded-xl"
                      >
                        Latihan pemahaman
                      </button>
                      {(feedback || note) && (
                        <p role="status">{feedback || note}</p>
                      )}
                    </div>
                  </aside>
                </div>
              </div>

              <nav className="w-full bg-surface py-space-md border-t border-divider mt-space-lg">
                <div className="max-w-[1200px] mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-md ui-container">
                  <a
                    className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary font-label text-label font-bold transition-colors"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onBack();
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span>Kembali ke Ringkasan Bab</span>
                  </a>
                  <div className="flex items-center gap-space-sm w-full sm:w-auto">
                    <button
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-2xl bg-canvas hover:bg-surface-container text-primary font-label text-label font-bold transition-colors"
                      type="button"
                      onClick={onPractice}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        quiz
                      </span>
                      <span>Coba Kuis Ringkas</span>
                    </button>
                    <button
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-2xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label font-bold transition-all shadow-sm"
                      type="button"
                      onClick={next}
                      disabled={busy}
                    >
                      <span>{concept.title}</span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        ) : null}
      </div>
      <dialog
        ref={pauseDialog}
        className="stitch-reason"
        aria-label="Ambil jeda sebentar"
      >
        <h2 className="ui-section-title">Ambil jeda sebentar</h2>
        <p>Posisi dan catatan yang berhasil disimpan bisa dilanjutkan nanti.</p>
        <button
          onClick={() => {
            update({
              status: session.status === "completed" ? "completed" : "active",
            });
            pauseDialog.current?.close();
          }}
        >
          Lanjutkan belajar
        </button>
      </dialog>
      <dialog
        ref={sourcesDialog}
        className="stitch-reason"
        aria-label="Sumber materi"
      >
        <h2 className="ui-section-title">Sumber materi</h2>
        {sources.map((s) => (
          <article key={s.id}>
            <h3 className="ui-card-title">{s.label}</h3>
            <p className="whitespace-pre-wrap">{s.text}</p>
          </article>
        ))}
        <button onClick={() => sourcesDialog.current?.close()}>
          Tutup sumber
        </button>
      </dialog>
    </>
  );
}
