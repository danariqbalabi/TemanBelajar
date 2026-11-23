"use client";
import { setTheme, useTheme } from "@/lib/theme";

// saklar langit: siang (matahari di kanan) dan malam (bulan di kiri)
export function ThemeToggle() {
  const dark = useTheme() === "dark";
  return (
    <button
      type="button"
      role="switch"
      className="theme-toggle"
      aria-label="Mode gelap"
      aria-checked={dark}
      title={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-stars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="theme-toggle-clouds">
          <i />
          <i />
          <i />
        </span>
        <span className="theme-toggle-knob">
          <i />
          <i />
          <i />
        </span>
      </span>
    </button>
  );
}
