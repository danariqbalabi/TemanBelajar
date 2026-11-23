"use client";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import type { MimoMood, MimoReaction } from "@/lib/mimo";
import {
  mimoMuted,
  playMimoSound,
  setMimoMuted,
  stopMimoSound,
  subscribeMimoSound,
} from "@/lib/mimo-sound";
import { UiIcon } from "./workspace-ui";

const poses: { mood: MimoMood; src: string }[] = [
  { mood: "wave", src: "/design/mimo-final.png" },
  { mood: "reading", src: "/design/mimo-reading-v2.png" },
  { mood: "cheer", src: "/design/mimo-cheer-v2.png" },
];
const nextPose: Record<MimoMood, MimoMood> = {
  wave: "cheer",
  cheer: "reading",
  reading: "wave",
};
const poseLabels: Record<MimoMood, string> = {
  wave: "Mimo menyapa!",
  reading: "Mimo membaca!",
  cheer: "Mimo melompat!",
};
const particles = [
  [-70, -45],
  [-42, -75],
  [-12, -88],
  [24, -78],
  [60, -50],
  [78, -12],
  [58, 30],
  [25, 50],
  [-15, 54],
  [-54, 30],
  [-78, 0],
  [-42, -40],
];

// sinar matahari ditulis koordinatnya langsung, biar ga ketimpa aturan transform
const sunRays = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  const point = (radius: number) => [
    +(24 + Math.sin(angle) * radius).toFixed(2),
    +(24 - Math.cos(angle) * radius).toFixed(2),
  ];
  return [...point(15), ...point(21)];
});

