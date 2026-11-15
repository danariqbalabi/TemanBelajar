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
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <button
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-primary font-medium text-sm hover:bg-surface transition-all focus-visible:outline-focus"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Materi Saya</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary bg-surface px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-mint-dark"></span>
                <span>Langkah 1 dari 2: Pilih &amp; Masukkan Materi</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-7 xl:col-span-8 space-y-7">
                <label className="block text-sm font-semibold text-primary">
                  Judul materi
                  <input
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full mt-2 p-3 rounded-xl bg-surface"
                  />
                </label>
                <div className="space-y-2">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary tracking-tight flex items-center gap-2.5">
                    <span>Tambah Materi Belajar Baru</span>
                    <span aria-hidden="true" className="text-2xl">
                      📚
                    </span>
                  </h1>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                    Unggah file materi sekolah, foto catatan, atau tempel teks
                    bab yang ingin kamu pelajari bareng Mimo.
                  </p>
                </div>

                <div
                  aria-label="Metode Masukan Materi"
                  className="bg-surface p-1.5 rounded-2xl shadow-sm flex flex-wrap gap-1"
                  role="tablist"
                >
                  <button
                    aria-selected={kind === "pdf"}
                    className="tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-primary text-surface shadow-xs transition-all focus-visible:outline-focus"
                    id="tab-doc"
                    role="tab"
                    type="button"
                    onClick={() => {
                      setKind("pdf");
                    }}
                  >
                    <span>📄</span>
                    <span>File Dokumen</span>
                  </button>

                  <button
                    aria-selected={kind === "text"}
                    className="tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-text-secondary hover:text-primary hover:bg-canvas transition-all focus-visible:outline-focus"
                    id="tab-paste"
                    role="tab"
                    type="button"
                    onClick={() => {
                      setKind("text");
                      setFile(null);
                    }}
                  >
                    <span>✍️</span>
                    <span>Tempel Teks</span>
                  </button>
                </div>

                <div
                  aria-label="Area seret dan lepas file atau klik untuk memilih file"
                  className="relative bg-surface rounded-2xl p-8 sm:p-10 text-center shadow-card transition-all duration-200 group cursor-pointer hover:shadow-md"
                  id="dropzone"
                  role="button"
                  onClick={() => fileInput.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInput.current?.click();
                    }
                  }}
                  tabIndex={0}
                  hidden={kind !== "pdf"}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setFile(e.dataTransfer.files[0] || null);
                  }}
                >
                  <input
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    id="file-input"
                    type="file"
                    ref={fileInput}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />

                  <div className="absolute inset-3 rounded-xl border-2 border-dashed border-[#91AF87]/60 group-hover:border-primary/50 transition-colors pointer-events-none"></div>
                  <div className="relative z-10 space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-mint/40 text-mint-dark flex items-center justify-center shadow-xs">
                      <span
                        className="material-symbols-outlined text-3xl"
                        aria-hidden="true"
                      >
                        cloud_upload
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-display font-bold text-base text-primary">
                        Tarik &amp; lepas file materimu ke sini, atau
                      </p>
                      <p className="text-xs text-text-secondary">
                        {"Unggah PDF berbasis teks atau tempel teks materi."}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canvas text-primary font-bold text-xs sm:text-sm hover:bg-mint/30 shadow-xs transition-all pointer-events-none">
                        <span
                          className="material-symbols-outlined text-base"
                          aria-hidden="true"
                        >
                          folder_open
                        </span>
                        <span>Pilih File dari Komputer</span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInput.current?.click();
                    }}
                    className="px-5 py-3 rounded-xl bg-primary text-surface min-h-[44px]"
                  >
                    Pilih file PDF
                  </button>
                  <p className="text-xs text-text-secondary mt-3">
                    PDF berbasis teks • maksimal 4 MB, 50 halaman
                  </p>
                </div>

                <div
                  className="bg-surface rounded-2xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  id="file-card"
                  hidden={!file || kind !== "pdf"}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{file?.name}</p>
                    <p className="text-xs text-text-secondary">
                      {file ? Math.ceil(file.size / 1024) : 0} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    aria-label="Hapus file terpilih"
                    className="min-h-[44px] px-4"
                  >
                    Hapus
                  </button>
                </div>

                <div className="bg-surface rounded-2xl p-6 shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-primary">
                      Penyesuaian Modul Otomatis
                    </h2>
                    <span className="text-xs text-text-secondary">
                      Dapat disesuaikan kembali nanti
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-bold text-primary"
                        htmlFor="subject-select"
                      >
                        Mata Pelajaran:
                      </label>
                      <div className="relative">
                        <p className="text-sm text-text-secondary">
                          Mata pelajaran dan konsep disusun dari isi sumber.
                          Waktu belajar mengikuti preferensimu.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-bold text-primary"
                        htmlFor="pace-select"
                      >
                        Gaya Belajar:
                      </label>
                      <div className="relative">
                        <p className="text-sm text-text-secondary">
                          Mata pelajaran dan konsep disusun dari isi sumber.
                          Waktu belajar mengikuti preferensimu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-primary text-surface font-display font-extrabold text-base hover:bg-primary-hover shadow-md hover:shadow-lg transition-all focus-visible:outline-focus min-h-[52px]"
                    type="button"
                    onClick={onSubmit}
                  >
                    <span>Mulai Susun Materi Bareng Mimo</span>
                    <span
                      className="material-symbols-outlined text-xl"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                  <button
                    className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-surface text-text-secondary hover:text-primary font-semibold text-xs sm:text-sm shadow-card hover:bg-canvas transition-all min-h-[52px]"
                    type="button"
                    onClick={onBack}
                  >
                    🕒 Simpan ke Jadwal Nanti
                  </button>
                </div>
                {kind === "text" && (
                  <label className="block text-sm font-semibold text-primary">
                    Teks materi
                    <textarea
                      rows={8}
                      maxLength={100000}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="block w-full mt-2 p-4 rounded-xl bg-surface"
                    />
                  </label>
                )}
                {validation && (
                  <p role="alert" className="text-error">
                    {validation}
                  </p>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={onSubmit}
                  className="w-full px-5 py-4 rounded-2xl bg-primary text-surface font-semibold min-h-[44px]"
                >
                  {busy ? "Menyimpan sumber..." : "Siapkan materi"}
                </button>
              </section>

              <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
                <div className="bg-[#F4F8F4] rounded-3xl p-6 sm:p-7 shadow-card relative overflow-hidden space-y-6">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-mint/40 blur-2xl pointer-events-none"></div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 shrink-0 bg-surface rounded-2xl p-1.5 shadow-sm flex items-center justify-center overflow-hidden">
                      <Image
                        alt="Mimo si bunglon hijau ramah sedang berpikir dengan jari di dagu, siap membantu menyiapkan materi belajar"
                        className="w-full h-full object-contain"
                        src="/design/mimo-4.png"
                        width={1024}
                        height={1024}
                      ></Image>
                    </div>
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-mint text-primary">
                        Asisten Adaptif
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-primary leading-tight">
                        Gimana cara Mimo menyiapkannya?
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="flex items-start gap-3.5 bg-surface/80 p-3.5 rounded-2xl shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-mint/50 text-mint-dark flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        🌿
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-primary">
                          Rangkuman Inti Bebas Lelah
                        </h4>
                        <p className="text-xs text-text-secondary leading-snug">
                          Bab panjang disaring jadi konsep mikro yang nyaman
                          dibaca tanpa bikin kewalahan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 bg-surface/80 p-3.5 rounded-2xl shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-lavender/40 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        🎧
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-primary">
                          Format Sesuai Gayamu
                        </h4>
                        <p className="text-xs text-text-secondary leading-snug">
                          Disiapkan dalam opsi bacaan kontras tinggi, audio
                          narasi santai, dan diagram praktis.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 bg-surface/80 p-3.5 rounded-2xl shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-peach/40 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        ⏱️
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-primary">
                          Bebas Batas Waktu
                        </h4>
                        <p className="text-xs text-text-secondary leading-snug">
                          Manda bisa belajar kapan pun tanpa tekanan waktu cepat
                          atau skor yang dikurangi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/90 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                    <span
                      className="material-symbols-outlined text-mint-dark text-lg mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      lock
                    </span>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      Catatanmu tersimpan privat dan aman. Hanya digunakan untuk
                      membangun modul belajar pribadimu.
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-5 shadow-card space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span className="font-display font-bold text-xs text-primary uppercase tracking-wider">
                      Tips Format Unggahan
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Punya buku cetak fisik? Gunakan tab{" "}
                    <strong className="text-primary font-semibold">
                      {"Unggah PDF berbasis teks atau tempel teks materi."}
                    </strong>{" "}
                    untuk mengambil foto halaman secara tegak lurus dengan
                    pencahayaan cukup.
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
