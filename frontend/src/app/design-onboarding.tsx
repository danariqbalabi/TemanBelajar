"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultProfile, type Profile, type Preferences } from "@/lib/types";
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
    [needs, setNeeds] = useState(["membaca"]),
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
    setNeeds(
      needs.includes(key) ? needs.filter((n) => n !== key) : [...needs, key],
    );
    if (key === "membaca")
      pref({
        reading_ruler: !value.preferences.reading_ruler,
        mode: "reading",
      });
    if (key === "fokus") pref({ reduced_motion: true, mode: "focus" });
    if (key === "audio") pref({ mode: "explore" });
    if (key === "kartu") pref({ mode: "transcript" });
    if (key === "deskripsi") pref({ mode: "explore" });
    if (key === "biasa") pref({ mode: "standard" });
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
return (<><div className="stitch-shell final-design"><header className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-divider h-20 px-6 flex items-center justify-between"><Image src="/design/logo-final.png" alt="TemanBelajar" width={320} height={120} className="h-10 w-auto object-contain"/><button type="button" onClick={onBack}>Kembali ke beranda</button><span>Langkah {step+1}/4</span></header>{(error||issue)&&<p className="pt-24 px-6 text-error" role="alert">{error||issue}</p>}{step===0&&(<div className="final-design final-screen-3 w-full pt-20 bg-canvas min-h-screen final-onboarding"><div className="flex flex-col w-full">
<div className="w-full max-w-6xl mx-auto px-gutter-mobile sm:px-gutter-tablet md:px-gutter py-space-md sm:py-space-xl">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
<div className="flex items-center gap-space-sm">
<a aria-label="Kembali ke layar sebelumnya" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface hover:bg-mint-tint text-primary border border-divider transition-all shadow-sm group" href="#" onClick={e=>{e.preventDefault();(()=>onBack?.())()}}>
<span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-0.5" aria-hidden="true">arrow_back</span>
</a>
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label text-label">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Langkah 1 dari 4
          </span>
<span className="text-on-surface-variant font-metadata text-metadata hidden sm:inline">· Kebutuhan Belajar</span>
</div>
</div>

<nav aria-label="Alur Onboarding" className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-mint-tint border border-secondary text-primary font-label text-[0.8125rem]">
<span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">1</span>
<span>Kebutuhan</span>
</div>
<span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">chevron_right</span>
<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-divider text-on-surface-variant font-label text-[0.8125rem]">
<span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px] font-bold">2</span>
<span>Aksesibilitas</span>
</div>
<span className="material-symbols-outlined text-outline text-[16px] hidden sm:inline" aria-hidden="true">chevron_right</span>
<div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-divider text-on-surface-variant font-label text-[0.8125rem]">
<span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px] font-bold">3</span>
<span>Tujuan</span>
</div>
<span className="material-symbols-outlined text-outline text-[16px] hidden md:inline" aria-hidden="true">chevron_right</span>
<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-divider text-on-surface-variant font-label text-[0.8125rem]">
<span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px] font-bold">4</span>
<span>Rencana Siap</span>
</div>
</nav>
</div>

<div className="relative bg-surface rounded-2xl sm:rounded-3xl p-space-md sm:p-space-xl border border-divider shadow-[0_3px_0_rgba(39,59,53,0.06)] mb-space-xl overflow-hidden">

<div className="absolute -top-3 left-10 w-28 h-7 bg-butter/70 rotate-[-2deg] rounded-sm pointer-events-none mix-blend-multiply opacity-80 border-t border-b border-butter"></div>
<div className="absolute -top-3 right-16 w-24 h-6 bg-lavender/40 rotate-[3deg] rounded-sm pointer-events-none mix-blend-multiply opacity-80 border-t border-b border-lavender"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
<div className="lg:col-span-8 flex flex-col gap-space-xs">
<div className="inline-flex items-center gap-2 text-secondary font-label text-label uppercase tracking-wider">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
            Personalisasi Ruang Belajar
          </div>
<h1 className="font-display text-[1.85rem] sm:text-display-mobile lg:text-[2.65rem] text-primary leading-tight font-extrabold tracking-tight">
            Biar belajarnya makin nyaman, kamu butuh bantuan apa?
          </h1>
<p className="font-reading text-reading text-on-surface-variant max-w-2xl mt-1">
            Pilih semua yang kamu rasa paling cocok. Nggak ada tes medis, nggak ada label kaku—semua pilihan bisa kamu ubah kapan aja di profilmu.
          </p>
<label className="block mt-6 text-sm font-bold">Nama panggilan<input className="block mt-2 w-full max-w-md" maxLength={80} value={value.display_name} onChange={e=>setValue({...value,display_name:e.target.value})}/></label></div>

<div className="lg:col-span-4 flex items-center gap-space-sm bg-lavender-tint border border-lavender/50 rounded-2xl p-space-md shadow-sm relative">

<div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center bg-secondary-container rounded-2xl">

<svg className="w-14 h-14" fill="none" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
<path d="M22 56C22 41 33 30 48 30C63 30 70 41 70 56C70 65 60 70 48 70C34 70 22 65 22 56Z" fill="#C8E8CE"></path>
<ellipse cx="56" cy="46" fill="#FFFFFF" rx="9" ry="10"></ellipse>
<circle cx="58" cy="46" fill="#112520" r="5"></circle>
<circle cx="60" cy="44" fill="#FFFFFF" r="1.5"></circle>

<path d="M26 38C34 33 52 33 66 38" stroke="#3B4C9B" strokeLinecap="round" strokeWidth="5"></path>
<path d="M24 38L18 35M24 38L19 41" stroke="#3B4C9B" strokeLinecap="round" strokeWidth="3"></path>

<path d="M50 58C54 61 60 60 62 57" stroke="#112520" strokeLinecap="round" strokeWidth="2.5"></path>

<circle cx="46" cy="55" fill="#FFCA9D" r="3.5"></circle>

<path d="M23 60C17 60 12 55 12 49C12 43 17 39 21 42" stroke="#496550" strokeLinecap="round" strokeWidth="3.5"></path>
</svg>
<span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-primary text-on-primary text-[9px] font-bold font-label uppercase">Mimo</span>
</div>
<div className="flex flex-col">
<span className="font-card-title text-label text-primary flex items-center gap-1 font-bold">
              Kata Mimo
              <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">forum</span>
</span>
<p className="font-mimo-voice text-[0.95rem] text-primary leading-snug mt-0.5">
              “Hai! Pilih yang bikin kepalamu enteng ya. Kamu bisa pilih lebih dari satu, atau pilih belajar seperti biasa!”
            </p>
</div>
</div>
</div>
</div>

<fieldset aria-describedby="helper-text" className="w-full mb-space-lg">
<legend className="sr-only">Pilihan Kebutuhan &amp; Bantuan Belajar</legend>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md sm:gap-space-lg" id="needs-grid">
<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-surface border-2 border-primary shadow-[0_4px_0_rgba(17,37,32,0.12)] cursor-pointer transition-all hover:-translate-y-1 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-reading">

<div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-mint-tint border border-secondary text-primary font-metadata text-[11px] font-bold shadow-sm flex items-center gap-1 z-10 rotate-[-1deg]">
<span className="material-symbols-outlined text-[13px] text-secondary" aria-hidden="true">stars</span> PILIHAN POPULER ✨
  </div>
