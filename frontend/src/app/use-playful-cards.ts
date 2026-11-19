"use client";
import { useEffect } from "react";

export function usePlayfulCards(page: string, reducedMotion: boolean) {
  useEffect(() => {
    if (
      page === "Beranda" ||
      reducedMotion ||
      typeof window.matchMedia !== "function"
    )
      return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (media.matches) return;
    const root = document.querySelector<HTMLElement>(".studio-playground");
    if (!root) return;
    const selector = ".material-tile, .mode-card, .collection-stat";
    let frame = 0;
    let current: HTMLElement | null = null;
    const clear = () => {
      if (frame) cancelAnimationFrame(frame);
      current?.style.removeProperty("--card-x");
      current?.style.removeProperty("--card-y");
      current = null;
    };
    const move = (event: PointerEvent) => {
      if (
        !finePointer.matches ||
        media.matches ||
        event.pointerType === "touch"
      )
        return;
      const card =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(selector)
          : null;
      if (!card || !root.contains(card)) {
        clear();
        return;
      }
      if (current !== card) clear();
      current = card;
      const box = card.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1),
      );
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty("--card-x", `${x * 5}px`);
        card.style.setProperty("--card-y", `${y * 4}px`);
      });
    };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", clear);
    media.addEventListener("change", clear);
    return () => {
      clear();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", clear);
      media.removeEventListener("change", clear);
    };
  }, [page, reducedMotion]);
}
