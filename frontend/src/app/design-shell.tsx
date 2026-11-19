"use client";
import { Brand } from "./brand";
import { usePlayfulCards } from "./use-playful-cards";
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
  navigate: (p: string) => void;
  className: string;
  style: CSSProperties;
}) {
  const header = useRef<HTMLElement>(null);
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
    navigate(destination);
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
                "Pengaturan",
              ].map((destination) => (
                <a
                  key={destination}
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
              <button
                aria-label="Mode Aksesibilitas dan Kontras"
                className="app-accessibility"
                type="button"
                onClick={() => goTo("Pengaturan")}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  accessibility_new
                </span>
                <span className="app-accessibility-label">Aksesibilitas</span>
              </button>
              <div className="app-profile">
                <div className="app-profile-name">
                  <p>{profile.display_name}</p>
                  <p>Pelajar SMP &amp; SMA</p>
                </div>
                <span className="app-avatar" aria-hidden="true">
                  <span className="material-symbols-outlined">person</span>
                </span>
              </div>
            </div>
          </div>
        </header>
        {page !== "Beranda" && (
          <div className="studio-page-index" aria-hidden="true">
            <span>
              RUANG BELAJAR /{" "}
              {String(
                [
                  "Beranda",
                  "Rencana Belajar",
                  "Materi Saya",
                  "Mulai Belajar",
                  "Progres",
                  "Pengaturan",
                ].indexOf(page) + 1,
              ).padStart(2, "0")}
            </span>
            <span>{page}</span>
            <span>SATU LANGKAH, SESUAI RITMEMU ↗</span>
          </div>
        )}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  );
}
