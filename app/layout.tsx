import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Notifoo - The Reminder you'll love to use.",
    template: "%s | Notifoo",
  },
  description:
    "HIPAA-compliant digital forms for Georgia DBHDD healthcare providers. Streamline documentation with mobile-first design.",
  keywords: [
    "healthcare",
    "forms",
    "DBHDD",
    "HIPAA",
    "Georgia",
    "digital",
    "care facility",
    "care center",
    "DBHDD forms",
  ],
  authors: [{ name: "Notifoo Team" }],
  creator: "Notifoo",
  publisher: "Notifoo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Notifoo - The reminder that actually works.",
    description: "The we remind you about anything you need to know.",
    siteName: "Notifoo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notifoo - The reminder that actually works.",
    description: "The we remind you about anything you need to know.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Notifoo.com",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
