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
      <div className="stitch-screen stitch-quiz revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-sm bg-surface-container-low/70">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary text-xs font-bold font-label tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  {`Latihan Pemahaman • Soal ${attempt.question_ids.indexOf(question.id) + 1} dari ${attempt.questions.length}`}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-label text-text-secondary bg-surface px-2.5 py-1 rounded-full shadow-sm">
                  <span
                    className="material-symbols-outlined text-[15px] text-secondary"
                    aria-hidden="true"
                  >
                    self_improvement
                  </span>
                  Ritme Santai: Tanpa Batas Waktu
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface hover:bg-surface-container text-xs font-label font-semibold text-primary shadow-sm transition-transform active:scale-95"
                  title="Aksesibilitas Kontras & Font"
                  type="button"
                  onClick={() => setHints(!hints)}
                  disabled={busy}
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    visibility
                  </span>
                  <span className="hidden md:inline">Mode Nyaman Mata</span>
                </button>
                <div className="flex items-center gap-1 text-xs text-text-secondary pl-2">
                  <span>Progres:</span>
                  <div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="w-1/2 h-full bg-secondary rounded-full transition-all duration-300"></div>
                  </div>
                  <span className="font-bold text-primary">50%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md lg:py-space-lg">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <main className="lg:col-span-7 flex flex-col gap-space-md">
                <article className="bg-surface rounded-xl p-space-md md:p-space-lg shadow-sm relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>

                  <div className="flex items-center justify-between gap-space-xs mb-space-sm flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/30 text-primary text-xs font-bold font-label">
                      <span
                        className="material-symbols-outlined text-[15px] text-secondary"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                      {material.title}
                    </span>
                    <span className="text-xs font-metadata text-text-secondary">{`${displayName}, ambil waktu yang kamu butuhkan.`}</span>
                  </div>

                  <h1 className="text-card-title md:text-section-title font-page-title text-primary font-bold mb-space-md leading-snug">
                    {question.prompt}
                  </h1>

                  <div className="w-full rounded-xl bg-surface-container-low p-space-md md:p-space-lg flex flex-col items-center justify-center relative mb-space-md">
                    <span className="text-xs font-metadata text-text-secondary mb-2 flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        aria-hidden="true"
                      >
                        architecture
                      </span>
                      Diagram Geometri: Segitiga Siku-Siku ABC
                    </span>

                    <div className="w-full max-w-sm aspect-[4/3] flex items-center justify-center"></div>
                    <p className="text-xs font-metadata text-text-secondary text-center mt-1">
                      Garis putus-putus menunjukkan sisi yang persis{" "}
                      <strong className="text-primary">
                        berhadapan langsung
                      </strong>{" "}
                      dengan sudut 90°.
                    </p>
                  </div>

                  <fieldset
                    aria-label="Pilihan Jawaban Soal Hipotenusa"
                    className="flex flex-col gap-space-sm"
                    id="mcq-options"
                  >
                    <legend className="font-semibold text-primary mb-4">
                      Pilih salah satu jawaban
                    </legend>
                    {question.options.map((option, i) => (
                      <label
                        key={i}
                        data-selected={choice === i}
                        className="flex items-center gap-4 p-4 rounded-xl border border-divider cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="jawaban"
                          aria-label={option}
                          checked={choice === i}
                          disabled={busy || answered}
                          onChange={() => select(i)}
                        />
                        <span>
                          {String.fromCharCode(65 + i)}. {option}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </article>
              </main>

              <aside className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="bg-surface rounded-xl p-space-md md:p-space-lg shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between mb-space-sm">
                    <span className="inline-flex items-center gap-1 text-xs font-label text-secondary font-bold bg-secondary-container px-2.5 py-1 rounded-full">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        aria-hidden="true"
                      >
                        favorite
                      </span>{" "}
                      Teman Belajarmu
                    </span>
                    <span className="text-xs font-metadata text-text-secondary">
                      Mimo si Bunglon
                    </span>
                  </div>

                  <div className="relative w-36 h-36 md:w-44 md:h-44 my-space-xs flex items-center justify-center overflow-hidden rounded-2xl bg-secondary-container/20 p-2">
                    <Image
                      alt="Mimo si bunglon ramah menyemangati belajar"
                      className="w-full h-full object-contain relative z-10 transition-transform duration-300 hover:scale-105 rounded-xl"
                      src="/design/mimo-5.png"
                      width={1024}
                      height={1024}
                    ></Image>
                  </div>

                  <div className="w-full bg-surface-container-low rounded-xl p-space-md text-left mt-space-xs relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-container-low rotate-45"></div>
                    <p className="font-mimo-voice text-sm md:text-base text-primary leading-relaxed relative z-10">
                      &quot;Santai aja Manda, pilih jawaban yang menurutmu
                      paling masuk akal. Latihan ini cuma buat ngecek pemahaman,{" "}
                      <span className="text-secondary font-extrabold">
                        bukan ujian bertarget nilai!
                      </span>
                      &quot;
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-space-md shadow-sm">
                  <details className="group" open={true}>
                    <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-8 h-8 rounded-lg bg-butter/60 text-primary flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            psychology_alt
                          </span>
                        </div>
                        <div>
                          <h3 className="font-label text-sm text-primary font-bold">
                            Bantuan Sensorik Visual
                          </h3>
                          <p className="font-metadata text-xs text-text-secondary">
                            Trik mata dari Mimo
                          </p>
                        </div>
                      </div>
                      <span
                        className="material-symbols-outlined text-[20px] text-text-secondary transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </summary>
                    <div className="mt-space-sm pt-space-sm border-t border-divider/60 text-xs md:text-sm font-reading text-on-surface-variant leading-relaxed">
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-2">
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          tips_and_updates
                        </span>
                        <p>
                          <strong>Tips dari Mimo:</strong> Ingat trik sudut
                          siku-siku! Sisi terpanjang (hipotenusa) selalu berada{" "}
                          <em>di depan matanya langsung</em>, tidak pernah
                          menyentuh langsung sudut 90°-nya.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-space-sm">
                        <div className="p-2 rounded-lg bg-surface-container text-xs">
                          <span className="font-bold text-primary block">
                            Sisi Penyiku:
                          </span>
                          <span className="text-text-secondary">
                            AB &amp; BC (Membentuk huruf L)
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary-container/50 text-xs">
                          <span className="font-bold text-primary block">
                            {material.title}
                          </span>
                          <span className="text-secondary font-semibold">
                            AC (Sisi miring seberangnya)
                          </span>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>

                <div className="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-sm">
                  <span
                    className="material-symbols-outlined text-[24px] text-secondary flex-shrink-0"
                    aria-hidden="true"
                  >
                    nature_people
                  </span>
                  <p className="font-metadata text-xs text-text-secondary leading-normal">
                    Merasa lelah? Tarik napas sejenak. Kamu bisa menyimpan
                    progres kapan saja tanpa kehilangan jejak belajar.
                  </p>
                </div>
              </aside>
            </div>
          </section>

          <section className="sticky bottom-20 z-30 w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-3 bg-surface/95 backdrop-blur-md shadow-md">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="font-label text-sm text-primary font-bold">{`Soal ${attempt.question_ids.indexOf(question.id) + 1} dari ${attempt.questions.length}`}</span>
                </div>
                <span className="font-metadata text-xs text-text-secondary hidden md:inline">
                  {choice === null
                    ? "Belum memilih jawaban"
                    : `Pilihan ${String.fromCharCode(65 + choice)} dipilih`}
                </span>
              </div>

              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                <button
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-xs md:text-sm font-semibold transition-colors active:scale-95"
                  type="button"
                  onClick={() => setHints(!hints)}
                  disabled={busy}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    help_outline
                  </span>
                  <span>Tanya Penjelasan</span>
                </button>
                <button
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-xs md:text-sm font-bold shadow-sm transition-transform active:scale-95"
                  type="button"
                  onClick={onAnswer}
                  disabled={busy}
                >
                  <span>Kirim Jawaban &amp; Lihat Hasil</span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
        <section className="max-w-6xl mx-auto p-6 bg-surface rounded-2xl space-y-4">
          {hints && (
            <p>
              Periksa kembali bacaan dan sumber konsep sebelum memilih. Tidak
              ada batas waktu.
            </p>
          )}
          <button onClick={() => onSpeak(question.prompt)}>Bacakan soal</button>
          <label className="block">
            Coretan latihan
            <textarea
              value={scratch}
              maxLength={3000}
              onChange={(e) => scratchChange(e.target.value)}
            />
          </label>
          {answered && (
            <div role="status">
              <h2>
                {attempt.answers[question.id]?.correct
                  ? "Pemahamanmu sudah tepat."
                  : "Belum tepat, kita pahami bareng."}
              </h2>
              <p>{question.explanation}</p>
              <p>
                Jawaban yang tepat:{" "}
                {question.options[question.correct_index ?? 0]}
              </p>
              {material.sources
                .filter((s) => question.source_ids.includes(s.id))
                .map((s) => (
                  <p key={s.id}>
                    {s.label}: {s.text}
                  </p>
                ))}
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            {!answered ? (
              <button
                disabled={busy || choice === null}
                onClick={onAnswer}
                className="min-h-[44px] px-5 rounded-xl bg-primary text-surface"
              >
                Kirim Jawaban & Lihat Penjelasan
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={onNext}
                className="min-h-[44px] px-5 rounded-xl bg-primary text-surface"
              >
                Pertanyaan berikutnya
              </button>
            )}
            <button disabled={busy} onClick={onPause}>
              Kembali membaca
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
