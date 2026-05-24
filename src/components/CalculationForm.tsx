"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Store, Calculator, Info, AlertCircle, Wallet, ChevronRight
} from "lucide-react";
import { UMKMInput, TaxBreakdown } from "@/types";
import { calculateTax, parseRupiahInput, formatRupiah } from "@/lib/tax-engine";

const TaxResult = dynamic(() => import("./TaxResult"), {
  loading: () => <div className="animate-pulse bg-[#0b1730]/40 rounded-3xl h-64 border border-slate-800" />,
});

const generateTaxPDF = async (...args: Parameters<typeof import("@/lib/pdf-generator").generateTaxPDF>) => {
  const { generateTaxPDF: fn } = await import("@/lib/pdf-generator");
  return fn(...args);
};

function RupiahInput({
  label,
  value,
  onChange,
  id,
  hint,
  icon: Icon,
  required = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  id: string;
  hint?: string;
  icon?: React.ElementType;
  required?: boolean;
}) {
  const [display, setDisplay] = useState(value > 0 ? formatRupiah(value) : "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value === 0) setDisplay("");
    else setDisplay(formatRupiah(value));
  }, [value]);

  return (
    <div className="group">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-2">
        {label}
        {required && <span className="text-blue-500">*</span>}
      </label>
      <div className={`relative flex items-center transition-all duration-200 rounded-2xl border ${
        isFocused 
          ? "border-blue-500 shadow-md shadow-blue-500/10" 
          : "border-slate-800 group-hover:border-slate-700"
      } bg-[#0b1730] overflow-hidden`}>
        {Icon && (
          <div className="pl-4 pr-2 text-slate-400">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={(e) => {
            const raw = parseRupiahInput(e.target.value);
            onChange(raw);
            setDisplay(raw > 0 ? formatRupiah(raw) : "");
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Rp0"
          className="w-full py-3 pr-4 bg-transparent text-white font-medium text-base placeholder:text-slate-500 focus:outline-none"
        />
      </div>
      {hint && (
        <div className="flex items-center gap-1.5 mt-2">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500 leading-relaxed">{hint}</p>
        </div>
      )}
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  id,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="group">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative flex items-center rounded-2xl border border-slate-800 bg-[#0b1730] overflow-hidden transition-all duration-300 group-hover:border-blue-500/50 shadow-inner group-focus-within:border-blue-500 group-focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        {Icon && (
          <div className="pl-4 pr-2 text-slate-400">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3 pr-10 pl-4 bg-[#0b1730] text-slate-200 font-medium appearance-none focus:outline-none cursor-pointer text-sm"
          style={{
            backgroundColor: '#0b1730',
            color: '#e2e8f0',
          }}
        >
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              className="bg-[#0b1730] text-slate-200"
              style={{ backgroundColor: '#0b1730', color: '#e2e8f0' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-slate-500">
          <ChevronRight className="w-4 h-4 rotate-90 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export default function CalculationForm() {
  const [result, setResult] = useState<TaxBreakdown | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const BULAN_OPTIONS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const [umkmInput, setUmkmInput] = useState<UMKMInput>({
    bulan: "Januari",
    omzetBulanIni: 0,
    totalOmzet: 0,
    omsetTahunan: 0,
  });

  // Calculate on input change
  const calculate = useCallback(() => {
    try {
      setResult(calculateTax("umkm", umkmInput));
    } catch (err) {
      console.error("Calculation error:", err);
    }
  }, [umkmInput]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleDownloadPDF = async () => {
    if (!result) return;

    const inputValues: Record<string, string | number> = {
      "Bulan": umkmInput.bulan,
      "Omzet Bulan Ini": formatRupiah(umkmInput.omzetBulanIni),
      "Total Omzet (Jan s.d. Bulan Ini)": formatRupiah(umkmInput.totalOmzet),
    };

    const doc = await generateTaxPDF("umkm", result, inputValues);
    doc.save(`pph-umkm-calculation-${Date.now()}.pdf`);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "umkm", input: umkmInput, result }),
      });

      if (response.ok) {
        setSaveMessage("Simulasi berhasil disimpan!");
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage("Gagal menyimpan simulasi.");
      }
    } catch {
      setSaveMessage("Gagal menyimpan simulasi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
      {/* Left Column - Form */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Card Utama UMKM - Elegant Corporate Refinement */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-gradient-to-br from-[#0b1730]/80 via-slate-900 to-[#071120] p-6 shadow-md shadow-blue-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">PP 55/2022</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">Tarif 0.5%</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Kalkulator Wajib Pajak UMKM</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Modul kalkulasi PPh Final untuk pelaku usaha (WP OP) dengan omzet bruto di atas Rp500 juta.
              </p>
            </div>
          </div>
          <div className="relative z-10 bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-2xl text-center flex-shrink-0">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Batas Bebas Pajak</div>
            <div className="text-base font-extrabold text-white mt-0.5">Rp500.000.000 / th</div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/5 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Input Omzet Pajak UMKM</h2>
                <p className="text-xs text-slate-400">Masukkan rincian omzet bruto operasional usaha Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectInput
                label="Bulan yang Dihitung"
                id="bulan-umkm"
                value={umkmInput.bulan}
                onChange={(v) => setUmkmInput({ ...umkmInput, bulan: v })}
                options={BULAN_OPTIONS.map((b) => ({ value: b, label: b }))}
              />
              <RupiahInput
                label="Omzet Bulan Ini"
                id="omzet-bulan-ini"
                value={umkmInput.omzetBulanIni}
                onChange={(v) => setUmkmInput({ ...umkmInput, omzetBulanIni: v })}
                icon={Wallet}
                required
              />
              <RupiahInput
                label="Total Omzet Jan - Bulan Ini"
                id="total-omzet"
                value={umkmInput.totalOmzet}
                onChange={(v) => {
                  setUmkmInput({ ...umkmInput, totalOmzet: v, omsetTahunan: v });
                }}
                hint="Diakumulasikan untuk batas bebas pajak tahunan"
                icon={Wallet}
                required
              />
            </div>

            <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-xs mb-1">Informasi Regulasi</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sesuai dengan PP 55/2022, pelaku UMKM dengan omzet di bawah Rp500.000.000 tidak dikenakan pajak (Nihil). 
                    Pajak PPh Final 0.5% hanya dikenakan pada kelebihan omzet bruto setelah melampaui Rp500 juta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            saveMessage.includes("berhasil")
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {saveMessage.includes("berhasil") ? (
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {saveMessage}
          </div>
        )}
      </div>

      {/* Right Column - Results */}
      <div className="xl:col-span-5">
        <TaxResult
          result={result}
          onDownloadPDF={handleDownloadPDF}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
