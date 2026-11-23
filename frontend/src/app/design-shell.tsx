"use client";
import { ProfileSettingsButton } from "./profile-settings-button";
import { Brand } from "./brand";
import { useScrollNavbar } from "./use-scroll-navbar";
import { usePlayfulCards } from "./use-playful-cards";
import { MimoMascot } from "./mimo-mascot";
import { useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import type { Profile } from "@/lib/types";
export function DesignShell({
  children,
  profile,
  page,
  navigate,
  className,
  style,
}: {
  children: ReactNode;
  profile: Profile;
  page: string;
  navigate: (p: string) => boolean | void;
  className: string;
  style: CSSProperties;
}) {
  const header = useRef<HTMLElement>(null);
  useScrollNavbar(header);
  usePlayfulCards(page, profile.preferences.reduced_motion);
  useEffect(() => {
    const element = header.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      element.parentElement?.style.setProperty(
        "--app-header-height",
        `${element.getBoundingClientRect().height}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  function goTo(destination: string) {
    if (navigate(destination) === false) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <>
      <div
        className={
          "stitch-shell final-design final-app " +
          (page === "Beranda" ? "" : "studio-playground ") +
          className
        }
        style={style}
      >
        <a className="skip" href="#main">
          Lewati ke konten
        </a>
        <header ref={header} className="app-header">
          <div className="app-header-inner">
            <a
              className="app-brand"
              href="#"
              aria-label="TemanBelajar — Beranda"
              onClick={(event) => {
                event.preventDefault();
                goTo("Beranda");
              }}
            >
              <Brand />
            </a>
            <nav className="app-navigation" aria-label="Navigasi utama">
              {[
                "Beranda",
                "Rencana Belajar",
                "Materi Saya",
                "Mulai Belajar",
                "Progres",
              ].map((destination) => (
                <a
                  key={destination}
                  data-tour={
                    destination === "Progres"
                      ? "progress"
                      : destination === "Rencana Belajar"
                        ? "plan"
                        : undefined
                  }
                  href="#"
                  aria-current={page === destination ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(destination);
                  }}
                >
                  {destination}
                </a>
              ))}
            </nav>
            <div className="app-header-tools">
              <ProfileSettingsButton
                name={profile.display_name}
                active={page === "Pengaturan"}
                onSettings={() => goTo("Pengaturan")}
              />
            </div>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        {page !== "Beranda" && profile.preferences.show_mimo && (
          <MimoMascot
            key={page}
            variant="dock"
            context={page}
            reducedMotion={profile.preferences.reduced_motion}
            onMotionSettings={() => goTo("Pengaturan")}
          />
        )}
      </div>
    </>
  );
}
