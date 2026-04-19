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
  title: "Kalkulator Pajak Pribadi | PPh OP UU HPP 2021",
  description: "Kalkulator PPh Orang Pribadi Indonesia sesuai UU HPP 2021 dan PP 55/2022. Hitung pajak untuk Karyawan, UMKM, Norma (NPPN), dan Profesi Bebas.",
  keywords: ["PPh OP", "pajak", "kalkulator", "UU HPP", "UMKM", "Norma", "PTKP"],
  authors: [{ name: "Kalkulator Pajak Pribadi" }],
  openGraph: {
    title: "Kalkulator Pajak Pribadi",
    description: "Kalkulator PPh Orang Pribadi Indonesia sesuai UU HPP 2021",
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
