import Link from "next/link";
import { Calculator } from "lucide-react";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-4 px-10 flex items-center justify-between bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-900/10 transition-all duration-300">

      <Link href="/" className="group flex items-center" title="Kalkulator Pajak Beranda">
        <span className="font-bold text-xl tracking-tight bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent transition-opacity duration-300">
          Kalkulator <span className="italic bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Pajak</span>
        </span>
      </Link>

      <HeaderActions />
    </header>
  );
}