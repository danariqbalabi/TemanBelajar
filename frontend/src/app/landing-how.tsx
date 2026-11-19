"use client";
import { useState } from "react";
import { UiIcon } from "./workspace-ui";

const previews = [
  {
    name: "Baca",
    icon: "auto_stories",
    heading: "Cahaya jadi energi.",
    detail: "Tumbuhan memakai cahaya untuk membuat makanan.",
  },
  {
    name: "Fokus",
    icon: "view_carousel",
    heading: "Satu konsep dulu.",
    detail: "Cahaya adalah sumber energi fotosintesis.",
  },
  {
    name: "Audio",
    icon: "headphones",
    heading: "Dengar sambil baca.",
    detail: "Baca nyaring mengikuti pengaturan perangkatmu.",
  },
];

export function LandingHow() {
  const [mode, setMode] = useState(0);
  const [reason, setReason] = useState(false);
  const [tomorrow, setTomorrow] = useState(false);
  return (
    <section
      id="cara-kerja"
      className="landing-how"
      aria-labelledby="cara-kerja-title"
    >
      <header className="landing-how-heading">
        <div>
          <span className="landing-how-kicker">CARANYA SESIMPEL INI</span>
          <h2 id="cara-kerja-title">Belajar, pakai caramu.</h2>
        </div>
        <p>
          Coba klik elemennya.
          <br />
          Ini contoh interaksi, bukan progres akunmu.
        </p>
      </header>
      <div className="landing-how-grid">
        <article className="landing-how-format">
          <div className="landing-how-card-top">
            <span className="landing-how-number">01 / CARA BELAJAR</span>
            <span className="landing-how-spark" aria-hidden="true">
              ✳
            </span>
          </div>
          <h3>
            Satu materi.
            <br />
            Banyak cara masuknya.
          </h3>
          <div className="landing-how-preview" data-mode={mode}>
            <span className="landing-how-paper-clip" aria-hidden="true" />
            <div className="landing-how-paper">
              <span className="landing-how-paper-label">
                CATATAN KECIL / IPA
              </span>
              <span className="landing-how-preview-icon">
                <UiIcon name={previews[mode].icon} />
              </span>
              <strong>{previews[mode].heading}</strong>
              <p>{previews[mode].detail}</p>
              <div className="landing-how-preview-lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              {mode === 2 && (
                <div className="landing-how-wave" aria-hidden="true">
                  {[12, 22, 16, 30, 20, 36, 24, 14, 28, 18, 32, 12].map(
                    (height, index) => (
                      <i key={index} style={{ height }} />
                    ),
                  )}
                </div>
              )}
              {mode === 1 && (
                <span className="landing-how-focus-tag">01 / 03</span>
              )}
            </div>
            <span className="landing-how-sticker" aria-hidden="true">
              <UiIcon name="psychology_alt" />
              ritmemu
              <br />
              sendiri
            </span>
          </div>
          <div className="landing-how-modes" aria-label="Contoh format belajar">
            {previews.map((preview, index) => (
              <button
                key={preview.name}
                aria-pressed={mode === index}
                onClick={() => setMode(index)}
              >
                <UiIcon name={preview.icon} />
                {preview.name}
              </button>
            ))}
          </div>
          <p className="landing-how-caption">
            Ganti cara, tetap di materi yang sama.
          </p>
        </article>
        <article className="landing-how-reason">
          <div className="landing-how-card-top">
            <span className="landing-how-number">02 / LANGKAH BERIKUTNYA</span>
            <span className="landing-how-orbit" aria-hidden="true">
              <UiIcon name="explore" />
            </span>
          </div>
          <h3>
            Saran yang
            <br />
            bisa kamu mengerti.
          </h3>
          <div className="landing-how-suggestion">
            <span className="landing-how-mini-icon">
              <UiIcon name="eco" />
            </span>
            <div>
              <span>CONTOH SARAN</span>
              <strong>Tinjau peran cahaya</strong>
            </div>
            <button
              aria-label="Lihat alasan contoh rekomendasi"
              aria-expanded={reason}
              onClick={() => setReason(!reason)}
            >
              <UiIcon name={reason ? "remove" : "add"} />
            </button>
          </div>
          {reason ? (
            <p className="landing-how-reason-text" role="status">
              Contohnya, jika jawaban tentang sumber energi belum tepat, kamu
              diajak meninjau konsep cahaya.
            </p>
          ) : (
            <p className="landing-how-caption">
              Ada alasan di balik setiap langkah. Klik + untuk melihatnya.
            </p>
          )}
        </article>
        <article className="landing-how-time">
          <div className="landing-how-card-top">
            <span className="landing-how-number">03 / WAKTU BELAJAR</span>
            <span className="landing-how-doodle" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="landing-how-time-layout">
            <div>
              <h3>
                Hari ini penuh?
                <br />
                Besok juga boleh.
              </h3>
              <button
                className="landing-how-reschedule"
                onClick={() => setTomorrow(!tomorrow)}
              >
                <UiIcon name="event_repeat" />
                {tomorrow ? "Kembalikan ke hari ini" : "Coba geser ke besok"}
              </button>
            </div>
            <div className="landing-how-calendar" aria-live="polite">
              <span>{tomorrow ? "BESOK" : "HARI INI"}</span>
              <strong>
                15<span>menit</span>
              </strong>
              <div>
                <i />
                <i />
                <i />
              </div>
              <span className="landing-how-calendar-check">
                <UiIcon name="check" />
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
