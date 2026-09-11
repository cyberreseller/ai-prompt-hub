import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Prompt & Tool Hub — The Architectural AI Engine",
  description: "Curated system prompts, deep module architectures, and security benchmarks for production AI engineering.",
  themeColor: "#07090e",
  openGraph: {
    title: "AI Prompt & Tool Hub",
    description: "Професійні системні промпти для AI-інженерії та AppSec.",
    type: "website",
    locale: "uk_UA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
      <body className="min-h-[100dvh] bg-[#07090e] text-[#f0f3f9] font-sans antialiased selection:bg-indigo-500/25 selection:text-indigo-200">
        {/* Subtle background ambient mesh glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] opacity-70" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[160px] opacity-50" />
          <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[600px] bg-emerald-600/6 rounded-full blur-[180px] opacity-40" />
        </div>
        {children}
      </body>
    </html>
  );
}
