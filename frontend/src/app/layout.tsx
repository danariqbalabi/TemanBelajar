import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/nunito/400.css";
import "./globals.css";
import "./stitch.css";
import "./design-final.css";
import "./ui-consistency.css";
export const metadata: Metadata = {
  title: "TemanBelajar — belajar sesuai ritmemu",
  description: "Teman belajar adaptif untuk SMP dan SMA.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
