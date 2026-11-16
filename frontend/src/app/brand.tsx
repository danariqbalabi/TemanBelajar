import Image from "next/image";

/** One wordmark, including its icon; do not add a second product name beside it. */
export function Brand() {
  return (
    <Image
      className="brand-logo"
      src="/design/logo-final.png"
      alt="TemanBelajar"
      width={1024}
      height={280}
      priority
    />
  );
}
