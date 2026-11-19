import type { ReactNode } from "react";

export function UiIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined" aria-hidden="true">
      {name}
    </span>
  );
}
export function Workspace({
  children,
  screen,
}: {
  children: ReactNode;
  screen: number;
}) {
  return (
    <div
      className={`final-design final-screen-${screen} screen-page workspace-page`}
    >
      <div className="workspace-container">{children}</div>
    </div>
  );
}
export function WorkspaceHeading({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: () => void;
  actions?: ReactNode;
}) {
  return (
    <header className="workspace-heading">
      <div>
        {back && (
          <button className="workspace-back" onClick={back}>
            <UiIcon name="arrow_back" />
            Kembali
          </button>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="workspace-actions">{actions}</div>}
    </header>
  );
}
