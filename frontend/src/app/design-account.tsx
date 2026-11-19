"use client";
import { Brand } from "./brand";
import { MimoMascot } from "./mimo-mascot";
import { useState } from "react";
import { UiIcon } from "./workspace-ui";
import { auth } from "@/lib/api";
import type { Run } from "./page";
export function AccountDesign({
  onBack,
  onDemo,
  run,
  busy,
  error,
}: {
  onBack: () => void;
  onDemo?: () => void;
  run: Run;
  busy: boolean;
  error: string;
}) {
  const [email, setEmail] = useState(""),
    [message, setMessage] = useState("");
  function demo() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.signInAnonymously();
      if (error) throw error;
      onDemo?.();
    });
  }
  function sendLink() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setMessage("Tautan masuk sudah dikirim. Periksa emailmu.");
    });
  }
  return (
    <div className="stitch-shell final-design studio-playground workspace-account">
      <header className="workspace-auth-header">
        <button onClick={onBack} aria-label="Kembali ke beranda">
          <Brand />
        </button>
        <button className="workspace-button" onClick={onBack}>
          <UiIcon name="arrow_back" />
          Kembali
        </button>
      </header>
      <main className="workspace-auth-layout">
        <section className="workspace-auth-art">
          <span className="workspace-eyebrow">TemanBelajar</span>
          <h1>
            Ruang untuk
            <br />
            belajar dengan
            <br />
            caramu.
          </h1>
          <div className="workspace-auth-shapes" aria-hidden="true">
            <span>
              <UiIcon name="auto_stories" />
            </span>
            <span>
              <UiIcon name="headphones" />
            </span>
            <span>
              <UiIcon name="edit_note" />
            </span>
          </div>
        </section>
        <section className="workspace-panel workspace-auth-form">
          <h2>Masuk ke ruang belajarmu</h2>
          <p className="workspace-muted">Kami kirim tautan masuk ke emailmu.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendLink();
            }}
          >
            <label className="workspace-field">
              Alamat Email
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </label>
            <button
              className="workspace-button primary"
              disabled={busy}
              type="submit"
            >
              Kirim Tautan Masuk Ajaib
              <UiIcon name="arrow_forward" />
            </button>
          </form>
          {error && (
            <p role="alert" className="workspace-inline-error">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="workspace-inline-message">
              {message}
            </p>
          )}
          <div className="workspace-auth-divider">
            <span>atau jelajahi dulu</span>
          </div>
          <a
            href="#"
            className="workspace-button"
            aria-disabled={busy}
            onClick={(e) => {
              e.preventDefault();
              if (!busy) demo();
            }}
          >
            Coba Demo Materi Fotosintesis
          </a>
          <p className="workspace-muted">
            Demo membuat ruang belajar sementara untuk menyimpan progresmu.
          </p>
        </section>
      </main>
      <MimoMascot variant="dock" context="Masuk" />
    </div>
  );
}
