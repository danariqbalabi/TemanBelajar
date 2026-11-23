"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const steps = {
  start: [
    '[data-path="mulai-belajar"]',
    "Mulai dari satu konsep",
    "Beranda menyarankan langkah kecil beserta alasannya. Buka materi untuk mencoba.",
  ],
  format: [
    '[data-tour="format"]',
    "Pilih cara belajarmu",
    "Coba ganti format. Posisi baca tetap tersimpan. Kamu juga bisa pakai format saat ini.",
  ],
  advance: [
    '[data-tour="advance"]',
    "Pelajari sedikit demi sedikit",
    "Baca bagian ini, lalu tekan tombol yang disorot. Setelah konsep terakhir, buka Cek pemahaman.",
  ],
  choices: [
    '[data-tour="choices"]',
    "Coba jawab satu soal",
    "Pilih jawaban yang menurutmu tepat. Soalnya berasal dari materi yang kamu baca.",
  ],
  submit: [
    '[data-tour="submit"]',
    "Periksa jawaban",
    "Kirim jawaban untuk melihat tanggapan dari aplikasi.",
  ],
  feedback: [
    '[data-tour="feedback"]',
    "Baca pembahasannya",
    "Lihat alasan jawabannya, lalu lanjut ke soal berikutnya.",
  ],
  result: [
    '[data-tour="result"]',
    "Lihat hasil latihan",
    "Jumlah jawaban tepat berasal dari latihan barusan. Pembahasan tersedia untuk ditinjau lagi.",
  ],
  overview: [
    ".progress-stats",
    "Progres tersimpan",
    "Ringkasan ini memisahkan konsep yang selesai, sesi, dan jawaban latihan yang tercatat.",
  ],
  progress: [
    '[data-tour="progress"]',
    "Lihat jejak belajar",
    "Hasil latihan merangkum jawabanmu. Buka Progres untuk melihat riwayat dan konsep yang bisa ditinjau.",
  ],
  plan: [
    '[data-tour="plan"]',
    "Buat jadwal yang pas",
    "Rencana Belajar membantu menata sesi dan waktu istirahat. Buka untuk melihat jadwalmu.",
  ],
  plannerOpen: [
    '[data-tour="planner-open"]',
    "Buka editor jadwal",
    "Di sini kamu bisa memilih materi, waktu, dan durasi belajar.",
  ],
  plannerNew: [
    '[data-tour="planner-new"]',
    "Pilih rencana baru",
    "Pilih Rencana baru untuk mencoba jadwal tanpa mengubah jadwal lama.",
  ],
  plannerDate: [
    '[data-tour="planner-date"]',
    "Pilih kapan mau belajar",
    "Isi tanggal dan jam yang cocok. Materi bisa dipilih di editor.",
  ],
  plannerSuggest: [
    '[data-tour="planner-suggest"]',
    "Susun jadwal awal",
    "Klik Susun usulan awal. TemanBelajar menyiapkan kegiatan sesuai target waktu harian.",
  ],
  plannerSave: [
    '[data-tour="planner-save"]',
    "Simpan jadwalmu",
    "Jadwal masih berupa usulan. Klik Simpan rencana untuk menyimpannya ke akun demo.",
  ],
  finish: [
    "",
    "Tos! Tur selesai",
    "Kamu sudah melihat cara memilih materi, belajar, berlatih, dan mengatur jadwal.",
  ],
} as const;
type Step = keyof typeof steps;
type Spot = { left: number; top: number; right: number; bottom: number };