<input checked={needs.includes("membaca")} className="need-checkbox sr-only" id="need-reading" name="study_need" type="checkbox" value="reading" onChange={()=>toggleNeed("membaca")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary-container text-primary font-label text-label font-bold border border-secondary/20">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">menu_book</span>
<span>Reading Companion</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku butuh bantuan membaca
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Penggaris fokus baris, font ramah disleksia, jarak teks ekstra lega, dan pemenggalan suku kata otomatis.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-mint-tint/80 border border-secondary/20 flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<span className="font-metadata text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]" aria-hidden="true">view_day</span> Pratinjau Penggaris Fokus
        </span>
<span className="px-1.5 py-0.2 rounded bg-surface border border-secondary/30 text-[10px] font-mono text-primary font-bold">OpenDyslexic</span>
</div>
<div className="relative px-2 py-1.5 bg-butter-tint rounded-lg border-l-4 border-primary text-primary font-mono text-[12px] flex items-center justify-between shadow-xs">
<span className="font-semibold">» Fo-kus pa-da ba-ris in-i sa-ja «</span>
<span className="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">line_weight</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-primary font-metadata text-[11px] font-semibold">Penggaris Baris</span>
<span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-secondary font-metadata text-[11px] font-semibold">Atur Spasi</span>
<span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-secondary font-metadata text-[11px] font-semibold">Suku Kata Otomatis</span>
</div>
</label>

<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-surface border-2 border-primary shadow-[0_4px_0_rgba(17,37,32,0.12)] cursor-pointer transition-all hover:-translate-y-1 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-focus">

<div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-lavender-tint border border-lavender text-tertiary-container font-metadata text-[11px] font-bold shadow-sm flex items-center gap-1 z-10 rotate-[1deg]">
<span className="material-symbols-outlined text-[13px] text-tertiary-container" aria-hidden="true">sentiment_satisfied</span> REKOMENDASI MIMO 🦎
  </div>
<input checked={needs.includes("fokus")} className="need-checkbox sr-only" id="need-focus" name="study_need" type="checkbox" value="focus" onChange={()=>toggleNeed("fokus")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-lavender text-tertiary-container font-label text-label font-bold border border-lavender/50">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">timer</span>
<span>Focus Navigator</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku gampang kehilangan fokus
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Materi dipecah gigitan kecil (chunking), timer tanpa alarm panik, jeda teratur, dan minim gangguan visual.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-lavender-tint/80 border border-lavender/50 flex flex-col gap-1.5">
<div className="flex items-center justify-between text-[11px] text-tertiary-container font-bold">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]" aria-hidden="true">pace</span> 15 Menit · Jeda Lembut</span>
<span className="px-1.5 py-0.2 rounded bg-surface text-[10px] text-tertiary-container border border-lavender">Zen Mode</span>
</div>
<div className="flex items-center gap-1.5 w-full mt-0.5">
<div className="flex-1 h-2 rounded-full bg-tertiary-container"></div>
<div className="flex-1 h-2 rounded-full bg-lavender"></div>
<div className="flex-1 h-2 rounded-full bg-surface-container-high"></div>
</div>
<span className="font-metadata text-[10px] text-on-surface-variant">Satu bab dipecah jadi 3 bagian ringan tanpa rasa kewalahan.</span>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full bg-lavender-tint text-tertiary-container font-metadata text-[11px] font-semibold">Chunking 15m</span>
<span className="px-2.5 py-0.5 rounded-full bg-lavender-tint text-tertiary-container font-metadata text-[11px] font-semibold">Zen Mode</span>
<span className="px-2.5 py-0.5 rounded-full bg-lavender-tint text-tertiary-container font-metadata text-[11px] font-semibold">Alarm Lembut</span>
</div>
</label>

<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-surface border border-divider shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/40 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-audio">
<input className="need-checkbox sr-only" id="need-audio" name="study_need" type="checkbox" value="audio" checked={needs.includes("audio")} onChange={()=>toggleNeed("audio")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-peach text-primary font-label text-label font-bold">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">headphones</span>
<span>Audio Explorer</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg border-2 border-outline-variant bg-surface flex items-center justify-center transition-colors shadow-xs group-hover:border-primary">
<span className="material-symbols-outlined text-[18px] opacity-0 text-on-primary" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku lebih nyaman mendengarkan
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Narasi suara jernih manusiawi, atur kecepatan baca 0.75x–1.5x, dan alternatif audio lengkap untuk grafik sains.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-peach-tint/80 border border-peach/50 flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1">
<span className="w-1 h-3 bg-primary rounded-full animate-pulse"></span>
<span className="w-1 h-5 bg-primary rounded-full"></span>
<span className="w-1 h-2 bg-primary rounded-full"></span>
<span className="w-1 h-4 bg-primary rounded-full"></span>
<span className="w-1 h-6 bg-primary rounded-full"></span>
<span className="w-1 h-3 bg-primary rounded-full"></span>
<span className="font-metadata text-[11px] font-bold text-primary ml-1.5">Suara Alami Bu Ayu</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface text-primary border border-peach text-[10px] font-bold">1.0x</span>
</div>
<span className="font-metadata text-[10px] text-on-surface-variant">Didukung audio diagram untuk grafik dan peta konsep.</span>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-[11px] font-semibold">Suara Alami</span>
<span className="px-2.5 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-[11px] font-semibold">Speed 0.75x-1.5x</span>
<span className="px-2.5 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-[11px] font-semibold">Audio Diagram</span>
</div>
</label>

<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-surface border border-divider shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/40 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-diagram">
<input className="need-checkbox sr-only" id="need-diagram" name="study_need" type="checkbox" value="diagram" checked={needs.includes("deskripsi")} onChange={()=>toggleNeed("deskripsi")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-butter text-warning font-label text-label font-bold">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">image_search</span>
<span>Diagram Describer</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg border-2 border-outline-variant bg-surface flex items-center justify-center transition-colors shadow-xs group-hover:border-primary">
<span className="material-symbols-outlined text-[18px] opacity-0 text-on-primary" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku butuh deskripsi gambar
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Penjelasan terstruktur untuk setiap bagan, kurva koordinat, dan ilustrasi biologi agar mudah dibayangkan.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-butter-tint/80 border border-butter/70 flex flex-col gap-1.5">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded bg-surface border border-butter flex items-center justify-center text-warning shrink-0">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">schema</span>
</div>
<div className="flex flex-col">
<span className="font-metadata text-[11px] font-bold text-warning">Alt-Teks Sains Bertingkat</span>
<span className="font-metadata text-[10px] text-on-surface-variant">Tabel nilai titik sumbu &amp; formula terbaca.</span>
</div>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[11px] font-semibold">Alt Teks Lengkap</span>
<span className="px-2.5 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[11px] font-semibold">Rincian Formula</span>
<span className="px-2.5 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[11px] font-semibold">Tabel Sederhana</span>
</div>
</label>

<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-surface border border-divider shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/40 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-visual">
<input className="need-checkbox sr-only" id="need-visual" name="study_need" type="checkbox" value="visual" checked={needs.includes("kartu")} onChange={()=>toggleNeed("kartu")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-mint-tint text-secondary font-label text-label font-bold border border-secondary/20">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">subtitles</span>
<span>Visual &amp; Caption</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg border-2 border-outline-variant bg-surface flex items-center justify-center transition-colors shadow-xs group-hover:border-primary">
<span className="material-symbols-outlined text-[18px] opacity-0 text-on-primary" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku lebih nyaman dengan teks dan visual
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Transkrip teks sinkron real-time, kartu rangkuman visual berwarna, dan ringkasan konsep infografik.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-surface-container-low border border-divider flex flex-col gap-1.5">
<div className="flex items-center justify-between text-[11px] text-secondary font-bold">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]" aria-hidden="true">closed_caption</span> Subtitle Sinkron Video</span>
<span className="px-1.5 py-0.2 rounded bg-surface border border-divider text-[10px] text-primary">Peta Konsep</span>
</div>
<div className="px-2 py-1 rounded bg-surface text-primary font-metadata text-[11px] border border-divider flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>&quot;...fotosintesis mengubah cahaya jadi energi...&quot;</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-secondary font-metadata text-[11px] font-semibold">Peta Konsep</span>
<span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-secondary font-metadata text-[11px] font-semibold">Subtitle Otomatis</span>
<span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-secondary font-metadata text-[11px] font-semibold">Infografik</span>
</div>
</label>

<label className="need-card group relative flex flex-col justify-between p-space-lg rounded-2xl bg-canvas border-2 border-dashed border-divider shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/40 focus-within:ring-2 focus-within:ring-tertiary" htmlFor="need-standard">

<div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-surface border border-divider text-on-surface-variant font-metadata text-[11px] font-bold shadow-sm flex items-center gap-1 z-10">
<span className="material-symbols-outlined text-[13px]" aria-hidden="true">flag</span> FLEKSIBEL
  </div>
<input className="need-checkbox sr-only" id="need-standard" name="study_need" type="checkbox" value="standard" checked={needs.includes("biasa")} onChange={()=>toggleNeed("biasa")}/>
<div>
<div className="flex items-center justify-between gap-space-sm mb-3 mt-1">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-container-high text-on-surface-variant font-label text-label font-bold border border-divider">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">edit_note</span>
<span>Standard Learning</span>
</div>
<div className="custom-indicator w-6 h-6 rounded-lg border-2 border-outline-variant bg-surface flex items-center justify-center transition-colors shadow-xs group-hover:border-primary">
<span className="material-symbols-outlined text-[18px] opacity-0 text-on-primary" aria-hidden="true">check</span>
</div>
</div>
<h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover mb-1.5 font-bold">
      Aku mau belajar seperti biasa
    </h2>
<p className="font-body text-label text-on-surface-variant leading-relaxed">
      Format materi artikel rapi standar sekolah. Fitur alat bantu tetap siap sedia di pojok layar jika sewaktu-waktu kamu inginkan.
    </p>

<div className="mt-3.5 p-2.5 rounded-xl bg-surface border border-divider flex flex-col gap-1">
<div className="flex items-center justify-between text-[11px] text-on-surface-variant font-semibold">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]" aria-hidden="true">article</span> Tampilan Standar Bersih</span>
<span className="text-[10px] text-secondary font-bold">Alat Tetap Sedia</span>
</div>
<div className="space-y-1 mt-0.5 opacity-60">
<div className="h-1.5 bg-surface-container-high rounded w-4/5"></div>
<div className="h-1.5 bg-surface-container-high rounded w-3/4"></div>
</div>
</div>
</div>

<div className="mt-space-md pt-space-sm border-t border-divider flex items-center gap-1.5 text-secondary">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">info</span>
<span className="font-metadata text-[11px] italic">Otomatis melepas centang kartu lain jika opsi ini dipilih.</span>
</div>
</label></div>
</fieldset>

<div className="w-full bg-surface-container-low rounded-2xl p-space-md sm:p-space-lg border border-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-xl">
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[24px] mt-0.5" aria-hidden="true">lightbulb</span>
<div className="flex flex-col">
<p className="font-label text-label text-primary font-semibold" id="helper-text">
            Pilihan ini opsional dan bisa kamu ubah kapan saja di menu Pengaturan.
          </p>
<p className="font-metadata text-metadata text-on-surface-variant">
            Semua penyesuaian akan langsung diterapkan pada materi pelajaran, kuis interaktif, dan lembar catatanmu.
          </p>
</div>
</div>
<div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-divider text-on-surface-variant font-metadata text-[12px] shrink-0">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">keyboard</span>
<span>Navigasi: <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[11px] font-bold">Tab</kbd> &amp; <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[11px] font-bold">Spasi</kbd></span>
</div>
</div>

<div className="sticky bottom-4 z-40 bg-surface/95 backdrop-blur-md rounded-2xl border border-divider p-space-md shadow-[0_4px_20px_rgba(39,59,53,0.1)] flex flex-col sm:flex-row items-center justify-between gap-space-md">

<div className="flex items-center gap-2 self-start sm:self-center">
<span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">check_circle</span>
<span className="font-label text-label text-primary" id="selected-summary">
<strong className="font-bold text-primary" id="selected-count">2</strong> bantuan belajar dipilih
        </span>
</div>

<div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
<a className="inline-flex items-center justify-center px-space-md py-2.5 rounded-xl text-primary font-label text-label hover:bg-surface-container-low transition-colors" href="#" onClick={e=>{e.preventDefault();(()=>goto(1))()}}>
          Lewati dulu
        </a>
<a className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-sm transition-all group" href="#" id="btn-submit" onClick={e=>{e.preventDefault();(()=>goto(1))()}}>
<span>Simpan &amp; Lanjut ke Aksesibilitas</span>
<span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
</a>
</div>
</div>
</div>
</div>
</div>)}{step===1&&(<div className="final-design final-screen-4 w-full pt-20 bg-canvas flex-1 final-onboarding"><div className="flex flex-col w-full">

<div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg flex flex-col gap-space-xl">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-divider">
<div className="flex items-center gap-space-md">
<a className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-control-border text-primary hover:bg-canvas transition-colors" href="#" title="Kembali ke Layar Kebutuhan" onClick={e=>{e.preventDefault();(()=>goto(0))()}}>
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
</a>
<div className="flex flex-col">
<div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container w-fit mb-1 font-label text-[11px] font-bold tracking-wide uppercase">
<span>Langkah 2 dari 4 · Aksesibilitas</span>
</div>
<span className="font-metadata text-metadata text-secondary font-medium">Pengaturan Kenyamanan Sensorik &amp; Kognitif</span>
</div>
</div>

<nav aria-label="Alur Onboarding" className="flex items-center gap-2">

<div className="flex items-center gap-1.5 text-success">
<div className="w-6 h-6 rounded-full bg-mint-tint flex items-center justify-center border border-success">
<span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">check</span>
</div>
<span className="font-label text-[12px] font-bold hidden sm:inline">1. Kebutuhan</span>
</div>
<span className="w-4 h-[1px] bg-divider"></span>

<div className="flex items-center gap-1.5 text-primary">
<div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[12px] font-bold shadow-sm">
            2
          </div>
<span className="font-label text-[12px] font-bold">Aksesibilitas</span>
</div>
<span className="w-4 h-[1px] bg-divider"></span>

<div className="flex items-center gap-1.5 text-outline">
<div className="w-6 h-6 rounded-full bg-surface border border-divider flex items-center justify-center text-[12px] font-medium">
            3
          </div>
<span className="font-label text-[12px] font-medium hidden sm:inline">Tujuan</span>
</div>
<span className="w-4 h-[1px] bg-divider"></span>

<div className="flex items-center gap-1.5 text-outline">
<div className="w-6 h-6 rounded-full bg-surface border border-divider flex items-center justify-center text-[12px] font-medium">
            4
          </div>
<span className="font-label text-[12px] font-medium hidden sm:inline">Rencana</span>
</div>
</nav>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
<div className="lg:col-span-8 flex flex-col gap-space-xs">
<div className="inline-flex items-center gap-space-xs font-label text-label font-bold tracking-wide uppercase text-secondary">
<span>⚙️ PREFERENSI &amp; KENYAMANAN SENSORIK</span>
</div>
<h1 className="font-display text-[2rem] md:text-[2.5rem] leading-[1.15] font-extrabold text-primary">
          Atur cara belajarmu yang paling pas
        </h1>
<p className="font-body text-body text-on-surface-variant max-w-2xl mt-1">
          Sesuaikan jenis huruf, jarak pandang, dan alat bantu sensorik. Setiap pilihan langsung tampak di pratinjau buku materi sebelah kanan!
        </p>
</div>

<div className="lg:col-span-4 flex items-center gap-space-md p-space-md bg-lavender-tint border border-tertiary-fixed-dim rounded-2xl relative">
<div className="shrink-0 w-14 h-14 bg-surface rounded-full flex items-center justify-center p-1 border border-tertiary-fixed-dim overflow-hidden shadow-sm">
<Image alt="" className="w-full h-full object-contain object-contain" src="/design/mimo-final.png" width={1408} height={1120}></Image>
</div>
<div className="flex flex-col">
<span className="font-label text-[11px] font-bold text-tertiary-container uppercase tracking-wider">Pesan Hangat dari Mimo</span>
<p className="font-mimo-voice text-mimo-voice text-contrast-ink leading-snug">
            &quot;Tenang ya, pengaturan ini bisa kamu ubah kapan pun di profil. Coba geser-geser tombolnya!&quot;
          </p>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

<div className="lg:col-span-6 flex flex-col gap-space-lg">

<section className="bg-surface rounded-2xl border border-divider p-space-lg flex flex-col gap-space-md shadow-[0_2px_8px_rgba(39,59,53,0.03)]">
<div className="flex items-center justify-between pb-space-xs border-b border-divider">
<div className="flex items-center gap-space-sm">
<span className="w-8 h-8 rounded-lg bg-mint-tint text-primary flex items-center justify-center font-bold text-[18px]">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">format_size</span>
</span>
<div>
<h2 className="font-card-title text-card-title text-primary">Tampilan &amp; Format Teks</h2>
<p className="font-metadata text-[12px] text-on-surface-variant">Prioritas pembacaan fokus dan kenyamanan disleksia</p>
</div>
</div>
<span className="font-label text-[11px] font-bold text-secondary bg-mint-tint px-2 py-0.5 rounded-full">Aktif</span>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label text-label text-primary font-semibold flex items-center justify-between">
<span>Jenis Huruf (Font Family)</span>
<span className="text-on-surface-variant font-normal text-[12px]">Pilih tipografi yang ramah mata</span>
</label>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="fontFamilyGroup">
<button className="font-opt px-3 py-2 rounded-xl text-center text-[12px] font-label border border-primary bg-secondary-container text-primary font-bold transition-all shadow-sm" data-font="plus-jakarta" type="button" onClick={()=>pref({font_family:"jakarta"})} aria-pressed={value.preferences.font_family==="jakarta"}>
                Plus Jakarta
              </button>
<button className="font-opt px-3 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-font="opendyslexic" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
                OpenDyslexic
              </button>
<button className="font-opt px-3 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-font="lexend" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
                Lexend
              </button>
<button className="font-opt px-3 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-font="system" type="button" onClick={()=>pref({font_family:"system"})} aria-pressed={value.preferences.font_family==="system"}>
                Standar Sistem
              </button>
</div>
</div>

<div className="flex flex-col gap-space-xs pt-space-xs border-t border-divider/60">
<div className="flex items-center justify-between">
<label className="font-label text-label text-primary font-semibold">Ukuran Huruf Bacaan</label>
<span className="font-label text-[12px] font-bold text-primary bg-butter-tint border border-butter px-2.5 py-0.5 rounded-full" id="currentFontSizeLabel">18px · Nyaman</span>
</div>
<div className="grid grid-cols-4 gap-2 pt-1" id="fontSizeGroup">
<button className="size-opt px-2.5 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-size="16" type="button" onClick={()=>pref({font_size:16})} aria-pressed={value.preferences.font_size===16}>
                16px <span className="text-[10px] block opacity-80">Kecil</span>
</button>
<button className="size-opt px-2.5 py-2 rounded-xl text-center text-[12px] font-label border border-primary bg-secondary-container text-primary font-bold transition-all shadow-sm" data-size="18" type="button" onClick={()=>pref({font_size:18})} aria-pressed={value.preferences.font_size===18}>
                18px <span className="text-[10px] block font-medium">Nyaman</span>
</button>
<button className="size-opt px-2.5 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-size="20" type="button" onClick={()=>pref({font_size:20})} aria-pressed={value.preferences.font_size===20}>
                20px <span className="text-[10px] block opacity-80">Besar</span>
</button>
<button className="size-opt px-2.5 py-2 rounded-xl text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas transition-all" data-size="24" type="button" onClick={()=>pref({font_size:24})} aria-pressed={value.preferences.font_size===24}>
                24px <span className="text-[10px] block opacity-80">Ekstra</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs border-t border-divider/60">

<div className="flex flex-col gap-space-xs">
<label className="font-label text-[13px] text-primary font-semibold">Jarak Antar Baris</label>
<div className="flex items-center gap-1.5" id="lineHeightGroup">
<button className="lh-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-lh="1.5" type="button" onClick={()=>pref({line_height:1.5})} aria-pressed={value.preferences.line_height===1.5}>
                  1.5x
                </button>
<button className="lh-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-primary bg-secondary-container text-primary font-bold" data-lh="1.7" type="button" onClick={()=>pref({line_height:1.7})} aria-pressed={value.preferences.line_height===1.7}>
                  1.7x (Ideal)
                </button>
<button className="lh-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-lh="2.0" type="button" onClick={()=>pref({line_height:2.0})} aria-pressed={value.preferences.line_height===2.0}>
                  2.0x
                </button>
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label text-[13px] text-primary font-semibold">Jarak Huruf (Tracking)</label>
<div className="flex items-center gap-1.5" id="letterSpacingGroup">
<button className="ls-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-ls="normal" type="button" onClick={()=>pref({letter_spacing:0})} aria-pressed={value.preferences.letter_spacing===0}>
                  Normal
                </button>
<button className="ls-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-primary bg-secondary-container text-primary font-bold" data-ls="0.08em" type="button" onClick={()=>pref({letter_spacing:0.08})} aria-pressed={value.preferences.letter_spacing===0.08}>
                  +0.08em
                </button>
<button className="ls-opt flex-1 py-1.5 px-2 rounded-lg text-center text-[12px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-ls="0.16em" type="button" onClick={()=>pref({letter_spacing:0.12})} aria-pressed={value.preferences.letter_spacing===0.12}>
                  +0.16em
                </button>
</div>
</div>
</div>

<div className="flex items-center justify-between p-space-sm bg-mint-tint/60 rounded-xl border border-secondary-fixed">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[22px]" aria-hidden="true">spellcheck</span>
<div>
<p className="font-label text-label font-bold text-primary">Pemenggalan Suku Kata</p>
<p className="font-metadata text-[12px] text-secondary">Bantu parsing baca kata panjang (misal: fo-to-sin-te-sis)</p>
</div>
</div>

<button aria-checked="true" className="w-12 h-7 bg-primary rounded-full relative p-0.5 transition-colors focus:outline-none" id="toggleSyllable" role="switch" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<span className="block w-6 h-6 bg-surface rounded-full shadow-md transform translate-x-5 transition-transform" id="syllableThumb"></span>
</button>
</div>
</section>

<section className="bg-surface rounded-2xl border border-divider p-space-lg flex flex-col gap-space-md shadow-[0_2px_8px_rgba(39,59,53,0.03)]">
<div className="flex items-center justify-between pb-space-xs border-b border-divider">
<div className="flex items-center gap-space-sm">
<span className="w-8 h-8 rounded-lg bg-peach-tint text-primary flex items-center justify-center font-bold text-[18px]">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">horizontal_rule</span>
</span>
<div>
<h2 className="font-card-title text-card-title text-primary">Alat Bantu Baca &amp; Fokus Sensorik</h2>
<p className="font-metadata text-[12px] text-on-surface-variant">Panduan visual agar pandangan tidak mudah lompat baris</p>
</div>
</div>
</div>

<div className="flex flex-col gap-space-sm p-space-sm bg-canvas rounded-xl border border-divider">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">visibility</span>
<div>
<span className="font-label text-label font-bold text-primary">Penggaris Fokus Baris (Focus Ruler)</span>
<p className="font-metadata text-[12px] text-on-surface-variant">Menyorot baris yang sedang kamu baca secara presisi</p>
</div>
</div>
<button aria-checked="true" className="w-12 h-7 bg-primary rounded-full relative p-0.5 transition-colors focus:outline-none" id="toggleRuler" role="switch" type="button" onClick={()=>pref({reading_ruler:!value.preferences.reading_ruler})} aria-pressed={value.preferences.reading_ruler}>
<span className="block w-6 h-6 bg-surface rounded-full shadow-md transform translate-x-5 transition-transform" id="rulerThumb"></span>
</button>
</div>
<div className="flex items-center justify-between pt-space-xs border-t border-divider/60">
<span className="font-metadata text-[12px] text-on-surface-variant font-medium">Pilihan Tint Penggaris:</span>
<div className="flex items-center gap-2" id="rulerColorGroup">
<button className="ruler-color-btn flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label border border-primary bg-secondary-container text-primary font-bold" data-color="mint" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Mint
                </button>
<button className="ruler-color-btn flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-color="butter" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<span className="w-2.5 h-2.5 rounded-full bg-butter"></span> Kuning Pastel
                </button>
<button className="ruler-color-btn flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label border border-divider bg-surface text-on-surface-variant hover:bg-canvas" data-color="lavender" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<span className="w-2.5 h-2.5 rounded-full bg-lavender"></span> Lavender
                </button>
</div>
</div>
</div>

<div className="flex flex-col gap-space-xs pt-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">record_voice_over</span>
<div>
<span className="font-label text-label font-bold text-primary">Pembaca Suara (Text-to-Speech AI)</span>
<p className="font-metadata text-[12px] text-on-surface-variant">Dengarkan penjelasan dengan intonasi ramah remaja</p>
</div>
</div>
<span className="font-label text-[11px] font-semibold text-secondary bg-surface px-2 py-0.5 rounded-md border border-divider">Tersedia</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
<div className="flex items-center justify-between p-2 rounded-xl bg-canvas border border-divider">
<span className="font-metadata text-[12px] text-primary font-medium">Karakter Suara</span>
<span className="font-label text-[12px] font-bold text-primary flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-success"></span> Bu Ayu (Hangat)
                </span>
</div>
<div className="flex items-center justify-between p-2 rounded-xl bg-canvas border border-divider">
<span className="font-metadata text-[12px] text-primary font-medium">Kecepatan Suara</span>
<div className="flex items-center gap-1">
<span className="px-2 py-0.5 rounded bg-surface border border-divider text-[11px] font-label text-on-surface-variant font-medium">0.75x</span>
<span className="px-2 py-0.5 rounded bg-primary text-on-primary text-[11px] font-label font-bold">1.0x</span>
<span className="px-2 py-0.5 rounded bg-surface border border-divider text-[11px] font-label text-on-surface-variant font-medium">1.25x</span>
</div>
</div>
</div>
</div>
</section>

<section className="bg-surface rounded-2xl border border-divider p-space-lg flex flex-col gap-space-md shadow-[0_2px_8px_rgba(39,59,53,0.03)]">
<div className="flex items-center justify-between pb-space-xs border-b border-divider">
<div className="flex items-center gap-space-sm">
<span className="w-8 h-8 rounded-lg bg-butter-tint text-primary flex items-center justify-center font-bold text-[18px]">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">palette</span>
</span>
<div>
<h2 className="font-card-title text-card-title text-primary">Tema Kontras &amp; Tampilan Layar</h2>
<p className="font-metadata text-[12px] text-on-surface-variant">Cegah kelelahan mata digital dan fotofobia sensorik</p>
</div>
</div>
</div>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="themeGroup">
<button className="theme-opt p-2.5 rounded-xl border border-primary bg-secondary-container text-left flex flex-col gap-1 transition-all" data-theme="krem" type="button" onClick={()=>pref({high_contrast:false})} aria-pressed={value.preferences.high_contrast===false}>
<div className="w-full h-5 rounded bg-[#F8F7F2] border border-divider flex items-center px-1">
<div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
</div>
<span className="font-label text-[11px] font-bold text-primary">Krem Alami</span>
<span className="font-metadata text-[10px] text-secondary">Bawaan nyaman</span>
</button>
<button className="theme-opt p-2.5 rounded-xl border border-divider bg-surface text-left flex flex-col gap-1 hover:bg-canvas transition-all" data-theme="putih" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<div className="w-full h-5 rounded bg-[#FFFFFF] border border-divider flex items-center px-1">
<div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
</div>
<span className="font-label text-[11px] font-bold text-primary">Putih Bersih</span>
<span className="font-metadata text-[10px] text-on-surface-variant">Monokrom sejuk</span>
</button>
<button className="theme-opt p-2.5 rounded-xl border border-divider bg-surface text-left flex flex-col gap-1 hover:bg-canvas transition-all" data-theme="tinggi" type="button" onClick={()=>pref({high_contrast:true})} aria-pressed={value.preferences.high_contrast===true}>
<div className="w-full h-5 rounded bg-[#112520] flex items-center px-1">
<div className="w-2.5 h-2.5 rounded-full bg-butter"></div>
</div>
<span className="font-label text-[11px] font-bold text-primary">Kontras Tinggi</span>
<span className="font-metadata text-[10px] text-on-surface-variant">WCAG AAA</span>
</button>
<button className="theme-opt p-2.5 rounded-xl border border-divider bg-surface text-left flex flex-col gap-1 hover:bg-canvas transition-all" data-theme="redup" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<div className="w-full h-5 rounded bg-[#FFF5D6] border border-divider flex items-center px-1">
<div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
</div>
<span className="font-label text-[11px] font-bold text-primary">Mode Redup</span>
<span className="font-metadata text-[10px] text-on-surface-variant">Pemanasan malam</span>
</button>
</div>

<div className="flex items-center justify-between p-space-sm bg-canvas rounded-xl border border-divider">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">motion_photos_off</span>
<div>
<p className="font-label text-label font-bold text-primary">Kurangi Gerakan Animasi</p>
<p className="font-metadata text-[12px] text-on-surface-variant">Nonaktifkan transisi gerak cepat agar tidak memicu pusing</p>
</div>
</div>
<button aria-checked="true" className="w-12 h-7 bg-primary rounded-full relative p-0.5 transition-colors focus:outline-none" role="switch" type="button" disabled={true} title="Pilihan ini belum didukung. Gunakan pengaturan yang tersedia.">
<span className="block w-6 h-6 bg-surface rounded-full shadow-md transform translate-x-5 transition-transform"></span>
</button>
</div>
</section>
</div>

<div className="lg:col-span-6 sticky top-28 flex flex-col gap-space-md">

<div className="bg-surface rounded-3xl border border-divider p-space-lg md:p-space-xl flex flex-col gap-space-md relative transition-all duration-300" id="previewCard" style={{"boxShadow": "0 4px 0 rgba(39, 59, 53, 0.08)"}}>

<div className="absolute -top-3.5 left-8 bg-butter border border-amber-300 px-4 py-1 rounded-sm shadow-sm transform -rotate-1 flex items-center gap-1.5 z-10">
<span className="material-symbols-outlined text-[15px] text-warning font-bold" aria-hidden="true">science</span>
<span className="font-label text-[11px] font-extrabold text-warning tracking-wider uppercase">PRATINJAU LANGSUNG MATERI NYATA</span>
</div>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-2 pb-space-sm border-b border-divider">
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span className="font-label text-[12px] font-bold text-secondary uppercase tracking-wide">Biologi SMP Kelas 8</span>
</div>
<h3 className="font-card-title text-card-title text-primary font-bold">Bab 3: Fotosintesis &amp; Energi Daun</h3>
</div>

<div className="flex items-center gap-1.5 shrink-0 bg-canvas p-1 rounded-xl border border-divider">
<button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-mint-tint border border-control-border text-primary font-label text-[11px] font-bold transition-colors" id="ttsPreviewBtn" type="button" onClick={speak}>Bacakan contoh</button>
<button className="p-1 rounded-lg hover:bg-canvas text-on-surface-variant transition-colors" id="previewResetBtn" title="Reset Tampilan" type="button" onClick={()=>pref(defaultProfile.preferences)}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">replay</span>
</button>
</div>
</div>

<div className="flex flex-col gap-space-md p-space-md rounded-2xl bg-canvas border border-divider relative overflow-hidden transition-all duration-200" id="previewTextSandbox">

<div className="absolute left-0 right-0 h-10 bg-[#C8E8CE]/60 border-y border-secondary/40 pointer-events-none transition-all duration-300 top-[18px]" id="focusRulerBar"></div>

<p className="preview-text relative z-10 text-contrast-ink leading-[1.7] transition-all duration-200" id="para1" style={{"fontSize": "18px", "letterSpacing": "0.08em", "lineHeight": "1.7"}}>
<span className="syllable-wrap">Fo-to-sin-te-sis</span> ada-lah pro-ses pem-bu-at-an ma-kan-an o-leh tum-buh-an hi-jau de-ngan ban-tu-an ca-ha-ya ma-ta-ha-ri, a-ir, dan kar-bon di-ok-si-da.
            </p>

<p className="preview-text relative z-10 text-contrast-ink leading-[1.7] transition-all duration-200" id="para2" style={{"fontSize": "18px", "letterSpacing": "0.08em", "lineHeight": "1.7"}}>
              Di da-lam sel daun ter-da-pat pa-brik ke-cil ber-na-ma <span className="bg-mint-tint px-1.5 py-0.5 rounded border-b-2 border-secondary font-semibold text-primary">klo-ro-plas</span>. Klo-ro-fil me-nye-rap ca-ha-ya dan me-ngu-bah-nya men-ja-di e-ner-gi ki-mi-a yang di-bu-tuh-kan se-lu-ruh ma-khluk hi-dup.
            </p>

<div className="relative z-10 p-3 bg-surface rounded-xl border border-divider flex items-center justify-between gap-space-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-mint-tint text-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]" aria-hidden="true">wb_sunny</span>
</div>
<div className="flex flex-col">
<span className="font-label text-[12px] font-bold text-primary">Formula Ringkas Daun:</span>
<span className="font-metadata text-[11px] text-secondary font-semibold">Cahaya + Air + CO₂ → Glukosa + Oksigen (O₂)</span>
</div>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">eco</span>
</div>

<div className="relative z-10 p-space-sm bg-lavender-tint/70 rounded-xl border border-tertiary-fixed-dim flex items-start gap-space-sm">
<span className="material-symbols-outlined text-tertiary-container text-[20px] shrink-0 mt-0.5" aria-hidden="true">lightbulb</span>
<div className="flex flex-col">
<span className="font-label text-[12px] font-bold text-tertiary-container">Istilah Penting (Glosarium Sensorik)</span>
<p className="font-body text-[12px] text-contrast-ink leading-relaxed">
<strong>Kloroplas</strong> = organel spesifik di dalam sel tumbuhan yang mengandung klorofil untuk memasak makanan secara mandiri.
                </p>
</div>
</div>
</div>

<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-divider text-on-surface-variant font-metadata text-[12px]">
<div className="flex items-center gap-2">
<div className="w-5 h-5 rounded-full bg-success text-on-success flex items-center justify-center">
<span className="material-symbols-outlined text-[13px] font-bold" aria-hidden="true">verified</span>
</div>
<span className="font-semibold text-primary">WCAG 2.2 AA Terpenuhi</span>
<span className="text-divider">·</span>
<span className="text-secondary font-medium" id="contrastRatioLabel">Rasio Kontras: 11.4:1 (Sangat Jelas)</span>
</div>
<div className="flex items-center gap-1.5 text-on-surface-variant bg-canvas px-2.5 py-1 rounded-full border border-divider">
<span className="material-symbols-outlined text-[14px]" aria-hidden="true">auto_awesome</span>
<span className="text-[11px] font-medium">Render Instan Web-Safe</span>
</div>
</div>
</div>

<div className="p-space-md bg-surface-container-low rounded-2xl border border-divider flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-secondary shrink-0 border border-divider">
<span className="material-symbols-outlined text-[22px]" aria-hidden="true">devices</span>
</div>
<div className="flex flex-col">
<span className="font-label text-label font-bold text-primary">Otomatis Terhubung ke Seluruh Modul</span>
<p className="font-metadata text-[12px] text-on-surface-variant">Pengaturan ini akan diterapkan di kuis latihan, ringkasan PDF, dan papan tanya jawab TemanBelajar.</p>
</div>
</div>
</div>
</div>

<div className="pt-space-lg pb-space-md border-t border-divider flex flex-col sm:flex-row items-center justify-between gap-space-md">

<button className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label text-label transition-colors" id="globalResetBtn" type="button" onClick={()=>pref(defaultProfile.preferences)}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">restart_alt</span>
<span>Kembalikan ke Pengaturan Bawaan</span>
</button>

<div className="flex items-center gap-space-md w-full sm:w-auto justify-end">
<a className="px-space-md py-space-sm rounded-xl text-on-surface-variant hover:text-primary hover:bg-canvas font-label text-label transition-colors text-center" href="#" onClick={e=>{e.preventDefault();(()=>goto(2))()}}>
          Lewati Dulu
        </a>
<a className="inline-flex items-center justify-center gap-2 px-space-xl py-space-sm rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold shadow-md hover:shadow-lg transition-all text-center" href="#" onClick={e=>{e.preventDefault();(()=>goto(2))()}}>
<span>Pakai Pengaturan Ini &amp; Lanjut</span>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
</a>
</div>
</div>

<div className="text-center font-metadata text-[12px] text-on-surface-variant -mt-space-md pb-space-sm flex items-center justify-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-success"></span>
<span>Semua preferensi tersimpan otomatis di perangkatmu tanpa perlu menekan tombol simpan berulang kali.</span>
</div>
</div>
</div>
</div>)}{step===2&&(<div className="final-design final-screen-5 w-full pt-20 bg-canvas min-h-screen final-onboarding"><div className="flex flex-col w-full">

<div className="w-full bg-canvas py-space-sm px-gutter">
<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">

<a className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-tertiary-container rounded-lg p-1 transition-colors" href="#" onClick={e=>{e.preventDefault();(()=>goto(1))()}}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
<span>Langkah 2: Preferensi Aksesibilitas</span>
</a>

<nav aria-label="Progress Onboarding" className="flex items-center flex-wrap gap-2">

<a className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-metadata text-metadata" href="#" onClick={e=>{e.preventDefault();(()=>goto(0))()}}>
<span className="material-symbols-outlined text-[15px] font-bold" aria-hidden="true">check_circle</span>
<span className="font-bold">1. Kebutuhan</span>
</a>
<span className="text-secondary font-bold text-xs select-none">/</span>

<a className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-metadata text-metadata" href="#" onClick={e=>{e.preventDefault();(()=>goto(1))()}}>
<span className="material-symbols-outlined text-[15px] font-bold" aria-hidden="true">check_circle</span>
<span className="font-bold">2. Aksesibilitas</span>
</a>
<span className="text-secondary font-bold text-xs select-none">/</span>

<span aria-current="step" className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary text-on-primary font-label text-label shadow-sm">
<span className="material-symbols-outlined text-[15px]" aria-hidden="true">flag</span>
<span className="font-bold">3. Tujuan Belajar</span>
</span>
<span className="text-secondary font-bold text-xs select-none">/</span>

<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-metadata text-metadata opacity-70">
<span>4. Rencana Siap</span>
</span>
</nav>
</div>
</div>

<section className="w-full max-w-6xl mx-auto px-gutter pt-space-md pb-space-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">

<div className="lg:col-span-8 flex flex-col gap-space-xs">
<div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-peach-tint text-primary font-label text-label">
<span className="material-symbols-outlined text-primary text-[16px]" aria-hidden="true">track_changes</span>
<span className="tracking-wide">TARGET &amp; WAKTU BELAJAR SANTAY</span>
</div>
<h1 className="font-display text-display-mobile md:text-display text-primary tracking-tight">
          Tentukan tujuan belajarmu, pelan-pelan asal konsisten!
        </h1>
<p className="font-reading text-reading text-secondary max-w-2xl">
          Pilih mata pelajaran yang ingin kamu kuasai dan seberapa banyak waktu luang yang kamu punya setiap hari. Nggak perlu ngoyo—<span className="font-bold text-primary">15 menit sehari</span> udah keren banget buat bangun ritme fokus.
        </p>
</div>

<div className="lg:col-span-4 relative">
<div className="bg-mint-tint rounded-2xl p-space-md shadow-sm flex items-start gap-space-md">
<div className="w-20 h-20 shrink-0 flex items-center justify-center -mt-2">
<Image alt="" className="w-full h-full object-contain pointer-events-none  object-contain" src="/design/mimo-final.png" width={1408} height={1120}></Image>
</div>
<div className="flex flex-col gap-1">
<span className="font-label text-label text-primary font-bold flex items-center gap-1">
              Mimo Siap Mendampingi
              <span className="material-symbols-outlined text-[16px] text-success" aria-hidden="true">waving_hand</span>
</span>
<p className="font-mimo-voice text-mimo-voice text-primary leading-snug">
              &quot;Pilih target yang bikin kamu nyaman ya! Jadwal belajarmu nanti bakal otomatis menyesuaikan energi harianmu.&quot;
            </p>
</div>
</div>
</div>
</div>
</section>

<section className="w-full max-w-6xl mx-auto px-gutter pb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">

<div className="lg:col-span-7 flex flex-col gap-space-lg">
<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-sm relative overflow-hidden">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">school</span>
      <span className="font-section-title text-section-title text-primary">Tingkat Sekolah</span>
      <span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[11px] font-bold border border-butter/80">Fase Kurikulum</span>
    </div>
    <span className="font-metadata text-metadata text-secondary font-semibold">Kurikulum Merdeka 2024</span>
  </div>
  <div aria-label="Pilih Jenjang Sekolah" className="grid grid-cols-2 gap-space-xs p-1 bg-surface-container rounded-xl" role="radiogroup">
    <button aria-checked="true" className="school-level-btn py-2.5 px-4 rounded-lg font-label text-label flex items-center justify-center gap-2 bg-primary text-on-primary shadow-sm transition-all" role="radio" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">menu_book</span>
      <span className="font-bold">SMP (Fase D)</span>
      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
    </button>
    <button aria-checked="false" className="school-level-btn py-2.5 px-4 rounded-lg font-label text-label flex items-center justify-center gap-2 bg-transparent text-secondary hover:bg-surface-container-high transition-all" role="radio" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">history_edu</span>
      <span>SMA (Fase E/F)</span>
    </button>
  </div>
</div>


<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-md">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <div>
      <div className="flex items-center gap-2">
        <h2 className="font-section-title text-section-title text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" aria-hidden="true">category</span>
          Mata Pelajaran yang Ingin Difokuskan
        </h2>
        <span className="px-2 py-0.5 rounded-md bg-peach-tint text-primary font-metadata text-[11px] font-bold border border-peach/40">PRIORITAS BELAJAR 🎯</span>
      </div>
      <p className="font-metadata text-metadata text-secondary mt-0.5">Pilih 1 hingga 3 mata pelajaran prioritas minggu ini.</p>
    </div>
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label text-xs font-bold self-start sm:self-auto shadow-xs">
      <span className="material-symbols-outlined text-[15px] text-success" aria-hidden="true">task_alt</span>
      2 Terpilih
    </span>
  </div>

  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm" id="subject-cards-container">
    
    <button aria-pressed={value.subjects.includes("Biologi")} className="subject-toggle text-left p-space-md rounded-2xl bg-mint-tint text-primary border-2 border-secondary/20 shadow-sm hover:scale-[1.01] transition-all flex flex-col justify-between h-36 relative group" type="button" onClick={()=>toggleSubject("Biologi")}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary font-bold shadow-xs border border-secondary/20">
            <span className="material-symbols-outlined text-[22px] text-primary" aria-hidden="true">psychiatry</span>
          </div>
          <div>
            <span className="font-card-title text-card-title text-primary block leading-snug">Biologi &amp; IPA</span>
            <span className="font-metadata text-metadata text-secondary text-xs flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span> SMP Fase D · Aktif di Jadwal
            </span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-md bg-surface text-primary font-metadata text-xs font-semibold shadow-xs border border-secondary/20 flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-success" aria-hidden="true">spa</span>Fotosintesis</span>
        <span className="px-2 py-0.5 rounded-md bg-surface text-primary font-metadata text-xs font-semibold shadow-xs border border-secondary/20">Sel &amp; Jaringan</span>
        <span className="px-2 py-0.5 rounded-md bg-mint-tint/60 text-secondary font-metadata text-xs font-medium">+Ekosistem</span>
      </div>
    </button>

    
    <button aria-pressed={value.subjects.includes("Matematika")} className="subject-toggle text-left p-space-md rounded-2xl bg-lavender-tint text-primary border-2 border-tertiary-container/20 shadow-sm hover:scale-[1.01] transition-all flex flex-col justify-between h-36 relative group" type="button" onClick={()=>toggleSubject("Matematika")}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary font-bold shadow-xs border border-tertiary-container/20">
            <span className="material-symbols-outlined text-[22px] text-tertiary-container" aria-hidden="true">functions</span>
          </div>
          <div>
            <span className="font-card-title text-card-title text-primary block leading-snug">Matematika</span>
            <span className="font-metadata text-metadata text-secondary text-xs flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Aljabar &amp; Bangun · Aktif
            </span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-md bg-surface text-primary font-metadata text-xs font-semibold shadow-xs border border-tertiary-container/20 flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-tertiary-container" aria-hidden="true">calculate</span>Aljabar Linear</span>
        <span className="px-2 py-0.5 rounded-md bg-surface text-primary font-metadata text-xs font-semibold shadow-xs border border-tertiary-container/20">Teorema Phytagoras</span>
      </div>
    </button>

    
    <button aria-pressed={value.subjects.includes("Bahasa Indonesia")} className="subject-toggle text-left p-space-md rounded-2xl bg-peach-tint/60 text-primary border border-peach/40 shadow-sm hover:bg-peach-tint hover:scale-[1.01] transition-all flex flex-col justify-between h-36 relative group" type="button" onClick={()=>toggleSubject("Bahasa Indonesia")}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-peach/40 flex items-center justify-center text-primary font-bold shadow-xs">
            <span className="material-symbols-outlined text-[22px] text-primary" aria-hidden="true">edit_note</span>
          </div>
          <div>
            <span className="font-card-title text-card-title text-primary block leading-snug">Bahasa Indonesia</span>
            <span className="font-metadata text-metadata text-secondary text-xs">Teks Laporan &amp; Narasi</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-surface text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary shadow-xs transition-colors">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-md bg-surface/80 text-secondary font-metadata text-xs border border-secondary/20">Karya Ilmiah</span>
        <span className="px-2 py-0.5 rounded-md bg-surface/80 text-secondary font-metadata text-xs border border-secondary/20">Menulis Reflektif</span>
      </div>
    </button>

    
    <button aria-pressed={value.subjects.includes("Bahasa Inggris")} className="subject-toggle text-left p-space-md rounded-2xl bg-butter-tint/80 text-primary border border-butter/60 shadow-sm hover:bg-butter-tint hover:scale-[1.01] transition-all flex flex-col justify-between h-36 relative group" type="button" onClick={()=>toggleSubject("Bahasa Inggris")}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-butter/60 flex items-center justify-center text-primary font-bold shadow-xs">
            <span className="material-symbols-outlined text-[22px] text-warning" aria-hidden="true">chat_bubble</span>
          </div>
          <div>
            <span className="font-card-title text-card-title text-primary block leading-snug">Bahasa Inggris</span>
            <span className="font-metadata text-metadata text-secondary text-xs">Vocabulary &amp; Dialog</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-surface text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary shadow-xs transition-colors">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-md bg-surface/80 text-secondary font-metadata text-xs border border-secondary/20">Daily Conversation</span>
        <span className="px-2 py-0.5 rounded-md bg-surface/80 text-secondary font-metadata text-xs border border-secondary/20">Passive Voice</span>
      </div>
    </button>
  </div>

  
  <div className="pt-space-xs bg-canvas/80 p-space-md rounded-xl border border-secondary/20 flex flex-col gap-2">
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px]" aria-hidden="true">search</span>
      <input className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-surface text-primary placeholder:text-secondary font-body text-body text-sm focus:outline-none focus:ring-2 focus:ring-tertiary-container shadow-xs border border-secondary/20" placeholder="Cari bab/materi spesifik (contoh: Fotosintesis C3, Hukum Newton...)" type="text" value={value.goal} onChange={e=>setValue({...value,goal:e.target.value})} aria-label="Target belajar"/>
      <button className="absolute right-2 px-3 py-1.5 rounded-lg bg-secondary-container text-primary font-label text-label hover:bg-secondary hover:text-on-secondary transition-colors text-xs font-bold flex items-center gap-1" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">add</span> Tambah
      </button>
    </div>
    <div className="flex items-center gap-1.5 text-secondary font-metadata text-xs ml-1">
      <span className="material-symbols-outlined text-warning text-[16px]" aria-hidden="true">tips_and_updates</span>
      <span>Tips Mimo: TemanBelajar bakal mengurai bab panjang jadi kartu bacaan 3 menitan.</span>
    </div>
  </div>
</div>


<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-md">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="font-section-title text-section-title text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary" aria-hidden="true">explore</span>
        Misi &amp; Fokus Belajar
      </h2>
      <p className="font-metadata text-metadata text-secondary mt-0.5">Pilih pendekatan belajar yang paling sesuai dengan ritmemu.</p>
    </div>
    <span className="px-2.5 py-1 rounded-full bg-mint-tint text-primary font-label text-xs font-bold border border-secondary/20">1 Pilihan Aktif</span>
  </div>
  <div aria-label="Misi Belajar" className="flex flex-col gap-space-sm" role="radiogroup">
    
    <label className="mission-option flex items-start gap-space-md p-space-md rounded-xl bg-mint-tint/60 border-2 border-secondary/20 cursor-pointer shadow-sm hover:bg-mint-tint transition-all relative">
      <input checked={value.goal==="santai"} className="mt-1 w-5 h-5 text-primary accent-primary" name="learning_goal" type="radio" value="santai" onChange={()=>setValue({...value,goal:"santai"})}/>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-card-title text-card-title text-primary font-bold">Paham Konsep Santai &amp; PR Sekolah</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-metadata text-xs font-bold flex items-center gap-1 border border-secondary/20">
            <span className="material-symbols-outlined text-[13px] text-success" aria-hidden="true">auto_awesome</span> REKOMENDASI MIMO ✨
          </span>
        </div>
        <p className="font-body text-body text-secondary text-sm mt-1 leading-relaxed">
          Fokus pemahaman konsep mendalam tanpa terburu-buru. Disertai contoh kasus relatable kehidupan sehari-hari siswa.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 rounded bg-surface text-secondary font-metadata text-xs font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-success" aria-hidden="true">check</span> Bebas Stres
          </span>
          <span className="px-2 py-0.5 rounded bg-surface text-secondary font-metadata text-xs font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-tertiary-container" aria-hidden="true">lightbulb</span> Micro-Reading
          </span>
        </div>
      </div>
      <span className="material-symbols-outlined text-success text-[24px]" aria-hidden="true">check_circle</span>
    </label>
    
    <label className="mission-option flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low border border-secondary/20 cursor-pointer shadow-sm hover:bg-surface-container transition-all relative">
      <input className="mt-1 w-5 h-5 text-primary accent-primary" name="learning_goal" type="radio" value="ujian" checked={value.goal==="ujian"} onChange={()=>setValue({...value,goal:"ujian"})}/>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="font-card-title text-card-title text-primary font-bold">Persiapan Penilaian Harian / Ujian Sekolah</span>
          <span className="px-2 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-xs font-bold">Simulasi Adaptif</span>
        </div>
        <p className="font-body text-body text-secondary text-sm mt-1">
          Materi dipadatkan dengan peta konsep ringkas, bank soal latihan adaptif, dan simulasi waktu ujian riil.
        </p>
      </div>
    </label>
    
    <label className="mission-option flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low border border-secondary/20 cursor-pointer shadow-sm hover:bg-surface-container transition-all relative">
      <input className="mt-1 w-5 h-5 text-primary accent-primary" name="learning_goal" type="radio" value="remedial" checked={value.goal==="remedial"} onChange={()=>setValue({...value,goal:"remedial"})}/>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="font-card-title text-card-title text-primary font-bold">Kejar Ketertinggalan Materi</span>
          <span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-xs font-bold">Fondasi Kuat</span>
        </div>
        <p className="font-body text-body text-secondary text-sm mt-1">
          Menyisir materi prasyarat dari bab-bab sebelumnya dengan penjelasan visual bertahap dan analogi sederhana.
        </p>
      </div>
    </label>
  </div>

  
  <div className="pt-space-xs flex flex-col gap-space-xs bg-canvas/90 p-space-md rounded-xl border border-secondary/20 relative">
    <div className="flex items-center justify-between">
      <label className="font-label text-label text-primary flex items-center gap-2 cursor-pointer" htmlFor="target-toggle">
        <input checked={Boolean(value.exam_date)} className="w-4 h-4 text-primary accent-primary rounded" id="target-toggle" type="checkbox" onChange={e=>setValue({...value,exam_date:e.target.checked?new Date().toISOString().slice(0,10):null})}/>
        <span className="font-bold">Punya target tanggal ujian khusus?</span>
      </label>
      <span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-xs font-bold border border-butter/80">Opsional</span>
    </div>
    <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm" id="target-date-container">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]" aria-hidden="true">event</span>
        <input className="w-full pl-10 pr-3 py-2 rounded-lg bg-surface text-primary font-body text-body text-sm focus:outline-none focus:ring-2 focus:ring-tertiary-container shadow-xs border border-secondary/20" type="date" value={value.exam_date||""} onChange={e=>setValue({...value,exam_date:e.target.value||null})} aria-label="Tanggal ujian (opsional)"/>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface text-primary font-metadata text-metadata text-xs border border-secondary/20 shadow-xs">
        <span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">verified</span>
        <span className="font-bold">Penilaian Akhir Semester (15 Nov 2026)</span>
      </div>
    </div>
    <p className="font-metadata text-metadata text-secondary text-xs flex items-center gap-1 mt-1">
      <span className="material-symbols-outlined text-[15px] text-secondary" aria-hidden="true">lock_open</span>
      Tenang, tanggal ini bisa dikosongkan kapan saja jika kamu hanya ingin belajar santai tanpa tenggat waktu.
    </p>
  </div>
</div></div>

<div className="lg:col-span-5 flex flex-col gap-space-lg">
<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-md">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">timer</span>
      <h2 className="font-section-title text-section-title text-primary">Waktu Belajar Harian</h2>
    </div>
    <span className="px-2 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-[11px] font-bold border border-peach/40">ANTI-BURNOUT ⏱️</span>
  </div>
  <div aria-label="Preset Durasi Harian" className="flex flex-col gap-space-sm" role="radiogroup">
    
    <label className="duration-card p-space-md rounded-xl bg-mint-tint/60 border-2 border-secondary/20 cursor-pointer shadow-sm flex flex-col gap-2 transition-all relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input checked={value.daily_minutes===15} className="w-4 h-4 text-primary accent-primary" name="daily_duration" type="radio" value="15" onChange={()=>setValue({...value,daily_minutes:15})}/>
          <span className="font-card-title text-card-title text-primary font-extrabold">15 Menit / Hari</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-butter text-warning font-label text-xs font-bold border border-butter/80 flex items-center gap-1 shadow-xs">
          <span>⭐ Paling Nyaman</span>
        </span>
      </div>
      <p className="font-body text-body text-secondary text-xs pl-6">
        Cocok untuk metode <span className="font-bold text-primary">Micro-Chunking</span> santai:
      </p>
      
      <div className="grid grid-cols-3 gap-1.5 pl-6 pt-0.5 text-center">
        <div className="py-1 px-1.5 rounded-lg bg-surface border border-secondary/20 font-metadata text-[11px] text-primary flex items-center justify-center gap-1 font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[13px] text-success" aria-hidden="true">auto_stories</span> 5m Baca
        </div>
        <div className="py-1 px-1.5 rounded-lg bg-surface border border-secondary/20 font-metadata text-[11px] text-primary flex items-center justify-center gap-1 font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[13px] text-tertiary-container" aria-hidden="true">psychology</span> 5m Paham
        </div>
        <div className="py-1 px-1.5 rounded-lg bg-surface border border-secondary/20 font-metadata text-[11px] text-primary flex items-center justify-center gap-1 font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[13px] text-warning" aria-hidden="true">quiz</span> 5m Kuis
        </div>
      </div>
    </label>

    
    <label className="duration-card p-space-md rounded-xl bg-surface-container-low border border-secondary/20 cursor-pointer shadow-sm flex flex-col gap-1 hover:bg-surface-container transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input className="w-4 h-4 text-primary accent-primary" name="daily_duration" type="radio" value="25" checked={value.daily_minutes===25} onChange={()=>setValue({...value,daily_minutes:25})}/>
          <span className="font-card-title text-card-title text-primary font-bold">25 Menit / Hari</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label text-xs font-semibold border border-secondary/20">
          Pomodoro Ringan
        </span>
      </div>
      <p className="font-body text-body text-secondary text-xs pl-6">
        20 menit eksplorasi konsep terpandu + 5 menit latihan refleksi pemahaman.
      </p>
    </label>

    
    <label className="duration-card p-space-md rounded-xl bg-surface-container-low border border-secondary/20 cursor-pointer shadow-sm flex flex-col gap-2 hover:bg-surface-container transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input className="w-4 h-4 text-primary accent-primary" name="daily_duration" type="radio" value="custom" checked={![15,25].includes(value.daily_minutes)} onChange={()=>setValue({...value,daily_minutes:20})}/>
          <span className="font-card-title text-card-title text-primary font-bold">Atur Sendiri Durasi</span>
        </div>
        <span className="font-label text-label text-primary font-bold px-2.5 py-0.5 rounded-md bg-surface border border-secondary/20 shadow-xs" id="custom-duration-val">20 Menit</span>
      </div>
      <div className="px-2 pt-1">
        <input aria-label="Slider durasi kustom menit" className="w-full accent-primary cursor-pointer" max="60" min="10" step="5" type="range" value={value.daily_minutes} onChange={e=>setValue({...value,daily_minutes:Number(e.target.value)})}/>
        <div className="flex justify-between text-secondary font-metadata text-xs mt-1">
          <span>10 mnt</span>
          <span>35 mnt</span>
          <span>60 mnt</span>
        </div>
      </div>
    </label>
  </div>
</div>


<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-sm">
  <div className="flex items-center justify-between">
    <h2 className="font-section-title text-section-title text-primary flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary" aria-hidden="true">calendar_today</span>
      Hari Belajar Aktif
    </h2>
    <span className="px-2 py-0.5 rounded-full bg-mint-tint text-primary font-metadata text-xs font-bold border border-secondary/20">Fleksibel</span>
  </div>
  <p className="font-body text-body text-secondary text-xs">Tandai hari saat kamu punya waktu santai untuk membuka modul.</p>
  <div aria-label="Pilih Hari Aktif" className="flex items-center justify-between gap-1 pt-1" role="group">
    
    <button aria-pressed={value.available_days.includes(0)} className="day-btn flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label flex flex-col items-center gap-0.5 shadow-sm transition-colors" type="button" onClick={()=>toggleDay(0)}>
      <span className="text-xs font-bold">Sen</span>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(1)} className="day-btn flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label flex flex-col items-center gap-0.5 shadow-sm transition-colors" type="button" onClick={()=>toggleDay(1)}>
      <span className="text-xs font-bold">Sel</span>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(2)} className="day-btn flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label flex flex-col items-center gap-0.5 shadow-sm transition-colors" type="button" onClick={()=>toggleDay(2)}>
      <span className="text-xs font-bold">Rab</span>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(3)} className="day-btn flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label flex flex-col items-center gap-0.5 shadow-sm transition-colors" type="button" onClick={()=>toggleDay(3)}>
      <span className="text-xs font-bold">Kam</span>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(4)} className="day-btn flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label flex flex-col items-center gap-0.5 shadow-sm transition-colors" type="button" onClick={()=>toggleDay(4)}>
      <span className="text-xs font-bold">Jum</span>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(5)} className="day-btn flex-1 py-2.5 rounded-xl bg-surface-container text-secondary font-label text-label flex flex-col items-center gap-0.5 hover:bg-surface-container-high transition-colors border border-secondary/20" type="button" onClick={()=>toggleDay(5)}>
      <span className="text-xs font-semibold">Sab</span>
      <span className="text-[10px] font-bold text-secondary">Libur 🌿</span>
    </button>
    
    <button aria-pressed={value.available_days.includes(6)} className="day-btn flex-1 py-2.5 rounded-xl bg-surface-container text-secondary font-label text-label flex flex-col items-center gap-0.5 hover:bg-surface-container-high transition-colors border border-secondary/20" type="button" onClick={()=>toggleDay(6)}>
      <span className="text-xs font-semibold">Min</span>
      <span className="text-[10px] font-bold text-secondary">Libur 🌿</span>
    </button>
  </div>
  <div className="mt-2 p-2.5 rounded-xl bg-secondary-container/60 border border-secondary/20 flex items-center justify-between text-primary">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-success text-[18px]" aria-hidden="true">verified</span>
      <span className="font-label text-label text-xs font-bold">5 Hari Aktif Belajar</span>
    </div>
    <span className="font-metadata text-metadata text-xs font-bold text-secondary">
      Total Target: 75 mnt / minggu
    </span>
  </div>
