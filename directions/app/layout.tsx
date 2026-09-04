import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { LiveChrome } from "@/components/shared/LiveChrome";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hambrick & Co. — Lead Response & Estimate Recovery",
    template: "%s",
  },
  description:
    "Hambrick & Co installs the systems that catch leads, close follow-ups, and fill the calendar — for local businesses within 40 miles of Charlottesville.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${instrument.variable} ${hanken.variable} ${plex.variable} antialiased`}>
        <LiveChrome />
        {children}
      </body>
    </html>
  );
}
