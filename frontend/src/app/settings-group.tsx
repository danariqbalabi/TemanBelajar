"use client";
import { Children, type ReactNode } from "react";

export function SettingsGroup({
  title,
  icon,
  description,
  children,
  id,
  headingId,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  description: string;
  children: ReactNode;
  id?: string;
  headingId: string;
  defaultOpen?: boolean;
}) {
  return (
    <details id={id} className="settings-group" open={defaultOpen}>
      <summary>
        <span
          className="settings-group-icon material-symbols-outlined"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="settings-group-copy">
          <span id={headingId} className="settings-group-title">
            {title}
          </span>
          <span className="settings-group-description">{description}</span>
        </span>
        <span
          className="settings-group-chevron material-symbols-outlined"
          aria-hidden="true"
        >
          expand_more
        </span>
      </summary>
      <div className="settings-group-body">
        {Children.toArray(children).slice(1)}
      </div>
    </details>
  );
}
