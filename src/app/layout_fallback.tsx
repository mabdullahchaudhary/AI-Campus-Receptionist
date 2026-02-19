// IF YOU CAN'T DOWNLOAD Cabinet Grotesk, use this layout instead:
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
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
    weight: ["500", "600", "700", "800"],
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
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${sora.variable} font-sans min-h-screen noise`}
            >
                {children}
            </body>
        </html>
    );
}