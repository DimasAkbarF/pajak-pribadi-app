import Link from "next/link";
import { Calculator } from "lucide-react";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full py-4 px-6 sm:px-10 flex items-center justify-between backdrop-blur-md transition-all duration-300"
      style={{
        background: 'rgba(5, 11, 24, 0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
    >
      <Link href="/" className="group flex items-center" title="Kalkulator Pajak UMKM Beranda">
        <span className="font-bold text-lg tracking-tight text-[#E5E7EB] transition-opacity duration-300">
          Kalkulator Pajak{" "}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1)' }}
          >
            UMKM
          </span>
        </span>
      </Link>

      <HeaderActions />
    </header>
  );
}