</div>


<div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-secondary/20 flex flex-col gap-space-sm">
  <h2 className="font-section-title text-section-title text-primary flex items-center gap-2">
    <span className="material-symbols-outlined text-secondary" aria-hidden="true">schedule</span>
    Waktu Belajar Favorit
  </h2>
  <p className="font-body text-body text-secondary text-xs">Kapan kamu biasanya paling gampang fokus tanpa gangguan?</p>
  <div className="grid grid-cols-2 gap-space-xs pt-1">
    
    <button className="time-btn p-2.5 rounded-xl bg-surface-container text-secondary font-label text-label text-xs flex items-center gap-2 hover:bg-surface-container-high border border-secondary/20 transition-all" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="text-lg">🌅</span>
      <div className="text-left">
        <span className="block font-bold text-primary">Pagi Hari</span>
        <span className="text-[11px] text-secondary">06.00 - 08.00</span>
      </div>
    </button>
    
    <button className="time-btn p-2.5 rounded-xl bg-surface-container text-secondary font-label text-label text-xs flex items-center gap-2 hover:bg-surface-container-high border border-secondary/20 transition-all" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="text-lg">☀️</span>
      <div className="text-left">
        <span className="block font-bold text-primary">Siang Hari</span>
        <span className="text-[11px] text-secondary">14.00 - 16.00</span>
      </div>
    </button>
    
    <button className="time-btn p-2.5 rounded-xl bg-peach-tint text-primary font-label text-label text-xs flex items-center gap-2 shadow-xs border-2 border-primary transition-all relative overflow-hidden" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="text-lg">🌇</span>
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <span className="block font-bold text-primary">Sore Santai</span>
          <span className="material-symbols-outlined text-primary text-[15px]" aria-hidden="true">check_circle</span>
        </div>
        <span className="text-[11px] text-secondary font-bold">16.00 - 18.00</span>
      </div>
    </button>
    
    <button className="time-btn p-2.5 rounded-xl bg-surface-container text-secondary font-label text-label text-xs flex items-center gap-2 hover:bg-surface-container-high border border-secondary/20 transition-all" type="button" disabled={true} title="Belum tersedia; jadwal rinci dapat diatur di Rencana Belajar.">
      <span className="text-lg">🌙</span>
      <div className="text-left">
        <span className="block font-bold text-primary">Malam Tenang</span>
        <span className="text-[11px] text-secondary">19.00 - 21.00</span>
      </div>
    </button>
  </div>
