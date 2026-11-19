"use client";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { MimoMood, MimoReaction } from "@/lib/mimo";

const poses: { mood: MimoMood; src: string }[] = [
  { mood: "wave", src: "/design/mimo-final.png" },
  { mood: "reading", src: "/design/mimo-reading-v2.png" },
  { mood: "cheer", src: "/design/mimo-cheer-v2.png" },
];
const greetings: Record<string, string> = {
  Beranda: "Hai! Satu langkah kecil dulu, yuk.",
  "Materi Saya": "Pilih satu materi. Aku temani belajarnya!",
  "Mulai Belajar": "Pelan-pelan juga boleh. Kita lanjut dari langkahmu.",
  "Rencana Belajar": "Belajar dan istirahat sama-sama perlu tempat.",
  Progres: "Lihat langkah yang sudah kamu ambil. Itu berarti!",
  Pengaturan: "Kenyamananmu dulu. Coba tampilan yang paling pas.",
  Masuk: "Hai! Ruang belajarmu menunggu.",
  Preferensi: "Kamu yang pilih ritmenya. Aku ikut!",
  Kenalan: "Aku Mimo! Klik lagi, aku punya pose lain.",
};

export function MimoMascot({
  context = "Kenalan",
  variant = "inline",
  reducedMotion = false,
  onMotionSettings,
}: {
  context?: string;
  variant?: "inline" | "dock";
  reducedMotion?: boolean;
  onMotionSettings?: () => void;
}) {
  const greeting = greetings[context] || greetings.Kenalan;
  const initialMood: MimoMood =
    context === "Mulai Belajar" || context === "Materi Saya"
      ? "reading"
      : "wave";
  const [reaction, setReaction] = useState<MimoReaction>({
    mood: initialMood,
    message: greeting,
  });
  const [open, setOpen] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const wakeButton = useRef<HTMLButtonElement>(null);
  const wasQuiet = useRef(false);
  const messageId = useId();
  useEffect(() => {
    if (quiet) wakeButton.current?.focus();
    else if (wasQuiet.current) button.current?.focus();
    wasQuiet.current = quiet;
  }, [quiet]);

  function resetTilt() {
    button.current?.style.removeProperty("--mimo-look-x");
    button.current?.style.removeProperty("--mimo-look-y");
  }
  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<MimoReaction>).detail;
      if (!detail || !poses.some((pose) => pose.mood === detail.mood)) return;
      setReaction(detail);
      setSequence((value) => value + 1);
      setAnimating(true);
      // Automatic encouragement stays silent and does not open a popup.
    };
    window.addEventListener("temanbelajar:mimo", receive);
    return () => window.removeEventListener("temanbelajar:mimo", receive);
  }, []);
  useEffect(() => {
    if (!animating) return;
    timer.current = setTimeout(() => setAnimating(false), 850);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [animating, sequence]);

  const responses: MimoReaction[] = [
    { mood: "cheer", message: `Tos kecil! ${greeting}` },
    { mood: "reading", message: "Ssst... aku lagi baca. Mau belajar bareng?" },
    { mood: "wave", message: greeting },
  ];
  function play() {
    setReaction(responses[sequence % responses.length]);
    setSequence((value) => value + 1);
    setAnimating(true);
    setOpen(true);
    setQuiet(false);
  }
  return (
    <div
      className={`mimo-mascot mimo-${variant}`}
      data-quiet={quiet}
      data-reduced-motion={reducedMotion}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      {quiet ? (
        <button
          ref={wakeButton}
          className="mimo-wake"
          onClick={() => {
            setQuiet(false);
            setOpen(false);
          }}
          aria-label="Bangunkan Mimo"
        >
          <span aria-hidden="true">✦</span>
          <span>Mimo</span>
        </button>
      ) : (
        <>
          {open && (
            <div id={messageId} className="mimo-bubble">
              <div className="mimo-bubble-heading">
                <strong>Mimo</strong>
                <button
                  aria-label="Tutup pesan Mimo"
                  onClick={() => {
                    setOpen(false);
                    button.current?.focus();
                  }}
                >
                  ×
                </button>
              </div>
              <p role="status">{reaction.message}</p>
              {reducedMotion && (
                <p className="mimo-calm-note">
                  Mode tenang: pose berubah tanpa lompatan.
                </p>
              )}
              <div className="mimo-bubble-actions">
                <button onClick={play}>Pose lain ↗</button>
                {reducedMotion && onMotionSettings && (
                  <button onClick={onMotionSettings}>Atur animasi</button>
                )}
                {variant === "dock" && (
                  <button
                    title="Istirahat sampai kamu membuka halaman lain"
                    onClick={() => {
                      setQuiet(true);
                      setOpen(false);
                    }}
                  >
                    Istirahatkan Mimo
                  </button>
                )}
              </div>
            </div>
          )}
          <button
            ref={button}
            className="mimo-touch"
            title="Klik untuk menyapa dan mengganti pose"
            aria-label="Sapa Mimo"
            aria-expanded={open}
            aria-controls={open ? messageId : undefined}
            onClick={play}
            onPointerMove={(event) => {
              if (
                reducedMotion ||
                event.pointerType === "touch" ||
                window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              )
                return;
              const box = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                "--mimo-look-x",
                `${((event.clientX - box.left) / box.width - 0.5) * 6}deg`,
              );
              event.currentTarget.style.setProperty(
                "--mimo-look-y",
                `${((event.clientY - box.top) / box.height - 0.5) * -5}deg`,
              );
            }}
            onPointerLeave={resetTilt}
            onBlur={resetTilt}
          >
            <span
              className="mimo-stage"
              key={sequence}
              data-mood={reaction.mood}
              data-animating={animating}
            >
              {poses.map((pose) => (
                <Image
                  key={pose.mood}
                  src={pose.src}
                  width={256}
                  height={256}
                  alt=""
                  className="mimo-pose"
                  data-active={reaction.mood === pose.mood}
                  sizes={
                    variant === "dock"
                      ? "88px"
                      : "(max-width: 640px) 200px, 300px"
                  }
                />
              ))}
              <span className="mimo-confetti" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <i
                    key={index}
                    style={{ "--particle": index } as CSSProperties}
                  />
                ))}
              </span>
            </span>
            <span className="mimo-floor" aria-hidden="true" />
          </button>
          <span className="mimo-touch-hint" aria-hidden="true">
            Sentuh Mimo ✦
          </span>
        </>
      )}
    </div>
  );
}
