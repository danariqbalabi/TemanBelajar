"use client";
import { useEffect } from "react";

// A shared observer covers both route changes and cards added by async actions.
// Content stays visible without JS or IntersectionObserver support.
export function CardMotion() {
  useEffect(() => installCardMotion(document), []);
  return null;
}

export function installCardMotion(root: Document) {
  if (
    typeof IntersectionObserver === "undefined" ||
    typeof window.matchMedia !== "function"
  )
    return;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const selector = [
    ".final-design article",
    ".final-design .workspace-panel",
    ".final-design .settings-group",
    ".final-design .material-tile",
    ".final-design .mode-card",
    ".final-design .workspace-mode",
    ".final-design .collection-stat",
    ".final-design .progress-stat",
    ".final-design .workspace-budget",
    ".final-design .workspace-next-card",
    ".final-design .workspace-study-card",
    ".final-design .workspace-start-card",
    ".final-design .workspace-resume-card",
    ".final-design .rounded-card",
    ".final-design section.rounded-2xl",
    ".final-design section.rounded-feature",
  ].join(",");
  const seen = new WeakSet<Element>();
  const pending = new Set<HTMLElement>();
  let frame = 0;
  const reveal = (card: HTMLElement, delay = 0) => {
    card.style.setProperty("--reveal-delay", `${delay}ms`);
    card.dataset.cardReveal = "visible";
    pending.delete(card);
    observer.unobserve(card);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      let index = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          reveal(entry.target as HTMLElement, Math.min(index++ * 40, 120));
      });
    },
    { threshold: 0, rootMargin: "0px 0px 48px 0px" },
  );
  const scan = () => {
    frame = 0;
    for (const card of pending) {
      if (!card.isConnected) {
        observer.unobserve(card);
        pending.delete(card);
      } else if (media.matches || card.closest(".calm")) reveal(card);
    }
    root.querySelectorAll<HTMLElement>(selector).forEach((card) => {
      if (seen.has(card)) return;
      // Don't stack entrance transforms on nested cards or hide dialog controls.
      if (
        card.parentElement?.closest(selector) ||
        card.closest('[role="dialog"], [role="alertdialog"], .mimo-mascot')
      )
        return;
      seen.add(card);
      if (
        media.matches ||
        card.closest(".calm") ||
        card.getBoundingClientRect().bottom <= 0
      )
        return;
      card.dataset.cardReveal = "pending";
      pending.add(card);
      observer.observe(card);
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(scan);
  };
  const mutations = new MutationObserver(schedule);
  mutations.observe(root.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  // A keyboard user can focus a card before the viewport callback runs.
  const focus = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest<HTMLElement>(
      '[data-card-reveal="pending"]',
    );
    if (card) reveal(card);
  };
  root.addEventListener("focusin", focus);
  media.addEventListener("change", schedule);
  scan();
  return () => {
    if (frame) cancelAnimationFrame(frame);
    mutations.disconnect();
    observer.disconnect();
    root.removeEventListener("focusin", focus);
    media.removeEventListener("change", schedule);
    root.querySelectorAll<HTMLElement>("[data-card-reveal]").forEach((card) => {
      delete card.dataset.cardReveal;
      card.style.removeProperty("--reveal-delay");
    });
  };
}
