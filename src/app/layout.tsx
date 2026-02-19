import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Superior AI — Intelligent Voice Receptionist for Universities",
  description:
    "The enterprise AI voice agent that handles admissions, schedules visits, and manages every call — 24/7, in English & Urdu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} font-sans min-h-screen noise`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}