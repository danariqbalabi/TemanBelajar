import { afterEach, expect, it, vi } from "vitest";
import { installCardMotion } from "../src/app/card-motion";
import { waitFor } from "@testing-library/react";
let dispose: (() => void) | undefined;
afterEach(() => {
  dispose?.();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function setup(reduced = false) {
  let notify: IntersectionObserverCallback = () => {};
  const observe = vi.fn(),
    unobserve = vi.fn(),
    disconnect = vi.fn();
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      notify = callback;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("matchMedia", () => ({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  document.body.innerHTML =
    '<main class="final-design"><article id="card"><button>Open</button><div class="workspace-panel"></div></article><div class="workspace-panel" id="other"></div></main>';
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: 100,
    bottom: 300,
    left: 0,
    right: 300,
    width: 300,
    height: 200,
    x: 0,
    y: 100,
    toJSON: () => ({}),
  });
  dispose = installCardMotion(document);
  return {
    observe,
    unobserve,
    disconnect,
    notify: (target: Element) =>
      notify(
        [{ target, isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
  };
}
it("reveals cards once on entry and avoids nested entrances", () => {
  const { observe, unobserve, notify } = setup();
  const card = document.getElementById("card")!;
  expect(observe).toHaveBeenCalledTimes(2);
  expect(card.dataset.cardReveal).toBe("pending");
  notify(card);
  expect(card.dataset.cardReveal).toBe("visible");
  expect(unobserve).toHaveBeenCalledWith(card);
});
it("reveals focused content immediately and cleans up on unmount", () => {
  const { disconnect } = setup();
  document.querySelector("button")!.focus();
  expect(document.getElementById("card")!.dataset.cardReveal).toBe("visible");
  dispose?.();
  dispose = undefined;
  expect(document.querySelector("[data-card-reveal]")).toBeNull();
  expect(disconnect).toHaveBeenCalled();
});
it("leaves content visible for reduced motion", () => {
  const { observe } = setup(true);
  expect(observe).not.toHaveBeenCalled();
  expect(document.querySelector("[data-card-reveal]")).toBeNull();
});

it("observes cards added after an async action", async () => {
  const { observe } = setup();
  const card = document.createElement("article");
  document.querySelector("main")!.append(card);
  await waitFor(() => expect(observe).toHaveBeenCalledWith(card));
  expect(card.dataset.cardReveal).toBe("pending");
});
