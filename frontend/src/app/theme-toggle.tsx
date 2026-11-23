"use client";
import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const dark = useTheme() === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Mode gelap"
      aria-pressed={dark}
      title={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <svg className="theme-toggle-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </g>
      </svg>
      <svg className="theme-toggle-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z"
        />
      </svg>
    </button>
  );
}
