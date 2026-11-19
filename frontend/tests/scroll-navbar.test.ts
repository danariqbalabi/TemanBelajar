import { afterEach, expect, it, vi } from "vitest";
import { installScrollNavbar } from "../src/app/use-scroll-navbar";
let dispose: (() => void) | undefined;
afterEach(() => {
  dispose?.();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});
function setup() {
  let callback: FrameRequestCallback | undefined;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    callback = cb;
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    callback = undefined;
  });
  vi.stubGlobal("scrollY", 0);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(
    4000,
  );
  document.body.innerHTML = "<header><button>Menu</button></header>";
  const header = document.querySelector("header")!;
  dispose = installScrollNavbar(header);
  return {
    header,
    scroll: (y: number) => {
      vi.stubGlobal("scrollY", y);
      window.dispatchEvent(new Event("scroll"));
      const pending = callback;
      callback = undefined;
      pending?.(0);
    },
  };
}
it("hides downward, reveals upward, and returns full width at the top", () => {
  const { header, scroll } = setup();
  scroll(200);
  expect(header.dataset.scrollNav).toBe("hidden");
  scroll(180);
  expect(header.dataset.scrollNav).toBe("shown");
  expect(header.dataset.navCompact).toBe("true");
  scroll(0);
  expect(header.dataset.scrollNav).toBe("shown");
  expect(header.dataset.navCompact).toBe("false");
});
it("ignores tiny direction changes and reveals keyboard navigation", () => {
  const { header, scroll } = setup();
  scroll(200);
  scroll(197);
  expect(header.dataset.scrollNav).toBe("hidden");
  document.querySelector("button")!.focus();
  expect(header.dataset.scrollNav).toBe("shown");
  scroll(250);
  expect(header.dataset.scrollNav).toBe("shown");
});
it("removes listeners and presentation state on cleanup", () => {
  const { header, scroll } = setup();
  scroll(200);
  dispose?.();
  dispose = undefined;
  expect(header.hasAttribute("data-scroll-nav")).toBe(false);
  scroll(300);
  expect(header.hasAttribute("data-scroll-nav")).toBe(false);
});
