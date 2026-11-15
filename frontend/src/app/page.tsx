"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { api, ApiError, auth, mutation } from "@/lib/api";
import { userMessage } from "@/lib/errors";
import {
  defaultProfile,
  type Material,
  type Profile,
  type LearningSession,
  type Mode,
  type Recommendation,
  type Plan,
} from "@/lib/types";
import { Account, Onboarding, Settings } from "./profile";
import { Materials } from "./materials";
import { Reader } from "./reader";
import { Planner } from "./planner";
import { ProgressView } from "./progress";
import { Dashboard } from "./dashboard";
import { DesignShell } from "./design-shell";
export type Run = (action: () => Promise<void>) => Promise<void>;
export default function Home() {
  const [account, setAccount] = useState<Session | null>(null),
    [ready, setReady] = useState(false),
    [profile, setProfile] = useState<Profile>(defaultProfile),
    [onboarding, setOnboarding] = useState(false),
    [materials, setMaterials] = useState<Material[]>([]),
    [sessions, setSessions] = useState<LearningSession[]>([]),
    [plans, setPlans] = useState<Plan[]>([]),
    [page, setPage] = useState("Beranda"),
    [active, setActive] = useState<LearningSession | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [recommendation, setRecommendation] = useState<Recommendation | null>(null),
    [landing, setLanding] = useState(true);
  const retry = useRef<null | (() => Promise<void>)>(null);
  const running = useRef(false);
  const run = useCallback(async (action: () => Promise<void>) => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    retry.current = action;
    try {
      await action();
      retry.current = null;
    } catch (e) {
      setError(userMessage(e));
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, []);
  const refresh = useCallback(async () => {
    const [m, s, p] = await Promise.all([
      api<{ items: Material[] }>("/materials"),
      api<{ items: LearningSession[] }>("/sessions"),
      api<{ items: Plan[] }>("/plans"),
    ]);
    setMaterials(m.items);
    setSessions(s.items);
    setPlans(p.items);
    if (m.items[0])
      setRecommendation(
        await api<Recommendation>(
          `/recommendations?material_id=${encodeURIComponent(m.items[0].id)}&available_minutes=15`,
        ),
      );
  }, []);
  useEffect(() => {
    if (!auth) {
      queueMicrotask(() => setReady(true));
      return;
    }
    auth.auth
      .getSession()
      .then(({ data }) => {
        setAccount(data.session);
        setReady(true);
      })
      .catch((e) => {
        setReady(true);
        setError(userMessage(e));
      });
    const { data } = auth.auth.onAuthStateChange((_event, s) => {
      setAccount(s);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const userId = account?.user.id;
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    Promise.all([
      api<Profile>("/profile")
        .then((p) => {
          if (alive) {
            setProfile(p);
            setOnboarding(p.onboarding_step < 4);
          }
        })
        .catch((e) => {
          if (e instanceof ApiError && e.status === 404) {
            if (alive) setOnboarding(true);
          } else throw e;
        }),
      Promise.resolve().then(refresh),
    ]).catch((e) => {
      if (alive) setError(userMessage(e));
    });
    return () => {
      alive = false;
    };
  }, [userId, refresh]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setPage("Pengaturan");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  async function start(material: Material, mode?: Mode, conceptId?: string) {
    const existing = sessions.find(
      (s) => s.material_id === material.id && s.status !== "completed",
    );
    const preferredMode = mode || existing?.mode || profile.preferences.mode;
    const supported =
      preferredMode === "transcript"
        ? material.concepts.every((c) => c.transcript)
        : preferredMode === "explore"
          ? material.concepts.every((c) => c.diagram_description)
          : true;
    const chosenMode = supported ? preferredMode : "reading";
    const create = mutation<LearningSession>("/sessions", {
      material_id: material.id,
      mode: chosenMode,
    });
    let recovered = existing;
    let change: (() => Promise<LearningSession>) | undefined;
    await run(async () => {
      let s = recovered || (await create());
      recovered = s;
      if (conceptId || s.mode !== chosenMode) {
        change ||= mutation<LearningSession>(
          `/sessions/${s.id}`,
          {
            expected_version: s.version,
            concept_id: conceptId || s.concept_id,
            paragraph: conceptId ? 0 : s.paragraph,
            mode: chosenMode,
            status: "active",
            completed_concepts: s.completed_concepts,
            draft: s.draft,
          },
          "PUT",
        );
        s = await change();
        recovered = s;
      }
      setActive(s);
      setPage("Mulai Belajar");
      await refresh();
    });
  }
  async function saveProfile(p: Profile) {
    const clean = Object.fromEntries(
      Object.keys(defaultProfile).map((key) => [key, p[key as keyof Profile]]),
    ) as Profile;
    await api("/profile", clean, "PUT");
    setProfile(clean);
    setOnboarding(false);
    setNotice("Preferensi tersimpan. Ritmemu bisa diubah kapan saja.");
  }
  if (!ready)
    return (
      <main className="welcome">
        <p role="status">Menyiapkan ruang belajarmu...</p>
      </main>
    );
  if (!account)
    return (
      <Account
        landing={landing}
        onContinue={() => setLanding(false)}
        onBack={() => setLanding(true)}
        run={run}
        busy={busy}
        error={error}
      />
    );
  if (onboarding)
    return (
      <Onboarding
        initial={profile}
        onSave={(p) => run(() => saveProfile(p))}
        busy={busy}
        error={error}
      />
    );
  const selected = materials.find((m) => m.id === active?.material_id),
    prefs = profile.preferences;
  return (
    <DesignShell
      profile={profile}
      page={page}
      navigate={setPage}
      className={`${prefs.reduced_motion ? "calm" : ""} ${prefs.high_contrast ? "high-contrast" : ""}`}
      style={
        {
          "--reader-size": `${prefs.font_size}px`,
          "--reader-line": prefs.line_height,
          "--reader-width": `${prefs.reading_width}ch`,
          "--reader-spacing": `${prefs.letter_spacing}em`,
        } as React.CSSProperties
      }
    >
      {" "}
      {error && (
        <div className="notice" role="alert">
          <p>{error}</p>
          <p>
            Input tetap tersedia. Jika versi berubah, muat data terbaru lalu
            tinjau kembali.
          </p>
          <div className="actions">
            <button
              disabled={busy}
              onClick={() => retry.current && run(retry.current)}
            >
              Coba lagi
            </button>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await refresh();
                  if (active)
                    setActive(
                      await api<LearningSession>(`/sessions/${active.id}`),
                    );
                  setNotice(
                    "Data terbaru dimuat. Tinjau kembali sebelum menyimpan.",
                  );
                })
              }
            >
              Muat data terbaru
            </button>
          </div>
        </div>
      )}
      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}
      {busy && (
        <p role="status" className="working">
          Menyimpan langkahmu...
        </p>
      )}
      {page === "Beranda" ? (
        <Dashboard
          profile={profile}
          materials={materials}
          sessions={sessions}
          plans={plans}
          recommendation={recommendation}
          start={start}
          navigate={setPage}
          onPreferences={(patch) =>
            run(() =>
              saveProfile({ ...profile, preferences: { ...prefs, ...patch } }),
            )
          }
        />
      ) : page === "Materi Saya" ? (
        <Materials
          sessions={sessions}
          onSettings={() => setPage("Pengaturan")}
          onPlan={() => setPage("Rencana Belajar")}
          onDefaultMode={(mode) =>
            saveProfile({ ...profile, preferences: { ...prefs, mode } })
          }
          materials={materials}
          run={run}
          busy={busy}
          refresh={refresh}
          start={start}
        />
      ) : page === "Rencana Belajar" ? (
        <Planner
          onMaterials={() => setPage("Materi Saya")}
          onBack={() => setPage("Beranda")}
          plans={plans}
          materials={materials}
          profile={profile}
          run={run}
          busy={busy}
          refresh={refresh}
          start={start}
        />
      ) : page === "Progres" ? (
        <ProgressView
          onPlan={() => setPage("Rencana Belajar")}
          onSettings={() => setPage("Pengaturan")}
          onBack={() => setPage("Beranda")}
          displayName={profile.display_name}
          timezone={profile.timezone}
          materials={materials}
          sessions={sessions}
          run={run}
          start={start}
        />
      ) : page === "Pengaturan" ? (
        <Settings
          onBack={() => setPage("Beranda")}
          profile={profile}
          onSave={(p) => run(() => saveProfile(p))}
          busy={busy}
          account={account}
          signOut={() =>
            run(async () => {
              await auth!.auth.signOut();
              setProfile(defaultProfile);
              setMaterials([]);
              setSessions([]);
              setPlans([]);
              setActive(null);
              setLanding(true);
            })
          }
        />
      ) : selected && active ? (
        <Reader
          key={active.id}
          material={selected}
          session={active}
          preferences={prefs}
          displayName={profile.display_name}
          onSettings={() => setPage("Pengaturan")}
          onBack={() => setPage("Materi Saya")}
          onPreferences={(patch) =>
            run(() =>
              saveProfile({ ...profile, preferences: { ...prefs, ...patch } }),
            )
          }
          run={run}
          busy={busy}
          onUpdate={(s) => {
            setActive(s);
            setSessions((items) => items.map((x) => (x.id === s.id ? s : x)));
          }}
          refresh={refresh}
          onPlanner={() => setPage("Rencana Belajar")}
        />
      ) : (
        <section>
          <h1>Mulai dengan satu langkah kecil</h1>
          <p>Pilih materi dan format yang nyaman.</p>
          <div className="material-grid">
            {materials.map((m) => (
              <button
                className="material-card"
                key={m.id}
                onClick={() => start(m)}
              >
                <small>{m.subject}</small>
                <h2>{m.title}</h2>
                <span>Mulai belajar →</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </DesignShell>
  );
}
