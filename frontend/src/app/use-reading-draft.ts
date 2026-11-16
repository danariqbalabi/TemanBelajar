"use client";
import { useEffect, useState } from "react";
import type { LearningSession } from "@/lib/types";

export function useReadingDraft(session: LearningSession) {
  const key = `temanbelajar-draft:${session.id}`;
  const [state, setState] = useState(() => {
    let text = session.draft;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null && stored.length <= 3000) text = stored;
    } catch {
      /* Browser storage may be disabled. */
    }
    return { text, server: session.draft };
  });
  const [storageFailed, setStorageFailed] = useState(false);
  // Adopt server updates only while clean; never replace edits made during a save.
  if (state.server !== session.draft) {
    setState({
      text: state.text === state.server ? session.draft : state.text,
      server: session.draft,
    });
  }
  const dirty = state.text !== session.draft;
  useEffect(() => {
    try {
      if (dirty) localStorage.setItem(key, state.text);
      else localStorage.removeItem(key);
      queueMicrotask(() => setStorageFailed(false));
    } catch {
      queueMicrotask(() => setStorageFailed(true));
    }
  }, [key, state.text, dirty]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return {
    draft: state.text,
    setDraft: (text: string) => setState({ text, server: session.draft }),
    draftNotice: dirty
      ? storageFailed
        ? "Catatan belum tersimpan. Penyimpanan browser tidak tersedia; simpan ke akun sebelum meninggalkan halaman."
        : "Draf catatan disimpan di browser ini. Tekan Simpan catatan agar tersedia di perangkat lain."
      : null,
  };
}
