import { UiIcon } from "./workspace-ui";

export function ProfileSettingsButton({
  name,
  active,
  onSettings,
}: {
  name: string;
  active: boolean;
  onSettings: () => void;
}) {
  return (
    <button
      type="button"
      className="app-profile"
      aria-label={`Buka pengaturan profil ${name}`}
      aria-current={active ? "page" : undefined}
      onClick={onSettings}
    >
      <span className="app-avatar" aria-hidden="true">
        {name.trim().slice(0, 1).toLocaleUpperCase("id") || "T"}
      </span>
      <span className="app-profile-name">
        <span>{name}</span>
        <span>Pengaturan</span>
      </span>
      <UiIcon name="settings" />
    </button>
  );
}
