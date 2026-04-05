import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futuristic Portfolio | Freelance Web Developer",
  description:
    "A premium, fully animated portfolio website featuring 3D interactions, real-time chat, and client management system.",
  keywords: [
    "portfolio",
    "web developer",
    "freelance",
    "3D",
    "animations",
    "client system",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Futuristic Portfolio | Freelance Web Developer",
    description: "Premium animated portfolio with client system",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-black text-white overflow-x-hidden`}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-black to-cyan-950/20 pointer-events-none" />
        <AnalyticsTracker />
        {children}
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
