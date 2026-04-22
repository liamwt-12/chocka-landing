import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans, DM_Mono, Archivo_Black, Inter, Caveat } from "next/font/google";
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

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chocka — Get More Jobs From Google",
  description:
    "Chocka manages your Google Business Profile so you get more calls, more jobs, and more revenue. £29/month. 2 minute setup.",
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
        className={`${barlow.variable} ${dmSans.variable} ${dmMono.variable} ${archivoBlack.variable} ${inter.variable} ${caveat.variable} font-body antialiased bg-warm text-black`}
      >
        {children}
      </body>
    </html>
  );
}
