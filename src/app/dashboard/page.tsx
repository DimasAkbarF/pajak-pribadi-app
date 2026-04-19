"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Calculator,
  TrendingUp,
  Users,
  AlertTriangle,
  UserCircle,
  Settings,
  Wallet,
  Receipt,
  FileSearch,
  Download,
  ChevronDown,
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckCircle,
  ArrowRight,
  HomeIcon,
  Lock,
} from "lucide-react";
import Link from "next/link";

// Dynamically import CalculationForm to prevent SSR issues with jsPDF
const CalculationForm = dynamic(() => import("@/components/CalculationForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

// --- PTKP Data ---
const ptkpData = [
  { status: "TK/0", value: 54000000, label: "Tidak Kawin, 0 Tanggungan" },
  { status: "TK/1", value: 58500000, label: "Tidak Kawin, 1 Tanggungan" },
  { status: "TK/2", value: 63000000, label: "Tidak Kawin, 2 Tanggungan" },
  { status: "TK/3", value: 67500000, label: "Tidak Kawin, 3 Tanggungan" },
  { status: "K/0", value: 58500000, label: "Kawin, 0 Tanggungan" },
  { status: "K/1", value: 63000000, label: "Kawin, 1 Tanggungan" },
  { status: "K/2", value: 67500000, label: "Kawin, 2 Tanggungan" },
  { status: "K/3", value: 72000000, label: "Kawin, 3 Tanggungan" },
  { status: "K/I/0", value: 112500000, label: "Kawin + Istri Digabung, 0 Tanggungan" },
  { status: "K/I/1", value: 117000000, label: "Kawin + Istri Digabung, 1 Tanggungan" },
  { status: "K/I/2", value: 121500000, label: "Kawin + Istri Digabung, 2 Tanggungan" },
  { status: "K/I/3", value: 126000000, label: "Kawin + Istri Digabung, 3 Tanggungan" },
];

const tarifData = [
  { range: "0 - 60 juta", rate: "5%", amount: "Rp60.000.000" },
  { range: "60 - 250 juta", rate: "15%", amount: "Rp250.000.000" },
  { range: "250 - 500 juta", rate: "25%", amount: "Rp500.000.000" },
  { range: "500 juta - 5 M", rate: "30%", amount: "Rp5.000.000.000" },
  { range: "> 5 Miliar", rate: "35%", amount: "∞" },
];

// --- Cara Menggunakan Steps ---
const caraSteps = [
  {
    icon: UserCircle,
    title: "Pilih Jenis WP",
    desc: "Pilih Karyawan, UMKM, Norma, atau Profesi Bebas",
  },
  {
    icon: Settings,
    title: "Atur PTKP",
    desc: "Sesuaikan status PTKP sesuai kondisi riil Anda",
  },
  {
    icon: Wallet,
    title: "Input Penghasilan",
    desc: "Masukkan jumlah penghasilan bruto tahunan",
  },
  {
    icon: Receipt,
    title: "Kredit Pajak",
    desc: "Masukkan PPh 21/22/23/25 yang sudah dipotong",
  },
  {
    icon: FileSearch,
    title: "Lihat Hasil",
    desc: "Status pajak (Nihil/Kurang Bayar) muncul otomatis",
  },
  {
    icon: Download,
    title: "Simpan PDF",
    desc: "Download hasil perhitungan dalam format PDF",
  },
];

// --- FAQ Data ---
const faqs = [
  {
    q: "Apakah data saya disimpan?",
    a: "Secara default, perhitungan berjalan di browser tanpa menyimpan data. Jika menekan 'Simpan', data akan masuk ke database admin.",
  },
  {
    q: "Regulasi apa yang digunakan?",
    a: "Kalkulator menggunakan tarif progresif UU HPP No. 7 Tahun 2021 dan PP 55/2022 untuk tarif final UMKM 0.5%.",
  },
  {
    q: "Apa perbedaan Karyawan dan Profesi Bebas?",
    a: "Karyawan mendapatkan Biaya Jabatan 5% (max Rp6jt/tahun). Profesi Bebas dapat mengurangkan pengeluaran operasional aktual.",
  },
  {
    q: "Berapa tarif pajak UMKM terbaru?",
    a: "UMKM dengan omzet di atas Rp500jt dikenakan pajak final 0.5%. Di bawah Rp500jt bebas pajak.",
  },
  {
    q: "Kapan harus lapor SPT?",
    a: "Batas pelaporan SPT Tahunan PPh Orang Pribadi adalah 31 Maret tahun berikutnya.",
  },
  {
    q: "Apa itu Norma Penghitungan Penghasilan Neto (NPPN)?",
    a: "NPPN adalah metode penghitungan pajak untuk profesi tertentu dengan menggunakan persentase pengurangan tetap sesuai Per-17/PJ/2015.",
  },
];

// --- Components ---

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ReferenceTables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* PTKP Table */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-fit"
      >
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">PTKP 2026</h3>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-slate-400 font-medium">Status</th>
                <th className="px-4 py-2 text-right text-slate-400 font-medium">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ptkpData.map((item) => (
                <tr key={item.status} className="hover:bg-white/5">
                  <td className="px-4 py-2 text-slate-300">{item.status}</td>
                  <td className="px-4 py-2 text-right text-white font-medium">
                    {formatRupiah(item.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-slate-400">
            +Rp4,5jt per tanggungan (maksimal 3 tanggungan)
          </p>
        </div>
      </m.div>

      {/* Tarif Progresif Table */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-fit"
      >
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Tarif PPh Progresif (UU HPP)</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {tarifData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-14 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                  {item.rate}
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${100 - i * 20}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-400 w-24 text-right">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-slate-400">
            Berlaku sejak UU HPP 2021
          </p>
        </div>
      </m.div>
    </div>
  );
}

function CaraMenggunakan() {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Cara Penggunaan</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {caraSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] text-blue-400 font-medium mb-1">
                  Langkah {i + 1}
                </span>
                <h4 className="text-sm font-medium text-white mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < caraSteps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-2 w-4 h-px bg-white/10" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <HelpCircle className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Pertanyaan Umum (FAQ)</h3>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-white text-sm">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""
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
                  <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 h-fit"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-500/10 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Deadline Pelaporan SPT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Batas Akhir</p>
              <p className="text-lg font-bold text-white">31 Maret {new Date().getFullYear()}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Denda Keterlambatan</p>
              <p className="text-lg font-bold text-red-400">Rp100.000 + Bunga 2%/bulan</p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

// --- TaxResult Placeholder ---

function TaxResultPlaceholder() {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Hasil Perhitungan</h2>
          <p className="text-sm text-slate-400">Ringkasan pajak terutang</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <p className="text-sm text-slate-400 mb-1">Status Perhitungan</p>
          <p className="text-lg font-medium text-slate-300">
            Pilih jenis WP dan masukkan data untuk melihat hasil
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ArrowRight className="w-4 h-4" />
          <span>Hasil akan muncul otomatis setelah Anda mengisi form</span>
        </div>
      </div>
    </div>
  );
}

// --- Simple Sidebar Component ---


// --- Main Page Component ---

export default function DashboardPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-950 relative selection:bg-blue-500/30">
        {/* Premium Mesh Gradient Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Deep Blue Core */}
          <div
            className="absolute top-0 -left-[10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[120px] animate-pulse"
            style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
          />
          {/* Violet Accent */}
          <div
            className="absolute bottom-0 -right-[10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[120px]"
            style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }}
          />
          {/* Subtle Slate Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative z-10 w-full pt-4">
          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {/* Header with Glassmorphism */}
              <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-3xl mb-10 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Calculator className="w-32 h-32 text-blue-400 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Official 2026 Edition</span>
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Kalkulator PPh <span className="text-blue-500">Orang Pribadi</span>
                  </h1>
                  <p className="text-slate-400 mt-2 max-w-2xl text-lg leading-relaxed">
                    Hitung simulasi pajak penghasilan Anda dengan parameter terbaru (UU HPP & PP 55/2022).
                    Data bersifat privat dan dihitung langsung di perangkat Anda.
                  </p>
                </div>
              </m.div>

              {/* Main Calculator Section */}
              <div className="mb-12">
                <CalculationForm />
              </div>

              {/* Informational Sections */}
              <div className="space-y-12 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <ReferenceTables />
                  <div className="space-y-8 h-fit">
                    <DeadlineInfo />
                    <FAQAccordion />
                  </div>
                </div>

                <CaraMenggunakan />
              </div>
            </div>

            {/* Footer */}
          </main>
        </div>
      </div>
    </LazyMotion>
  );
}

