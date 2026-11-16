"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { Material, LearningSession, Job } from "@/lib/types";
export function Catalog({
  materials,
  sessions,
  jobs,
  query,
  setQuery,
  onUpload,
  onDetail,
  onSettings,
  jobsPanel,
  uploadPanel,
  errorsPanel,
}: {
  materials: Material[];
  sessions: LearningSession[];
  jobs: Job[];
  query: string;
  setQuery: (q: string) => void;
  onUpload: () => void;
  onDetail: (m: Material) => void;
  onSettings: () => void;
  jobsPanel: ReactNode;
  uploadPanel: ReactNode;
  errorsPanel: ReactNode;
}) {
  const [subject, setSubject] = useState("Semua Topik"),
    [status, setStatus] = useState("all"), [list,setList]=useState(false);
  const completed = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  const filtered = materials.filter(
    (m) =>
      (m.title + " " + m.subject).toLowerCase().includes(query.toLowerCase()) &&
      (subject === "Semua Topik" || m.subject === subject) &&
      (status === "all" ||
        (status === "learning" &&
          sessions.some(
            (s) => s.material_id === m.id && s.status !== "completed",
          )) ||
        (status === "ready" && !sessions.some((s) => s.material_id === m.id))),
  );
return (<><div className="final-design final-screen-8 w-full pt-20 bg-canvas flex-1">{errorsPanel}{uploadPanel}<div className="flex flex-col w-full">
<div className="max-w-[1200px] w-full mx-auto px-margin py-space-xl flex flex-col gap-space-xl">

<header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
<div className="flex flex-col gap-space-xs max-w-2xl">
<div className="flex items-center gap-space-sm">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label text-label">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Katalog Belajar Pribadi
          </span>
<span className="text-on-surface-variant font-metadata text-metadata">{`${materials.length} materi · ${jobs.filter(j=>j.status!=="ready").length} unggahan belum siap`}</span>
</div>
<h1 className="font-display text-page-title text-primary tracking-tight">
          Materi Saya
        </h1>
<p className="font-body text-body text-on-surface-variant">
          Kumpulan modul, rangkuman, dan catatan belajarmu yang sudah disesuaikan agar nyaman dibaca dan dipahami tanpa rasa cemas.
        </p>
</div>

<div className="flex flex-wrap items-center gap-space-sm shrink-0">
<button className="inline-flex items-center justify-center gap-space-xs px-5 py-3 rounded-xl bg-surface text-primary font-label text-label hover:bg-canvas transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary" type="button" onClick={()=>{const m=materials.find(m=>m.is_demo);if(m)onDetail(m)}}>
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">lightbulb</span>
          Coba Materi Contoh
        </button>
<button className="inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2" type="button" onClick={onUpload}>
<span className="material-symbols-outlined text-[20px]" aria-hidden="true">add_circle</span>
          + Tambah Materi Baru
        </button>
</div>
</header>

<section aria-label="Status Pemrosesan Berjalan" className="w-full bg-butter-tint rounded-2xl p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">{jobsPanel}</section>

<section aria-label="Pencarian dan Filter Materi" className="flex flex-col gap-space-md">

<div className="relative w-full">
<span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[22px]" aria-hidden="true">search</span>
</span>
<input className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-surface text-primary placeholder-outline font-body text-body shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary" placeholder="Cari judul materi, bab, kata kunci, atau mata pelajaran..." type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Cari materi atau topik konsep"/>
<div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
<kbd className="hidden sm:inline-block px-2.5 py-1 bg-surface-container rounded-lg font-metadata text-metadata text-on-surface-variant text-xs font-semibold">
            Ctrl + K
          </kbd>
</div>
</div>

<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">

<div className="flex items-center gap-space-xs overflow-x-auto pb-1 -mx-margin px-margin lg:mx-0 lg:px-0">{['Semua Topik',...new Set(materials.map(m=>m.subject))].map(s=><button key={s} onClick={()=>setSubject(s)} aria-pressed={subject===s} className="px-4 py-2 rounded-full bg-surface border border-divider">{s}</button>)}</div>

<div className="flex items-center gap-space-sm shrink-0 flex-wrap">
<div className="relative inline-block text-left">
<select aria-label="Filter status belajar" className="appearance-none bg-surface text-primary font-label text-label pl-3.5 pr-8 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary cursor-pointer">
<option>Semua Status</option>
<option>Sedang Dipelajari</option>
<option>Belum Mulai</option>
<option>Selesai</option>
</select>
<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">expand_more</span>
</span>
</div>
<div className="relative inline-block text-left">
<select aria-label="Urutkan materi" className="appearance-none bg-surface text-primary font-label text-label pl-3.5 pr-8 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary cursor-pointer">
<option>Terakhir Dipelajari</option>
<option>Terbaru Ditambahkan</option>
<option>A-Z Judul</option>
</select>
<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">sort</span>
</span>
</div>
<div className="flex items-center bg-surface p-1 rounded-xl shadow-sm">
<button aria-label="Tampilan kartu" className="p-1.5 rounded-lg bg-surface-container text-primary" type="button" onClick={()=>setList(false)} aria-pressed={!list}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">grid_view</span>
</button>
<button aria-label="Tampilan daftar" className="p-1.5 rounded-lg text-outline hover:text-primary transition-colors" type="button" onClick={()=>setList(true)} aria-pressed={list}>
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">format_list_bulleted</span>
</button>
</div>
</div>
</div>
</section>

<section aria-label="Daftar Modul Belajar" className={"grid gap-6 "+(list?"grid-cols-1":"grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>{filtered.map(item=>(<article className="flex flex-col justify-between bg-surface rounded-3xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative" key={item.id}><div className="flex justify-between text-sm"><span>{item.subject}</span><span>{item.is_demo?'Materi contoh':'Materi kamu'}</span></div><div className="my-5 p-5 rounded-2xl bg-mint-tint border border-divider"><span className="material-symbols-outlined text-4xl" aria-hidden="true">menu_book</span><p className="mt-3 text-sm">{item.concepts.length} konsep · {item.question_count} soal</p></div><h2 className="text-xl font-bold">{item.title}</h2><p className="text-sm mt-3">{completed(item.id)} / {item.concepts.length} konsep dibaca</p><div className="h-2 rounded-full bg-mint-tint my-4"><div className="h-full bg-primary rounded-full" style={{width:`${item.concepts.length?Math.min(100,completed(item.id)/item.concepts.length*100):0}%`}}/></div><button onClick={()=>onDetail(item)} className="bg-primary text-white rounded-xl px-5 py-3 font-bold">Buka Ringkasan →</button></article>))}{!filtered.length&&<div className="col-span-full text-center bg-mint-tint rounded-3xl p-12"><h2 className="text-2xl font-bold">{materials.length?"Belum ada materi yang cocok":"Belum ada materi tersimpan"}</h2><p className="mt-3">{materials.length?"Coba kata kunci atau filter lain.":"Tambahkan PDF atau tempel catatanmu untuk mulai belajar."}</p><button className="mt-6 bg-primary text-white px-5 py-3 rounded-xl" onClick={()=>{if(materials.length){setQuery("");setSubject("Semua Topik");setStatus("all")}else onUpload()}}>{materials.length?"Hapus filter":"Tambah materi"}</button></div>}</section>

<section aria-label="Catatan Pendamping dari Mimo" className="w-full bg-surface rounded-3xl p-space-lg lg:p-space-xl shadow-sm flex flex-col md:flex-row items-center gap-space-lg">
<div className="w-28 h-28 shrink-0 flex items-center justify-center bg-mint-tint rounded-2xl p-2 relative">

<svg className="w-24 h-24" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">

<circle cx="80" cy="85" fill="#C8E8CE" r="48"></circle>
<path d="M45 105 C30 115, 25 135, 40 145 C55 155, 75 140, 65 125 C60 118, 50 120, 52 130" fill="none" stroke="#C8E8CE" strokeLinecap="round" strokeWidth="12"></path>

<path d="M80 32 C70 45, 90 45, 80 32" fill="#C8E8CE"></path>

<rect fill="#001766" height="15" rx="4" width="76" x="42" y="55"></rect>
<polygon fill="#FFFFFF" points="80,57 76,64 81,64 77,70 85,63 80,63"></polygon>

<ellipse cx="68" cy="80" fill="#FFCA9D" opacity="0.7" rx="10" ry="7"></ellipse>
<ellipse cx="98" cy="80" fill="#FFCA9D" opacity="0.7" rx="10" ry="7"></ellipse>

<circle cx="70" cy="74" fill="#112520" r="6"></circle>
<circle cx="72" cy="72" fill="#FFFFFF" r="2"></circle>
<path d="M93 74 Q98 70 103 74" fill="none" stroke="#112520" strokeLinecap="round" strokeWidth="2.5"></path>

<path d="M78 88 Q83 94 88 88" fill="none" stroke="#112520" strokeLinecap="round" strokeWidth="2.5"></path>

<ellipse cx="80" cy="115" fill="#EAF6EB" rx="14" ry="12"></ellipse>
</svg>
</div>
<div className="flex flex-col gap-space-xs text-center md:text-left">
<div className="inline-flex items-center justify-center md:justify-start gap-1.5 text-secondary font-label text-label">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">verified</span>
          Catatan Sahabat Belajar dari Mimo
        </div>
<blockquote className="font-mimo-voice text-mimo-voice text-primary max-w-3xl">
          “Semua materi yang kamu unggah bakal otomatis disesuaikan dengan preferensi bacamu (font ramah disleksia, pemenggal suku kata, dan pemecah durasi 15 menit). Belajar jadi tenang tanpa pusing!”
        </blockquote>
<div className="flex items-center justify-center md:justify-start gap-space-sm mt-1 text-on-surface-variant font-metadata text-metadata">
<span>✓ Otomatis simpan posisi baca</span>
<span>•</span>
<span>✓ Mode bebas distraksi aktif</span>
<span>•</span>
<span>✓ Sesuai standar kurikulum nasional</span>
</div>
</div>
</section>
</div>
</div>
</div></>);}
