import Image from "next/image";
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
  return (
    <>
      <div
        className={"stitch-shell final-design final-app " + className}
        style={style}
      >
        <a className="skip" href="#main">
          Lewati ke konten
        </a>
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-divider">
          <div className="h-20 max-w-[1200px] mx-auto px-margin flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-lg">
              <a
                className={
                  "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                  (page === "Beranda"
                    ? "bg-mint font-bold"
                    : "hover:bg-mint-tint")
                }
                data-path="beranda"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  (() => navigate("Beranda"))();
                }}
                aria-current={page === "Beranda" ? "page" : undefined}
              >
                <Image
                  alt="TemanBelajar"
                  className="h-8 w-auto object-contain object-contain"
                  src="/design/logo-final.png"
                  width={1024}
                  height={280}
                ></Image>
                <span className="font-display text-card-title text-primary tracking-tight hidden sm:inline">
                  TemanBelajar
                </span>
              </a>
              <nav
                className="flex items-center gap-1 overflow-x-auto max-w-full final-nav"
                data-active-classes="bg-secondary-container text-on-secondary-fixed font-label rounded-lg"
                aria-label="Navigasi utama"
              >
                <a
                  aria-current={page === "Beranda" ? "page" : undefined}
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Beranda"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="beranda"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Beranda"))();
                  }}
                >
                  Beranda
                </a>
                <a
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Rencana Belajar"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="rencana-belajar"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Rencana Belajar"))();
                  }}
                  aria-current={page === "Rencana Belajar" ? "page" : undefined}
                >
                  Rencana Belajar
                </a>
                <a
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Materi Saya"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="materi-saya"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Materi Saya"))();
                  }}
                  aria-current={page === "Materi Saya" ? "page" : undefined}
                >
                  Materi Saya
                </a>
                <a
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Mulai Belajar"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="mulai-belajar"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Mulai Belajar"))();
                  }}
                  aria-current={page === "Mulai Belajar" ? "page" : undefined}
                >
                  Mulai Belajar
                </a>
                <a
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Progres"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="progres"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Progres"))();
                  }}
                  aria-current={page === "Progres" ? "page" : undefined}
                >
                  Progres
                </a>
                <a
                  className={
                    "px-3 py-2 rounded-xl text-sm whitespace-nowrap " +
                    (page === "Pengaturan"
                      ? "bg-mint font-bold"
                      : "hover:bg-mint-tint")
                  }
                  data-path="pengaturan"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => navigate("Pengaturan"))();
                  }}
                  aria-current={page === "Pengaturan" ? "page" : undefined}
                >
                  Pengaturan
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-space-sm">
              <button
                aria-label="Mode Aksesibilitas dan Kontras"
                className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full border border-divider bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors text-label font-label"
                type="button"
                onClick={() => navigate("Pengaturan")}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  accessibility_new
                </span>
                <span className="hidden md:inline text-metadata font-metadata">
                  Aksesibilitas
                </span>
              </button>
              <div className="h-6 w-[1px] bg-divider mx-space-xs hidden sm:block"></div>
              <div className="flex items-center gap-space-sm pl-space-xs">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="font-label text-label text-primary font-bold">
                    {profile.display_name}
                  </p>
                  <p className="text-metadata font-metadata text-outline text-[12px]">
                    Pelajar SMP & SMA
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-on-primary text-[18px]"
                    aria-hidden="true"
                  >
                    person
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
      </div>
    </>
  );
}
