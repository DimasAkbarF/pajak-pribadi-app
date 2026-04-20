"use client";

import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react"; // Menambahkan UserCog
import { usePathname } from "next/navigation";

export default function HeaderActions() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex items-center gap-10">
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="/#features" className="text-sm font-medium text-slate-400 hover:text-white transition-all duration-300">
          Fitur
        </a>
        <a href="/#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-all duration-300">
          Cara Kerja
        </a>
      </nav>

      {/* CTA Button / Back Button */}
      {isDashboard ? (
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      ) : (
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
        >
          <UserCog className="w-4 h-4" /> {/* Logo Admin */}
          login
        </Link>
      )}
    </div>
  );
}