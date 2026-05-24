"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Calculator,
  AlertTriangle,
  UserCircle,
  Settings,
  Wallet,
  Receipt,
  ChevronDown,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

// Dynamically import CalculationForm to prevent SSR issues with jsPDF
const CalculationForm = dynamic(() => import("@/components/CalculationForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
  ),
});

// --- Cara Menggunakan Steps ---
const caraSteps = [
  {
    icon: UserCircle,
    title: "Pilih Bulan Pajak",
    desc: "Atur bulan operasional usaha yang ingin Anda hitung pajaknya",
  },
  {
    icon: Wallet,
    title: "Input Omzet Bulanan",
    desc: "Masukkan omzet kotor (omzet bruto) riil usaha Anda di bulan tersebut",
  },
  {
    icon: Settings,
    title: "Input Total Omzet",
    desc: "Masukkan akumulasi omzet usaha dari Januari s.d. bulan berjalan",
  },
  {
    icon: Calculator,
    title: "Hitung Otomatis",
    desc: "Sistem mendeteksi batas bebas Rp500jt dan menghitung PPh secara instan",
  },
  {
    icon: Receipt,
    title: "Simpan Laporan",
    desc: "Simpan hasil simulasi ke database admin untuk kebutuhan rekapan",
  },
  {
    icon: ArrowRight,
    title: "Unduh PDF",
    desc: "Download dokumen perincian pajak resmi PP 55/2022 sebagai pembukuan",
  },
];

// --- FAQ Data ---
const faqs = [
  {
    q: "Apa dasar hukum pengenaan PPh Final UMKM?",
    a: "Regulasi pajak UMKM didasarkan pada PP Nomor 55 Tahun 2022, yang merupakan aturan turunan dari UU Harmonisasi Peraturan Perpajakan (UU HPP) No. 7 Tahun 2021.",
  },
  {
    q: "Bagaimana cara kerja batas bebas pajak Rp500 juta?",
    a: "Wajib Pajak Orang Pribadi pelaku UMKM dibebaskan dari pajak untuk omzet bruto kumulatif sampai Rp500 juta dalam satu tahun pajak. PPh Final 0.5% hanya dipotong dari bagian omzet kumulatif bulanan yang sudah melampaui ambang batas Rp500 juta tersebut.",
  },
  {
    q: "Kapan batas waktu penyetoran PPh Final UMKM?",
    a: "Apabila hasil perhitungan menunjukkan Kurang Bayar, Anda wajib menyetor PPh Final 0.5% paling lambat tanggal 15 bulan berikutnya setelah masa pajak berakhir.",
  },
  {
    q: "Apakah pelaku UMKM tetap wajib melaporkan SPT Tahunan?",
    a: "Ya. Pembayaran PPh Final 0.5% secara bulanan bersifat final, namun omzet bruto dan total pajak yang disetor tetap wajib dilaporkan di dalam SPT Tahunan PPh Orang Pribadi paling lambat tanggal 31 Maret tahun berikutnya.",
  },
  {
    q: "Bagaimana jika omzet usaha saya dalam setahun tidak mencapai Rp500 juta?",
    a: "Maka status perhitungan pajak Anda adalah Nihil (Bebas Pajak). Anda tidak perlu membayar PPh Final sama sekali, tetapi Anda tetap wajib melaporkan omzet tersebut di dalam SPT Tahunan.",
  },
  {
    q: "Apakah data omzet saya tersimpan di server?",
    a: "Privasi Anda terjaga sepenuhnya. Perhitungan pajak berjalan langsung di dalam browser perangkat Anda secara lokal. Data baru akan disimpan jika Anda secara manual mengetuk tombol 'Simpan' pada panel hasil.",
  },
];

// --- Components ---

function CaraMenggunakan() {
  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 mb-12 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <BookOpen className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-base font-bold text-white">Panduan Penggunaan Kalkulator</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {caraSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#0b1730] border border-slate-800 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest mb-1">
                  Langkah {i + 1}
                </span>
                <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < caraSteps.length - 1 && (
                <div className="hidden lg:block absolute top-5 -right-3 w-6 h-px bg-slate-800" />
              )}
            </div>
          );
        })}
      </div>
    </m.div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 h-fit shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <HelpCircle className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-base font-bold text-white">Pertanyaan Umum UMKM (FAQ)</h3>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.01] transition-colors"
            >
              <span className="font-bold text-white text-xs sm:text-sm">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""
                  }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 bg-white/[0.005]">
                    {faq.a}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </m.div>
  );
}

function DeadlineInfo() {
  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-950/20 to-slate-900 border border-blue-500/10 rounded-3xl p-6 h-fit shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white mb-2">Batas Waktu Pajak UMKM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#071120] rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider">Penyetoran Bulanan (PPh Masa)</p>
              <p className="text-sm font-bold text-white">Tgl 15 bulan berikutnya</p>
              <p className="text-[9px] text-slate-500 mt-1">Penyetoran PPh Final 0.5% lewat e-Billing resmi DJP</p>
            </div>
            <div className="p-4 bg-[#071120] rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider">Pelaporan SPT Tahunan</p>
              <p className="text-sm font-bold text-white">31 Maret tahun berikutnya</p>
              <p className="text-[9px] text-slate-500 mt-1">Pelaporan omzet bruto tahunan wajib pajak orang pribadi</p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default function DashboardPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-950 relative selection:bg-blue-500/20">
        {/* Premium Mesh Gradient Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Deep Navy Core */}
          <div
            className="absolute top-0 -left-[10%] w-[70%] h-[70%] rounded-full opacity-10 blur-[120px] animate-pulse"
            style={{ background: "radial-gradient(circle, #1e3a8a 0%, transparent 70%)" }}
          />
          {/* Violet Accent */}
          <div
            className="absolute bottom-0 -right-[10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
            style={{ background: "radial-gradient(circle, #1e3b8a 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 w-full pt-4">
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {/* Header with Glassmorphism */}
              <m.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.01] p-6 md:p-8 rounded-3xl mb-10 overflow-hidden relative border border-white/5 shadow-xl"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Calculator className="w-24 h-24 text-blue-400 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400">Edisi Regulasi PP 55/2022</span>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Simulasi <span className="text-blue-400">Kalkulator Pajak UMKM</span>
                  </h1>
                  <p className="text-slate-400 mt-2.5 max-w-3xl text-sm leading-relaxed font-medium">
                    Hitung PPh Final 0.5% UMKM Anda secara presisi sesuai skema aturan PP 55/2022. 
                    Dilengkapi fitur pembebasan pajak untuk omzet tahunan s.d. Rp500 Juta bagi Wajib Pajak Orang Pribadi.
                  </p>
                </div>
              </m.div>

              {/* Main Calculator Section */}
              <div className="mb-10">
                <CalculationForm />
              </div>

              {/* Informational Sections */}
              <div className="space-y-10 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <DeadlineInfo />
                  <FAQAccordion />
                </div>

                <CaraMenggunakan />
              </div>
            </div>
          </main>
        </div>
      </div>
    </LazyMotion>
  );
}
