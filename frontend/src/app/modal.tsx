"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="stitch-reason"
      aria-label={title}
      onCancel={onClose}
    >
      <h2 className="ui-section-title">{title}</h2>
      {children}
      <button type="button" onClick={onClose}>
        Tutup sumber
      </button>
    </dialog>
  );
}
