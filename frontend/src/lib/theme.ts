"use client";
import { useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./theme-script";

export type Theme = "light" | "dark";
const listeners = new Set<() => void>();

export function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  window.setTimeout(() => root.classList.remove("theme-switching"), 320);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
