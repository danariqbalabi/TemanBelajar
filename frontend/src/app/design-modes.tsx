"use client";
import { useState } from "react";
import type { Material, Mode } from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
const modes: {
  id: Mode;
  title: string;
  icon: string;
  description: string;
  color: string;
}[] = [
  {
    id: "reading",
    title: "Teman Baca",
    icon: "auto_stories",
    description: "Teks lapang dengan alat bantu baca.",
    color: "mint",
  },
  {
    id: "focus",
    title: "Selangkah demi Selangkah",
    icon: "view_carousel",
    description: "Satu bagian setiap langkah.",
    color: "lilac",
  },
  {
    id: "explore",
    title: "Jelajah visual",
    icon: "hub",
    description: "Jelajahi penjelasan diagram.",
    color: "peach",
  },
  {
    id: "transcript",
    title: "Transkrip & audio",
    icon: "headphones",
    description: "Baca transkrip atau dengarkan.",
    color: "butter",
  },
  {
    id: "standard",
    title: "Belajar standar",
    icon: "article",
    description: "Bacaan lengkap dalam satu tampilan.",
    color: "mint",
  },
];
export function ModePicker({
  material,
  busy,
  onBack,
  onSelect,
  canSaveDefault,
}: {
  material: Material;
  busy: boolean;
  onBack: () => void;
  onSelect: (mode: Mode, remember: boolean) => void;
  canSaveDefault: boolean;
}) {
  const [selected, setSelected] = useState<Mode>("reading");
  const [remember, setRemember] = useState(false);
  const available = (mode: Mode) =>
    mode === "explore"
      ? material.concepts.every((c) => c.diagram_description)
      : mode === "transcript"
        ? material.concepts.every((c) => c.transcript)
        : true;
  return (
    <Workspace screen={12}>
      <WorkspaceHeading
        title="Pilih cara belajar"
        description={material.title}
        back={onBack}
      />
      <fieldset className="workspace-mode-grid">
        <legend className="sr-only">Pilihan Cara Belajar</legend>
        {modes.map((mode) => (
          <label
            key={mode.id}
            className="workspace-mode mode-card"
            data-tone={mode.color}
            data-selected={selected === mode.id}
            data-disabled={!available(mode.id)}
          >
            <input
              type="radio"
              name="learning-mode"
              aria-label={mode.title}
              checked={selected === mode.id}
              disabled={busy || !available(mode.id)}
              onChange={() => setSelected(mode.id)}
            />
            <span className="workspace-mode-art">
              <UiIcon name={mode.icon} />
              <span aria-hidden="true" className="workspace-mode-lines">
                <i />
                <i />
                <i />
              </span>
            </span>
            <strong>{mode.title}</strong>
            <span>{mode.description}</span>
            {!available(mode.id) && (
              <small>Belum tersedia untuk materi ini</small>
            )}
          </label>
        ))}
      </fieldset>
      <footer className="workspace-selection-bar">
        <div>
          <span className="workspace-eyebrow">Pilihanmu</span>
          <strong>{modes.find((mode) => mode.id === selected)?.title}</strong>
          {canSaveDefault && (
            <label className="workspace-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Jadikan pilihan utama
            </label>
          )}
        </div>
        <button
          className="workspace-button primary"
          disabled={busy || !available(selected)}
          onClick={() => onSelect(selected, remember)}
        >
          Mulai belajar
          <UiIcon name="arrow_forward" />
        </button>
      </footer>
    </Workspace>
  );
}
