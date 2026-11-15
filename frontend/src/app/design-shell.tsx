import Image from "next/image";
import type { ReactNode } from "react";
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
  style: React.CSSProperties;
}) {
  return (
    <div className={"stitch-shell " + className} style={style}>
      <a className="skip" href="#main">
        Lewati ke konten
      </a>
      <aside className="fixed left-0 top-0 h-full w-60 bg-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          <div className="h-16 px-space-md flex items-center gap-space-sm">
            <Image
              alt="TemanBelajar"
              className="stitch-logo"
              src="/design/logo.png"
              width={640}
              height={240}
            />
          </div>
          <div className="px-space-md py-space-sm">
            <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-secondary text-[20px]"
                >
                  self_improvement
                </span>
                <div className="flex flex-col">
                  <span className="font-label text-[12px] text-primary leading-tight">
                    Mode Tenang
                  </span>
                  <span className="font-metadata text-[11px] text-text-secondary">
                    Aktif bebas cemas
                  </span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
            </div>
          </div>
          <nav
            className="px-space-sm flex flex-col gap-1 mt-2"
            data-active-classes="bg-secondary-container text-on-secondary-container font-label font-bold rounded-xl"
            aria-label="Navigasi utama"
          >
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Beranda"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="beranda"
              aria-current={page === "Beranda" ? "page" : undefined}
              onClick={() => navigate("Beranda")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                home
              </span>
              <span className="font-label text-label">Beranda</span>
            </button>
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Rencana Belajar"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="rencana-belajar"
              aria-current={page === "Rencana Belajar" ? "page" : undefined}
              onClick={() => navigate("Rencana Belajar")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                calendar_today
              </span>
              <span className="font-label text-label">Rencana Belajar</span>
            </button>
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Materi Saya"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="materi-saya"
              aria-current={page === "Materi Saya" ? "page" : undefined}
              onClick={() => navigate("Materi Saya")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                menu_book
              </span>
              <span className="font-label text-label">Materi Saya</span>
            </button>
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Mulai Belajar"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="mulai-belajar"
              aria-current={page === "Mulai Belajar" ? "page" : undefined}
              onClick={() => navigate("Mulai Belajar")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                play_circle
              </span>
              <span className="font-label text-label">Mulai Belajar</span>
            </button>
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Progres"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="progres-belajar"
              aria-current={page === "Progres" ? "page" : undefined}
              onClick={() => navigate("Progres")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                insights
              </span>
              <span className="font-label text-label">Progres</span>
            </button>
            <button
              className={
                "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-left " +
                (page === "Pengaturan"
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container")
              }
              data-path="pengaturan-aksesibilitas"
              aria-current={page === "Pengaturan" ? "page" : undefined}
              onClick={() => navigate("Pengaturan")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
              >
                tune
              </span>
              <span className="font-label text-label">Pengaturan</span>
            </button>
          </nav>
        </div>
        <div className="p-space-md flex flex-col gap-space-sm">
          <div className="p-space-sm rounded-xl bg-secondary-fixed/50 flex items-center gap-space-xs">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-secondary text-[18px]"
            >
              verified_user
            </span>
            <span className="font-metadata text-[12px] text-on-secondary-fixed-variant">
              {"Target WCAG 2.2 AA"}
            </span>
          </div>
          <div className="flex items-center gap-space-sm p-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-on-primary text-[18px]"
              >
                person
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label text-[13px] text-primary truncate leading-tight">
                {profile.display_name}
              </span>
              <span className="font-metadata text-[11px] text-text-secondary truncate">
                SMP Kelas 8
              </span>
            </div>
          </div>
        </div>
      </aside>
      <div className="stitch-workspace pl-60 min-h-screen flex flex-col">
        <header className="fixed top-0 left-60 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-space-sm">
            <button
              className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-xl bg-surface-container text-primary font-label text-label hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={() => navigate("Pengaturan")}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[18px]"
              >
                accessibility_new
              </span>
              <span>Pintasan Aksesibilitas</span>
              <kbd className="px-1.5 py-0.5 rounded text-[11px] bg-surface font-metadata text-text-secondary shadow-sm">
                Alt+A
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span className="font-metadata text-[12px] text-text-secondary">
                Lingkungan Belajar Ramah
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-on-primary text-[18px]"
              >
                person
              </span>
            </div>
          </div>
        </header>
        <main id="main" className="stitch-main">
          {children}
        </main>
        <footer className="stitch-footer">
          TemanBelajar — Pembelajaran Adaptif SMP &amp; SMA{" "}
          <span>Desain tenang &amp; bebas tekanan</span>
        </footer>
      </div>
    </div>
  );
}
