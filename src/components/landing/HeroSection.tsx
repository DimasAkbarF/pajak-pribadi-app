import Link from "next/link";
import { ChevronRight, Calculator, CheckCircle, FileText, Zap } from "lucide-react";

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-3" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <Icon className="w-4 h-4 text-[#60A5FA]" />
      </div>
      <div className="text-2xl font-bold text-[#E5E7EB] mb-1">{value}</div>
      <div className="text-xs text-[#94A3B8]">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-[calc(100vh-73px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center w-full">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E5E7EB] mb-6 leading-tight tracking-tight">
            Simulasi{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1)' }}
            >
              Kalkulator Pajak UMKM
            </span>
          </h1>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-100">
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12 leading-relaxed">
            Solusi cerdas perhitungan Pajak Penghasilan (PPh) Final 0.5% khusus pelaku usaha UMKM berdasarkan regulasi PP 55/2022.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
              }}
            >
              Mulai Simulasi — Gratis
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-[#94A3B8] hover:text-[#CBD5E1] transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
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
