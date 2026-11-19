import { afterEach, expect, it, vi } from "vitest";
import {
  mimoMuted,
  setMimoMuted,
  playMimoSound,
  stopMimoSound,
} from "../src/lib/mimo-sound";
afterEach(() => {
  stopMimoSound();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  setMimoMuted(false);
});
it("keeps mute functional when browser storage is blocked", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  setMimoMuted(true);
  expect(mimoMuted()).toBe(true);
  setMimoMuted(false);
  expect(mimoMuted()).toBe(false);
});
it("plays short notes only when enabled and cancels them on mute", async () => {
  const stop = vi.fn();
  const start = vi.fn();
  const param = {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  };
  const createOscillator = vi.fn(() => ({
    frequency: param,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start,
    stop,
  }));
  class AudioMock {
    state = "running";
    currentTime = 0;
    destination = {};
    createOscillator = createOscillator;
    createGain() {
      return { gain: param, connect: vi.fn(), disconnect: vi.fn() };
    }
  }
  vi.stubGlobal("AudioContext", AudioMock);
  setMimoMuted(true);
  await playMimoSound("cheer");
  expect(start).not.toHaveBeenCalled();
  setMimoMuted(false);
  await playMimoSound("cheer");
  expect(start).toHaveBeenCalledTimes(4);
  const count = stop.mock.calls.length;
  setMimoMuted(true);
  expect(stop.mock.calls.length).toBeGreaterThan(count);
});
