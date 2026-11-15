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
    <div className={"stitch-shell revamp-shell " + className} style={style}>
      <a className="skip" href="#main">
        Lewati ke konten
      </a>
      <aside
        aria-label="Navigasi Utama"
        className="revamp-sidebar fixed left-0 top-0 h-full w-56 bg-surface border-r border-divider z-40 flex flex-col justify-between"
      >
        <div className="p-5 space-y-6">
          <div className="flex items-center px-2 py-1">
            <Image
              src="/design/logo-revamp.png"
              alt="TemanBelajar"
              className="h-10 w-auto object-contain"
              width={1024}
              height={1024}
            ></Image>
          </div>

          <nav aria-label="Menu Aplikasi" className="space-y-1">
            <button
              className={
                "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
                (page === "Beranda"
                  ? "bg-mint/50 text-primary font-semibold border border-divider"
                  : "text-text-secondary hover:bg-canvas font-medium")
              }
              onClick={() => navigate("Beranda")}
              aria-current={page === "Beranda" ? "page" : undefined}
            >
              <svg
                className="w-5 h-5 text-mint-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Beranda</span>
            </button>
            <button
              className={
                "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
                (page === "Rencana Belajar"
                  ? "bg-mint/50 text-primary font-semibold border border-divider"
                  : "text-text-secondary hover:bg-canvas font-medium")
              }
              onClick={() => navigate("Rencana Belajar")}
              aria-current={page === "Rencana Belajar" ? "page" : undefined}
            >
              <svg
                className="w-5 h-5 text-muted-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Rencana Belajar</span>
            </button>
            <button
              className={
                "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
                (page === "Materi Saya"
                  ? "bg-mint/50 text-primary font-semibold border border-divider"
                  : "text-text-secondary hover:bg-canvas font-medium")
              }
              onClick={() => navigate("Materi Saya")}
              aria-current={page === "Materi Saya" ? "page" : undefined}
            >
              <svg
                className="w-5 h-5 text-muted-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Materi Saya</span>
            </button>
            <button
              className={
                "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
                (page === "Progres"
                  ? "bg-mint/50 text-primary font-semibold border border-divider"
                  : "text-text-secondary hover:bg-canvas font-medium")
              }
              onClick={() => navigate("Progres")}
              aria-current={page === "Progres" ? "page" : undefined}
            >
              <svg
                className="w-5 h-5 text-muted-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Progres</span>
            </button>
            <button
              className={
                "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
                (page === "Pengaturan"
                  ? "bg-mint/50 text-primary font-semibold border border-divider"
                  : "text-text-secondary hover:bg-canvas font-medium")
              }
              onClick={() => navigate("Pengaturan")}
              aria-current={page === "Pengaturan" ? "page" : undefined}
            >
              <svg
                className="w-5 h-5 text-muted-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        <div className="p-4 m-3 rounded-2xl bg-canvas border border-divider space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-peach/40 border border-peach flex items-center justify-center font-bold text-sm text-primary">
              M
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-primary truncate">
                {profile.display_name}
              </div>
              <div className="text-[10px] text-text-secondary truncate">
                SMP Kelas 8 · Santai
              </div>
            </div>
          </div>
          <button
            className={
              "flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm min-h-[44px] " +
              (page === "Pengaturan"
                ? "bg-mint/50 text-primary font-semibold border border-divider"
                : "text-text-secondary hover:bg-canvas font-medium")
            }
            onClick={() => navigate("Pengaturan")}
            aria-current={page === "Pengaturan" ? "page" : undefined}
          >
            ♿ Aksesibilitas Cepat
          </button>
        </div>
      </aside>
      <div className="revamp-workspace">
        <header className="revamp-topbar bg-surface border-b border-divider px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-display font-extrabold text-xl text-primary">
                {profile.display_name}
              </h1>
              <p className="text-xs text-text-secondary">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  timeZone: profile.timezone,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-mint/50 text-mint-dark border border-[#BCE0C3]">
              <span className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse"></span>
              Mode Adaptif Aktif
            </span>
            <button
              aria-label="Bantuan atau Glosarium"
              className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-canvas border border-divider transition-all"
              onClick={() => navigate("Pengaturan")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </button>
          </div>
        </header>
        <main id="main" className="revamp-main">
          {children}
        </main>
        <footer className="stitch-footer">
          TemanBelajar ? Belajar sesuai ritmemu
        </footer>
      </div>
    </div>
  );
}