</div>


<div className="bg-butter-tint rounded-2xl p-space-md shadow-sm border border-butter/80 relative overflow-hidden flex flex-col gap-2">
  
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-butter rotate-1 shadow-xs pointer-events-none rounded-sm border border-butter/80"></div>
  <div className="flex items-center gap-2 mt-2">
    <span className="material-symbols-outlined text-warning text-[20px]" aria-hidden="true">auto_awesome</span>
    <span className="font-label text-label text-warning font-bold">Proyeksi Santai TemanBelajar</span>
  </div>
  <p className="font-reading text-reading text-primary text-sm leading-relaxed">
    &quot;Dengan <span className="font-bold underline decoration-secondary">15 menit per sore</span> (5 hari/minggu), kamu bisa menuntaskan materi <span className="font-bold text-primary">Fotosintesis &amp; Aljabar Linear</span> lengkap dengan 2 latihan adaptif dalam <span className="font-bold text-success">4 hari saja</span> tanpa stres!&quot;
  </p>
  <div className="flex items-center gap-3 pt-2 text-secondary font-metadata text-xs">
    <span className="flex items-center gap-1 font-semibold text-primary">
      <span className="material-symbols-outlined text-[15px] text-success" aria-hidden="true">sentiment_very_satisfied</span>
      🌱 Bebas beban kognitif
    </span>
    <span>•</span>
    <span className="flex items-center gap-1 font-semibold text-primary">
      <span className="material-symbols-outlined text-[15px] text-tertiary-container" aria-hidden="true">battery_charging_full</span>
      ⚡ Energi terjaga
    </span>
  </div>
