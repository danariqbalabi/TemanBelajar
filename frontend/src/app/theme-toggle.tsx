"use client";
import { setTheme, useTheme } from "@/lib/theme";

// sinar matahari, koordinatnya langsung biar ga ketimpa aturan transform
const rays = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  const point = (radius: number) => [
    +(13 + Math.sin(angle) * radius).toFixed(2),
    +(13 - Math.cos(angle) * radius).toFixed(2),
  ];
  return [...point(9.2), ...point(12)];
});

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
          <svg viewBox="0 0 26 26">
            <g className="theme-toggle-sun">
              {rays.map(([x1, y1, x2, y2], index) => (
                <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
              <circle className="theme-toggle-sun-core" cx="13" cy="13" r="7" />
              <circle
                className="theme-toggle-sun-cheek"
                cx="10"
                cy="14.5"
                r="1.1"
              />
              <circle
                className="theme-toggle-sun-cheek"
                cx="16"
                cy="14.5"
                r="1.1"
              />
            </g>
            <g className="theme-toggle-moon">
              <path d="M16.5 2.8a10.5 10.5 0 1 0 6.9 17.6A8.6 8.6 0 0 1 16.5 2.8Z" />
              <circle cx="9" cy="16" r="1.6" />
              <circle cx="13.5" cy="20" r="1" />
              <circle cx="8" cy="10.5" r="0.9" />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}
