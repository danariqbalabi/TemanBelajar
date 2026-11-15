"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type { Plan, Proposal } from "@/lib/types";
export function ProposalDesign({
  plan,
  proposal,
  busy,
  onAccept,
  onDismiss,
  onBack,
  onEdit,
  onRestore,
  onRefresh,
}: {
  plan: Plan;
  proposal: Proposal;
  busy: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onBack: () => void;
  onEdit: () => void;
  onRestore: (version: number) => void;
  onRefresh: () => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const historyDialog = useRef<HTMLDialogElement>(null);
  const before = plan.history[String(proposal.base_version)] || plan.activities;
  const restoreTarget = Object.keys(plan.history)
    .map(Number)
    .filter((v) => v < plan.version)
    .sort((a, b) => b - a)[0];
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface-container-low shadow-sm">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <button
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold group focus:outline-none focus:ring-2 focus:ring-focus rounded-full px-2.5 py-1"
                data-path="rencana-belajar"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Rencana Harian</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-primary uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Usulan Penyesuaian Jadwal #V-03
                </span>
                <button
                  className="text-xs font-medium text-text-secondary hover:text-primary transition-colors px-2 py-1 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-focus rounded"
                  type="button"
                  disabled={busy}
                  onClick={() => historyDialog.current?.showModal()}
                >
                  Riwayat Perubahan
                </button>
              </div>
            </div>
          </section>

          <section className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-4">
            <div className="bg-gradient-to-br from-secondary-container/40 via-surface to-peach/20 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-secondary-fixed/50 blur-3xl pointer-events-none"></div>
              <div className="absolute right-1/3 -bottom-10 w-44 h-44 rounded-full bg-peach/30 blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container w-fit text-xs font-bold tracking-wide">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      auto_fix_high
                    </span>
                    Pembaruan Jadwal Adaptif Otomatis
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight font-display">
                    {"Ada Usulan Penyesuaian Jadwal 🌿"}
                  </h1>
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    Berdasarkan hasil latihan tadi, kamu butuh{" "}
                    <strong className="text-primary font-semibold">
                      8 menit
                    </strong>{" "}
                    untuk memperkuat konsep luas kuadrat hari ini. Agar total
                    waktu belajarmu tidak melebihi komitmen santai{" "}
                    <strong className="text-primary font-semibold">
                      35 menit
                    </strong>
                    , kuis pemahaman kita pindahkan ke besok pagi ya!
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-surface/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm self-start md:self-auto min-w-[210px]">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary shrink-0">
                    <span
                      className="material-symbols-outlined text-2xl"
                      aria-hidden="true"
                    >
                      timelapse
                    </span>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-text-secondary">
                      Waktu Hari Ini
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-primary">
                        33
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        / 35 Menit
                      </span>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-success bg-secondary-container/60 px-2 py-0.5 rounded-full mt-0.5">
                      -7 mnt lebih ringan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                ["Jadwal semula", before],
                ["Usulan jadwal baru", proposal.activities],
              ].map(([title, rows]) => (
                <div
                  key={String(title)}
                  className="p-6 bg-surface rounded-2xl shadow-card"
                >
                  <h2 className="font-bold text-lg text-primary">
                    {String(title)}
                  </h2>
                  <div className="space-y-3 mt-4">
                    {(rows as Plan["activities"]).map((a) => (
                      <article key={a.id} className="p-4 rounded-xl bg-canvas">
                        <h3 className="font-semibold">{a.title}</h3>
                        <p className="text-sm text-text-secondary">
                          {new Date(a.start_at).toLocaleString("id-ID", {
                            timeZone: plan.timezone,
                          })}{" "}
                          • {a.duration_minutes} menit
                        </p>
                        <p className="text-xs">
                          {a.status}
                          {a.locked ? " • Terkunci" : ""}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-4">
            <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-secondary-container/40 flex items-center justify-center p-2 shadow-inner">
                  <Image
                    alt="Mimo si bunglon bersorak gembira merayakan ritme belajar santai"
                    className="w-28 h-28 md:w-32 md:h-32 object-contain select-none drop-shadow-sm"
                    src="/design/mimo-0.png"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-peach text-primary rounded-full p-1.5 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px] block"
                    aria-hidden="true"
                  >
                    tips_and_updates
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-5 md:p-6 relative">
                <div className="hidden md:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-surface-container-low"></div>
                <div className="md:hidden absolute left-8 -top-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-surface-container-low"></div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">
                    Kata Mimo
                  </span>
                  <span className="text-[11px] text-muted-gray">
                    • Rekan Belajar Kamu
                  </span>
                </div>
                <p className="font-display font-bold text-base md:text-lg text-primary leading-snug">
                  {proposal.reason}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[15px] text-success"
                      aria-hidden="true"
                    >
                      energy_savings_leaf
                    </span>
                    Energi terjaga stabil
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[15px] text-primary"
                      aria-hidden="true"
                    >
                      psychology
                    </span>
                    Retensi materi +38% lebih kuat
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-4 mb-28">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  target
                </span>
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase">
                    Fokus Tepat Sasaran
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Memperbaiki celah pemahaman sebelum lanjut ke kuis berat.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  sentiment_satisfied
                </span>
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase">
                    Bebas Rasa Lelah
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {proposal.reason}
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  bedtime
                </span>
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase">
                    Konsolidasi Memori
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {proposal.reason}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl shadow-lg">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-focus"
                  title="Kembalikan jadwal persis ke versi semula"
                  type="button"
                  disabled={busy || !restoreTarget}
                  onClick={() => restoreTarget && onRestore(restoreTarget)}
                >
                  <span
                    className="material-symbols-outlined text-base"
                    aria-hidden="true"
                  >
                    restart_alt
                  </span>
                  <span>Pulihkan Rencana Sebelumnya</span>
                </button>
                <button
                  className="text-xs font-medium text-muted-gray hover:text-on-surface transition-colors px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-focus sm:hidden"
                  type="button"
                  disabled={busy}
                  onClick={onDismiss}
                >
                  Nanti Dulu
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  className="hidden sm:inline-flex text-xs font-semibold text-text-secondary hover:text-primary transition-colors px-3.5 py-2.5 rounded-xl hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={onDismiss}
                >
                  Nanti Dulu / Tetap Jadwal Lama
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                  type="button"
                  disabled={busy}
                  onClick={onEdit}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                  <span>Atur Jam Sendiri</span>
                </button>
                <button
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-bold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                  type="button"
                  disabled={busy || proposal.base_version !== plan.version}
                  onClick={onAccept}
                >
                  <span
                    className="material-symbols-outlined text-base"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  <span>Pakai Rencana Baru Ini</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
        <div className="max-w-6xl mx-auto p-4">
          <button
            onClick={() => setShowReason(!showReason)}
            aria-expanded={showReason}
          >
            Lihat alasan perubahan
          </button>
          {showReason && <p>{proposal.reason}</p>}
          {proposal.base_version !== plan.version && (
            <p role="alert">
              Rencana aktif sudah berubah. Muat ulang sebelum menerapkan.
            </p>
          )}
          <button disabled={busy} onClick={onRefresh}>
            Muat rencana terbaru
          </button>
        </div>
        <dialog ref={historyDialog} className="stitch-reason">
          <h2>Riwayat versi</h2>
          {Object.keys(plan.history).map((v) => (
            <p key={v}>Versi {v}</p>
          ))}
          <button onClick={() => historyDialog.current?.close()}>Tutup</button>
        </dialog>
      </div>
    </>
  );
}
