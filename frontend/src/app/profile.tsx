"use client";
import Image from "next/image";
import { useState } from "react";
import { Landing } from "./design-landing";
import { AccountDesign } from "./design-account";
import { OnboardingDesign } from "./design-onboarding";
import type { Session } from "@supabase/supabase-js";
import type { Profile, Preferences } from "@/lib/types";
import type { Run } from "./page";
export function Mimo() {
  return (
    <Image
      src="/design/mimo.png"
      width={1024}
      height={1024}
      className="mimo-svg"
      alt="Mimo, bunglon ramah yang duduk di atas buku"
    />
  );
}
export function Account({
  landing,
  onContinue,
  onBack,
  run,
  busy,
  error,
}: {
  landing: boolean;
  onContinue: () => void;
  onBack: () => void;
  run: Run;
  busy: boolean;
  error: string;
}) {
  if (!landing)
    return (
      <AccountDesign onBack={onBack} run={run} busy={busy} error={error} />
    );
  return <Landing onContinue={onContinue} error={error} />;
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
export function Onboarding(props: {
  initial: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
}) {
  return <OnboardingDesign {...props} />;
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
