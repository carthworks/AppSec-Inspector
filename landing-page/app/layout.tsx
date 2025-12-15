import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AppSec Inspector - Professional Security Inspection Tool for Chrome",
  description: "Comprehensive security audits directly in your browser. Scan headers, detect secrets, audit authentication - all locally with zero data collection. Built for AppSec, DevSecOps, and Security teams.",
  keywords: ["security", "chrome extension", "appsec", "security headers", "secret detection", "authentication audit", "OWASP"],
  authors: [{ name: "AppSec Inspector Team" }],
  openGraph: {
    title: "AppSec Inspector - Professional Security Inspection Tool",
    description: "Comprehensive security audits directly in your browser. Privacy-focused, locally-run analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
