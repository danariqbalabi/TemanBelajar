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
    <div className="stitch-screen stitch-quiz">
      {answered && (
        <section
          className="p-space-lg rounded-2xl bg-secondary-container/50 mb-space-lg"
          role="status"
        >
          <h2 className="font-section-title text-section-title text-primary">
            {attempt.answers[question.id]?.correct
              ? "Pemahamanmu sudah tepat."
              : "Belum tepat, kita pahami bareng."}
          </h2>
          <p className="font-reading text-reading text-primary mt-space-sm">
            {question.explanation}
          </p>
          <p className="font-label text-label text-secondary mt-space-sm">
            Jawaban yang tepat: {question.options[question.correct_index ?? 0]}
          </p>
          <details className="mt-space-md">
            <summary className="font-label text-label text-primary">
              Lihat sumber penjelasan
            </summary>
            {material.sources
              .filter((s) => question.source_ids.includes(s.id))
              .map((s) => (
                <p
                  key={s.id}
                  className="font-body text-body text-text-secondary mt-space-sm"
                >
                  {s.label}: {s.text}
                </p>
              ))}
          </details>
        </section>
      )}
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl flex flex-col gap-space-xl">
          <section className="w-full flex flex-wrap items-center justify-between gap-space-md bg-surface p-space-md rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-space-sm sm:gap-space-md">
              <button
                className="inline-flex items-center gap-space-xs font-label text-label text-secondary hover:text-primary transition-colors"
                onClick={onPause}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Ringkasan Materi Bab 4</span>
              </button>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:inline-block"></span>
              <span className="font-metadata text-metadata text-on-surface-variant font-semibold">
                {material.title}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-label font-bold">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                <span>Sesi Latihan Mandiri • Bebas Tekanan Waktu</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs sm:gap-space-sm ml-auto">
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs transition-colors"
                type="button"
                disabled={busy}
                onClick={() =>
                  onSpeak(question.prompt + " " + question.options.join(". "))
                }
              >
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  aria-hidden="true"
                >
                  volume_up
                </span>
                <span className="hidden sm:inline">Bacakan Soal</span>
              </button>
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container text-text-secondary font-label text-xs">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  hourglass_disabled
                </span>
                <span>Timer Nonaktif</span>
              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary text-on-primary font-label text-xs uppercase tracking-wider">
                    {`Langkah ${attempt.question_ids.indexOf(question.id) + 1}/${attempt.questions.length}`}
                  </span>
                  <span className="font-metadata text-metadata text-text-secondary">
                    {
                      material.concepts.find(
                        (c) => c.id === question.concept_id,
                      )?.title
                    }
                  </span>
                </div>
                <h1 className="font-section-title text-section-title text-primary mt-1">{`Soal ${attempt.question_ids.indexOf(question.id) + 1}: ${material.title}`}</h1>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  psychology
                </span>
                <span className="font-metadata text-metadata font-bold text-primary">
                  Latihan Pemahaman Konsep
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <div className="h-2 rounded-full bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary-fixed opacity-40"></div>
              </div>
              <div className="h-2 rounded-full bg-surface-container-highest"></div>
            </div>
          </section>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              <article className="bg-surface p-space-lg md:p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-lg">
                <div className="flex flex-wrap items-center justify-between gap-space-xs pb-1">
                  <span className="font-label text-label tracking-wide uppercase text-secondary font-bold flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      home_repair_service
                    </span>
                    Kasus Nyata 1 • Analogi Tangga Rumah
                  </span>
                  <span className="text-xs font-metadata text-muted-gray bg-surface-container-low px-2.5 py-1 rounded-full">
                    {
                      material.concepts.find(
                        (c) => c.id === question.concept_id,
                      )?.title
                    }
                  </span>
                </div>

                <p className="font-reading text-reading text-on-surface leading-relaxed">
                  {question.prompt}
                </p>

                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full max-w-md flex flex-col items-center">
                    <div className="relative w-full aspect-[16/10] max-h-56 flex items-center justify-center">
                      {question.id === "pythagoras-1" ? (
                        <svg
                          className="w-full h-full drop-shadow-sm select-none"
                          fill="none"
                          viewBox="0 0 400 240"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            stroke="#c2c8c4"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            strokeWidth="2"
                            x1="40"
                            x2="360"
                            y1="200"
                            y2="200"
                          ></line>
                          <line
                            stroke="#c2c8c4"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            strokeWidth="2"
                            x1="80"
                            x2="80"
                            y1="20"
                            y2="210"
                          ></line>

                          <polygon
                            fill="#c8e8ce"
                            fillOpacity="0.45"
                            points="80,50 80,200 280,200"
                          ></polygon>

                          <rect
                            fill="#faf9f4"
                            height="24"
                            width="24"
                            x="80"
                            y="176"
                          ></rect>
                          <path
                            d="M 80 176 L 104 176 L 104 200"
                            fill="none"
                            stroke="#112520"
                            strokeWidth="2.5"
                          ></path>
                          <circle
                            cx="92"
                            cy="188"
                            fill="#112520"
                            r="2.5"
                          ></circle>

                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="4"
                            x1="80"
                            x2="80"
                            y1="50"
                            y2="200"
                          ></line>

                          <line
                            stroke="#112520"
                            strokeLinecap="round"
                            strokeWidth="4"
                            x1="80"
                            x2="280"
                            y1="200"
                            y2="200"
                          ></line>

                          <line
                            stroke="#496550"
                            strokeDasharray="8 6"
                            strokeLinecap="round"
                            strokeWidth="5"
                            x1="80"
                            x2="280"
                            y1="50"
                            y2="200"
                          ></line>

                          <circle cx="80" cy="50" fill="#112520" r="6"></circle>
                          <circle
                            cx="80"
                            cy="200"
                            fill="#112520"
                            r="6"
                          ></circle>
                          <circle
                            cx="280"
                            cy="200"
                            fill="#112520"
                            r="6"
                          ></circle>

                          <rect
                            fill="#112520"
                            height="26"
                            rx="6"
                            width="50"
                            x="22"
                            y="112"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="12"
                            fontWeight="700"
                            textAnchor="middle"
                            x="47"
                            y="129"
                          >
                            b = 3 m
                          </text>

                          <rect
                            fill="#112520"
                            height="26"
                            rx="6"
                            width="52"
                            x="156"
                            y="208"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="12"
                            fontWeight="700"
                            textAnchor="middle"
                            x="182"
                            y="225"
                          >
                            a = 4 m
                          </text>

                          <rect
                            fill="#c8e8ce"
                            height="30"
                            rx="8"
                            width="94"
                            x="195"
                            y="100"
                          ></rect>
                          <text
                            fill="#052011"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="13"
                            fontWeight="800"
                            textAnchor="middle"
                            x="242"
                            y="120"
                          >
                            Tangga: c = ?
                          </text>
                        </svg>
                      ) : (
                        <div className="p-space-lg rounded-2xl bg-surface-container-low text-center">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[64px] text-secondary"
                          >
                            school
                          </span>
                          <p className="font-metadata text-metadata text-text-secondary mt-space-sm">
                            {
                              material.concepts.find(
                                (c) => c.id === question.concept_id,
                              )?.title
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-center flex items-center gap-1.5 text-xs text-text-secondary bg-surface px-3 py-1.5 rounded-full shadow-sm">
                      <span
                        className="material-symbols-outlined text-[16px] text-secondary"
                        aria-hidden="true"
                      >
                        visibility
                      </span>
                      <span>
                        Diagram: Segitiga siku-siku dengan alas{" "}
                        <span className="font-bold text-on-surface">
                          a = 4 m
                        </span>
                        , tinggi dinding{" "}
                        <span className="font-bold text-on-surface">
                          b = 3 m
                        </span>
                        , dan tangga miring{" "}
                        <span className="font-bold text-on-surface">c</span>.
                      </span>
                    </div>
                  </div>

                  <div className="w-full mt-4 flex flex-col items-center">
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-label text-primary hover:text-secondary bg-surface hover:bg-surface-container py-1.5 px-3 rounded-full transition-colors"
                      type="button"
                      disabled={busy}
                      onClick={() => setHints(!hints)}
                      aria-expanded={hints}
                    >
                      <span
                        className="material-symbols-outlined text-[16px] text-warning"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                      <span>Butuh petunjuk awal? Buka rumus bantu</span>
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={
                        hints
                          ? "p-space-md rounded-xl bg-secondary-container/40 mt-space-sm"
                          : "hidden"
                      }
                      id="hint-box"
                    >
                      <h3 className="font-label text-label text-primary">
                        Petunjuk dari sumber materi
                      </h3>
                      {material.sources
                        .filter((s) => question.source_ids.includes(s.id))
                        .map((s) => (
                          <p
                            key={s.id}
                            className="font-body text-body text-text-secondary mt-space-sm"
                          >
                            {s.text}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <fieldset className="flex flex-col gap-space-md mt-space-xs">
                  <legend className="font-label text-label text-primary">
                    Pilih satu jawaban
                  </legend>
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      data-selected={
                        (answered
                          ? attempt.answers[question.id]?.selected_index
                          : choice) === i
                      }
                      className="relative flex items-start gap-space-md p-space-md rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                      <input
                        type="radio"
                        aria-label={option}
                        name={"answer-" + question.id}
                        checked={
                          (answered
                            ? attempt.answers[question.id]?.selected_index
                            : choice) === i
                        }
                        disabled={busy || answered}
                        onChange={() => select(i)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[24px] text-secondary"
                      >
                        {(answered
                          ? attempt.answers[question.id]?.selected_index
                          : choice) === i
                          ? "radio_button_checked"
                          : "radio_button_unchecked"}
                      </span>
                      <span className="font-reading text-reading text-primary">
                        {option}
                      </span>
                    </label>
                  ))}
                </fieldset>
              </article>

              <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between text-xs font-metadata text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-success text-[18px]"
                    aria-hidden="true"
                  >
                    cloud_done
                  </span>
                  <span>
                    Jawaban tersimpan otomatis di perangkatmu (Draft aman)
                  </span>
                </div>
                <button
                  className="text-primary hover:text-secondary underline font-semibold"
                  type="button"
                  disabled={busy || answered}
                  onClick={() => onChoice(null)}
                >
                  Batal Pilih / Reset Opsi
                </button>
              </div>
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-space-lg">
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md relative overflow-hidden">
                <div className="flex items-center gap-space-sm pb-1">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      cruelty_free
                    </span>
                  </div>
                  <div>
                    <h2 className="font-label text-label text-primary font-bold">
                      Mimo si Teman Belajar
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary text-xs">
                      {material.subject}
                    </span>
                  </div>
                </div>

                <div className="w-full flex justify-center py-2">
                  <div className="relative w-44 h-44 rounded-2xl bg-surface-container-low flex items-center justify-center overflow-hidden p-2">
                    <Image
                      className="w-full h-full object-contain"
                      data-alt="An adorable, friendly green chameleon mascot named Mimo with soft pastel colors, sitting cheerfully on a neat stack of colorful storybooks. Clean hand-drawn picture-book editorial zine illustration style, warm cream background, high contrast lines, inspiring confidence and calm studying vibe."
                      src="/design/mimo.png"
                      width={1024}
                      height={1024}
                      alt="Mimo, teman belajarmu"
                    />
                  </div>
                </div>

                <div className="relative bg-secondary-container/50 p-space-md rounded-2xl">
                  <div className="absolute -top-2 left-10 w-4 h-4 bg-secondary-container/50 rotate-45 transform"></div>
                  <p className="font-mimo-voice text-mimo-voice text-on-surface text-sm leading-snug">{`Santai aja, ${displayName}. Latihan ini membantu memilih langkah berikutnya, tanpa penalti saat mencoba lagi.`}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-metadata text-xs font-semibold flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-success"
                      aria-hidden="true"
                    >
                      sentiment_very_satisfied
                    </span>
                    Bebas Cemas
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-metadata text-xs font-semibold flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-secondary"
                      aria-hidden="true"
                    >
                      health_and_safety
                    </span>
                    Tanpa Skor Merah
                  </span>
                </div>
              </div>

              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-card-title text-card-title text-primary flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      construction
                    </span>
                    Alat Bantu Belajar
                  </h3>
                  <span className="text-xs font-metadata text-muted-gray">
                    Opsional
                  </span>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-label text-primary">
                    <span className="font-bold flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        edit_note
                      </span>
                      Papan Coret-Coretan
                    </span>
                    <button
                      className="text-text-secondary hover:text-primary text-xs"
                      type="button"
                      disabled={busy}
                      onClick={() => scratchChange("")}
                    >
                      Bersihkan
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-surface p-2.5 rounded-lg text-xs font-metadata text-on-surface placeholder:text-muted-gray resize-none focus:outline-none"
                    placeholder="Ketik hitungan cepatmu di sini... misal: 4^2 = 16, 3^2 = 9..."
                    rows={3}
                    value={scratch}
                    onChange={(e) => scratchChange(e.target.value)}
                    maxLength={3000}
                    aria-label="Catatan hitungan latihan"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="font-label text-xs uppercase tracking-wider text-text-secondary font-bold">
                    Kamus Kilat Bab 4
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1">
                    <div className="font-label text-xs font-bold text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Hipotenusa:
                    </div>
                    <p className="font-metadata text-metadata text-xs text-on-surface-variant leading-relaxed">
                      {
                        material.concepts.find(
                          (c) => c.id === question.concept_id,
                        )?.paragraphs[0]
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full py-2.5 px-space-md rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label flex items-center justify-center gap-2 shadow-sm transition-colors"
                    type="button"
                    disabled={busy}
                    onClick={onPause}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      pause_circle
                    </span>
                    <span>Jeda Latihan &amp; Simpan Status</span>
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-butter/40 flex items-start gap-space-sm">
                <span
                  className="material-symbols-outlined text-warning text-[20px] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  school
                </span>
                <p className="font-metadata text-metadata text-xs text-on-surface leading-relaxed">
                  {
                    "Jawabanmu disimpan setelah dikirim. Mimo menggunakan hasil latihan untuk membantu memilih langkah berikutnya."
                  }
                </p>
              </div>
            </aside>
          </div>

          <section className="w-full bg-surface p-space-md sm:p-space-lg rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm text-text-secondary text-xs sm:text-sm font-metadata">
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                aria-hidden="true"
              >
                check_circle
              </span>
              <span>
                Opsi{" "}
                <strong className="text-primary font-bold">A (5 meter)</strong>{" "}
                dipilih • Siap diperiksa
              </span>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                className="px-space-md py-3 rounded-xl bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label text-label transition-colors"
                type="button"
                disabled={busy}
                onClick={onPause}
              >
                {"Lewati latihan dulu"}
              </button>
              <button
                className="px-space-xl py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
                type="button"
                disabled={busy || (!answered && choice === null)}
                onClick={() => (answered ? onNext() : onAnswer())}
              >
                {answered
                  ? "Pertanyaan berikutnya"
                  : "Kirim Jawaban & Lihat Penjelasan"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
