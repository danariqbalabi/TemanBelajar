"use client";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { auth } from "@/lib/api";
import type { Profile, Preferences } from "@/lib/types";
import type { Run } from "./page";
export function Mimo() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="mimo-svg"
      role="img"
      aria-label="Mimo, teman belajarmu"
    >
      <path
        d="M22 69Q9 41 29 27L28 12 44 24Q70 13 82 37Q96 69 74 83Q44 99 22 69Z"
        fill="#91af87"
        stroke="#435a49"
        strokeWidth="3"
      />
      <ellipse cx="55" cy="65" rx="23" ry="20" fill="#c8d8ad" />
      <circle cx="38" cy="43" r="4" fill="#273b35" />
      <circle cx="67" cy="40" r="4" fill="#273b35" />
      <path
        d="M46 50Q54 60 62 49"
        fill="none"
        stroke="#435a49"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="30" cy="51" rx="7" ry="4" fill="#e8a69a" />
      <ellipse cx="75" cy="48" rx="7" ry="4" fill="#e8a69a" />
    </svg>
  );
}
export function Account({
  landing,
  onContinue,
  run,
  busy,
  error,
}: {
  landing: boolean;
  onContinue: () => void;
  run: Run;
  busy: boolean;
  error: string;
}) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [signup, setSignup] = useState(false),
    [message, setMessage] = useState("");
  return (
    <main className="welcome">
      <div className="brand">
        <span className="brand-mark">tb</span>TemanBelajar
      </div>
      {landing ? (
        <section className="landing-hero">
          <span className="pill">TEMAN BELAJAR ADAPTIF SMP &amp; SMA</span>
          <Mimo />
          <h1>
            Belajar dengan caramu.
            <br />
            Tumbuh dengan ritmemu.
          </h1>
          <p>
            Materi terasa panjang? Mulai satu konsep bersama Mimo. Pilih membaca
            santai, fokus satu langkah, atau dengarkan penjelasannya.
          </p>
          <div className="actions">
            <button className="primary" onClick={onContinue}>
              Mulai perjalananmu →
            </button>
            <button
              disabled={busy || !auth}
              onClick={() =>
                run(async () => {
                  const { error } = await auth!.auth.signInAnonymously();
                  if (error) throw error;
                })
              }
            >
              Coba demo tanpa email
            </button>
          </div>
          <div className="feature-row">
            <span>Tanpa timer wajib</span>
            <span>Format yang fleksibel</span>
            <span>Tanpa rasa bersalah</span>
          </div>
        </section>
      ) : (
        <section>
          <h1>{signup ? "Buat ruang belajarmu" : "Selamat datang kembali"}</h1>
          <p>Mimo siap menemani langkah kecilmu hari ini.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                if (!auth) throw Error("Layanan akun belum tersedia.");
                const result = signup
                  ? await auth.auth.signUp({
                      email,
                      password,
                      options: { emailRedirectTo: window.location.origin },
                    })
                  : await auth.auth.signInWithPassword({ email, password });
                if (result.error) throw result.error;
                if (signup && !result.data.session)
                  setMessage(
                    "Periksa email untuk mengonfirmasi akun, lalu masuk kembali.",
                  );
              });
            }}
          >
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Kata sandi
              <input
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="primary" disabled={busy || !auth}>
              {signup ? "Daftar" : "Masuk"}
            </button>
          </form>
          <div className="actions">
            <button disabled={busy} onClick={() => setSignup(!signup)}>
              {signup ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
            <button
              disabled={busy || !auth}
              onClick={() =>
                run(async () => {
                  const { error } = await auth!.auth.signInAnonymously();
                  if (error) throw error;
                })
              }
            >
              Coba demo
            </button>
            <button
              disabled={busy || !auth || !email}
              onClick={() =>
                run(async () => {
                  const { error } = await auth!.auth.signInWithOtp({
                    email,
                    options: {
                      emailRedirectTo: window.location.origin,
                      shouldCreateUser: false,
                    },
                  });
                  if (error) throw error;
                  setMessage("Tautan masuk sudah dikirim. Periksa emailmu.");
                })
              }
            >
              Kirim tautan masuk
            </button>
          </div>
          {message && <p role="status">{message}</p>}
        </section>
      )}
      {!auth && (
        <p className="notice">
          Layanan akun belum dikonfigurasi. Isi konfigurasi publik Supabase pada
          frontend untuk melanjutkan.
        </p>
      )}
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      <p>Istirahat juga bagian dari belajar.</p>
    </main>
  );
}
function PreferenceFields({
  value,
  onChange,
}: {
  value: Preferences;
  onChange: (p: Preferences) => void;
}) {
  const update = <K extends keyof Preferences>(key: K, v: Preferences[K]) =>
    onChange({ ...value, [key]: v });
  return (
    <>
      <label>
        Format awal
        <select
          value={value.mode}
          onChange={(e) =>
            update("mode", e.target.value as Preferences["mode"])
          }
        >
          <option value="reading">Membaca santai</option>
          <option value="standard">Standar</option>
          <option value="focus">Fokus satu langkah</option>
        </select>
      </label>
      <label>
        Ukuran teks
        <input
          type="range"
          min={14}
          max={32}
          value={value.font_size}
          onChange={(e) => update("font_size", +e.target.value)}
        />
        <output>{value.font_size}px</output>
      </label>
      <label>
        Jarak baris
        <input
          type="range"
          min={1.2}
          max={2.5}
          step={0.1}
          value={value.line_height}
          onChange={(e) => update("line_height", +e.target.value)}
        />
        <output>{value.line_height}</output>
      </label>
      <label>
        Jenis huruf
        <select
          value={value.font_family}
          onChange={(e) =>
            update("font_family", e.target.value as Preferences["font_family"])
          }
        >
          <option value="jakarta">Jakarta Sans</option>
          <option value="nunito">Nunito</option>
          <option value="system">Sistem perangkat</option>
        </select>
      </label>
      <label>
        Lebar bacaan
        <input
          type="range"
          min={40}
          max={80}
          value={value.reading_width}
          onChange={(e) => update("reading_width", +e.target.value)}
        />
        <output>{value.reading_width} karakter</output>
      </label>
      <label>
        Jarak huruf
        <input
          type="range"
          min={0}
          max={0.2}
          step={0.01}
          value={value.letter_spacing}
          onChange={(e) => update("letter_spacing", +e.target.value)}
        />
      </label>
      <label>
        Kecepatan baca nyaring
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={value.speech_rate}
          onChange={(e) => update("speech_rate", +e.target.value)}
        />
        <output>{value.speech_rate}×</output>
      </label>
      {(
        [
          ["high_contrast", "Kontras tinggi"],
          ["reduced_motion", "Redam animasi"],
          ["reading_ruler", "Penggaris baca"],
          ["timer_enabled", "Tampilkan timer opsional"],
          ["show_mimo", "Tampilkan Mimo"],
          ["captions", "Tampilkan transkrip"],
        ] as const
      ).map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => update(key, e.target.checked)}
          />
        </label>
      ))}
      <div
        className="preview-reading"
        style={{
          fontSize: value.font_size,
          lineHeight: value.line_height,
          letterSpacing: `${value.letter_spacing}em`,
          color: value.high_contrast ? "#101a16" : undefined,
        }}
      >
        Satu langkah kecil hari ini sudah berarti. Kamu bebas menyesuaikan ritme
        belajar.
      </div>
    </>
  );
}
function GoalFields({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (p: Profile) => void;
}) {
  return (
    <>
      <label>
        Waktu harian (menit)
        <input
          type="number"
          required
          min={5}
          max={240}
          value={value.daily_minutes}
          onChange={(e) =>
            onChange({ ...value, daily_minutes: +e.target.value })
          }
        />
      </label>
      <label>
        Tujuan belajar
        <textarea
          maxLength={500}
          value={value.goal}
          onChange={(e) => onChange({ ...value, goal: e.target.value })}
          placeholder="Misalnya: lebih memahami materi IPA tanpa terburu-buru"
        />
      </label>
      <label>
        Tanggal ujian (opsional)
        <input
          type="date"
          value={value.exam_date || ""}
          onChange={(e) =>
            onChange({ ...value, exam_date: e.target.value || null })
          }
        />
      </label>
      <fieldset>
        <legend>Hari belajar pilihan</legend>
        <div className="day-picker">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
            <label key={d}>
              <input
                type="checkbox"
                checked={value.available_days.includes(i)}
                onChange={(e) =>
                  onChange({
                    ...value,
                    available_days: e.target.checked
                      ? [...value.available_days, i]
                      : value.available_days.filter((x) => x !== i),
                  })
                }
              />
              {d}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
export function Onboarding({
  initial,
  onSave,
  busy,
  error,
}: {
  initial: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
}) {
  const [step, setStep] = useState(0),
    [value, setValue] = useState(initial);
  return (
    <main className="welcome">
      <div className="brand">TemanBelajar</div>
      <section>
        <span className="pill">LANGKAH {step + 1} DARI 4</span>
        <h1>
          {
            [
              "Kenalan dulu, yuk.",
              "Bikin nyaman ruang bacamu.",
              "Apa langkah kecilmu?",
              "Rencana awalmu siap.",
            ][step]
          }
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) setStep(step + 1);
            else
              onSave({
                ...value,
                display_name: value.display_name.trim(),
                onboarding_step: 4,
              });
          }}
        >
          {step === 0 ? (
            <>
              <label>
                Nama panggilan
                <input
                  required
                  maxLength={80}
                  value={value.display_name}
                  onChange={(e) =>
                    setValue({ ...value, display_name: e.target.value })
                  }
                />
              </label>
              <fieldset>
                <legend>Pelajaran yang ingin kamu pelajari</legend>
                <div className="day-picker">
                  {[
                    "IPA",
                    "Matematika",
                    "Bahasa Indonesia",
                    "Bahasa Inggris",
                    "IPS",
                  ].map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        checked={value.subjects.includes(s)}
                        onChange={(e) =>
                          setValue({
                            ...value,
                            subjects: e.target.checked
                              ? [...value.subjects, s]
                              : value.subjects.filter((x) => x !== s),
                          })
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p>Pilih sesuai kebutuhanmu. Semua pilihan bisa diubah nanti.</p>
            </>
          ) : step === 1 ? (
            <PreferenceFields
              value={value.preferences}
              onChange={(preferences) => setValue({ ...value, preferences })}
            />
          ) : step === 2 ? (
            <GoalFields value={value} onChange={setValue} />
          ) : (
            <>
              <Mimo />
              <h2>Halo, {value.display_name}!</h2>
              <p>
                Kita mulai dengan {value.daily_minutes} menit per hari. Pilih
                materi contoh atau unggah materi dari sekolah. Rencana selalu
                bisa ditinjau dan diubah.
              </p>
              <dl>
                <dt>Pelajaran pilihan</dt>
                <dd>{value.subjects.join(", ") || "Belum dipilih"}</dd>
                <dt>Tujuanmu</dt>
                <dd>{value.goal || "Mulai belajar dengan nyaman"}</dd>
              </dl>
            </>
          )}
          <div className="actions">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                ← Kembali
              </button>
            )}
            <button
              className="primary"
              disabled={busy || !value.display_name.trim()}
            >
              {step === 3 ? "Buka ruang belajar →" : "Lanjut →"}
            </button>
          </div>
        </form>
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
export function Settings({
  profile,
  onSave,
  busy,
  account,
  signOut,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  account: Session;
  signOut: () => void;
}) {
  const [value, setValue] = useState(profile);
  return (
    <>
      <h1>Pengaturan</h1>
      <p>Ruang belajar yang mengikuti kebutuhanmu.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(value);
        }}
      >
        <div className="columns">
          <div>
            <section>
              <h2>Profil dan tujuan</h2>
              <label>
                Nama panggilan
                <input
                  required
                  maxLength={80}
                  value={value.display_name}
                  onChange={(e) =>
                    setValue({ ...value, display_name: e.target.value })
                  }
                />
              </label>
              <GoalFields value={value} onChange={setValue} />
            </section>
            <section>
              <h2>Akun</h2>
              <p>
                {account.user.is_anonymous
                  ? "Kamu sedang memakai akun demo anonim. Simpan akses perangkat ini agar progres demo tetap dapat dibuka."
                  : account.user.email}
              </p>
              <button type="button" disabled={busy} onClick={signOut}>
                Keluar dari akun
              </button>
            </section>
          </div>
          <section>
            <h2>Aksesibilitas</h2>
            <PreferenceFields
              value={value.preferences}
              onChange={(preferences) => setValue({ ...value, preferences })}
            />
          </section>
        </div>
        <button className="primary" disabled={busy}>
          Simpan pengaturan
        </button>
      </form>
    </>
  );
}
