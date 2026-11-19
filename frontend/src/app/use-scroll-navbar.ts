"use client";
import { useEffect, type RefObject } from "react";

export function useScrollNavbar(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (ref.current) return installScrollNavbar(ref.current);
  }, [ref]);
}

export function installScrollNavbar(header: HTMLElement) {
  let lastY = Math.max(0, window.scrollY);
  let travel = 0;
  let direction = 0;
  let frame = 0;
  header.dataset.scrollNav = "shown";
  const update = () => {
    frame = 0;
    // Clamp rubber-band scrolling at both ends of mobile documents.
    const maxY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const y = Math.max(0, Math.min(window.scrollY, maxY));
    const delta = y - lastY;
    lastY = y;
    header.dataset.navCompact = String(y > 48);
    if (y < 48) {
      header.dataset.scrollNav = "shown";
      travel = 0;
      return;
    }
    if (Math.abs(delta) < 1) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) travel = 0;
    direction = nextDirection;
    travel += Math.abs(delta);
    if (travel < 12) return;
    const engaged =
      (header.contains(document.activeElement) &&
        document.activeElement?.matches(":focus-visible")) ||
      (header.matches(":hover") &&
        window.matchMedia?.("(hover: hover)").matches);
    header.dataset.scrollNav =
      direction < 0 || engaged || y < header.offsetHeight + 48
        ? "shown"
        : "hidden";
  };
  const scroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const focus = () => {
    header.dataset.scrollNav = "shown";
    travel = 0;
  };
  window.addEventListener("scroll", scroll, { passive: true });
  header.addEventListener("focusin", focus);
  update();
  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("scroll", scroll);
    header.removeEventListener("focusin", focus);
    delete header.dataset.scrollNav;
    delete header.dataset.navCompact;
  };
}
