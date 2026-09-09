import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Feito de Nós — Histórias que viram presente",
  description: "Presentes afetivos interativos que transformam memórias e vozes em histórias inesquecíveis.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: "Feito de Nós" }],
};

export const viewport: Viewport = {
  themeColor: "#FFF8F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${dmSerifDisplay.variable} ${manrope.variable}`}>
      <body className="bg-brand-cream text-brand-graphite font-sans antialiased min-h-screen flex flex-col selection:bg-brand-rose selection:text-brand-graphite">
        {children}
      </body>
    </html>
  );
}
