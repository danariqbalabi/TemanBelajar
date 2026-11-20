import Image from "next/image";
import { useEffect, useState } from "react";

const CUE_DURATION = 750;

export function MimoLoading({
  page,
  pendingLabel,
  showMimo,
  reducedMotion,
  highContrast,
}: {
  page: string | null;
  pendingLabel: string | null;
  showMimo: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}) {
  const [previousPage, setPreviousPage] = useState(page);
  const [navigation, setNavigation] = useState<string | null>(null);
  if (page !== previousPage) {
    setPreviousPage(page);
    setNavigation(page && previousPage ? page : null);
  }

  useEffect(() => {
    if (!navigation) return;
    const timer = window.setTimeout(() => setNavigation(null), CUE_DURATION);
    return () => window.clearTimeout(timer);
  }, [navigation]);

  const label = pendingLabel || navigation;
  const [lastLabel, setLastLabel] = useState(label);
  if (label && label !== lastLabel) setLastLabel(label);

  return (
    <div
      className="mimo-page-overlay"
      data-visible={!!label}
      data-kind={
        pendingLabel ? "pending" : navigation ? "navigation" : undefined
      }
      data-reduced-motion={reducedMotion}
      data-high-contrast={highContrast}
      aria-hidden={pendingLabel ? undefined : true}
      role={pendingLabel ? "status" : undefined}
    >
      <div className="mimo-page-popup">
        {showMimo && (
          <div className="mimo-page-art" aria-hidden="true">
            <span className="mimo-spark mimo-spark-left">✦</span>
            <Image
              src="/design/mimo-cheer-v2.png"
              width={144}
              height={144}
              alt=""
              loading="eager"
            />
            <span className="mimo-spark mimo-spark-right">✧</span>
          </div>
        )}
        <div className="mimo-page-caption">
          {label || lastLabel}
          <span className="mimo-page-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