export function DemoTour({
  page,
  suspended,
  busy = false,
  onClose,
}: {
  page: string;
  suspended: boolean;
  busy?: boolean;
  onClose: () => void;
}) {
  const [formatSeen, setFormatSeen] = useState(false);
  const [seenResult, setSeenResult] = useState(false);
  const [seenOverview, setSeenOverview] = useState(false);
  const [pose, setPose] = useState(false);
  const [view, setView] = useState<{
    step: Step;
    spot: Spot | null;
    anchor: Spot | null;
    hasTarget: boolean;
    width: number;
    height: number;
  } | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLElement>(null);
  const id = useId();
  const liveStep = useRef<Step>("start");

  useEffect(() => {
    if (suspended) return;
    let target: HTMLElement | null = null;
    let frame = 0;
    let lastStep: Step | undefined;
    function find(selector: string) {
      return document.querySelector<HTMLElement>(selector);
    }
    function selectStep(): Step {
      if (page === "Beranda") return "start";
      if (page === "Progres") return seenOverview ? "plan" : "overview";
      if (page === "Rencana Belajar") {
        if (find('[data-tour="planner-saved"]')) return "finish";
        const date = document.querySelector<HTMLInputElement>(
          steps.plannerDate[0],
        );
        if (!date) return "plannerOpen";
        if (
          document.querySelector<HTMLSelectElement>(steps.plannerNew[0])?.value
        )
          return "plannerNew";
        const save = find(steps.plannerSave[0]);
        if (save && !save.matches(":disabled")) return "plannerSave";
        return date.value ? "plannerSuggest" : "plannerDate";
      }
      if (find(steps.feedback[0])) return "feedback";
      const submit = find(steps.submit[0]);
      if (submit) return submit.matches(":disabled") ? "choices" : "submit";
      if (find(steps.result[0])) return seenResult ? "progress" : "result";
      if (find(steps.advance[0])) return formatSeen ? "advance" : "format";
      return "progress";
    }
    function measure() {
      frame = 0;
      const step = busy ? liveStep.current : selectStep();
      const next = steps[step][0] ? find(steps[step][0]) : null;
      if (target !== next || lastStep !== step) {
        target = next;
        lastStep = step;
        if (next?.closest(".app-header"))
          window.scrollTo({ top: 0, behavior: "instant" });
        else next?.scrollIntoView?.({ block: "center", behavior: "instant" });
      }
      liveStep.current = step;
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Keep the question or reading visible while its action is highlighted.
      const context =
        step === "advance"
          ? next?.closest(".lesson-stage")
          : step === "choices" || step === "submit" || step === "feedback"
            ? next?.closest(".workspace-question")
            : null;
      const contextRect = context?.getBoundingClientRect();
      const actionRect = next?.getBoundingClientRect();
      const rect =
        contextRect &&
        (step !== "advance" || contextRect.height < height * 0.64)
          ? contextRect
          : actionRect;
      const spot =
        rect &&
        actionRect &&
        actionRect.bottom > 0 &&
        actionRect.top < height &&
        rect.width > 0 &&
        rect.bottom > 0 &&
        rect.top < height &&
        rect.right > 0 &&
        rect.left < width
          ? {
              left: Math.max(0, rect.left - 6),
              top: Math.max(0, rect.top - 6),
              right: Math.min(width, rect.right + 6),
              bottom: Math.min(height, rect.bottom + 6),
            }
          : null;
      const anchor =
        spot && actionRect
          ? {
              left: Math.max(0, actionRect.left - 6),
              top: Math.max(0, actionRect.top - 6),
              right: Math.min(width, actionRect.right + 6),
              bottom: Math.min(height, actionRect.bottom + 6),
            }
          : null;
      setView((current) =>
        current?.step === step &&
        current.hasTarget === Boolean(next) &&
        current.width === width &&
        current.height === height &&
        current.spot?.left === spot?.left &&
        current.spot?.top === spot?.top &&
        current.spot?.right === spot?.right &&
        current.spot?.bottom === spot?.bottom &&
        current.anchor?.left === anchor?.left &&
        current.anchor?.top === anchor?.top &&
        current.anchor?.right === anchor?.right &&
        current.anchor?.bottom === anchor?.bottom
          ? current
          : { step, spot, anchor, hasTarget: Boolean(next), width, height },
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current?.click();
      }
      if (event.key !== "Tab" || !target || !bubble.current) return;
      const controls = [
        ...bubble.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled)",
        ),
        ...(target.matches("button, a, select, input")
          ? [target]
          : target.querySelectorAll<HTMLElement>("input:not(:disabled)")),
      ];
      if (!controls.length) return;
      const index = controls.indexOf(document.activeElement as HTMLElement);
      const direction = event.shiftKey ? -1 : 1;
      event.preventDefault();
      controls[
        index < 0
          ? event.shiftKey
            ? controls.length - 1
            : 0
          : (index + direction + controls.length) % controls.length
      ].focus({ preventScroll: true });
    }
    schedule();
    const timer = window.setInterval(schedule, 120);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("keydown", keyboard);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("keydown", keyboard);
    };
  }, [page, suspended, busy, formatSeen, seenResult, seenOverview]);

  const step = view?.step ?? (page === "Beranda" ? "start" : "progress");
  useEffect(() => {
    if (!suspended) close.current?.focus({ preventScroll: true });
  }, [step, suspended]);

  if (suspended) return null;
  const spot = view?.spot;
  const hasTarget = view?.hasTarget === true;
  const anchor = view?.anchor;
  const width = view?.width ?? window.innerWidth;
  const height = view?.height ?? window.innerHeight;
  const bubbleWidth = Math.min(350, width - 24);
  const left = anchor
    ? Math.min(width - bubbleWidth - 12, Math.max(12, anchor.left))
    : width - bubbleWidth - 12;
  const above =
    anchor &&
    height - anchor.bottom < Math.min(250, height * 0.42) &&
    anchor.top > height - anchor.bottom;
  // satu lapisan dengan lubang, biar ga ada garis di sambungan blur
  const shade = spot
    ? {
        clipPath: `polygon(evenodd, 0 0, ${width}px 0, ${width}px ${height}px, 0 ${height}px, 0 0, ${spot.left}px ${spot.top}px, ${spot.left}px ${spot.bottom}px, ${spot.right}px ${spot.bottom}px, ${spot.right}px ${spot.top}px, ${spot.left}px ${spot.top}px)`,
      }
    : undefined;
  const fallback = () => {
    const selector = steps[liveStep.current][0];
    const target = selector && document.querySelector<HTMLElement>(selector);
    if (target && target.closest(".app-header"))
      window.scrollTo({ top: 0, behavior: "instant" });
    else if (target)
      target.scrollIntoView?.({ block: "center", behavior: "instant" });
  };
  return createPortal(
    <div className="demo-tour">
      {step !== "finish" && hasTarget && (
        <div
          className="demo-tour-shade"
          data-spotlight={spot ? "true" : "false"}
          style={shade}
        />
      )}
      {anchor && (
        <div
          className="demo-tour-ring"
          aria-hidden="true"
          style={{
            left: anchor.left,
            top: anchor.top,
            width: anchor.right - anchor.left,
            height: anchor.bottom - anchor.top,
          }}
        />
      )}
      <section
        ref={bubble}
        className="demo-tour-bubble"
        data-side={anchor ? (above ? "above" : "below") : undefined}
        style={{
          left,
          width: bubbleWidth,
          ...(anchor
            ? above
              ? {
                  top: "auto",
                  bottom: height - anchor.top + 12,
                  maxHeight: Math.max(64, anchor.top - 24),
                }
              : {
                  top: anchor.bottom + 12,
                  bottom: "auto",
                  maxHeight: Math.max(64, height - anchor.bottom - 24),
                }
            : {}),
        }}
        aria-labelledby={id}
      >
        <button
          type="button"
          className="demo-tour-mimo"
          aria-label="Ganti pose Mimo"
          aria-pressed={pose}
          onClick={() => setPose(!pose)}
        >
          <Image
            key={String(pose)}
            src={pose ? "/design/mimo-cheer-v2.png" : "/design/mimo-final.png"}
            width={58}
            height={54}
            alt=""
          />
        </button>
        <div>
          <p className="demo-tour-label">Panduan Mimo</p>
          <h2 id={id} aria-live="polite">
            {steps[step][1]}
          </h2>
          <p>{steps[step][2]}</p>
          {step === "format" && (
            <button type="button" onClick={() => setFormatSeen(true)}>
              Lanjut baca
            </button>
          )}
          {step === "result" && (
            <button type="button" onClick={() => setSeenResult(true)}>
              Lanjut ke Progres
            </button>
          )}
          {step === "overview" && (
            <button type="button" onClick={() => setSeenOverview(true)}>
              Lanjut ke jadwal
            </button>
          )}
          {step !== "finish" && hasTarget && !spot && !busy && (
            <button type="button" onClick={fallback}>
              Lihat tombolnya
            </button>
          )}
          {step !== "finish" && view && !hasTarget && !busy && (
            <p role="status">
              Langkah ini belum tersedia. Kamu bisa lanjut tanpa tur.
            </p>
          )}
          <button ref={close} type="button" onClick={onClose}>
            {step === "finish" ? "Selesai" : "Lewati tur"}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
