import Link from "next/link";
import { ChevronRight, Calculator, CheckCircle, FileText, Zap } from "lucide-react";

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-3">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-[calc(100vh-73px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center w-full">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Simulasi <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Kalkulator Pajak UMKM</span>
          </h1>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-100">
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Solusi cerdas perhitungan Pajak Penghasilan (PPh) Final 0.5% khusus pelaku usaha UMKM berdasarkan regulasi PP 55/2022.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Mulai Simulasi - Gratis
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="opacity-0 animate-fade-in-up animate-delay-300 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="50K+" label="Perhitungan" icon={Calculator} />
          <StatCard value="99.9%" label="Akurat" icon={CheckCircle} />
          <StatCard value="PP 55" label="Regulasi" icon={FileText} />
          <StatCard value="Rp0" label="Biaya" icon={Zap} />
        </div>
      </div>
    </section>
  );
}
