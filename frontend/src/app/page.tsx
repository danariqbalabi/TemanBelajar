"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { api, ApiError, auth, mutation } from "@/lib/api";
import { userMessage } from "@/lib/errors";
import { finishAuthReturn } from "@/lib/auth-return";
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
import { LearningStart } from "./learning-start";
import { reactMimo } from "@/lib/mimo";
import { Reader } from "./reader";
import { Planner } from "./planner";
import { DemoTour } from "./demo-tour";
import { ProgressView } from "./progress";
import { Dashboard } from "./dashboard";
import { DesignShell } from "./design-shell";
import { MimoLoading } from "./mimo-loading";
export type Run = (action: () => Promise<void>) => Promise<void>;
async function readWorkspace(minutes: number) {
  const [m, s, p] = await Promise.all([
    api<{ items: Material[] }>("/materials"),
    api<{ items: LearningSession[] }>("/sessions"),
    api<{ items: Plan[] }>("/plans"),
  ]);
  const recent = [...s.items].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  )[0];
  const target =
    m.items.find((item) => item.id === recent?.material_id) || m.items[0];
  const recommendation = target
    ? await api<Recommendation>(
        `/recommendations?material_id=${encodeURIComponent(target.id)}&available_minutes=${minutes}`,
      )
    : null;
  return {
    materials: m.items,
    sessions: s.items,
    plans: p.items,
    recommendation,
  };
}
export default function Home() {
  const [tour, setTour] = useState(false);
  const [accountEntry, setAccountEntry] = useState(false);
  const [accountMode, setAccountMode] = useState<"login" | "register">(
    "login",
  );
  const [account, setAccount] = useState<Session | null>(null),
    [ready, setReady] = useState(false),
    [loadedUserId, setLoadedUserId] = useState<string | null>(null),
    [loadFailure, setLoadFailure] = useState(""),
    [loadRevision, setLoadRevision] = useState(0),
    [profile, setProfile] = useState<Profile>(defaultProfile),
    [onboarding, setOnboarding] = useState(false),
    [materials, setMaterials] = useState<Material[]>([]),
    [sessions, setSessions] = useState<LearningSession[]>([]),
    [plans, setPlans] = useState<Plan[]>([]),
    [page, setPage] = useState("Beranda"),
    [active, setActive] = useState<LearningSession | null>(null),
    [practiceRequested, setPracticeRequested] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [recommendation, setRecommendation] = useState<Recommendation | null>(null),
    [landing, setLanding] = useState(true);
  const retry = useRef<null | (() => Promise<void>)>(null);
  const workspaceEpoch = useRef(0);
  const dailyMinutes = useRef(defaultProfile.daily_minutes);
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
  const applyWorkspace = useCallback(
    (data: Awaited<ReturnType<typeof readWorkspace>>) => {
      setMaterials(data.materials);
      setSessions(data.sessions);
      setPlans(data.plans);
      setRecommendation(data.recommendation);
    },
    [],
  );
  const refresh = useCallback(async () => {
    const epoch = workspaceEpoch.current;
    const data = await readWorkspace(dailyMinutes.current);
    if (epoch === workspaceEpoch.current) applyWorkspace(data);
  }, [applyWorkspace]);
  useEffect(() => {
    if (!auth) {
      queueMicrotask(() => setReady(true));
      return;
    }
    let alive = true;
    let authRevision = 0;
    const { data } = auth.auth.onAuthStateChange((event, s) => {
      authRevision += 1;
      setAccount(s);
      if (event === "SIGNED_IN" && s) {
        setLanding(false);
        setAccountEntry(false);
      }
    });
    const revision = authRevision;
    finishAuthReturn(auth)
      .then(({ session, callback }) => {
        if (!alive) return;
        if (callback || revision === authRevision) setAccount(session);
        if (callback || (session && !session.user.is_anonymous))
          setLanding(false);
        setReady(true);
      })
      .catch((e) => {
        if (!alive) return;
        setAccount(null);
        setLanding(false);
        setAccountEntry(true);
        setReady(true);
        setError(userMessage(e));
      });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  const userId = account?.user.id;
  const anonymous = account?.user.is_anonymous;
  const accountName = account?.user.user_metadata?.display_name;
  useEffect(() => {
    const epoch = ++workspaceEpoch.current;
    if (!userId) return;
    let alive = true;
    Promise.resolve()
      .then(async () => {
        if (!alive) return;
        setLoadFailure("");
        setLoadedUserId(null);
        setActive(null);
        setPage("Beranda");
        retry.current = null;
        setError("");
        setNotice("");
        let needsProfile = false;
        const loadedProfile = await api<Profile>("/profile").catch((e) => {
          if (e instanceof ApiError && e.status === 404) {
            needsProfile = !anonymous;
            const name = accountName;
            return {
              ...defaultProfile,
              display_name: needsProfile
                ? typeof name === "string" && name.trim()
                  ? name.trim().slice(0, 80)
                  : "Teman"
                : "Manda",
            };
          }
          throw e;
        });
        const data = await readWorkspace(loadedProfile.daily_minutes);
        if (!alive || epoch !== workspaceEpoch.current) return;
        dailyMinutes.current = loadedProfile.daily_minutes;
        setProfile(loadedProfile);
        setOnboarding(needsProfile);
        applyWorkspace(data);
        setLoadedUserId(userId);
      })
      .catch((e) => {
        if (alive) setLoadFailure(userMessage(e));
      });
    return () => {
      alive = false;
    };
  }, [userId, anonymous, accountName, loadRevision, applyWorkspace]);
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
  async function start(
    material: Material,
    mode?: Mode,
    conceptId?: string,
    practice = false,
  ) {
    const existing = sessions.find(
      (s) => s.material_id === material.id && s.status !== "completed",
    );
    const preferredMode = mode || existing?.mode || profile.preferences.mode;
    const target =
      material.concepts.find(
        (c) => c.id === (conceptId || existing?.concept_id),
      ) ?? material.concepts[0];
    const supported =
      preferredMode === "transcript"
        ? !!target?.transcript
        : preferredMode === "explore"
          ? !!target?.diagram_description
          : true;
    const chosenMode = supported ? preferredMode : "reading";
    let create: (() => Promise<LearningSession>) | undefined;
    let recovered = existing;
    let change: (() => Promise<LearningSession>) | undefined;
    await run(async () => {
      if (!target)
        throw new Error("Materi ini belum punya konsep yang bisa dibuka.");
      create ||= mutation<LearningSession>("/sessions", {
        material_id: material.id,
        mode: chosenMode,
        concept_id: target.id,
      });
      let s = recovered || (await create());
      recovered = s;
      const changingConcept = s.concept_id !== target.id;
      if (changingConcept || s.mode !== chosenMode || s.status === "paused") {
        change ||= mutation<LearningSession>(
          `/sessions/${s.id}`,
          {
            expected_version: s.version,
            concept_id: target.id,
            paragraph: changingConcept ? 0 : s.paragraph,
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
      setPracticeRequested(practice);
      setPage("Mulai Belajar");
      setSessions((items) => [s, ...items.filter((item) => item.id !== s.id)]);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }
  async function saveProfile(p: Profile) {
    const clean = Object.fromEntries(
      Object.keys(defaultProfile).map((key) => [key, p[key as keyof Profile]]),
    ) as Profile;
    const saved = await api<Profile>(
      "/profile",
      { ...clean, expected_revision: p.revision || 0 },
      "PUT",
    );
    setProfile(saved);
    reactMimo({
      mood: "cheer",
      message: "Sudah tersimpan. Sekarang ruang belajarmu lebih pas buatmu!",
    });
    dailyMinutes.current = saved.daily_minutes;
    setOnboarding(false);
    setNotice("Preferensi tersimpan. Ritmemu bisa diubah kapan saja.");
  }
  function openAccount(mode: "login" | "register") {
    setAccountMode(mode);
    setLanding(false);
    setAccountEntry(true);
    setError("");
  }
  async function startDemo() {
    if (account) {
      setAccountEntry(false);
      if (account.user.is_anonymous) {
        setPage("Beranda");
        setTour(true);
      }
      setLanding(false);
      return;
    }
    await run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error: demoError } = await auth.auth.signInAnonymously();
      if (demoError) throw demoError;
      setLanding(false);
      setAccountEntry(false);
      setTour(true);
    });
  }
  const prefs = profile.preferences;
  const showAccount = landing || !account || accountEntry;
  const awaitingWorkspace = ready && !showAccount && loadedUserId !== userId;
  const workspacePage =
    ready && !showAccount && !awaitingWorkspace && !onboarding ? page : null;
  const loadingLabel = !ready
    ? "Menyiapkan ruang belajarmu"
    : awaitingWorkspace
      ? loadFailure
        ? null
        : "Memuat ruang belajarmu"
      : busy
        ? "Sebentar, ya"
        : null;
  function withLoading(content: ReactNode) {
    return (
      <>
        {content}
        <MimoLoading
          page={workspacePage}
          pendingLabel={loadingLabel}
          showMimo={prefs.show_mimo}
          reducedMotion={prefs.reduced_motion}
          highContrast={prefs.high_contrast}
        />
      </>
    );
  }

  if (!ready) return withLoading(null);
  if (!account || showAccount)
    return withLoading(
      <Account
        landing={landing}
        initialMode={accountMode}
        onClearError={() => {
          setError("");
          retry.current = null;
        }}
        onLogin={() => openAccount("login")}
        onRegister={() => openAccount("register")}
        onDemo={() => setTour(true)}
        onContinue={startDemo}
        onBack={() => setLanding(true)}
        run={run}
        busy={busy}
        error={error}
      />,
    );
  if (awaitingWorkspace)
    return withLoading(
      <main className="welcome">
        {loadFailure ? (
          <section>
            <h1>Ruang belajar belum berhasil dimuat</h1>
            <p role="alert">{loadFailure}</p>
            <p>
              Data akunmu belum diubah. Periksa koneksi, lalu coba muat kembali.
            </p>
            <button onClick={() => setLoadRevision((value) => value + 1)}>
              Coba muat kembali
            </button>
            <button onClick={() => setLanding(true)}>
              Kembali ke halaman awal
            </button>
          </section>
        ) : null}
      </main>,
    );
  if (onboarding)
    return withLoading(
      <Onboarding
        initial={profile}
        onBack={() => setOnboarding(false)}
        onSave={(p) => run(() => saveProfile(p))}
        busy={busy}
        error={error}
      />,
    );
  const selected = materials.find((m) => m.id === active?.material_id);
  return withLoading(
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
      {tour && (
        <DemoTour
          page={page}
          suspended={!!error}
          busy={busy}
          onClose={() => setTour(false)}
        />
      )}
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
              onClick={() => run(retry.current || refresh)}
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
      {page === "Beranda" && !tour && profile.onboarding_step < 4 && (
        <section className="stitch-screen bg-secondary-container rounded-2xl p-space-lg mb-space-lg">
          <h2 className="font-card-title text-card-title text-primary ui-card-title">
            Atur ritme belajarmu saat kamu siap
          </h2>
          <p className="font-body text-body text-text-secondary">
            Kamu bisa langsung belajar dengan preferensi awal, atau
            menyesuaikannya lewat empat langkah singkat.
          </p>
          <button
            onClick={() => setOnboarding(true)}
            className="h-11 px-space-md mt-space-sm rounded-xl bg-primary text-on-primary font-label text-label"
          >
            Atur preferensi belajar
          </button>
        </section>
      )}
      {page === "Beranda" ? (
        <Dashboard
          busy={busy}
          onDemoTour={
            account.user.is_anonymous && !tour ? () => setTour(true) : undefined
          }
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
          defaultMode={prefs.mode}
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
          availableMinutes={profile.daily_minutes}
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
          onAccount={() => {
            setAccountMode("login");
            setAccountEntry(true);
            setError("");
          }}
          signOut={() =>
            run(async () => {
              const { error: signOutError } = await auth!.auth.signOut();
              if (signOutError) throw signOutError;
              workspaceEpoch.current += 1;
              setLoadedUserId(null);
              setOnboarding(false);
              setProfile(defaultProfile);
              setMaterials([]);
              setSessions([]);
              setPlans([]);
              setActive(null);
              setLanding(true);
            })
          }
        />
      ) : page === "Mulai Belajar" && selected && active ? (
        <Reader
          availableMinutes={profile.daily_minutes}
          key={active.id}
          initialPractice={practiceRequested}
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
        <LearningStart
          materials={materials}
          sessions={sessions}
          busy={busy}
          start={start}
          onMaterials={() => setPage("Materi Saya")}
        />
      )}
    </DesignShell>,
  );
}