</div></div>
</div>
</section>

<div className="sticky bottom-0 z-40 w-full bg-surface/95 backdrop-blur-md shadow-[0_-2px_12px_rgba(39,59,53,0.08)] py-space-md px-gutter"><div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-md"><div className="flex flex-col gap-1 text-center sm:text-left"><div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap"><span className="inline-flex items-center gap-1.5 font-card-title text-card-title text-primary font-extrabold"><span className="material-symbols-outlined text-success text-[20px]" aria-hidden="true">task_alt</span>Target Siap Disusun</span><span className="text-secondary text-sm hidden sm:inline">•</span><div className="flex items-center gap-1.5 flex-wrap"><span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-metadata text-xs font-bold">2 Mapel (Biologi, MTK)</span><span className="px-2 py-0.5 rounded-full bg-peach-tint text-primary font-metadata text-xs font-bold">15 mnt/hari (Sore)</span><span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-xs font-bold">5 Hari Aktif</span></div></div><p className="font-metadata text-metadata text-secondary text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">lock_clock</span>Jadwal ini 100% fleksibel, tidak ada penalti kalau kamu sedang capek atau ingin istirahat.</p></div><div className="flex items-center gap-space-sm w-full sm:w-auto justify-end"><a className="inline-flex items-center justify-center px-space-md py-2.5 rounded-xl font-label text-label text-secondary bg-surface-container hover:bg-surface-container-high transition-colors text-center shrink-0 border border-secondary/20" href="#" onClick={e=>{e.preventDefault();(()=>goto(3))()}}>Gunakan Default</a><a className="inline-flex items-center justify-center gap-2 px-space-lg py-2.5 rounded-xl font-label text-label text-on-primary bg-primary hover:bg-primary-hover active:bg-primary-pressed shadow-sm transition-all text-center flex-1 sm:flex-initial font-bold" href="#" onClick={e=>{e.preventDefault();(()=>goto(3))()}}><span>Lihat Rencana Belajarku</span><span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span></a></div></div></div>
</div>
</div>)}{step===3&&(<div className="final-design final-screen-6 w-full pt-20 bg-canvas min-h-screen final-onboarding"><p className="max-w-6xl mx-auto px-6 py-4 bg-butter-tint">Pratinjau untuk {value.display_name}: {value.subjects.join(", ")} · {value.daily_minutes} menit per hari. Jadwal di bawah adalah contoh, belum disimpan sebagai aktivitas.</p><div className="flex flex-col w-full">

<section className="max-w-7xl mx-auto px-gutter w-full pt-space-lg pb-space-md">
<nav aria-label="Progress Onboarding" className="w-full">
<ol className="flex items-center gap-space-xs sm:gap-space-sm flex-wrap">
<li className="flex items-center gap-space-xs text-secondary font-label text-label">
<span className="w-6 h-6 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-[12px] shadow-sm">
<span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
</span>
<span className="hidden sm:inline">1. Kebutuhan</span>
<span className="sm:hidden text-[12px]">Kebutuhan</span>
<span className="material-symbols-outlined text-outline-variant text-[16px] ml-1" aria-hidden="true">chevron_right</span>
</li>
<li className="flex items-center gap-space-xs text-secondary font-label text-label">
<span className="w-6 h-6 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-[12px] shadow-sm">
<span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
</span>
<span className="hidden sm:inline">2. Aksesibilitas</span>
<span className="sm:hidden text-[12px]">Aksesibilitas</span>
<span className="material-symbols-outlined text-outline-variant text-[16px] ml-1" aria-hidden="true">chevron_right</span>
</li>
<li className="flex items-center gap-space-xs text-secondary font-label text-label">
<span className="w-6 h-6 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-[12px] shadow-sm">
<span className="material-symbols-outlined text-[14px]" aria-hidden="true">check</span>
</span>
<span className="hidden sm:inline">3. Tujuan Belajar</span>
<span className="sm:hidden text-[12px]">Tujuan</span>
<span className="material-symbols-outlined text-outline-variant text-[16px] ml-1" aria-hidden="true">chevron_right</span>
</li>
<li className="flex items-center gap-space-xs text-primary font-label text-label">
<span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[12px] shadow-sm">4</span>
<span className="font-bold underline decoration-butter decoration-4 underline-offset-4">4. Rencana Siap</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-success font-metadata text-[10px] font-extrabold uppercase tracking-wider ml-1">
            Aktif
          </span>
</li>
</ol>
</nav>
</section>

<section className="max-w-7xl mx-auto px-gutter w-full pb-space-lg">
<div className="relative rounded-2xl bg-surface-container-low p-space-md sm:p-space-xl overflow-hidden shadow-sm">

<div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-butter/30 pointer-events-none"></div>
<div className="absolute right-40 -bottom-8 w-24 h-24 rounded-full bg-secondary-container/40 pointer-events-none"></div>
<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-lg">
<div className="flex-1 space-y-space-sm text-left">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-primary font-label text-label shadow-xs">
<span className="text-base">🌿</span>
<span className="font-bold tracking-wide uppercase text-[11px]">Rencana Belajar Personal Terkurasi</span>
<span className="w-1.5 h-1.5 rounded-full bg-success"></span>
<span className="font-metadata text-[11px] text-secondary">100% Siap Dijalankan</span>
</div>
<h1 className="font-page-title text-page-title text-primary tracking-tight">
            Yeay! Rencana belajarmu udah siap.
          </h1>
<p className="font-reading text-reading text-secondary max-w-2xl">
            Mimo udah susun ritme belajar santai <strong>15 menit per hari</strong> yang pas dengan preferensi bacamu. Nggak bakal bikin pusing atau kewalahan!
          </p>

<div className="pt-space-xs">
<div className="relative bg-lavender-tint rounded-2xl p-space-md text-primary max-w-xl shadow-xs">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5" aria-hidden="true">sentiment_satisfied</span>
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-mimo-voice text-mimo-voice text-primary">Pesan dari Mimo</span>
<span className="px-2 py-0.5 rounded-full bg-surface text-secondary font-metadata text-[10px] font-bold">Sahabat Belajarmu</span>
</div>
<p className="font-reading text-reading text-primary">
                    “Keren banget! Jadwal ini fleksibel 100%. Kalau kamu lagi capek atau banyak tugas sekolah, kamu bisa mundurin atau jeda kapan aja tanpa rasa bersalah!”
                  </p>
</div>
</div>
</div>
</div>
</div>

<div className="w-48 sm:w-56 md:w-64 shrink-0 flex items-center justify-center p-2">
<Image alt="" className="w-full h-auto max-h-56 object-contain object-contain" src="/design/mimo-final.png" width={1408} height={1120}></Image>
</div>
</div>
</div>
</section>

<section className="max-w-7xl mx-auto px-gutter w-full pb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

<div className="lg:col-span-8 flex flex-col gap-space-lg">

<div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div>
<div className="flex items-center gap-2">
<span className="px-2.5 py-0.5 rounded-md bg-peach-tint text-warning font-metadata text-[11px] font-extrabold uppercase tracking-wide">
                  Linimasa Perdana
                </span>
<span className="text-secondary font-metadata text-metadata">Hari Ini · Sesi Sore</span>
</div>
<h2 className="font-section-title text-section-title text-primary mt-1">
                Jadwal Belajar Santai (16.00 – 16.15 WIB)
              </h2>
</div>
<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mint-tint text-success font-label text-label self-start sm:self-auto">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">timelapse</span>
<span className="font-bold">Total 15 Menit</span>
</div>
</div>

<div className="flex flex-col gap-space-sm pt-space-xs">

<div className="relative flex flex-col sm:flex-row sm:items-start gap-space-md p-space-md rounded-xl bg-surface-container-low transition-colors">
<div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
<div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">auto_stories</span>
</div>
<span className="font-metadata text-metadata text-primary font-bold">16.00 - 16.05</span>
</div>
<div className="flex-1 space-y-1">
<div className="flex flex-wrap items-center gap-2">
<h3 className="font-card-title text-card-title text-primary">
                    1. Eksplorasi Konsep: Fotosintesis &amp; Energi Daun
                  </h3>
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-metadata text-[11px] font-bold">
                    5 Menit
                  </span>
<span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[11px] font-bold">
                    Siap Mulai
                  </span>
</div>
<p className="font-reading text-reading text-secondary">
                  Membaca konsep inti dengan kalimat ringkas, didukung diagram pigmen kloroplas dan analogi dapur sel.
                </p>
<div className="flex items-center gap-3 pt-1 text-secondary font-metadata text-metadata">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">visibility</span>
                    Penggaris Baris Aktif
                  </span>
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">text_fields</span>
                    Font OpenDyslexic
                  </span>
</div>
</div>
</div>

<div className="relative flex flex-col sm:flex-row sm:items-start gap-space-md p-space-md rounded-xl bg-surface transition-colors">
<div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
<div className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">quiz</span>
</div>
<span className="font-metadata text-metadata text-secondary">16.05 - 16.10</span>
</div>
<div className="flex-1 space-y-1">
<div className="flex flex-wrap items-center gap-2">
<h3 className="font-card-title text-card-title text-primary">
                    2. Cek Pemahaman Cepat
                  </h3>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-metadata text-[11px] font-bold">
                    5 Menit
                  </span>
<span className="px-2 py-0.5 rounded-full bg-canvas text-secondary font-metadata text-[11px]">
                    Menunggu Giliran
                  </span>
</div>
<p className="font-reading text-reading text-secondary">
                  Dua pertanyaan adaptif berformat kartu interaktif. Tanpa batasan waktu detak jantung, bebas coba lagi tanpa cemas salah.
                </p>
<div className="flex items-center gap-2 pt-1 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">sentiment_very_satisfied</span>
<span>Skor berbasis pemahaman konseptual (BKT Engine), bukan hafalan kaku</span>
</div>
</div>
</div>

<div className="relative flex flex-col sm:flex-row sm:items-start gap-space-md p-space-md rounded-xl bg-surface transition-colors">
<div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
<div className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">psychology_alt</span>
</div>
<span className="font-metadata text-metadata text-secondary">16.10 - 16.15</span>
</div>
<div className="flex-1 space-y-1">
<div className="flex flex-wrap items-center gap-2">
<h3 className="font-card-title text-card-title text-primary">
                    3. Refleksi &amp; Catatan Visual Mimo
                  </h3>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-metadata text-[11px] font-bold">
                    5 Menit
                  </span>
<span className="px-2 py-0.5 rounded-full bg-canvas text-secondary font-metadata text-[11px]">
                    Menunggu Giliran
                  </span>
</div>
<p className="font-reading text-reading text-secondary">
                  Rangkuman peta visual satu lembar yang bisa kamu simpan ke catatan pribadi atau dengarkan via narasi audio santai.
                </p>
<div className="flex items-center gap-2 pt-1 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">bookmark_add</span>
<span>Tersimpan otomatis di Paspor Belajar</span>
</div>
</div>
</div>
</div>
</div>

<div className="rounded-2xl bg-secondary-container p-space-lg text-primary shadow-[0_3px_0_rgba(39,59,53,0.09)] relative overflow-hidden">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md relative z-10">
<div className="space-y-space-xs max-w-xl">
<div className="flex items-center gap-2">
<span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-label text-label font-bold shadow-xs">
                  🌱 Materi Pembuka Hari Ini
                </span>
<span className="px-2 py-0.5 rounded-full bg-mint-tint text-success font-metadata text-[11px] font-bold">
                  Demo Siap Dicoba
                </span>
</div>
<h3 className="font-section-title text-section-title text-primary">
                Bab 3 Biologi SMP: “Fotosintesis &amp; Peran Cahaya Matahari”
              </h3>
<p className="font-reading text-reading text-on-secondary-container">
                Modul percontohan ini sudah dioptimalkan sesuai pengaturan mata dan gaya belajarmu: paragraf telah dipecah kecil-kecil, suku kata berjarak nyaman, dan glosarium istilah sensorik siap pakai.
              </p>
</div>

<div className="bg-surface rounded-xl p-space-md shrink-0 flex flex-col items-center justify-center text-center shadow-xs">
<span className="material-symbols-outlined text-primary text-[36px]" aria-hidden="true">nature</span>
<span className="font-label text-label text-primary font-bold mt-1">IPA Biologi</span>
<span className="font-metadata text-metadata text-secondary">3 Subkonsep Inti</span>
</div>
</div>
<div className="mt-space-md pt-space-md bg-surface/40 rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-sm relative z-10">
<div className="flex items-center gap-2 text-primary font-label text-label">
<span className="material-symbols-outlined text-success text-[20px]" aria-hidden="true">verified</span>
<span>Kurikulum Merdeka 2024 · Terverifikasi Ramah Kognitif</span>
</div>
<span className="font-metadata text-metadata text-secondary">
              Bisa langsung dicoba di Beranda sesudah konfirmasi ini
            </span>
</div>
</div>

<div className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm flex items-start gap-space-md">
<div className="w-12 h-12 rounded-2xl bg-butter-tint text-warning flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[26px]" aria-hidden="true">coffee</span>
</div>
<div className="flex-1 space-y-1">
<div className="flex items-center gap-2">
<h3 className="font-card-title text-card-title text-primary">
                Capek Hari Ini? Geser ke Besok Tanpa Rasa Bersalah
              </h3>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-metadata text-[10px] font-bold uppercase">
                Zero Penalty
              </span>
</div>
<p className="font-reading text-reading text-secondary">
              TemanBelajar nggak mengenal konsep <em>streak patah</em> yang menghukummu. Bila ada ulangan mendadak, les sore, atau tubuhmu butuh istirahat, cukup tekan tombol “Tunda Sesi” di Beranda. Rencana belajarmu otomatis bergeser rapi tanpa menumpuk tugas.
            </p>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-space-lg">

<div className="bg-surface rounded-2xl p-space-lg shadow-sm relative overflow-hidden">

<div className="w-24 h-4 bg-peach/40 -rotate-2 mx-auto -mt-3 mb-space-sm rounded-xs"></div>
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[22px]" aria-hidden="true">badge</span>
<h2 className="font-section-title text-section-title text-primary">Paspor Belajarmu</h2>
</div>
<span className="px-2 py-0.5 rounded-full bg-butter-tint text-warning font-metadata text-[10px] font-extrabold uppercase">
              SMP Kelas 8
            </span>
</div>
<p className="font-metadata text-metadata text-secondary mb-space-md">
            Konfigurasi lingkungan belajar yang kamu tentukan di langkah sebelumnya.
          </p>
<div className="flex flex-col gap-space-sm">

<div className="bg-surface-container-low rounded-xl p-space-sm sm:p-space-md">
<div className="flex items-center gap-2 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
<span className="font-bold text-primary">Waktu &amp; Ritme</span>
</div>
<p className="font-reading text-reading text-primary font-semibold mt-0.5">
                15 Menit / Hari (Sore Santai)
              </p>
<span className="font-metadata text-metadata text-secondary">Rekomendasi aktif: 16.00 – 18.00 WIB</span>
</div>

<div className="bg-surface-container-low rounded-xl p-space-sm sm:p-space-md">
<div className="flex items-center gap-2 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">calendar_month</span>
<span className="font-bold text-primary">Hari Belajar</span>
</div>
<p className="font-reading text-reading text-primary font-semibold mt-0.5">
                5 Hari / Minggu (Senin – Jumat)
              </p>
<div className="flex items-center gap-1.5 mt-1 text-success font-metadata text-metadata">
<span className="material-symbols-outlined text-[14px]" aria-hidden="true">weekend</span>
<span>Sabtu &amp; Minggu Libur Total (Recharge Otak)</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-space-sm sm:p-space-md">
<div className="flex items-center gap-2 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">menu_book</span>
<span className="font-bold text-primary">Fokus Materi</span>
</div>
<div className="flex flex-wrap gap-1.5 mt-1.5">
<span className="px-2.5 py-1 rounded-lg bg-mint-tint text-success font-label text-label font-bold text-[12px]">
                  🌿 Biologi &amp; IPA
                </span>
<span className="px-2.5 py-1 rounded-lg bg-lavender-tint text-primary font-label text-label font-bold text-[12px]">
                  📐 Matematika
                </span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-space-sm sm:p-space-md">
<div className="flex items-center gap-2 text-secondary font-metadata text-metadata">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">tune</span>
<span className="font-bold text-primary">Alat Bantu Terpasang</span>
</div>
<ul className="mt-2 space-y-1.5 font-metadata text-metadata text-primary">
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">check_circle</span>
<span>Penggaris Fokus Baris (Warna Mint)</span>
</li>
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">check_circle</span>
<span>Font Ramah Disleksia (OpenDyslexic)</span>
</li>
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">check_circle</span>
<span>Pemisah Suku Kata Otomatis</span>
</li>
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-success text-[16px]" aria-hidden="true">check_circle</span>
<span>Pemecah Materi Otomatis 15 Menit</span>
</li>
</ul>
</div>

<div className="bg-peach-tint/60 rounded-xl p-space-sm sm:p-space-md text-primary">
<div className="flex items-center gap-2 font-metadata text-metadata text-warning">
<span className="material-symbols-outlined text-[16px]" aria-hidden="true">flag</span>
<span className="font-bold">Target Belajar Terdekat</span>
</div>
<p className="font-label text-label font-bold text-primary mt-0.5">
                Penilaian Akhir Semester (PAS)
              </p>
<span className="font-metadata text-metadata text-secondary">15 November 2026 · 42 Sesi santai tersisa</span>
</div>
</div>
</div>

<div className="bg-lavender-tint rounded-2xl p-space-lg text-primary shadow-xs space-y-space-md">
<div className="flex items-center gap-2">
<span className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center font-bold text-[14px]">
              💡
            </span>
<h3 className="font-card-title text-card-title text-primary">
              Kenapa metode ini bikin tenang?
            </h3>
</div>
<div className="space-y-space-sm">
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5" aria-hidden="true">spa</span>
<div>
<h4 className="font-label text-label font-bold text-primary">Bebas Stres Kognitif</h4>
<p className="font-metadata text-metadata text-secondary">
                  Otak remaja menyerap konsep baru paling optimal dalam rentang 15–20 menit sebelum kelelahan informasi muncul.
                </p>
</div>
</div>
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5" aria-hidden="true">analytics</span>
<div>
<h4 className="font-label text-label font-bold text-primary">Mesin Bukti Bayesian (BKT)</h4>
<p className="font-metadata text-metadata text-secondary">
                  Tingkat kesulitan soal menyesuaikan otomatis dengan kecepatan pemahamanmu, bukan dengan membandingkanmu ke teman lain.
                </p>
</div>
</div>
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5" aria-hidden="true">shield</span>
<div>
<h4 className="font-label text-label font-bold text-primary">Tanpa Label Medis atau Tekanan</h4>
<p className="font-metadata text-metadata text-secondary">
                  Akomodasi belajar adalah hak semua murid, bukan cap kelemahan. Ruang belajarmu aman, privat, dan mendukung 100%.
                </p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="sticky bottom-0 left-0 right-0 w-full z-40 bg-surface/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(39,59,53,0.06)] py-space-md">
<div className="max-w-7xl mx-auto px-gutter flex flex-col sm:flex-row items-center justify-between gap-space-md">

<a className="inline-flex items-center justify-center gap-2 px-space-md py-space-sm rounded-xl font-label text-label text-secondary bg-surface hover:bg-canvas transition-colors w-full sm:w-auto shadow-xs" href="#" onClick={e=>{e.preventDefault();(()=>goto(2))()}}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
<span>Ubah Tujuan Belajar</span>
</a>

<div className="flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">

<button className="inline-flex items-center justify-center gap-2 px-space-md py-space-sm rounded-xl font-label text-label text-primary bg-surface hover:bg-surface-container-low transition-colors w-full sm:w-auto shadow-xs" id="btn-calendar-sync" type="button" disabled={true} title="Ini contoh jadwal. Susun jadwal tersimpan di Rencana Belajar untuk mengekspornya.">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">event</span>
<span>Unduh Jadwal (Kalender)</span>
</button>

<a className="inline-flex items-center justify-center gap-2 px-space-xl py-3 rounded-xl font-label text-label text-on-primary bg-primary hover:bg-primary-hover active:bg-primary-pressed transition-all duration-200 w-full sm:w-auto shadow-md hover:shadow-lg focus:outline-none" href="#" onClick={e=>{e.preventDefault();(finish)()}}>
<span>Lanjut ke Beranda Utama</span>
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span>
</a>
</div>
</div>
</section>
</div>
</div>)}</div></>);}
