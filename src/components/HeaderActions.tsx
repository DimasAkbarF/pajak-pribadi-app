"use client";

import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeaderActions() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex items-center gap-8">
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="/#features" className="text-sm font-medium text-[#94A3B8] hover:text-[#CBD5E1] transition-colors duration-200">
          Fitur
        </a>
        <a href="/#how-it-works" className="text-sm font-medium text-[#94A3B8] hover:text-[#CBD5E1] transition-colors duration-200">
          Cara Kerja
        </a>
      </nav>

      {/* CTA Button / Back Button */}
      {isDashboard ? (
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-[#CBD5E1] transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      ) : (
        <Link
          href="/admin"
          className="flex items-center gap-2 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            background: 'linear-gradient(to right, #2563EB, #4F46E5)',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
          }}
        >
          <UserCog className="w-4 h-4" />
          Login
        </Link>
      )}
    </div>
  );
}