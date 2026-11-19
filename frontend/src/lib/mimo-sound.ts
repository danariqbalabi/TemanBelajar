import type { MimoMood } from "./mimo";

const key = "temanbelajar:mimo-muted";
const changeEvent = "temanbelajar:mimo-sound";
let context: AudioContext | null = null;
let generation = 0;
let fallbackMuted = false;
const playing = new Set<OscillatorNode>();

export function mimoMuted() {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return fallbackMuted;
  }
}
export function subscribeMimoSound(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      if (mimoMuted()) stopMimoSound();
      listener();
    }
  };
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", storage);
  };
}
export function stopMimoSound() {
  generation += 1;
  for (const oscillator of playing) {
    try {
      oscillator.stop();
    } catch {
      /* Already ended. */
    }
  }
  playing.clear();
}
export function setMimoMuted(muted: boolean) {
  fallbackMuted = muted;
  try {
    localStorage.setItem(key, String(muted));
  } catch {
    /* In-memory rendering remains available. */
  }
  if (muted) stopMimoSound();
  window.dispatchEvent(new Event(changeEvent));
}

// Only call from the mascot's click handler. Automatic reactions stay silent.
export async function playMimoSound(mood: MimoMood) {
  if (mimoMuted() || typeof window.AudioContext !== "function") return;
  try {
    stopMimoSound();
    const token = generation;
    if (!context || context.state === "closed") context = new AudioContext();
    if (context.state === "suspended") await context.resume();
    if (token !== generation || mimoMuted()) return;
    const notes =
      mood === "cheer"
        ? [523.25, 659.25, 783.99, 1046.5]
        : mood === "reading"
          ? [880, 659.25, 523.25]
          : [659.25, 987.77, 783.99];
    const now = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context!.createOscillator();
      const envelope = context!.createGain();
      const start = now + index * 0.065;
      oscillator.type = mood === "reading" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency * 0.82, start);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency,
        start + 0.035,
      );
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(0.055, start + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.17);
      oscillator.connect(envelope);
      envelope.connect(context!.destination);
      playing.add(oscillator);
      oscillator.onended = () => {
        playing.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(start + 0.19);
    });
  } catch {
    /* Audio is optional: browser restrictions never interrupt the UI. */
  }
}
