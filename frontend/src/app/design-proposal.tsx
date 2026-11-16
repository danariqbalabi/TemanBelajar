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
      <div className="final-design final-screen-21 w-full pt-[8.25rem] bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl flex flex-col gap-space-xl">
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex items-center flex-wrap gap-space-xs text-metadata font-metadata text-on-surface-variant">
                <a
                  className="hover:text-primary transition-colors"
                  data-path="beranda"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Beranda
                </a>
                <span className="text-outline-variant">•</span>
                <a
                  className="hover:text-primary transition-colors"
                  data-path="rencana-belajar"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Rencana Belajar
                </a>
                <span className="text-outline-variant">•</span>
                <span className="text-primary font-bold">
                  {proposal.reason}
                </span>
              </div>
              <div className="flex items-center gap-space-sm self-start md:self-auto">
                <div className="inline-flex items-center bg-surface rounded-full px-space-xs py-1 shadow-sm">
                  <button
                    aria-label="Kecilkan ukuran teks"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label text-label font-bold"
                    id="font-decrease"
                    type="button"
                    onClick={onBack}
                  >
                    A-
                  </button>
                  <div className="h-4 w-px bg-divider"></div>
                  <button
                    aria-label="Besarkan ukuran teks"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label text-label font-bold"
                    id="font-increase"
                    type="button"
                    onClick={onBack}
                  >
                    A+
                  </button>
                </div>
                <button
                  className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-full bg-surface hover:bg-surface-container text-on-surface font-label text-label shadow-sm transition-colors"
                  type="button"
                  onClick={onEdit}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                  <span>Atur Preferensi Jadwal</span>
                </button>
              </div>
            </section>

            <section className="flex flex-col gap-space-sm">
              <a
                className="inline-flex items-center gap-space-xs text-secondary hover:text-primary font-label text-label font-bold transition-colors w-fit"
                data-path="rencana-belajar"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Rencana Belajar Hari Ini</span>
              </a>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mt-space-xs">
                <div>
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-mint-tint text-success font-label text-label font-bold mb-space-xs">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      auto_awesome
                    </span>
                    <span>{proposal.reason}</span>
                  </div>
                  <h1 className="font-page-title text-page-title text-primary tracking-tight">
                    {proposal.status === "accepted"
                      ? "Rencana belajarmu sudah diperbarui"
                      : "Ada usulan buat rencana belajarmu"}
                  </h1>
                  <p className="font-reading text-reading text-on-surface-variant max-w-3xl mt-space-xs">
                    {proposal.reason}
                  </p>
                </div>
                <div className="bg-surface-container-low px-space-md py-space-sm rounded-xl flex items-center gap-space-sm self-start lg:self-auto">
                  <span
                    className="material-symbols-outlined text-secondary text-[24px]"
                    aria-hidden="true"
                  >
                    verified_user
                  </span>
                  <span className="font-metadata text-metadata text-secondary font-medium">
                    {proposal.reason}
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-lavender-tint rounded-2xl p-space-md md:p-space-lg flex flex-col md:flex-row items-center gap-space-lg relative overflow-hidden shadow-sm">
              <div className="relative shrink-0 flex items-center justify-center">
                <Image
                  alt=""
                  className="w-28 h-28 md:w-32 md:h-32 object-contain transform hover: transition-all object-contain"
                  src="/design/mimo-final.png"
                  width={1408}
                  height={1120}
                ></Image>
              </div>
              <div className="flex-1 flex flex-col gap-space-xs text-center md:text-left">
                <div className="inline-flex items-center justify-center md:justify-start gap-space-xs text-tertiary-container font-label text-label font-bold">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    chat_bubble
                  </span>
                  <span>Bisikan Semangat dari Mimo</span>
                </div>
                <p className="font-mimo-voice text-mimo-voice text-primary leading-relaxed">
                  {proposal.reason}
                </p>
                <span className="text-metadata font-metadata text-on-surface-variant text-[13px]">
                  Target ritme belajar: 15–20 menit fokus berkualitas per sesi.
                </span>
              </div>
              <div className="shrink-0 flex items-center">
                <a
                  className="px-space-md py-2.5 rounded-xl bg-surface text-primary hover:bg-surface-container font-label text-label font-bold shadow-sm transition-colors inline-flex items-center gap-space-xs"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  <span>Lihat Perbedaan</span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    south
                  </span>
                </a>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="bg-mint-tint rounded-2xl p-space-lg flex flex-col justify-between gap-space-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label font-bold text-success uppercase tracking-wider text-[11px]">
                    Durasi Belajar
                  </span>
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-success">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      timer
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-section-title text-primary font-black">
                    {proposal.reason}
                  </h3>
                  <p className="font-body text-body text-on-surface-variant mt-1">
                    Total waktu belajar hari ini tidak berubah. Nol beban waktu
                    tambahan untukmu.
                  </p>
                </div>
                <div className="inline-flex items-center gap-space-xs font-metadata text-metadata text-success font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  <span>{proposal.reason}</span>
                </div>
              </div>

              <div className="bg-butter-tint rounded-2xl p-space-lg flex flex-col justify-between gap-space-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label font-bold text-warning uppercase tracking-wider text-[11px]">
                    Fokus Tambahan
                  </span>
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-warning">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      bolt
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-section-title text-primary font-black">
                    +4 Menit Review
                  </h3>
                  <p className="font-body text-body text-on-surface-variant mt-1">
                    Penguatan mikro untuk materi{" "}
                    <strong>{proposal.reason}</strong> selagi ingatan masih
                    hangat.
                  </p>
                </div>
                <div className="inline-flex items-center gap-space-xs font-metadata text-metadata text-warning font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    trending_up
                  </span>
                  <span>Rekomendasi Adaptif Soal #4</span>
                </div>
              </div>

              <div className="bg-lavender-tint rounded-2xl p-space-lg flex flex-col justify-between gap-space-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label font-bold text-tertiary-container uppercase tracking-wider text-[11px]">
                    Relokasi Jadwal
                  </span>
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-tertiary-container">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      schedule
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-section-title text-primary font-black">
                    Digeser ke Besok
                  </h3>
                  <p className="font-body text-body text-on-surface-variant mt-1">
                    Kuis Analogi Santai dipindah ke{" "}
                    <strong>Besok Pagi (09.00 WIB)</strong> saat energimu
                    optimal.
                  </p>
                </div>
                <div className="inline-flex items-center gap-space-xs font-metadata text-metadata text-tertiary-container font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    hotel
                  </span>
                  <span>Sore Hari Bebas Tugas</span>
                </div>
              </div>
            </section>

            <section
              className="flex flex-col gap-space-lg"
              id="komparasi-jadwal"
            >
              <h2 className="font-section-title text-section-title text-primary tracking-tight">
                Perbandingan Jadwal: Sebelum vs Usulan Baru
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  ["Sebelum", before],
                  ["Usulan", proposal.activities],
                ].map(([label, items]) => (
                  <div
                    key={label as string}
                    className="bg-surface border border-divider rounded-2xl p-6"
                  >
                    <h3 className="font-bold text-xl mb-4">
                      {label as string}
                    </h3>
                    {(items as typeof before).map((a) => (
                      <article
                        key={a.id}
                        className="p-4 border-b border-divider"
                      >
                        <h4 className="font-bold">{a.title}</h4>
                        <p className="text-sm">
                          {new Date(a.start_at).toLocaleString("id-ID")} ·{" "}
                          {a.duration_minutes} menit
                        </p>
                        <p className="text-sm">
                          {a.kind === "manual" ? "Kegiatan mandiri" : ""}{" "}
                          {a.locked ? "· Jadwal dikunci" : ""}
                        </p>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-space-lg flex flex-col gap-space-md shadow-sm">
              <div className="flex items-center gap-space-xs">
                <h2 className="font-section-title text-section-title text-primary tracking-tight">
                  Kenapa Jadwal Ini Diusulkan? (Transparansi Cerdas)
                </h2>
                <button
                  onClick={() => setShowReason(!showReason)}
                  aria-expanded={showReason}
                >
                  Lihat alasannya
                </button>
                {showReason && <p>{proposal.reason}</p>}
              </div>
              <p className="font-body text-body text-on-surface-variant max-w-4xl">
                TemanBelajar tidak mengubah jadwal secara sembarangan. Setiap
                rekomendasi berdasar pada data performa latihan dan prinsip
                pembelajaran yang menenangkan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-xs">
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-label text-label font-bold">
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      psychology_alt
                    </span>
                    <span>1. Titik Mispersepsi Ditemukan</span>
                  </div>
                  <p className="font-metadata text-metadata text-on-surface-variant leading-relaxed">
                    {proposal.reason}
                  </p>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-label text-label font-bold">
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      shield
                    </span>
                    <span>2. Perlindungan Anti-Kelelahan</span>
                  </div>
                  <p className="font-metadata text-metadata text-on-surface-variant leading-relaxed">
                    {proposal.reason}
                  </p>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-label text-label font-bold">
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      schedule_send
                    </span>
                    <span>3. Waktu Luang Kamu Masih Lapang</span>
                  </div>
                  <p className="font-metadata text-metadata text-on-surface-variant leading-relaxed">
                    Berdasarkan profil mingguanmu, pukul 09.25–09.35 WIB adalah
                    jendela waktu santai sebelum jam istirahat siang, sehingga
                    kamu tidak terburu-buru.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-space-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-space-md sticky bottom-4 z-20">
              <div className="flex flex-col gap-0.5 text-center md:text-left">
                <span className="font-label text-label font-bold text-primary flex items-center justify-center md:justify-start gap-1">
                  <span
                    className="material-symbols-outlined text-success text-[18px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  Rencana v2.4 siap diaktifkan
                </span>
                <span className="font-metadata text-metadata text-on-surface-variant text-[13px]">
                  Kamu bisa mengubah atau memulihkan jadwal lama kapan pun
                  melalui Rencana Belajar.
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-space-sm w-full md:w-auto">
                <button
                  className="px-space-md py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary font-label text-label transition-colors inline-flex items-center gap-1.5"
                  id="btn-pulihkan"
                  type="button"
                  disabled={busy || proposal.status !== "pending"}
                  onClick={onDismiss}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    history
                  </span>
                  <span>Tetap Pakai Jadwal Lama</span>
                </button>

                <button
                  className="px-space-md py-3 rounded-xl bg-surface hover:bg-canvas text-primary font-label text-label font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  id="btn-kustomisasi"
                  type="button"
                  onClick={onEdit}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    edit_calendar
                  </span>
                  <span>Atur Jam Sendiri</span>
                </button>

                <button
                  className="px-space-lg py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold transition-all shadow-md inline-flex items-center gap-2 transform active:scale-95"
                  id="btn-terapkan"
                  type="button"
                  disabled={
                    busy ||
                    proposal.status !== "pending" ||
                    proposal.base_version !== plan.version
                  }
                  onClick={onAccept}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  <span>Pakai Rencana Baru (Terapkan)</span>
                </button>
              </div>
            </section>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-10 space-y-3">
          {proposal.status === "pending" &&
            proposal.base_version !== plan.version && (
              <p role="alert" className="text-error">
                Rencana telah berubah. Muat versi terbaru sebelum menerapkan
                usulan.
              </p>
            )}
          <button onClick={onRefresh}>Perbarui rencana</button>
          <button onClick={() => historyDialog.current?.showModal()}>
            Riwayat perubahan
          </button>
          <button
            disabled={busy || restoreTarget === undefined}
            onClick={() => onRestore(restoreTarget)}
          >
            Pulihkan versi sebelumnya
          </button>
        </div>
        <dialog ref={historyDialog} className="stitch-reason">
          <h2>Riwayat rencana</h2>
          {Object.entries(plan.history).map(([version, items]) => (
            <p key={version}>
              Versi {version}: {items.length} kegiatan
            </p>
          ))}
          <button onClick={() => historyDialog.current?.close()}>
            Tutup riwayat
          </button>
        </dialog>
      </div>
    </>
  );
}
