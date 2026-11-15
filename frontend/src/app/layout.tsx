import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TemanBelajar — belajar sesuai ritmemu', description: 'Teman belajar adaptif untuk SMP dan SMA.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="id"><body>{children}</body></html> }