// matahari di mode terang, bulan + bintang di mode gelap (diatur lewat css)
function MimoSky() {
  return (
    <span className="mimo-sky" aria-hidden="true">
      <svg className="mimo-sun" viewBox="0 0 48 48">
        <g className="mimo-sun-rays">
          {sunRays.map(([x1, y1, x2, y2], index) => (
            <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <circle className="mimo-sun-core" cx="24" cy="24" r="10.5" />
        <circle className="mimo-sun-cheek" cx="19.5" cy="26" r="1.6" />
        <circle className="mimo-sun-cheek" cx="28.5" cy="26" r="1.6" />
      </svg>
      <svg className="mimo-moon" viewBox="0 0 48 48">
        <path
          className="mimo-moon-body"
          d="M30.5 7.5a17 17 0 1 0 10 27.6A14 14 0 0 1 30.5 7.5Z"
        />
        <circle className="mimo-moon-spot" cx="17" cy="29" r="2.2" />
        <circle className="mimo-moon-spot" cx="23" cy="36" r="1.4" />
      </svg>
      <i className="mimo-twinkle mimo-twinkle-one" />
      <i className="mimo-twinkle mimo-twinkle-two" />
      <i className="mimo-twinkle mimo-twinkle-three" />
    </span>
  );
}

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
  const [mood, setMood] = useState<MimoMood>(
    context === "Mulai Belajar" || context === "Materi Saya"
      ? "reading"
      : "wave",
  );
  const [quiet, setQuiet] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [manual, setManual] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const muted = useSyncExternalStore(
    subscribeMimoSound,
    mimoMuted,
    () => false,
  );
  const button = useRef<HTMLButtonElement>(null);
  const wakeButton = useRef<HTMLButtonElement>(null);
  const wasQuiet = useRef(false);
  useEffect(() => {
    if (quiet) wakeButton.current?.focus();
    else if (wasQuiet.current) button.current?.focus();
    wasQuiet.current = quiet;
  }, [quiet]);
  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<MimoReaction>).detail;
      if (!detail || !poses.some((pose) => pose.mood === detail.mood)) return;
      setMood(detail.mood);
      setSequence((value) => value + 1);
      setManual(false);
      setAnimating(true);
    };
    window.addEventListener("temanbelajar:mimo", receive);
    return () => window.removeEventListener("temanbelajar:mimo", receive);
  }, []);
  useEffect(() => {
    if (!animating) return;
    const timer = setTimeout(() => setAnimating(false), 1100);
    return () => clearTimeout(timer);
  }, [animating, sequence]);
  function resetTilt() {
    button.current?.style.removeProperty("--mimo-look-x");
    button.current?.style.removeProperty("--mimo-look-y");
  }
  function play() {
    const next = nextPose[mood];
    setMood(next);
    setSequence((value) => value + 1);
    setManual(true);
    setAnimating(true);
    setAnnouncement(poseLabels[next]);
    void playMimoSound(next);
  }
  return (
    <div
      className={`mimo-mascot mimo-${variant}`}
      data-quiet={quiet}
      data-reduced-motion={reducedMotion}
      data-animating={animating}
      data-intensity={manual ? "playful" : "gentle"}
    >
      {quiet ? (
        <button
          ref={wakeButton}
          className="mimo-wake"
          onClick={() => setQuiet(false)}
          aria-label="Bangunkan Mimo"
        >
          <UiIcon name="pets" />
          <span>Mimo</span>
        </button>
      ) : (
        <>
          <button
            ref={button}
            className="mimo-touch"
            aria-label="Sapa Mimo"
            onClick={play}
            onPointerMove={(event) => {
              if (
                reducedMotion ||
                event.pointerType === "touch" ||
                window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              )
                return;
              const box = event.currentTarget.getBoundingClientRect();
              if (!box.width || !box.height) return;
              event.currentTarget.style.setProperty(
                "--mimo-look-x",
                `${((event.clientX - box.left) / box.width - 0.5) * 12}deg`,
              );
              event.currentTarget.style.setProperty(
                "--mimo-look-y",
                `${((event.clientY - box.top) / box.height - 0.5) * -8}deg`,
              );
            }}
            onPointerLeave={resetTilt}
            onBlur={resetTilt}
          >
            <span
              className="mimo-stage"
              key={sequence}
              data-mood={mood}
              data-animating={animating}
              data-intensity={manual ? "playful" : "gentle"}
            >
              {poses.map((pose) => (
                <Image
                  key={pose.mood}
                  src={pose.src}
                  width={256}
                  height={256}
                  alt=""
                  className="mimo-pose"
                  data-active={mood === pose.mood}
                  sizes={
                    variant === "dock"
                      ? "88px"
                      : "(max-width: 640px) 200px, 300px"
                  }
                />
              ))}
            </span>
            <span
              className="mimo-fx"
              key={`fx-${sequence}`}
              data-active={animating && manual}
              aria-hidden="true"
            >
              <i className="mimo-aura" />
              <i className="mimo-ring" />
              <i className="mimo-ring mimo-ring-second" />
              <span className="mimo-confetti">
                {particles.map(([x, y], index) => (
                  <i
                    key={index}
                    style={
                      {
                        "--burst-x": `${x}px`,
                        "--burst-y": `${y}px`,
                        "--particle": index,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
              <i className="mimo-star mimo-star-one" />
              <i className="mimo-star mimo-star-two" />
            </span>
            <span className="mimo-floor" aria-hidden="true" />
            <MimoSky />
          </button>
          <div className="mimo-controls">
            <button
              className="mimo-control"
              aria-label="Suara Mimo"
              aria-pressed={!muted}
              title={muted ? "Aktifkan suara Mimo" : "Matikan suara Mimo"}
              onClick={() => setMimoMuted(!muted)}
            >
              <UiIcon name={muted ? "volume_off" : "volume_up"} />
            </button>
            {reducedMotion && onMotionSettings && (
              <button
                className="mimo-control"
                aria-label="Atur animasi Mimo"
                title="Mode tenang aktif"
                onClick={onMotionSettings}
              >
                <UiIcon name="animation" />
              </button>
            )}
            {variant === "dock" && (
              <button
                className="mimo-control"
                aria-label="Istirahatkan Mimo"
                title="Istirahat di halaman ini"
                onClick={() => {
                  stopMimoSound();
                  setQuiet(true);
                }}
              >
                <UiIcon name="bedtime" />
              </button>
            )}
          </div>
          <span className="mimo-touch-hint" aria-hidden="true">
            Klik untuk pose lain
          </span>
          <span className="sr-only" role="status">
            {announcement}
          </span>
        </>
      )}
    </div>
  );
}
