import type {
  LearningSession,
  Material,
  Mode,
  Plan,
  Profile,
  Recommendation,
} from "@/lib/types";
import { Mimo } from "./profile";
export function Dashboard({
  profile,
  materials,
  sessions,
  plans,
  recommendation,
  start,
  navigate,
}: {
  profile: Profile;
  materials: Material[];
  sessions: LearningSession[];
  plans: Plan[];
  recommendation: Recommendation | null;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
  navigate: (p: string) => void;
}) {
  const material =
      materials.find((m) => m.id === recommendation?.material_id) ||
      materials[0],
    concept = material?.concepts.find(
      (c) => c.id === recommendation?.concept_id,
    ),
    activities = plans.flatMap((p) => p.activities),
    completed = activities.filter((a) => a.status === "completed").length,
    total = activities.filter((a) => a.status !== "skipped").length,
    percent = total ? Math.round((completed / total) * 100) : 0;
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: profile.timezone,
  });
  return (
    <>
      <div className="intro">
        <div>
          <h1>
            Halo, {profile.display_name}! Siap belajar
            <br />
            bareng Mimo hari ini?
          </h1>
          <p>
            {date} • Ritme belajarmu dirancang seringan mungkin
            <br />
            tanpa target yang menumpuk.
          </p>
        </div>
        {profile.preferences.show_mimo && (
          <div className="mimo-message">
            <Mimo />
            <div>
              <small>Mimo • Teman Belajarmu</small>
              <p>
                “Kita mulai dengan satu langkah ringan. Nggak usah buru-buru,
                nikmati aja prosesnya ya!”
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="columns">
        <div>
          <section className="hero">
            <span className="pill dark">✧ REKOMENDASI ADAPTIF HARI INI</span>
            <div>
              <span className="pill">
                ◷ {recommendation?.estimated_minutes || profile.daily_minutes}{" "}
                Menit • Sesuai ritmemu
              </span>
            </div>
            <small>
              {material?.subject || "MATERI BELAJAR"} •{" "}
              {material?.is_demo ? "MATERI CONTOH" : "MATERI KAMU"}
            </small>
            <h2>
              Langkah terbaikmu hari ini:{" "}
              {concept?.title || material?.title || "Pilih satu materi ringan"}
            </h2>
            <div className="reason">
              <b>Kenapa Mimo menyarankan langkah ini?</b>
              <p>
                {recommendation?.reason ||
                  "Mulai dari konsep pertama. Hasil latihanmu nanti membantu Mimo menyarankan langkah berikutnya."}
              </p>
            </div>
            <div className="actions">
              <button
                className="primary"
                disabled={!material}
                onClick={() =>
                  start(material, undefined, recommendation?.concept_id)
                }
              >
                Mulai sekarang →
              </button>
              <button onClick={() => navigate("Progres")}>
                Lihat dasar rekomendasi
              </button>
              {material?.concepts.every((c) => c.transcript) && (
                <button onClick={() => start(material, "transcript")}>
                  Coba format audio
                </button>
              )}
            </div>
            <button
              className="text-button"
              onClick={() => navigate("Materi Saya")}
            >
              Lewati dulu (tanpa penalti) →
            </button>
          </section>
          <section>
            <div className="section-title">
              <h2>Jadwal Belajar</h2>
              <button onClick={() => navigate("Rencana Belajar")}>
                Atur waktu
              </button>
            </div>
            <p className="muted">
              Total waktu harian pilihanmu: {profile.daily_minutes} menit
            </p>
            {activities
              .filter((a) => a.status !== "skipped")
              .slice(0, 3)
              .map((a) => (
                <div className="schedule" key={a.id}>
                  <span className="book">▤</span>
                  <div>
                    <span className="pill">
                      {a.duration_minutes} menit •{" "}
                      {a.status === "completed" ? "Selesai" : "Rencana kamu"}
                    </span>
                    <h3>{a.title}</h3>
                    <p>
                      {new Date(a.start_at).toLocaleString("id-ID", {
                        timeZone: profile.timezone,
                      })}
                    </p>
                  </div>
                  <button onClick={() => navigate("Rencana Belajar")}>
                    Lihat →
                  </button>
                </div>
              ))}
            {activities.length === 0 && (
              <div className="empty-state">
                <h3>Belum ada jadwal, dan itu nggak apa-apa.</h3>
                <p>Susun satu kegiatan pendek saat kamu siap.</p>
                <button onClick={() => navigate("Rencana Belajar")}>
                  Buat rencana ringan
                </button>
              </div>
            )}
            <p className="footnote">
              Jadwal ini saran lembut. Kamu bebas menyesuaikan ritme kapan saja.
            </p>
          </section>
          <div className="section-title">
            <h2>Materi untukmu</h2>
            <button
              className="text-button"
              onClick={() => navigate("Materi Saya")}
            >
              Semua materi →
            </button>
          </div>
          <div className="material-grid">
            {materials.slice(0, 4).map((m) => (
              <button
                className="material-card"
                key={m.id}
                onClick={() => start(m)}
              >
                <small>
                  {m.subject} • {m.is_demo ? "Materi contoh" : "Materi pribadi"}
                </small>
                <h3>{m.title}</h3>
                <p>
                  {m.concepts.length} konsep •{" "}
                  {
                    sessions.filter(
                      (s) => s.material_id === m.id && s.status === "completed",
                    ).length
                  }{" "}
                  sesi selesai
                </p>
                <span>Belajar →</span>
              </button>
            ))}
          </div>
        </div>
        <div className="right">
          <section>
            <h3>⚑ Langkah dalam rencanamu</h3>
            <div className="target">
              <div className="ring">
                {completed}/{total}
                <small>kegiatan</small>
              </div>
              <div>
                <b>{total ? `${percent}% tercapai` : "Mulai pelan-pelan"}</b>
                <p>
                  {total
                    ? "Setiap kegiatan selesai adalah satu langkah berarti."
                    : "Belum ada target yang disimpan. Kamu bisa mulai kapan saja."}
                </p>
              </div>
            </div>
            <div className="stats">
              <div>
                <small>Waktu pilihan</small>
                <b>{profile.daily_minutes} Menit</b>
              </div>
              <div>
                <small>Sesi selesai</small>
                <b>{sessions.filter((s) => s.status === "completed").length}</b>
              </div>
            </div>
          </section>
          <section>
            <h3>Unggah Materi Ujian</h3>
            <p>Ingin Mimo bantu menyusun catatan sekolahmu?</p>
            <div className="upload">
              <span>▧</span>
              <p>PDF berbasis teks atau teks tempel</p>
              <small>PDF maksimal 10 MB</small>
              <button onClick={() => navigate("Materi Saya")}>
                + Tambah materi baru
              </button>
            </div>
          </section>
          <section>
            <h3>Pintasan Aksesibilitas</h3>
            <p>Atur ukuran teks, kontras, penggaris baca, dan baca nyaring.</p>
            <button onClick={() => navigate("Pengaturan")}>
              Sesuaikan ruang baca
            </button>
          </section>
          <div className="gentle">
            Istirahat juga bagian dari belajar. Mimo siap saat kamu siap.
          </div>
        </div>
      </div>
      <div className="zero">
        <span>♡</span>
        <div>
          <b>Prinsip Nol Rasa Bersalah (Zero-Guilt Learning)</b>
          <p>
            Hari ini capek atau ada ulangan mendadak? Tinjau ulang rencanamu
            tanpa pengurangan nilai. Langkah kecilmu tetap berarti.
          </p>
        </div>
      </div>
    </>
  );
}
