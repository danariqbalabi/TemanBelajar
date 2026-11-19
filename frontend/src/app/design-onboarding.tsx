"use client";
import { Brand } from "./brand";
import { MimoMascot } from "./mimo-mascot";
import { useEffect, useState } from "react";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
import { readingStyle } from "./reading-style";
import { type Profile, type Preferences } from "@/lib/types";
export function OnboardingDesign({
  initial,
  onSave,
  busy,
  error,
  onBack,
}: {
  initial: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
  onBack?: () => void;
}) {
  const [step, setStep] = useState(0),
    [value, setValue] = useState(initial),
    [needs, setNeeds] = useState<string[]>(() => {
      const prefs = initial.preferences;
      const primary = { reading: "membaca", focus: "fokus", transcript: "audio", standard: "kartu", explore: "deskripsi" }[prefs.mode];
      return [
        ...(prefs.reading_ruler && primary !== "membaca" ? ["membaca"] : []),
        ...(prefs.letter_spacing > 0 ? ["renggang"] : []),
        primary,
      ];
    }),
    [issue, setIssue] = useState("");
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [],
  );
  function goto(next: number) {
    if (!value.display_name.trim()) {
      setIssue("Isi nama panggilan terlebih dahulu.");
      return;
    }
    setIssue("");
    setStep(next);
    window.scrollTo({ top: 0 });
  }
  function finish() {
    onSave({
      ...value,
      display_name: value.display_name.trim(),
      onboarding_step: 4,
    });
  }
  function pref(p: Partial<Preferences>) {
    setValue({ ...value, preferences: { ...value.preferences, ...p } });
  }
  function toggleNeed(key: string) {
    const selected = needs.includes(key)
      ? needs.filter((need) => need !== key)
      : key === "biasa"
        ? ["biasa"]
        : [...needs.filter((need) => need !== "biasa"), key];
    setNeeds(selected);
    if (key === "renggang") {
      pref({ letter_spacing: selected.includes(key) ? Math.max(value.preferences.letter_spacing, 0.06) : 0 });
      return;
    }
    const modes = {
      membaca: "reading",
      fokus: "focus",
      audio: "transcript",
      kartu: "standard",
      deskripsi: "explore",
      biasa: "standard",
    } as const;
    const preferred = selected.filter(need => need !== "renggang").at(-1) as keyof typeof modes | undefined;
    pref({
      reading_ruler: selected.includes("membaca"),
      ...(key === "biasa" ? { letter_spacing: 0 } : {}),
      mode: preferred ? modes[preferred] : "standard",
      ...(selected.includes("fokus") ? { reduced_motion: true } : {}),
    });
  }

  function toggleSubject(s: string) {
    setValue({
      ...value,
      subjects: value.subjects.includes(s)
        ? value.subjects.filter((x) => x !== s)
        : [...value.subjects, s],
    });
  }
  function toggleDay(day: number) {
    setValue({
      ...value,
      available_days: value.available_days.includes(day)
        ? value.available_days.filter((x) => x !== day)
        : [...value.available_days, day],
    });
  }
  function speak() {
    if (!("speechSynthesis" in window)) {
      setIssue("Baca nyaring belum tersedia di browser ini.");
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      "Cahaya menyediakan energi untuk fotosintesis. Klorofil membantu menyerap energi cahaya.",
    );
    speech.lang = "id-ID";
    speech.rate = value.preferences.speech_rate;
    speechSynthesis.speak(speech);
  }
  const stepNames = ["Cara belajar", "Tampilan", "Ritme", "Ringkasan"];
  const nextLabels = [
    "Simpan & Lanjut ke Aksesibilitas",
    "Pakai Pengaturan Ini & Lanjut",
    "Lihat Rencana Belajarku",
    "Lanjut ke Beranda Utama",
  ];
  const options = [
    {
      id: "membaca",
      title: "Membaca santai",
      icon: "auto_stories",
      text: "Teks lapang dan penggaris baca.",
    },
    {
      id: "renggang",
      title: "Renggangkan huruf",
      icon: "format_size",
      text: "Tambah jarak antarhuruf saat membaca dan latihan.",
    },
    {
      id: "fokus",
      title: "Satu langkah dulu",
      icon: "view_carousel",
      text: "Satu bagian setiap langkah.",
    },
    {
      id: "audio",
      title: "Dengar sambil baca",
      icon: "headphones",
      text: "Transkrip dan baca nyaring.",
    },
    {
      id: "kartu",
      title: "Bacaan lengkap",
      icon: "article",
      text: "Seluruh konsep dalam satu tempat.",
    },
    {
      id: "deskripsi",
      title: "Jelajah visual",
      icon: "hub",
      text: "Diagram dan penjelasannya.",
    },
    {
      id: "biasa",
      title: "Setelan standar",
      icon: "tune",
      text: "Mulai dengan tampilan bawaan.",
    },
  ];
  return (
    <div
      className={`stitch-shell final-design studio-playground onboarding-shell ${value.preferences.reduced_motion ? "calm" : ""} ${value.preferences.high_contrast ? "high-contrast" : ""}`}
      aria-busy={busy}
    >
      <header className="workspace-auth-header">
        <button onClick={onBack} aria-label="TemanBelajar - Beranda">
          <Brand />
        </button>
        <button className="workspace-button" onClick={onBack}>
          Kembali ke beranda
        </button>
      </header>
      <Workspace screen={step + 3}>
        <nav
          className="workspace-onboarding-steps"
          aria-label="Langkah preferensi"
        >
          {stepNames.map((name, index) => (
            <span
              key={name}
              aria-current={index === step ? "step" : undefined}
              data-done={index < step}
            >
              <b>{index + 1}</b>
              <span>{name}</span>
            </span>
          ))}
        </nav>
        <WorkspaceHeading
          title={
            [
              "Belajar nyaman, mulai dari kamu",
              "Atur tampilan bacaan",
              "Temukan ritme belajarmu",
              "Preferensimu siap",
            ][step]
          }
          description={
            [
              "Pilih bantuan yang ingin kamu coba.",
              "Coba setelannya di pratinjau.",
              "Mulai kecil. Bisa diubah kapan saja.",
              "Periksa pilihanmu sebelum menyimpan.",
            ][step]
          }
        />
        {(error || issue) && (
          <p className="workspace-inline-error" role="alert">
            {error || issue}
          </p>
        )}
        {step === 0 && (
          <>
            <label className="workspace-field workspace-name-field">
              Nama panggilan
              <input
                maxLength={80}
                value={value.display_name}
                disabled={busy}
                onChange={(e) =>
                  setValue({ ...value, display_name: e.target.value })
                }
              />
            </label>
            <div className="workspace-needs-grid">
              {options.map((option) => (
                <button
                  key={option.id}
                  className="workspace-need"
                  aria-pressed={needs.includes(option.id)}
                  onClick={() => toggleNeed(option.id)}
                  disabled={busy}
                >
                  <UiIcon name={option.icon} />
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                  <span className="workspace-need-check" aria-hidden="true">
                    {needs.includes(option.id) ? "\u2713" : "+"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <div className="workspace-secondary-grid">
            <section className="workspace-panel workspace-onboarding-options">
              <h2>Tampilan teks</h2>
              <label className="workspace-field">
                Jenis huruf
                <select
                  value={value.preferences.font_family}
                  onChange={(e) =>
                    pref({
                      font_family: e.target.value as Preferences["font_family"],
                    })
                  }
                >
                  <option value="jakarta">Plus Jakarta Sans</option>
                  <option value="nunito">Nunito</option>
                  <option value="system">Font perangkat</option>
                </select>
              </label>
              <label className="workspace-field">
                Ukuran teks: {value.preferences.font_size}px
                <input
                  type="range"
                  min={14}
                  max={32}
                  value={value.preferences.font_size}
                  onChange={(e) => pref({ font_size: +e.target.value })}
                />
              </label>
              <label className="workspace-field">
                Jarak baris: {value.preferences.line_height}
                <input
                  type="range"
                  min={1.2}
                  max={2.5}
                  step={0.1}
                  value={value.preferences.line_height}
                  onChange={(e) => pref({ line_height: +e.target.value })}
                />
              </label>
              <label className="workspace-check">
                <input
                  type="checkbox"
                  checked={value.preferences.reading_ruler}
                  onChange={(e) => pref({ reading_ruler: e.target.checked })}
                />
                Penggaris baca
              </label>
              <label className="workspace-check">
                <input
                  type="checkbox"
                  checked={value.preferences.high_contrast}
                  onChange={(e) => pref({ high_contrast: e.target.checked })}
                />
                Kontras tinggi
              </label>
              <label className="workspace-check">
                <input
                  type="checkbox"
                  checked={value.preferences.reduced_motion}
                  onChange={(e) => pref({ reduced_motion: e.target.checked })}
                />
                Kurangi animasi
              </label>
              <details className="workspace-disclosure">
                <summary>Lebar bacaan & audio</summary>
                <label className="workspace-field">
                  Lebar bacaan
                  <input
                    type="range"
                    min={40}
                    max={80}
                    value={value.preferences.reading_width}
                    onChange={(e) => pref({ reading_width: +e.target.value })}
                  />
                </label>
                <label className="workspace-field">
                  Kecepatan suara
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={value.preferences.speech_rate}
                    onChange={(e) => pref({ speech_rate: +e.target.value })}
                  />
                </label>
                <button className="workspace-button" onClick={speak}>
                  Coba suara
                </button>
              </details>
            </section>
            <section className="workspace-panel workspace-onboarding-preview">
              <span className="workspace-eyebrow">Pratinjau</span>
              <div
                data-reading-preview
                style={{
                  ...readingStyle(value.preferences),
                  background: value.preferences.high_contrast
                    ? "white"
                    : undefined,
                  color: value.preferences.high_contrast
                    ? "#10251b"
                    : undefined,
                }}
              >
                <h2>Cahaya dan tumbuhan</h2>
                <p
                  className={
                    value.preferences.reading_ruler
                      ? "workspace-preview-ruler"
                      : ""
                  }
                >
                  Cahaya menyediakan energi untuk fotosintesis. Klorofil
                  membantu menyerap energi cahaya.
                </p>
              </div>
            </section>
          </div>
        )}
        {step === 2 && (
          <div className="workspace-secondary-grid">
            <section className="workspace-panel workspace-onboarding-options">
              <h2>Mata pelajaran</h2>
              <div className="workspace-subject-options">
                {[
                  "IPA",
                  "Matematika",
                  "Bahasa Indonesia",
                  "Bahasa Inggris",
                  "IPS",
                ].map((subject) => (
                  <button
                    className="workspace-button"
                    key={subject}
                    aria-pressed={value.subjects.includes(subject)}
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <label className="workspace-field">
                Tujuan belajar
                <textarea
                  rows={3}
                  maxLength={500}
                  value={value.goal}
                  onChange={(e) => setValue({ ...value, goal: e.target.value })}
                  placeholder="Apa yang ingin kamu pahami?"
                />
              </label>
            </section>
            <section className="workspace-panel workspace-onboarding-options">
              <h2>Waktu belajar</h2>
              <label className="workspace-field">
                Menit per hari
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={value.daily_minutes}
                  onChange={(e) =>
                    setValue({ ...value, daily_minutes: +e.target.value })
                  }
                />
              </label>
              <fieldset className="workspace-days-field">
                <legend>Hari belajar</legend>
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                  (day, index) => (
                    <button
                      key={day}
                      aria-pressed={value.available_days.includes(index)}
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </button>
                  ),
                )}
              </fieldset>
              <label className="workspace-field">
                Tanggal ujian (opsional)
                <input
                  type="date"
                  value={value.exam_date || ""}
                  onChange={(e) =>
                    setValue({ ...value, exam_date: e.target.value || null })
                  }
                />
              </label>
            </section>
          </div>
        )}
        {step === 3 && (
          <div className="workspace-onboarding-review">
            <section className="workspace-study-card" data-tone="mint">
              <span className="workspace-study-art">
                <UiIcon name="task_alt" />
              </span>
              <h2>{value.display_name}, siap mulai?</h2>
              <p className="workspace-muted">
                Preferensi ini bisa diubah di Pengaturan.
              </p>
            </section>
            <section className="workspace-panel">
              <dl className="workspace-review-definition">
                <div>
                  <dt>Mata pelajaran</dt>
                  <dd>{value.subjects.join(", ") || "Belum dipilih"}</dd>
                </div>
                <div>
                  <dt>Ritme belajar</dt>
                  <dd>
                    {value.daily_minutes} menit / {value.available_days.length}{" "}
                    hari
                  </dd>
                </div>
                <div>
                  <dt>Tampilan</dt>
                  <dd>
                    {value.preferences.font_size}px ?{" "}
                    {value.preferences.font_family === "nunito"
                      ? "Nunito"
                      : value.preferences.font_family === "system"
                        ? "Font perangkat"
                        : "Plus Jakarta Sans"}
                  </dd>
                </div>
                <div>
                  <dt>Tujuan</dt>
                  <dd>{value.goal || "Belajar sesuai ritmeku"}</dd>
                </div>
              </dl>
            </section>
          </div>
        )}
        <footer className="workspace-selection-bar">
          <button
            className="workspace-button"
            disabled={busy}
            onClick={() => (step ? goto(step - 1) : onBack?.())}
          >
            {step ? "Sebelumnya" : "Nanti saja"}
          </button>
          <a
            href="#"
            className="workspace-button primary"
            aria-disabled={busy}
            onClick={(e) => {
              e.preventDefault();
              if (busy) return;
              if (
                step === 2 &&
                (!value.subjects.length ||
                  value.daily_minutes < 5 ||
                  value.daily_minutes > 240)
              ) {
                setIssue("Pilih mata pelajaran dan waktu 5 sampai 240 menit.");
                return;
              }
              if (step === 3) finish();
              else goto(step + 1);
            }}
          >
            {nextLabels[step]}
            <UiIcon name="arrow_forward" />
          </a>
        </footer>
      </Workspace>
      {value.preferences.show_mimo && (
        <MimoMascot
          variant="dock"
          context="Preferensi"
          reducedMotion={value.preferences.reduced_motion}
        />
      )}
    </div>
  );
}
