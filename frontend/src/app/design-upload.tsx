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
    <div className="stitch-screen">
      <div className="flex flex-col w-full">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-space-lg pb-space-xxl">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-col gap-1">
              <button
                className="inline-flex items-center gap-space-xs text-secondary hover:text-primary transition-colors font-label text-label group w-fit"
                type="button"
                disabled={busy}
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Materi Saya</span>
              </button>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-metadata text-[12px] font-semibold">
                  Tambah Sumber Belajar Baru
                </span>
                <span className="text-text-secondary font-metadata text-[12px]">
                  •
                </span>
                <span className="text-text-secondary font-metadata text-[12px]">
                  SMP &amp; SMA Kurikulum Merdeka
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-xl bg-surface-container-low shadow-sm">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                aria-hidden="true"
              >
                verified_user
              </span>
              <span className="font-metadata text-[12px] text-text-secondary">
                Pemrosesan Aman &amp; Privat
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-page-title text-page-title text-primary tracking-tight">
              Unggah Materi atau Catatan Belajar
            </h1>
            <p className="font-reading text-reading text-text-secondary max-w-3xl">
              Tarik tugas sekolah, foto catatan tangan buku tulis, atau dokumen
              PDF. Mimo akan menyusunnya jadi zine ringkas yang ramah bacaan dan
              bebas bikin cemas.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-secondary-container p-space-md md:p-space-lg shadow-sm flex flex-col sm:flex-row items-center gap-space-md">
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface/80 flex items-center justify-center shadow-sm overflow-hidden p-1">
                <Image
                  className="w-full h-full object-contain"
                  data-alt="Chameleon mascot named Mimo sitting thoughtfully on a stack of colorful pastel textbooks with gentle mint green skin, peach cheeks, and a welcoming friendly smile in soft storybook humanist zine illustration style"
                  src="/design/mimo.png"
                  width={1024}
                  height={1024}
                  alt="Mimo, teman belajarmu"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-primary text-on-primary font-metadata text-[10px] font-bold tracking-wide uppercase">
                Mimo Siap Bantu
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
              <div className="relative inline-block bg-surface p-4 rounded-xl shadow-sm text-primary max-w-2xl">
                <p className="font-mimo-voice text-mimo-voice text-primary leading-relaxed">
                  {
                    "Mimo membaca teks yang diekstrak dari PDF atau teks tempel. Sumber disimpan agar penjelasan dapat diperiksa kembali."
                  }
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-sm pt-1">
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/90 hover:bg-surface text-primary font-label text-[13px] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => {
                    setKind("text");
                    setFile(null);
                    setText(
                      "Fotosintesis menggunakan energi cahaya untuk mengubah air dan karbon dioksida menjadi gula. Klorofil menyerap cahaya. Proses ini menghasilkan oksigen.",
                    );
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    visibility
                  </span>
                  <span>Lihat Contoh Materi yang Bagus</span>
                </button>
                <span className="font-metadata text-[12px] text-on-secondary-container">
                  Tip: 1 bab catatan cukup sekitar 2–5 halaman.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              <div className="flex p-1.5 rounded-2xl bg-surface-container-high gap-1">
                <button
                  className="flex-1 py-2.5 px-3 rounded-xl bg-surface text-primary font-label text-label font-bold shadow-sm flex items-center justify-center gap-2 transition-all"
                  type="button"
                  onClick={() => {
                    setKind("pdf");
                  }}
                  aria-pressed={kind === "pdf"}
                >
                  {
                    <>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                      >
                        upload_file
                      </span>
                      Unggah Berkas PDF
                    </>
                  }
                </button>
                <button
                  className="flex-1 py-2.5 px-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface/50 font-label text-label flex items-center justify-center gap-2 transition-all"
                  type="button"
                  onClick={() => {
                    setKind("text");
                    setFile(null);
                  }}
                  aria-pressed={kind === "text"}
                >
                  {
                    <>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                      >
                        edit_note
                      </span>
                      Tempel Teks Mandiri
                    </>
                  }
                </button>
              </div>

              <div
                className="relative bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col items-center justify-center text-center gap-space-md transition-all group cursor-pointer hover:bg-surface-container-low"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(200, 232, 206, 0.25) 0%, transparent 70%)",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) {
                    setFile(f);
                    setKind("pdf");
                  }
                }}
              >
                {kind === "pdf" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[48px] text-secondary"
                    >
                      cloud_upload
                    </span>
                    <p className="font-card-title text-card-title text-primary">
                      Tarik dan lepaskan PDF berbasis teks ke sini
                    </p>
                    <p className="font-metadata text-metadata text-text-secondary">
                      Maksimal 4 MB, 50 halaman. PDF pindai memerlukan versi
                      teks.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
                    >
                      Pilih File PDF
                    </button>
                    <input
                      ref={fileInput}
                      aria-label="File PDF"
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </>
                ) : (
                  <label className="flex flex-col gap-space-sm w-full text-left font-label text-label text-primary">
                    Teks materi
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={100000}
                      rows={10}
                      placeholder="Tempel materi dari catatan sekolah..."
                      className="w-full p-space-md rounded-xl bg-surface-container-low font-body text-body text-primary"
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {file && (
                  <>
                    <h2 className="font-label text-label text-primary">
                      Berkas yang Siap Disesuaikan
                    </h2>
                    <div className="bg-surface rounded-2xl p-space-md flex items-center justify-between gap-space-md">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[32px] text-secondary"
                      >
                        picture_as_pdf
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-label text-label text-primary break-words">
                          {file.name}
                        </p>
                        <p className="font-metadata text-metadata text-text-secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                        </p>
                      </div>
                      <button
                        aria-label="Hapus berkas"
                        type="button"
                        onClick={() => setFile(null)}
                        className="w-9 h-9 rounded-xl bg-surface-container text-primary"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                <h2 className="font-section-title text-section-title text-primary">
                  Personalisasi Materi Belajar
                </h2>
                <p className="font-body text-body text-text-secondary">
                  Beri judul agar materi mudah ditemukan. Konsep dan pelajaran
                  disusun dari sumber yang kamu berikan.
                </p>
                <label className="flex flex-col gap-space-sm font-label text-label text-primary">
                  Judul
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={160}
                    required
                    className="w-full h-11 px-space-md rounded-xl bg-surface-container-low font-body text-body"
                  />
                </label>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-space-xs text-primary">
                  <span
                    className="material-symbols-outlined text-secondary text-[22px]"
                    aria-hidden="true"
                  >
                    psychology_alt
                  </span>
                  <h2 className="font-card-title text-card-title">
                    Cara Mimo Menyiapkan Materimu
                  </h2>
                </div>
                <ol className="flex flex-col gap-space-md">
                  <li className="flex items-start gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label text-[14px] text-primary font-bold">
                        Membaca Teks &amp; Diagram
                      </span>
                      <span className="font-metadata text-metadata text-text-secondary leading-snug">
                        {
                          "Mimo membaca teks yang diekstrak dari PDF atau teks tempel. Sumber disimpan agar penjelasan dapat diperiksa kembali."
                        }
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label text-[14px] text-primary font-bold">
                        Membagi Modul 10–15 Menit
                      </span>
                      <span className="font-metadata text-metadata text-text-secondary leading-snug">
                        Bab yang panjang dipecah jadi bagian kecil agar otakmu
                        tidak cepat lelah atau tertekan.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label text-[14px] text-primary font-bold">
                        Penerapan Tipografi Tenang
                      </span>
                      <span className="font-metadata text-metadata text-text-secondary leading-snug">
                        Mengikuti setelan font OpenDyslexic atau kontras tinggi
                        sesuai preferensi kenyamananmu.
                      </span>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-2">
                <div className="flex items-center gap-space-xs text-primary">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px]"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                  <span className="font-label text-label font-bold">
                    Jaminan Privasi Siswa
                  </span>
                </div>
                <p className="font-metadata text-metadata text-text-secondary leading-relaxed">
                  Catatan dan tugasmu hanya disimpan untuk akun belajarmu.
                  TemanBelajar tidak pernah menjual atau melatih model
                  kecerdasan buatan publik menggunakan dokumen pribadimu.
                </p>
              </div>

              <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-metadata text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Contoh Hasil Zine Belajar
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-peach/40 text-primary font-metadata text-[11px] font-bold">
                    IPA Biologi
                  </span>
                </div>
                <div className="flex items-center gap-space-sm p-space-xs rounded-xl bg-surface-container-low">
                  <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-primary">
                    <span
                      className="material-symbols-outlined text-[24px]"
                      aria-hidden="true"
                    >
                      nature
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label text-[13px] text-primary font-bold truncate">
                      Fotosintesis &amp; Klorofil
                    </span>
                    <span className="font-metadata text-[11px] text-text-secondary truncate">
                      3 bagian ringkas • Glosarium siap
                    </span>
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-between text-secondary hover:text-primary font-label text-[12px] pt-1"
                  type="button"
                  disabled={busy}
                  onClick={onBack}
                >
                  <span>Buka Pratinjau Zine</span>
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-30 w-full mt-space-md">
            <div className="bg-surface/95 backdrop-blur-md rounded-2xl p-space-md shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm text-text-secondary font-metadata text-metadata text-center sm:text-left">
                <span
                  className="material-symbols-outlined text-secondary text-[20px] hidden sm:inline"
                  aria-hidden="true"
                >
                  schedule
                </span>
                <span>
                  Proses perapian materi biasanya memakan waktu{" "}
                  <strong>15–30 detik</strong>.
                </span>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-initial h-12 px-space-lg rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={onBack}
                >
                  Batal dan Kembali
                </button>
                <button
                  className="flex-1 sm:flex-initial h-12 px-space-xl rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={onSubmit}
                >
                  {
                    <>
                      Simpan sumber materi
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        arrow_forward
                      </span>
                    </>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {validation && (
        <p role="alert" className="notice">
          {validation}
        </p>
      )}
    </div>
  );
}
