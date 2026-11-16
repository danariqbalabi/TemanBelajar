"use client";
import { useRef, useState } from "react";
import Image from "next/image";
export function UploadDesign({
  title,
  text,
  file,
  validation,
  busy,
  setTitle,
  setText,
  setFile,
  onSubmit,
  onBack,
}: {
  title: string;
  text: string;
  file: File | null;
  validation: string;
  busy: boolean;
  setTitle: (s: string) => void;
  setText: (s: string) => void;
  setFile: (f: File | null) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [kind, setKind] = useState<"pdf" | "text">(
    file ? "pdf" : text ? "text" : "pdf",
  );
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="final-design final-screen-9 w-full pt-20 bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md lg:py-space-lg flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
              <div className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant">
                <a
                  className="hover:text-primary transition-colors flex items-center gap-1 font-label"
                  data-path="materi-saya"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    folder_open
                  </span>
                  <span>Materi Saya</span>
                </a>
                <span className="text-outline text-[14px]">/</span>
                <span className="text-primary font-bold">
                  Tambah Materi Baru
                </span>
              </div>
              <a
                className="inline-flex items-center gap-space-xs text-label font-label text-secondary hover:text-primary transition-colors py-1 px-space-sm rounded-lg hover:bg-surface-container w-fit"
                data-path="materi-saya"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Materi Saya</span>
              </a>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-0.5 rounded-full bg-mint-tint text-success font-label text-label border border-secondary/20">
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  auto_stories
                </span>
                <span>Studio Konversi TemanBelajar • Modul Ramah Kognitif</span>
              </div>
              <h1 className="font-page-title text-page-title text-contrast-ink tracking-tight">
                Tambah Materi Belajarmu
              </h1>
              <p className="font-reading text-reading text-on-surface-variant max-w-3xl leading-relaxed">
                Unggah file PDF modul, foto lembar catatan buku tulismu, atau
                tempel teks rangkuman. Mimo bakal merapikan dan memecahnya jadi
                sesi santai 15 menit!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <section className="bg-surface rounded-xl p-space-md md:p-space-lg shadow-sm border border-divider flex flex-col gap-space-md">
                  <label className="block mb-5 font-bold">
                    Judul materi
                    <input
                      className="block mt-2 w-full"
                      value={title}
                      maxLength={200}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="font-card-title text-card-title text-contrast-ink flex items-center gap-space-xs">
                      <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-fixed text-[13px] font-bold inline-flex items-center justify-center">
                        1
                      </span>
                      Pilih Metode Unggah
                    </span>
                    <span className="text-metadata font-metadata text-outline hidden sm:inline">
                      Pilih salah satu cara termudahmu
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs bg-canvas p-1 rounded-xl border border-divider"
                    id="mode-tabs"
                  >
                    <button
                      className="mode-tab-btn active flex items-center justify-center gap-space-xs py-space-sm px-space-md rounded-lg font-label text-label transition-all bg-surface text-primary shadow-xs border border-primary/20"
                      data-mode="file"
                      type="button"
                      onClick={() => {
                        setKind("pdf");
                        setText("");
                      }}
                      aria-pressed={kind === "pdf"}
                    >
                      Dokumen PDF
                    </button>

                    <button
                      className="mode-tab-btn flex items-center justify-center gap-space-xs py-space-sm px-space-md rounded-lg font-label text-label transition-all text-on-surface-variant hover:text-primary hover:bg-surface/50"
                      data-mode="camera"
                      type="button"
                      disabled={true}
                      title="Pengenalan teks foto belum tersedia"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] text-secondary"
                        aria-hidden="true"
                      >
                        photo_camera
                      </span>
                      <span>Foto Catatan Buku</span>
                    </button>

                    <button
                      className="mode-tab-btn flex items-center justify-center gap-space-xs py-space-sm px-space-md rounded-lg font-label text-label transition-all text-on-surface-variant hover:text-primary hover:bg-surface/50"
                      data-mode="text"
                      type="button"
                      onClick={() => {
                        setKind("text");
                        setFile(null);
                      }}
                      aria-pressed={kind === "text"}
                    >
                      <span
                        className="material-symbols-outlined text-[20px] text-secondary"
                        aria-hidden="true"
                      >
                        edit_note
                      </span>
                      <span>Tempel Rangkuman</span>
                    </button>
                  </div>

                  <div
                    className="relative group rounded-2xl border-2 border-dashed border-control-border/60 hover:border-secondary transition-all bg-mint-tint/30 p-space-md md:p-space-xl flex flex-col items-center justify-center text-center gap-space-md"
                    id="dropzone-area"
                    hidden={kind !== "pdf"}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setFile(e.dataTransfer.files?.[0] || null);
                    }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-[36px]"
                        aria-hidden="true"
                      >
                        cloud_upload
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                      <p className="font-section-title text-section-title text-contrast-ink">
                        Tarik &amp; lepas file modul di sini
                      </p>
                      <p className="font-body text-body text-on-surface-variant">
                        atau klik tombol di bawah untuk memilih file dari
                        perangkatmu.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-space-sm">
                      <label
                        className="cursor-pointer inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface border border-control-border hover:bg-canvas text-primary font-label text-label shadow-xs hover:border-primary transition-all"
                        htmlFor="file-upload-input"
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          add_circle
                        </span>
                        <span>+ Pilih File dari Komputer</span>
                      </label>
                      <input
                        accept=".pdf,application/pdf"
                        className="sr-only"
                        id="file-upload-input"
                        type="file"
                        ref={fileInput}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex items-center gap-space-sm pt-2 text-metadata font-metadata text-outline">
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        PDF berbasis teks
                      </span>
                      <span>•</span>
                      <span>
                        Pilih tipe yang didukung, maksimal 4 MB per file
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-xl bg-surface-container-low border border-divider p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md"
                    id="selected-file-preview"
                    hidden={!file || kind !== "pdf"}
                  >
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-peach-tint text-warning flex items-center justify-center border border-peach/50">
                        <span
                          className="material-symbols-outlined text-[28px]"
                          aria-hidden="true"
                        >
                          picture_as_pdf
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <p className="font-card-title text-card-title text-contrast-ink truncate max-w-[260px] md:max-w-[340px]">
                            {file?.name}
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-label">
                            Siap diproses
                          </span>
                        </div>
                        <p className="font-metadata text-metadata text-outline flex items-center gap-space-xs">
                          <span>
                            {file
                              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                              : ""}
                          </span>
                          <span>•</span>
                          <span>
                            {file
                              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                              : ""}
                          </span>
                          <span>•</span>
                          <span className="text-success inline-flex items-center gap-0.5 font-label">
                            <span
                              className="material-symbols-outlined text-[14px]"
                              aria-hidden="true"
                            >
                              verified
                            </span>{" "}
                            Terverifikasi
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-center">
                      <button
                        className="px-space-sm py-1.5 rounded-lg border border-divider bg-surface hover:bg-canvas text-on-surface text-label font-label transition-colors inline-flex items-center gap-1 text-[13px]"
                        type="button"
                        onClick={() => fileInput.current?.click()}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          sync_alt
                        </span>
                        <span>Ganti File</span>
                      </button>
                      <button
                        aria-label="Hapus file pilihan"
                        className="p-1.5 rounded-lg border border-divider hover:border-error hover:bg-error-surface text-on-surface-variant hover:text-error transition-colors inline-flex items-center justify-center"
                        type="button"
                        onClick={() => setFile(null)}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                  {kind === "text" && (
                    <label className="block my-5 font-bold">
                      Teks materi
                      <textarea
                        className="block mt-2 w-full min-h-64"
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Tempel teks sumber di sini…"
                      />
                    </label>
                  )}
                  <p className="text-sm mt-3">
                    PDF berbasis teks, maksimal 4 MB dan 50 halaman. Foto, Word,
                    dan PDF hasil scan belum didukung.
                  </p>
                  {validation && (
                    <p role="alert" className="text-error mt-3">
                      {validation}
                    </p>
                  )}
                </section>

                <section className="bg-surface rounded-xl p-space-md md:p-space-lg shadow-sm border border-divider flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-card-title text-card-title text-contrast-ink flex items-center gap-space-xs">
                      <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-fixed text-[13px] font-bold inline-flex items-center justify-center">
                        2
                      </span>
                      Informasi Materi &amp; Pengaturan Belajar
                    </span>
                    <span className="text-metadata font-metadata text-outline hidden sm:inline">
                      Membantu Mimo menyesuaikan gaya bahasa
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label text-label text-contrast-ink flex items-center justify-between">
                      <span>Mata Pelajaran</span>
                      <span className="text-metadata text-outline font-normal">
                        Pilih salah satu
                      </span>
                    </label>
                    <div
                      className="flex flex-wrap gap-space-xs"
                      id="subject-chips"
                    >
                      <button
                        className="subject-chip selected inline-flex items-center gap-1 px-space-md py-1.5 rounded-full border border-primary bg-secondary-container text-contrast-ink font-label text-label"
                        type="button"
                        disabled={true}
                        title="Mata pelajaran dikenali dari isi materi."
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          biotech
                        </span>
                        <span>IPA Biologi</span>
                      </button>
                      <button
                        className="subject-chip inline-flex items-center gap-1 px-space-md py-1.5 rounded-full border border-divider bg-surface text-on-surface-variant hover:border-control-border font-label text-label"
                        type="button"
                        disabled={true}
                        title="Mata pelajaran dikenali dari isi materi."
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          calculate
                        </span>
                        <span>Matematika</span>
                      </button>
                      <button
                        className="subject-chip inline-flex items-center gap-1 px-space-md py-1.5 rounded-full border border-divider bg-surface text-on-surface-variant hover:border-control-border font-label text-label"
                        type="button"
                        disabled={true}
                        title="Mata pelajaran dikenali dari isi materi."
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          menu_book
                        </span>
                        <span>Bahasa Indonesia</span>
                      </button>
                      <button
                        className="subject-chip inline-flex items-center gap-1 px-space-md py-1.5 rounded-full border border-divider bg-surface text-on-surface-variant hover:border-control-border font-label text-label"
                        type="button"
                        disabled={true}
                        title="Mata pelajaran dikenali dari isi materi."
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          translate
                        </span>
                        <span>Bahasa Inggris</span>
                      </button>
                      <button
                        className="subject-chip inline-flex items-center gap-1 px-space-md py-1.5 rounded-full border border-divider bg-surface text-on-surface-variant hover:border-control-border font-label text-label"
                        type="button"
                        disabled={true}
                        title="Mata pelajaran dikenali dari isi materi."
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          category
                        </span>
                        <span>Lainnya...</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label text-label text-contrast-ink"
                        htmlFor="grade-select"
                      >
                        Jenjang &amp; Kelas
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-surface border border-control-border rounded-xl px-space-md py-2.5 text-primary font-body text-body appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          id="grade-select"
                          disabled={true}
                          title="Pengaturan ini belum tersedia untuk unggahan."
                        >
                          <option value="smp-8">
                            SMP - Kelas 8 (Terpilih otomatis dari profil)
                          </option>
                          <option value="smp-7">SMP - Kelas 7</option>
                          <option value="smp-9">SMP - Kelas 9</option>
                          <option value="sma-10">SMA - Kelas 10</option>
                          <option value="sma-11">SMA - Kelas 11</option>
                          <option value="sma-12">SMA - Kelas 12</option>
                        </select>
                        <span
                          className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-outline text-[20px]"
                          aria-hidden="true"
                        >
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label text-label text-contrast-ink"
                        htmlFor="target-select"
                      >
                        Target Ritme Belajar
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-surface border border-control-border rounded-xl px-space-md py-2.5 text-primary font-body text-body appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          id="target-select"
                          disabled={true}
                          title="Pengaturan ini belum tersedia untuk unggahan."
                        >
                          <option value="chill">
                            Santai tanpa batas waktu (Kapan saja)
                          </option>
                          <option value="3days">
                            Rekomendasi Mimo (Selesai dalam 3 hari)
                          </option>
                          <option value="urgent">
                            Persiapan Ulangan Harian (1-2 hari)
                          </option>
                          <option value="weekend">
                            Review Akhir Pekan (Sabtu-Minggu)
                          </option>
                        </select>
                        <span
                          className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-outline text-[20px]"
                          aria-hidden="true"
                        >
                          alarm
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs pb-space-lg">
                  <a
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface border border-control-border hover:bg-canvas text-primary font-label text-label transition-colors order-2 sm:order-1"
                    data-path="materi-saya"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onBack();
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      close
                    </span>
                    <span>Batal / Kembali</span>
                  </a>
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm transition-all transform hover:-translate-y-0.5 order-1 sm:order-2"
                    data-path="proses-materi"
                    onClick={onSubmit}
                    disabled={busy || !title.trim() || (!file && !text.trim())}
                    type="button"
                  >
                    <span>Siapkan Materi Bersama Mimo</span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="rounded-2xl bg-lavender-tint border border-lavender/40 p-space-md flex flex-col gap-space-md relative overflow-hidden">
                  <div className="flex items-center gap-space-md">
                    <div className="w-20 h-20 shrink-0 bg-surface rounded-2xl p-1 shadow-xs border border-lavender/30 flex items-center justify-center">
                      <Image
                        alt=""
                        className="w-full h-full object-contain object-contain"
                        data-alt="Chameleon mascot Mimo, a cute friendly mint green chameleon with big curious eyes, rosy cheeks, and a bright blue headband with a white lightning bolt, waving hand cheerfully on clean paper background, storybook pastel aesthetic"
                        src="/design/mimo-final.png"
                        width={1408}
                        height={1120}
                      ></Image>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-label uppercase tracking-wider text-tertiary">
                        Pendamping Fokusmu
                      </span>
                      <p className="font-card-title text-card-title text-contrast-ink leading-tight">
                        Halo! Mimo di sini!
                      </p>
                      <span className="text-metadata text-secondary font-metadata flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-success"></span>{" "}
                        Mode Siaga
                      </span>
                    </div>
                  </div>

                  <div className="relative bg-surface rounded-xl p-space-md border border-lavender/40 shadow-xs">
                    <p className="font-mimo-voice text-mimo-voice text-contrast-ink leading-snug">
                      “Tenang, file yang tebal bakal Mimo sulap jadi modul tipis
                      berfokus 5–15 menit dengan font nyaman dan bahasa yang
                      mudah dipahami!”
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-divider/60 flex items-center justify-between text-metadata font-metadata text-outline text-[12px]">
                      <span>Bebas stres &amp; minim overwhelmed</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-tertiary"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-space-md border border-divider shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span
                      className="material-symbols-outlined text-secondary text-[22px]"
                      aria-hidden="true"
                    >
                      magic_button
                    </span>
                    <h2 className="font-card-title text-card-title text-contrast-ink">
                      Apa yang Terjadi Sesudah Diunggah?
                    </h2>
                  </div>
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-mint-tint text-success font-bold text-[13px] flex items-center justify-center border border-success/20">
                        1
                      </div>
                      <div className="flex flex-col">
                        <p className="font-label text-label text-contrast-ink">
                          Ekstraksi Konsep Inti
                        </p>
                        <p className="font-body text-body text-on-surface-variant text-[13px] leading-relaxed">
                          AI memilah materi esensial, memotong kalimat berbelit
                          tanpa rumus membingungkan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-butter-tint text-warning font-bold text-[13px] flex items-center justify-center border border-butter">
                        2
                      </div>
                      <div className="flex flex-col">
                        <p className="font-label text-label text-contrast-ink">
                          Format Ramah Disleksia &amp; Sensorik
                        </p>
                        <p className="font-body text-body text-on-surface-variant text-[13px] leading-relaxed">
                          Otomatis disiapkan dengan opsi font OpenDyslexic,
                          pemenggal suku kata, dan penggaris fokus baris.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-peach-tint text-warning font-bold text-[13px] flex items-center justify-center border border-peach/50">
                        3
                      </div>
                      <div className="flex flex-col">
                        <p className="font-label text-label text-contrast-ink">
                          Rekomendasi Cara Belajar
                        </p>
                        <p className="font-body text-body text-on-surface-variant text-[13px] leading-relaxed">
                          Pilih gaya ternyamanmu: membaca visual, dengar narasi
                          audio santai, atau kuis interaktif 3 kartu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-canvas border border-divider p-space-md flex items-start gap-space-sm">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-surface text-secondary flex items-center justify-center shadow-xs border border-divider">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      verified_user
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label text-label text-contrast-ink">
                      Materi tersimpan di akunmu
                    </span>
                    <p className="font-metadata text-metadata text-on-surface-variant text-[12px] leading-normal">
                      Catatanmu aman dan bersifat privat. Tidak pernah dibagikan
                      ke publik atau digunakan untuk melatih data pihak ketiga
                      tanpa izin wali murid.
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-space-md border border-divider flex items-center gap-space-sm">
                  <span
                    className="material-symbols-outlined text-tertiary text-[20px]"
                    aria-hidden="true"
                  >
                    lightbulb
                  </span>
                  <p className="font-metadata text-metadata text-on-surface-variant text-[12px]">
                    Tip: Kamu juga bisa mengambil foto langsung dari kamera
                    ponsel dengan memilih tab <strong>Foto Catatan Buku</strong>
                    .
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
