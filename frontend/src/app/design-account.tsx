"use client";
import { Brand } from "./brand";
import { MimoMascot } from "./mimo-mascot";
import { useState } from "react";
import { UiIcon } from "./workspace-ui";
import { auth } from "@/lib/api";
import { authCallbackUrl } from "@/lib/auth-return";
import type { Run } from "./page";
export function AccountDesign({
  onBack,
  onDemo,
  run,
  busy,
  error,
  onClearError,
}: {
  onBack: () => void;
  onDemo?: () => void;
  run: Run;
  busy: boolean;
  error: string;
  onClearError?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"login" | "register" | "link">("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  function switchMode(next: typeof mode) {
    onClearError?.();
    setMode(next);
    setMessage("");
    setIssue("");
    setPassword("");
    setConfirmation("");
    setConfirmationEmail("");
    setShowPassword(false);
  }
  function demo() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.signInAnonymously();
      if (error) throw error;
      onDemo?.();
    });
  }
  function submit() {
    setIssue("");
    setMessage("");
    if (mode === "register" && (!name.trim() || password !== confirmation)) {
      setIssue(
        !name.trim()
          ? "Isi nama panggilanmu dulu."
          : "Konfirmasi kata sandi belum sama.",
      );
      return;
    }
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const address = email.trim();
      if (mode === "login") {
        const { error } = await auth.auth.signInWithPassword({
          email: address,
          password,
        });
        if (error) throw error;
      } else if (mode === "register") {
        const { data, error } = await auth.auth.signUp({
          email: address,
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: authCallbackUrl(),
          },
        });
        if (error) throw error;
        if (!data.session) {
          setConfirmationEmail(address);
          setMessage(
            "Periksa kotak masuk atau spam untuk mengonfirmasi emailmu. Setelah diklik, tautannya akan membuka ruang belajar. Kalau email sudah terdaftar, gunakan tab Masuk.",
          );
        }
      } else {
        const { error } = await auth.auth.signInWithOtp({
          email: address,
          options: {
            emailRedirectTo: authCallbackUrl(),
            shouldCreateUser: false,
          },
        });
        if (error) throw error;
        setMessage(
          "Kalau email ini sudah terdaftar, tautan masuk akan dikirim. Periksa kotak masuk atau spam. Belum punya akun? Pilih Daftar.",
        );
      }
      setPassword("");
      setConfirmation("");
    });
  }
  function resendConfirmation() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.resend({
        type: "signup",
        email: confirmationEmail,
        options: { emailRedirectTo: authCallbackUrl() },
      });
      if (error) throw error;
      setMessage(
        "Email konfirmasi diminta ulang. Periksa kotak masuk atau spam dan gunakan tautan terbaru.",
      );
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
            Ruang untuk <br />
            belajar dengan <br />
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
          <div className="workspace-auth-tabs" aria-label="Pilihan akun">
            <button
              type="button"
              aria-pressed={mode === "login"}
              disabled={busy}
              onClick={() => switchMode("login")}
            >
              Masuk
            </button>
            <button
              type="button"
              aria-pressed={mode === "register"}
              disabled={busy}
              onClick={() => switchMode("register")}
            >
              Daftar
            </button>
          </div>
          <h2>
            {mode === "register"
              ? "Bikin akun belajarmu"
              : mode === "link"
                ? "Masuk lewat tautan email"
                : "Masuk ke ruang belajarmu"}
          </h2>
          <p className="workspace-muted">
            {mode === "register"
              ? "Simpan progresmu dengan akun email sendiri."
              : mode === "link"
                ? "Kami kirim tautan untuk akun yang sudah terdaftar."
                : "Pakai email dan kata sandi akunmu."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {mode === "register" && (
              <label className="workspace-field">
                Nama panggilan
                <input
                  name="display_name"
                  autoComplete="nickname"
                  required
                  maxLength={80}
                  value={name}
                  disabled={busy}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            <label className="workspace-field">
              Alamat Email
              <input
                id="email-input"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </label>
            {mode !== "link" && (
              <>
                <label className="workspace-field">
                  Kata sandi
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    required
                    minLength={mode === "register" ? 8 : undefined}
                    maxLength={128}
                    value={password}
                    disabled={busy}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-describedby={
                      mode === "register" ? "password-help" : undefined
                    }
                  />
                </label>
                {mode === "register" && (
                  <>
                    <p className="workspace-muted" id="password-help">
                      Minimal 8 karakter. Pakai kata sandi yang unik.
                    </p>
                    <label className="workspace-field">
                      Ulangi kata sandi
                      <input
                        name="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={128}
                        value={confirmation}
                        disabled={busy}
                        onChange={(e) => setConfirmation(e.target.value)}
                      />
                    </label>
                  </>
                )}
                <button
                  className="workspace-subtle-link"
                  type="button"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"}
                </button>
              </>
            )}
            {issue && (
              <p role="alert" className="workspace-inline-error">
                {issue}
              </p>
            )}
            <button
              className="workspace-button primary"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Sebentar, ya..."
                : mode === "register"
                  ? "Buat akun"
                  : mode === "link"
                    ? "Kirim tautan masuk"
                    : "Masuk ke akun"}
              <UiIcon name="arrow_forward" />
            </button>
          </form>
          <button
            className="workspace-subtle-link"
            type="button"
            disabled={busy}
            onClick={() => switchMode(mode === "link" ? "login" : "link")}
          >
            {mode === "link"
              ? "Pakai email dan kata sandi"
              : "Masuk lewat tautan email"}
          </button>
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
          {confirmationEmail && (
            <button
              className="workspace-button"
              disabled={busy}
              type="button"
              onClick={resendConfirmation}
            >
              Kirim ulang email konfirmasi
            </button>
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
            Coba demo Manda
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
