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
    <div className="stitch-screen">
      {proposal.base_version !== plan.version && (
        <p role="alert" className="notice">
          Rencana aktif sudah berubah. Tinjau data terbaru dan susun usulan
          kembali sebelum menerapkan.
        </p>
      )}
      <div className="flex flex-col w-full">
        <div className="max-w-7xl mx-auto px-margin py-space-xl w-full flex flex-col gap-space-xl">
          <header className="flex flex-col gap-space-sm">
            <nav
              aria-label="Jejak navigasi"
              className="flex items-center gap-space-xs text-metadata font-metadata text-text-secondary"
            >
              <button
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
                onClick={onBack}
              >
                Beranda
              </button>
              <span
                className="material-symbols-outlined text-[14px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
              <button
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
                onClick={onBack}
              >
                Rencana Belajar
              </button>
              <span
                className="material-symbols-outlined text-[14px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
              <span className="text-primary font-label">{`Versi aktif ${plan.version} • Usulan dari versi ${proposal.base_version}`}</span>
            </nav>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs">
              <div className="flex flex-col gap-space-xs max-w-3xl">
                <div className="flex items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-metadata shadow-sm">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      auto_awesome
                    </span>
                    Usulan Penyesuaian Otomatis Mimo • Siap Diterapkan
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-butter/60 text-contrast-ink font-metadata text-metadata">
                    {
                      "Rencana mengikuti ritme belajarmu, tanpa menghapus kegiatan yang sudah selesai."
                    }
                  </span>
                </div>
                <h1 className="font-page-title text-page-title text-primary tracking-tight">
                  Rencana Belajarmu Siap Disesuaikan!
                </h1>
                <p className="font-reading text-reading text-text-secondary leading-relaxed">
                  {proposal.reason}
                </p>
              </div>

              <div className="flex items-center gap-space-sm shrink-0 self-start lg:self-center">
                <button
                  className="px-space-md py-space-sm rounded-xl bg-surface-container-low text-text-secondary hover:text-primary hover:bg-surface-container font-label text-label transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={() => historyDialog.current?.showModal()}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    history
                  </span>
                  Riwayat Versi (2.3)
                </button>
                <button
                  className="px-space-lg py-space-sm rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy || proposal.base_version !== plan.version}
                  onClick={onAccept}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  Pakai Rencana Ini
                </button>
              </div>
            </div>
          </header>

          <section
            aria-label="Pesan dari Mimo"
            className="relative rounded-2xl bg-secondary-container/50 p-space-lg shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-space-lg">
              <div className="shrink-0 relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-surface p-2 shadow-sm flex items-center justify-center overflow-hidden">
                  <Image
                    alt="Mimo, teman belajarmu"
                    className="w-full h-full object-contain"
                    data-alt="Cute friendly green chameleon mascot named Mimo wearing a tiny leaf bookmark collar, sitting happily atop three stacked pastel books (mint, soft lavender, peach) in a cozy storybook editorial illustration style, warm cream background."
                    src="/design/mimo.png"
                    width={1024}
                    height={1024}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-peach rounded-full px-2 py-0.5 text-[11px] font-label text-contrast-ink shadow-sm">
                  Teman Belajar
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-space-xs text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="font-mimo-voice text-mimo-voice text-primary">
                    Kata Mimo:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface text-primary font-metadata text-[12px]">
                    Hasil Sesi Teorema Pythagoras #4.1
                  </span>
                </div>
                <div className="relative bg-surface rounded-2xl p-space-md text-on-surface shadow-sm">
                  <p className="font-reading text-reading leading-relaxed text-contrast-ink">
                    {proposal.reason}
                  </p>

                  <div className="hidden md:block absolute -left-2 top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-surface border-b-[8px] border-b-transparent"></div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-metadata font-metadata text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      verified_user
                    </span>
                    Algoritma BKT (Bayesian Knowledge Tracing) • Kapasitas
                    Kognitif Harian Terjaga
                  </span>
                  <button
                    className="text-primary hover:underline font-label flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-focus rounded"
                    type="button"
                    disabled={busy}
                    onClick={() => setShowReason(!showReason)}
                    aria-expanded={showReason}
                  >
                    <span>Mengapa Mimo mengusulkan ini?</span>
                    <span
                      className="material-symbols-outlined text-[16px]"
                      id="algo-icon"
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </button>
                </div>

                <div
                  className="mt-space-md font-body text-body text-text-secondary"
                  id="algo-details"
                  hidden={!showReason}
                >
                  {proposal.reason}
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="Ringkasan Dampak Waktu dan Kapasitas"
            className="grid grid-cols-1 md:grid-cols-3 gap-space-md"
          >
            <article className="rounded-2xl bg-surface p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
              <p className="font-label text-label text-text-secondary">
                Durasi dalam usulan
              </p>
              <p className="font-display text-page-title text-primary mt-space-md">{`${proposal.activities.filter((a) => a.status !== "skipped").reduce((n, a) => n + a.duration_minutes, 0)} Menit`}</p>
            </article>

            <article className="rounded-2xl bg-surface p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
              <p className="font-label text-label text-text-secondary">
                Perubahan yang diusulkan
              </p>
              <p className="font-display text-page-title text-primary mt-space-md">
                {String(proposal.changes.length)}
              </p>
            </article>

            <article className="rounded-2xl bg-surface p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
              <p className="font-label text-label text-text-secondary">
                Kegiatan terlindungi
              </p>
              <p className="font-display text-page-title text-primary mt-space-md">
                {String(
                  before.filter(
                    (a) =>
                      a.locked ||
                      a.status === "completed" ||
                      a.status === "active",
                  ).length,
                )}
              </p>
            </article>
          </section>

          <section
            aria-label="Komparasi Jadwal Rinci"
            className="flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between flex-wrap gap-space-sm">
              <div>
                <h2 className="font-section-title text-section-title text-primary">
                  Perbandingan Alur Belajar
                </h2>
                <p className="font-metadata text-metadata text-text-secondary">
                  {proposal.reason}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-metadata font-label text-text-secondary">
                  <span className="w-3 h-3 rounded-full bg-surface-container"></span>{" "}
                  Tetap / Tersimpan
                </span>
                <span className="inline-flex items-center gap-1 text-metadata font-label text-primary">
                  <span className="w-3 h-3 rounded-full bg-mimo-belly"></span>{" "}
                  Ditambahkan Baru
                </span>
                <span className="inline-flex items-center gap-1 text-metadata font-label text-tertiary">
                  <span className="w-3 h-3 rounded-full bg-tertiary-fixed"></span>{" "}
                  Dijadwalkan Ulang
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              <div className="rounded-3xl bg-surface-container-low p-space-lg flex flex-col gap-space-md">
                <h3 className="font-card-title text-card-title text-primary">{`Jadwal Semula (Versi ${proposal.base_version})`}</h3>
                <div className="flex flex-col gap-space-md mt-space-md">
                  {before.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl bg-surface-container-low p-space-md"
                    >
                      <div className="flex items-center justify-between gap-space-sm">
                        <span className="font-metadata text-metadata text-secondary">
                          {new Date(a.start_at).toLocaleString("id-ID", {
                            timeZone: plan.timezone,
                          })}
                        </span>
                        {(a.locked ||
                          a.status === "completed" ||
                          a.status === "active") && (
                          <span
                            className="material-symbols-outlined text-secondary text-[18px]"
                            aria-label="Kegiatan terlindungi"
                          >
                            lock
                          </span>
                        )}
                      </div>
                      <h4 className="font-label text-label text-primary mt-space-xs">
                        {a.title}
                      </h4>
                      <p className="font-metadata text-metadata text-text-secondary mt-space-xs">
                        {a.duration_minutes} menit •{" "}
                        {a.status === "completed"
                          ? "Selesai"
                          : a.status === "active"
                            ? "Berjalan"
                            : a.status === "skipped"
                              ? "Dilewati"
                              : "Siap dijalani"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-secondary-container/40 p-space-lg flex flex-col gap-space-md shadow-sm">
                <h3 className="font-card-title text-card-title text-primary">{`Usulan Jadwal Baru (setelah versi ${proposal.base_version})`}</h3>
                <div className="flex flex-col gap-space-md mt-space-md">
                  {proposal.activities.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl bg-surface-container-low p-space-md"
                    >
                      <div className="flex items-center justify-between gap-space-sm">
                        <span className="font-metadata text-metadata text-secondary">
                          {new Date(a.start_at).toLocaleString("id-ID", {
                            timeZone: plan.timezone,
                          })}
                        </span>
                        {(a.locked ||
                          a.status === "completed" ||
                          a.status === "active") && (
                          <span
                            className="material-symbols-outlined text-secondary text-[18px]"
                            aria-label="Kegiatan terlindungi"
                          >
                            lock
                          </span>
                        )}
                      </div>
                      <h4 className="font-label text-label text-primary mt-space-xs">
                        {a.title}
                      </h4>
                      <p className="font-metadata text-metadata text-text-secondary mt-space-xs">
                        {a.duration_minutes} menit •{" "}
                        {a.status === "completed"
                          ? "Selesai"
                          : a.status === "active"
                            ? "Berjalan"
                            : a.status === "skipped"
                              ? "Dilewati"
                              : "Siap dijalani"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="Pratinjau Modul Penguatan Baru"
            className="rounded-3xl bg-surface p-space-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg"
          >
            <div className="flex-1 flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-1.5 text-metadata font-label text-secondary">
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  extension
                </span>
                Bocoran Isi Modul Baru 5 Menit
              </div>
              <h3 className="font-card-title text-card-title text-primary">
                {"Penyesuaian berdasarkan pilihan dan hasil belajarmu"}
              </h3>
              <p className="font-reading text-reading text-text-secondary">
                {proposal.reason}
              </p>
              <div className="pt-2 flex items-center gap-space-md text-metadata font-metadata text-text-secondary">
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px] text-success"
                    aria-hidden="true"
                  >
                    volume_up
                  </span>{" "}
                  Ada panduan suara Mimo
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px] text-success"
                    aria-hidden="true"
                  >
                    touch_app
                  </span>{" "}
                  Interaktif geser ubin
                </span>
              </div>
            </div>

            <div className="w-full md:w-80 shrink-0 bg-background rounded-2xl p-space-md flex flex-col items-center justify-center gap-2 shadow-inner">
              <svg
                aria-hidden="true"
                className="w-full h-auto max-w-[240px]"
                viewBox="0 0 240 140"
              >
                <rect
                  fill="#FFCA9D"
                  height="40"
                  rx="4"
                  stroke="#273B35"
                  strokeWidth="2"
                  width="40"
                  x="20"
                  y="50"
                ></rect>
                <text
                  fill="#273B35"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  x="40"
                  y="74"
                >
                  {"Penyesuaian berdasarkan pilihan dan hasil belajarmu"}
                </text>

                <text
                  fill="#273B35"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="18"
                  fontWeight="700"
                  textAnchor="middle"
                  x="75"
                  y="75"
                >
                  +
                </text>

                <rect
                  fill="#FFE7A3"
                  height="50"
                  rx="4"
                  stroke="#273B35"
                  strokeWidth="2"
                  width="50"
                  x="90"
                  y="40"
                ></rect>
                <text
                  fill="#273B35"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  x="115"
                  y="70"
                >
                  8²=64
                </text>

                <text
                  fill="#892E32"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="18"
                  fontWeight="700"
                  textAnchor="middle"
                  x="155"
                  y="75"
                >
                  ≠
                </text>

                <rect
                  fill="#C8E8CE"
                  height="60"
                  rx="4"
                  stroke="#273B35"
                  strokeDasharray="3 3"
                  strokeWidth="2"
                  width="60"
                  x="170"
                  y="30"
                ></rect>
                <text
                  fill="#273B35"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  x="200"
                  y="65"
                >
                  11²=121
                </text>

                <rect
                  fill="#273B35"
                  height="24"
                  rx="12"
                  width="140"
                  x="50"
                  y="105"
                ></rect>
                <text
                  fill="#FFFFFF"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                  x="120"
                  y="121"
                >
                  100 &lt; 121 (Tumpul)
                </text>
              </svg>
              <span className="text-[12px] font-label text-text-secondary text-center">
                {"Penyesuaian berdasarkan pilihan dan hasil belajarmu"}
              </span>
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  history_toggle_off
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label text-label text-primary">
                    Riwayat Perubahan Jadwal Belajar
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-label bg-secondary-container text-on-secondary-container">{`Versi aktif ${plan.version} • Usulan dari versi ${proposal.base_version}`}</span>
                </div>
                <p className="font-metadata text-metadata text-text-secondary">
                  Semua aktivitas yang telah selesai (9 menit) terkunci aman dan
                  tidak akan terhapus jika kamu berpindah versi.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <button
                className="px-space-md py-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-metadata transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy || !restoreTarget}
                onClick={() => restoreTarget && onRestore(restoreTarget)}
              >
                {restoreTarget
                  ? `Pulihkan ke Versi ${restoreTarget}`
                  : "Belum ada versi sebelumnya"}
              </button>
            </div>
          </section>

          <section
            aria-label="Pilihan Tindakan"
            className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm"
          >
            <div className="flex items-center gap-space-sm">
              <button
                className="px-space-md py-space-sm rounded-xl text-text-secondary hover:text-primary hover:bg-surface-container-low font-label text-label transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-focus"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                Kembali ke Rencana Belajar
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-space-sm w-full sm:w-auto">
              <button
                className="px-space-md py-space-sm rounded-xl bg-surface hover:bg-surface-container-low text-text-secondary hover:text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy}
                onClick={onDismiss}
              >
                Pertahankan Jadwal Lama (Batal)
              </button>

              <button
                className="px-space-md py-space-sm rounded-xl bg-surface hover:bg-surface-container-low text-primary font-label text-label shadow-sm transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy}
                onClick={onEdit}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  tune
                </span>
                Atur Jam &amp; Hari Sendiri
              </button>

              <button
                className="px-space-lg py-space-sm rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy || proposal.base_version !== plan.version}
                onClick={onAccept}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  done_all
                </span>
                Pakai Rencana Baru Ini (Terapkan)
              </button>
            </div>
          </section>
        </div>

        <aside
          aria-label="Bilah Tindakan Cepat"
          className="sticky bottom-0 z-40 w-full bg-surface/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(39,59,53,0.08)] py-3 px-margin"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  bolt
                </span>
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label text-label text-primary">{`Versi aktif ${plan.version} • Usulan dari versi ${proposal.base_version}`}</span>
                  <span className="hidden md:inline px-2 py-0.2 rounded-full bg-mimo-belly/40 text-primary font-metadata text-[12px]">
                    Total 14 Menit • 1 Perubahan Diterapkan
                  </span>
                </div>
                <span className="text-metadata font-metadata text-text-secondary">
                  Langsung lanjut ke modul 5 menit selagi ingatan konsep
                  Pythagoras masih hangat.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0 w-full sm:w-auto justify-end">
              <button
                className="px-space-md py-2 rounded-xl text-text-secondary hover:text-primary font-label text-metadata transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy}
                onClick={onDismiss}
              >
                Nanti Saja
              </button>
              <button
                className="px-space-lg py-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                disabled={busy || proposal.base_version !== plan.version}
                onClick={onAccept}
              >
                <span>Terapkan &amp; Lanjut Belajar</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>
      <div className="flex flex-wrap gap-space-sm mt-space-md">
        <button
          disabled={busy}
          onClick={onRefresh}
          className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
        >
          Muat rencana terbaru
        </button>
        <button
          disabled={busy}
          onClick={onBack}
          className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
        >
          Kembali meninjau jadwal
        </button>
      </div>
      <dialog ref={historyDialog} className="stitch-reason">
        <h2>Riwayat versi rencana</h2>
        <p>
          Pemulihan tetap melindungi kegiatan selesai, berjalan, dan terkunci.
        </p>
        {Object.keys(plan.history).map((v) => (
          <div
            key={v}
            className="flex items-center justify-between gap-space-md mt-space-sm"
          >
            <span>Versi {v}</span>
            <button
              disabled={busy || +v === plan.version}
              onClick={() => onRestore(+v)}
            >
              Pulihkan
            </button>
          </div>
        ))}
        <button onClick={() => historyDialog.current?.close()}>
          Tutup riwayat
        </button>
      </dialog>
    </div>
  );
}
