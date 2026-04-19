import Link from "next/link";
import { Calculator } from "lucide-react";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-4 px-10 flex items-center justify-between bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-900/10 transition-all duration-300">
      {/* Branding - Now part of initial HTML (No JS required for render) */}
      <Link href="/" className="group flex items-center gap-3" title="Kalkulator Pajak Beranda">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">
          Kalkulator Pajak
        </span>
      </Link>

      <HeaderActions />
    </header>
  );
}
