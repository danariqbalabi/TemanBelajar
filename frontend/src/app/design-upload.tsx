"use client";
import { useRef, useState } from "react";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function UploadDesign({
  title,
  text,
  file,
  validation,
  busy,
  setTitle,
  setText,
  setFile,
  onSubmit,
  onBack,
}: {
  title: string;
  text: string;
  file: File | null;
  validation: string;
  busy: boolean;
  setTitle: (s: string) => void;
  setText: (s: string) => void;
  setFile: (f: File | null) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [kind, setKind] = useState<"pdf" | "text">(
    file ? "pdf" : text ? "text" : "pdf",
  );
  const input = useRef<HTMLInputElement>(null);
  return (
    <Workspace screen={9}>
      <WorkspaceHeading
        title="Tambah materi"
        description="Dari sumbermu, jadi langkah belajar."
        back={onBack}
      />
      <div className="workspace-upload-layout">
        <form
          className="workspace-panel workspace-upload-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <label className="workspace-field">
            Judul materi
            <input
              value={title}
              maxLength={200}
              required
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Fotosintesis"
            />
          </label>
          <div className="workspace-segments" aria-label="Sumber materi">
            <button
              type="button"
              aria-pressed={kind === "pdf"}
              disabled={busy}
              onClick={() => {
                setKind("pdf");
                setText("");
              }}
            >
              <UiIcon name="picture_as_pdf" />
              Dokumen PDF
            </button>
            <button
              type="button"
              aria-pressed={kind === "text"}
              disabled={busy}
              onClick={() => {
                setKind("text");
                setFile(null);
              }}
            >
              <UiIcon name="edit_note" />
              Tempel Rangkuman
            </button>
          </div>
          {kind === "pdf" ? (
            <div
              className="workspace-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!busy) setFile(e.dataTransfer.files[0] || null);
              }}
            >
              <span className="workspace-upload-icon">
                <UiIcon name={file ? "task_alt" : "upload_file"} />
              </span>
              <strong>{file ? file.name : "Letakkan PDF di sini"}</strong>
              <span>
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "Maks. 4 MB / 50 halaman"}
              </span>
              <input
                ref={input}
                type="file"
                accept=".pdf,application/pdf"
                aria-label="Pilih PDF"
                hidden
                disabled={busy}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="workspace-actions">
                <button
                  type="button"
                  className="workspace-button"
                  disabled={busy}
                  onClick={() => input.current?.click()}
                >
                  {file ? "Ganti File" : "Pilih PDF"}
                </button>
                {file && (
                  <button
                    type="button"
                    className="workspace-button"
                    aria-label="Hapus file pilihan"
                    disabled={busy}
                    onClick={() => {
                      setFile(null);
                      if (input.current) input.current.value = "";
                    }}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label className="workspace-field">
              Teks materi
              <textarea
                aria-label="Teks materi"
                value={text}
                rows={10}
                maxLength={100000}
                disabled={busy}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tempel teks sumber di sini..."
              />
              <small>
                {text.length.toLocaleString("id-ID")} / 100.000 karakter / min.
                30
              </small>
            </label>
          )}
          {validation && (
            <p className="workspace-inline-error" role="alert">
              {validation}
            </p>
          )}
          <div className="workspace-form-footer">
            <button
              type="submit"
              className="workspace-button primary"
              disabled={busy}
            >
              Simpan sumber & lanjut
              <UiIcon name="arrow_forward" />
            </button>
          </div>
        </form>
        <aside className="workspace-upload-guide">
          <span className="workspace-eyebrow">Setelah ini</span>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Simpan sumber</strong>
                <p>Materi asli tetap bisa dibuka.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Susun materi</strong>
                <p>Mulai proses AI saat kamu siap.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Pilih cara belajar</strong>
                <p>Baca dan latihan sesuai ritmemu.</p>
              </div>
            </li>
          </ol>
          <details className="workspace-disclosure">
            <summary>Format yang didukung</summary>
            <p>
              PDF berbasis teks atau teks tempel. Foto dan PDF hasil scan belum
              didukung.
            </p>
          </details>
        </aside>
      </div>
    </Workspace>
  );
}
