import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://hambrickco.com";
const title = "Hambrick & Co. | Growth Partner for Revenue Businesses";
const description =
  "Hambrick & Co. finds the pain your business is losing money on, builds the fix, and stays on to keep it running. A full-stack growth partner for revenue businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description:
      "We identify what's leaking revenue, build the system to fix it, and stay on to keep it running.",
    url: siteUrl,
    siteName: "Hambrick & Co.",
  },
  twitter: {
    card: "summary",
    title,
    description:
      "We identify what's leaking revenue, build the system to fix it, and stay on to keep it running.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
