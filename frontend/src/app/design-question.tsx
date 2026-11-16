"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Attempt, Material } from "@/lib/types";
export function QuestionDesign({
  attempt,
  material,
  question,
  choice,
  answered,
  busy,
  onChoice,
  onAnswer,
  onNext,
  onPause,
  onSpeak,
  displayName,
}: {
  attempt: Attempt;
  material: Material;
  question: Attempt["questions"][number];
  choice: number | null;
  answered: boolean;
  busy: boolean;
  onChoice: (n: number | null) => void;
  onAnswer: () => void;
  onNext: () => void;
  onPause: () => void;
  onSpeak: (text?: string) => void;
  displayName: string;
}) {
  const [hints, setHints] = useState(false),
    [scratch, setScratch] = useState("");
  const [large, setLarge] = useState(false);
  const scratchKey = "temanbelajar-scratch:" + attempt.id;
  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(scratchKey) || "null");
        if (saved && alive) {
          setScratch(saved.text || "");
          if (
            saved.question === question.id &&
            !answered &&
            Number.isInteger(saved.choice) &&
            saved.choice >= 0 &&
            saved.choice < question.options.length
          )
            onChoice(saved.choice);
        }
      } catch {}
    });
    return () => {
      alive = false;
    };
  }, [scratchKey, question.id, question.options.length, answered, onChoice]);
  function persist(text: string, selection: number | null) {
    try {
      localStorage.setItem(
        scratchKey,
        JSON.stringify({ text, choice: selection, question: question.id }),
      );
    } catch {}
  }
  function scratchChange(text: string) {
    setScratch(text);
    persist(text, choice);
  }
  function select(i: number) {
    onChoice(i);
    persist(scratch, i);
  }
  return (
    <>
      <div className="final-design final-screen-17 w-full pt-20 bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface border-b border-divider py-space-sm px-margin">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
              <div className="flex flex-wrap items-center gap-space-sm">
                <a
                  className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-label text-label transition-colors py-1 px-2 rounded-lg hover:bg-canvas"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPause();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Materi</span>
                </a>
                <div className="h-4 w-[1px] bg-divider hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-mint-tint border border-secondary/20 text-success text-[12px] font-label font-bold">
                    Latihan Adaptif
                  </span>
                  <span className="text-on-surface-variant font-metadata text-metadata truncate max-w-[280px] sm:max-w-none">{`Soal ${attempt.question_ids.indexOf(question.id) + 1} dari ${attempt.questions.length} · ${material.title}`}</span>
                </div>
              </div>

              <div className="flex items-center gap-space-xs self-end md:self-auto flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-control-border/40 bg-surface hover:bg-canvas text-primary font-label text-label transition-colors"
                  id="btn-tts"
                  title="Dengarkan soal dengan suara"
                  type="button"
                  onClick={() => onSpeak(question.prompt)}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    volume_up
                  </span>
                  <span className="hidden sm:inline">Bacakan Soal</span>
                </button>
                <div className="inline-flex items-center rounded-xl border border-control-border/40 bg-surface p-0.5">
                  <button
                    className="px-2 py-1 text-[13px] font-bold text-on-surface-variant hover:text-primary transition-colors"
                    id="btn-font-dec"
                    title="Perkecil Teks"
                    type="button"
                    onClick={() => setLarge(false)}
                  >
                    A−
                  </button>
                  <div className="h-3 w-[1px] bg-divider"></div>
                  <button
                    className="px-2 py-1 text-[13px] font-bold text-on-surface-variant hover:text-primary transition-colors"
                    id="btn-font-inc"
                    title="Perbesar Teks"
                    type="button"
                    onClick={() => setLarge(true)}
                  >
                    A+
                  </button>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-butter-tint/80 border border-warning/30 text-warning font-label text-label"
                  id="btn-relax-mode"
                  title="Mode santai tanpa batas waktu aktif"
                  type="button"
                  onClick={onPause}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    self_improvement
                  </span>
                  <span className="hidden lg:inline">Mode Santai</span>
                </button>
                <a
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-divider hover:bg-canvas text-outline hover:text-on-surface font-label text-label transition-colors"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPause();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    logout
                  </span>
                  <span className="hidden sm:inline">Simpan &amp; Keluar</span>
                </a>
              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container-low border-b border-divider py-space-xs px-margin">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-space-md">
              <div className="flex items-center gap-2 min-w-fit">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  task_alt
                </span>
                <span className="font-label text-label font-bold text-primary">{`Soal ${attempt.question_ids.indexOf(question.id) + 1} dari ${attempt.questions.length} · ${material.title}`}</span>
              </div>
              <div className="w-full max-w-md bg-canvas rounded-full h-2.5 overflow-hidden border border-divider">
                <div
                  className="bg-secondary-container h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <span className="text-metadata font-metadata text-outline text-[12px] hidden sm:inline">{`Soal ${attempt.question_ids.indexOf(question.id) + 1} dari ${attempt.questions.length} · ${material.title}`}</span>
            </div>
          </section>

          <div className="w-full max-w-[1200px] mx-auto px-margin py-space-lg flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <main
                className="lg:col-span-8 flex flex-col gap-space-md"
                id="question-stage"
              >
                <article className="bg-surface rounded-3xl p-6 sm:p-8 border border-divider shadow-[0_3px_0_rgba(39,59,53,0.09)] flex flex-col gap-space-md">
                  <div className="flex items-center justify-between border-b border-divider/60 pb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-tint text-primary text-[13px] font-label font-bold border border-lavender/30">
                      <span
                        className="material-symbols-outlined text-[16px] text-tertiary"
                        aria-hidden="true"
                      >
                        biotech
                      </span>
                      Konsep 2: Tekanan Filtrasi &amp; Hasil Filtrasi Glomerulus
                    </span>
                    <span className="text-outline text-metadata font-metadata text-[13px]">
                      Bobot 20 Poin
                    </span>
                  </div>

                  <div className="transition-all" id="quiz-stem-wrapper">
                    <h1
                      className="font-section-title text-section-title text-contrast-ink leading-relaxed font-bold"
                      id="quiz-question-text"
                      style={{ fontSize: large ? 28 : 22 }}
                    >
                      {question.prompt}
                    </h1>
                  </div>

                  <div className="rounded-2xl p-4 bg-butter-tint/60 border border-warning/20 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-butter flex items-center justify-center shrink-0 text-warning mt-0.5 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        filter_alt
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-label text-label font-bold text-warning">
                          Analogi Memori Sederhana
                        </p>
                        <span className="text-[11px] font-metadata uppercase tracking-wider text-warning/70 bg-butter px-1.5 py-0.2 rounded">
                          Pori Saringan
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body text-body text-[14px] mt-0.5 leading-snug">
                        Ingat prinsip saringan teh: partikel berukuran besar
                        (seperti daun teh) akan tertahan di atas saringan,
                        sedangkan molekul air serta zat terlarut yang sangat
                        kecil akan bebas lolos ke cangkir.
                      </p>
                    </div>
                  </div>

                  <fieldset
                    aria-label="Pilihan jawaban"
                    className="flex flex-col gap-3 mt-1"
                    role="radiogroup"
                  >
                    <legend className="sr-only">
                      Pilih salah satu jawaban
                    </legend>
                    {question.options.map((option, i) => (
                      <label
                        key={i}
                        className={
                          "flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer " +
                          (choice === i
                            ? "bg-mint-tint border-primary"
                            : "bg-surface border-divider")
                        }
                      >
                        <input
                          type="radio"
                          name="answer"
                          checked={choice === i}
                          disabled={busy || answered}
                          onChange={() => select(i)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>

                  <div className="pt-4 border-t border-divider flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-control-border/40 hover:bg-canvas text-on-surface font-label text-label transition-colors"
                        id="btn-doubt"
                        type="button"
                        aria-pressed={Boolean(scratch)}
                        onClick={() =>
                          scratchChange(scratch ? "" : "Perlu ditinjau lagi")
                        }
                      >
                        <span
                          className="material-symbols-outlined text-[18px] text-warning"
                          aria-hidden="true"
                        >
                          flag
                        </span>
                        <span>Tandai Ragu-ragu</span>
                      </button>
                      <button
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-secondary/30 bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors"
                        id="btn-ask-mimo"
                        type="button"
                        aria-expanded={hints}
                        onClick={() => setHints(!hints)}
                      >
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary"
                          aria-hidden="true"
                        >
                          lightbulb
                        </span>
                        <span>Bantuan Petunjuk</span>
                      </button>
                    </div>
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold shadow-[0_3px_0_rgba(19,37,31,0.3)] transition-all"
                      id="btn-submit-answer"
                      type="button"
                      disabled={busy || choice === null || answered}
                      onClick={onAnswer}
                    >
                      <span>Periksa Jawaban Sekarang</span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </article>

                <div
                  className="p-5 rounded-2xl bg-mint-tint"
                  id="feedback-panel"
                  hidden={!answered}
                >
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onNext}
                    className="bg-primary text-white rounded-xl px-5 py-3 mb-4"
                  >
                    Pertanyaan berikutnya
                  </button>
                  <h2 className="font-bold">
                    {attempt.answers[question.id]?.correct
                      ? "Jawabanmu tepat"
                      : "Belum pas, yuk pelajari alasannya"}
                  </h2>
                  <p>{question.explanation}</p>
                  {material.sources
                    .filter((s) => question.source_ids.includes(s.id))
                    .map((s) => (
                      <details key={s.id}>
                        <summary>{s.label}</summary>
                        <p className="whitespace-pre-wrap">{s.text}</p>
                      </details>
                    ))}
                </div>
              </main>

              <aside className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="bg-surface rounded-3xl p-6 border border-divider shadow-sm relative overflow-hidden flex flex-col items-center">
                  <div className="w-44 h-36 flex items-center justify-center relative -mb-1">
                    <Image
                      alt=""
                      className="w-full h-full object-contain pointer-events-none select-none object-contain"
                      src="/design/mimo-final.png"
                      width={1408}
                      height={1120}
                    ></Image>
                  </div>

                  <div className="w-full bg-lavender-tint rounded-2xl p-4 border border-lavender/30 relative">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      <p className="font-mimo-voice text-primary text-[14px] font-bold tracking-tight">
                        Mimo Menyemangati
                      </p>
                    </div>
                    <p
                      className="font-mimo-voice text-primary text-[15px] font-bold leading-snug"
                      id="mimo-speech-text"
                    >{`${displayName}, ambil waktu yang kamu butuhkan. Tidak ada batas waktu.`}</p>
                  </div>

                  <div
                    className="p-4 rounded-xl bg-butter-tint"
                    id="mimo-hint-box"
                    hidden={!hints}
                  >
                    <p>
                      Baca kembali kata kunci pada soal. Kamu bisa membuka teks
                      sumber untuk mengingat konsep, lalu memilih sendiri
                      jawabanmu.
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-6 border border-divider shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="font-card-title text-card-title font-bold text-primary">
                      Peta Soal Latihan
                    </h2>
                    <span className="text-[12px] font-metadata text-outline">
                      5 Soal Adaptif
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2"></div>

                  <div className="flex items-center justify-between text-[11px] font-metadata text-on-surface-variant pt-2 border-t border-divider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success"></span>{" "}
                      1 Selesai
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                      1 Aktif
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-divider"></span>{" "}
                      3 Menunggu
                    </span>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-5 border border-divider shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-mint-tint flex items-center justify-center text-success shrink-0">
                    <span
                      className="material-symbols-outlined text-[22px]"
                      aria-hidden="true"
                    >
                      timer
                    </span>
                  </div>
                  <div>
                    <p className="font-label text-label font-bold text-primary">
                      Irama Belajar Santai
                    </p>
                    <p className="font-metadata text-metadata text-on-surface-variant text-[12px] leading-tight">
                      Timer dihentikan. Kerjakan dengan kecepatan pikiranmu
                      sendiri tanpa cemas.
                    </p>
                  </div>
                </div>
                <section className="bg-surface border border-divider rounded-2xl p-5">
                  <h2 className="font-bold">Catatan latihan</h2>
                  <textarea
                    aria-label="Catatan latihan"
                    className="w-full mt-3"
                    value={scratch}
                    onChange={(e) => scratchChange(e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm mt-3">
                    {Object.keys(attempt.answers).length}/
                    {attempt.questions.length} jawaban tersimpan
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
