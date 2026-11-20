import Image from "next/image";

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
          <Image src="/design/mimo-final.png" alt="" width={40} height={40} />
        </span>
      )}
      <div className="mimo-loading-copy">
        <span>{label}</span>
        <span className="mimo-loading-track" aria-hidden="true" />
      </div>
    </div>
  );
}
