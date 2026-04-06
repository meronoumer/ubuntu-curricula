import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import "./globals.css";

// ── Body font (clean, modern sans-serif) ──────────────────────────────────────
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// ── Heading font (warm editorial serif) ──────────────────────────────────────
// Lora is an elegant serif designed for on-screen reading — it gives
// headings warmth and authority without feeling stiff or academic.
const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ubuntu Curriculum",
  description:
    "Helping facilitators deliver structured community education programmes and track real outcomes — built for low-connectivity, high-impact field work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
