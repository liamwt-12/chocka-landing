import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans, DM_Mono, Caveat } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chocka — Closed to new signups",
  description:
    "Chocka is currently closed to new signups. Leave your email and we'll let you know if that changes.",
  metadataBase: new URL("https://chocka.co.uk"),
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${barlow.variable} ${dmSans.variable} ${dmMono.variable} ${caveat.variable} font-body antialiased bg-warm text-black`}
      >
        {children}
      </body>
    </html>
  );
}
