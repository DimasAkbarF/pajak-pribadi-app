import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kalkulator Pajak UMKM | PPh Final 0.5% PP 55/2022",
  description: "Kalkulator PPh Final 0.5% khusus UMKM Indonesia sesuai PP 55/2022. Simulasikan pajak bulanan pelaku usaha dengan batas bebas pajak Rp500 Juta secara instan.",
  keywords: ["PPh Final", "pajak UMKM", "kalkulator pajak", "PP 55/2022", "batas bebas pajak", "pajak orang pribadi"],
  authors: [{ name: "Kalkulator Pajak UMKM" }],
  openGraph: {
    title: "Kalkulator Pajak UMKM",
    description: "Kalkulator PPh Final 0.5% khusus UMKM Indonesia sesuai PP 55/2022",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-500/30`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
