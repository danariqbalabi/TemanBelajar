import Image from "next/image";
import { useEffect, useState } from "react";

export function MimoPageCue({
  page,
  showMimo,
}: {
  page: string;
  showMimo: boolean;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 960);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <div className="mimo-page-overlay">
      <MimoLoading label={page} kind="navigation" showMimo={showMimo} />
    </div>
  );
}

export function MimoLoading({
  label,
  kind = "request",
  showMimo = true,
}: {
  label: string;
  kind?: "navigation" | "request" | "startup";
  showMimo?: boolean;
}) {
  const navigation = kind === "navigation";
  return (
    <div
      className="mimo-loading"
      data-kind={kind}
      role={navigation ? undefined : "status"}
      aria-hidden={navigation || undefined}
    >
      {showMimo && (
        <span className="mimo-loading-mascot" aria-hidden="true">
          <Image
            src="/design/mimo-final.png"
            alt=""
            width={navigation ? 88 : 40}
            height={navigation ? 88 : 40}
            loading="eager"
          />
        </span>
      )}
      <div className="mimo-loading-copy">
        {navigation && (
          <span className="mimo-page-title">
            {showMimo ? "Yuk, lanjut bareng Mimo!" : "Pindah halaman"}
          </span>
        )}
        <span>{label}</span>
        <span className="mimo-loading-track" aria-hidden="true" />
      </div>
    </div>
  );
}
