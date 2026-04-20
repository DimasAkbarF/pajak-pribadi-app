"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Briefcase, Store, ClipboardList, Scale, Calculator,
  ChevronRight, Info, AlertCircle, Wallet
} from "lucide-react";
import {
  TaxModule,
  StatusPajak,
  KaryawanInput,
  UMKMInput,
  NormaInput,
  ProfesiInput,
  TaxBreakdown,
} from "@/types";
import {
  calculateTax,
  parseRupiahInput,
  formatRupiah,
  getNormaCities,
  getProfessionsByCity,
  getNormaPersen,
  getAllProfesiNames,
  getNPPNByProfesi,
  parseNPPN,
  getJenisUsahaCategories,
  getJenisUsahaByCategory,
  getNPPNByJenisUsaha,
} from "@/lib/tax-engine";

const TaxResult = dynamic(() => import("./TaxResult"), {
  loading: () => <div className="animate-pulse bg-white/[0.03] rounded-2xl h-64" />,
});

const generateTaxPDF = async (...args: Parameters<typeof import("@/lib/pdf-generator").generateTaxPDF>) => {
  const { generateTaxPDF: fn } = await import("@/lib/pdf-generator");
  return fn(...args);
};

const STATUS_OPTIONS: StatusPajak[] = [
  "TK/0", "TK/1", "TK/2", "TK/3",
  "K/0", "K/1", "K/2", "K/3",
  "K/I/0", "K/I/1", "K/I/2", "K/I/3",
];

const STATUS_LABELS: Record<StatusPajak, string> = {
  "TK/0": "TK/0 - Tidak Kawin, 0 tanggungan",
  "TK/1": "TK/1 - Tidak Kawin, 1 tanggungan",
  "TK/2": "TK/2 - Tidak Kawin, 2 tanggungan",
  "TK/3": "TK/3 - Tidak Kawin, 3 tanggungan",
  "K/0": "K/0 - Kawin, 0 tanggungan",
  "K/1": "K/1 - Kawin, 1 tanggungan",
  "K/2": "K/2 - Kawin, 2 tanggungan",
  "K/3": "K/3 - Kawin, 3 tanggungan",
  "K/I/0": "K/I/0 - Kawin, Penghasilan Digabung, 0 tanggungan",
  "K/I/1": "K/I/1 - Kawin, Penghasilan Digabung, 1 tanggungan",
  "K/I/2": "K/I/2 - Kawin, Penghasilan Digabung, 2 tanggungan",
  "K/I/3": "K/I/3 - Kawin, Penghasilan Digabung, 3 tanggungan",
};

const TABS: { id: TaxModule; label: string; icon: React.ElementType; description: string; color: string }[] = [
  { id: "karyawan", label: "Pegawai/Karyawan", icon: Briefcase, description: "PPh 21 dengan Biaya Jabatan", color: "blue" },
  { id: "umkm", label: "UMKM", icon: Store, description: "PP 55/2022 - Tarif Final 0.5%", color: "emerald" },
  { id: "norma", label: "Norma (NPPN)", icon: ClipboardList, description: "NPPN per Kota (10 Ibukota Provinsi)", color: "amber" },
  { id: "profesi", label: "Profesi Bebas", icon: Scale, description: "NPPN Profesi (10 Ibukota Provinsi)", color: "violet" },
];

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
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`relative flex items-center transition-all duration-200 rounded-xl border-2 ${
        isFocused 
          ? "border-blue-500 shadow-lg shadow-blue-500/20" 
          : "border-slate-700 group-hover:border-slate-600"
      } bg-[#0f172a] overflow-hidden`}>
        {Icon && (
          <div className="pl-4 pr-2 text-slate-400">
            <Icon className="w-5 h-5" />
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
          className="w-full py-3.5 pr-4 bg-transparent text-white font-medium text-lg placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {hint && (
        <div className="flex items-center gap-1.5 mt-2">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <p className="text-xs text-slate-400">{hint}</p>
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
      <div className="relative flex items-center rounded-xl border-2 border-white/10 bg-[#0f172a] overflow-hidden transition-all duration-300 group-hover:border-blue-500/50 shadow-inner group-focus-within:border-blue-500 group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        {Icon && (
          <div className="pl-4 pr-2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3.5 pr-10 bg-[#0f172a] text-[#f8fafc] font-medium appearance-none focus:outline-none cursor-pointer"
          style={{
            backgroundColor: '#0f172a',
            color: '#f8fafc',
          }}
        >
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              className="bg-[#0f172a] text-[#f8fafc]"
              style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </div>
    </div>
  );
}

export default function CalculationForm() {
  const [activeTab, setActiveTab] = useState<TaxModule>("karyawan");
  const [result, setResult] = useState<TaxBreakdown | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form states
  const [karyawanInput, setKaryawanInput] = useState<KaryawanInput>({
    penghasilanBruto: 0,
    statusPajak: "TK/0",
    penghasilanIstri: 0,
    pph21Dibayar: 0,
    pph22Dibayar: 0,
    pph23Dibayar: 0,
    pph25Dibayar: 0,
  });

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

  const [normaInput, setNormaInput] = useState<NormaInput & { kategoriUsaha: string; jenisUsaha: string }>({
    penghasilanBruto: 0,
    kota: getNormaCities()[0],
    jenisProfesi: "Dokter/Profesi Medis",
    normaPersen: 0,
    statusPajak: "TK/0",
    pph21Dibayar: 0,
    pph22Dibayar: 0,
    pph23Dibayar: 0,
    pph25Dibayar: 0,
    kategoriUsaha: "Perdagangan (10 Ibukota Provinsi)",
    jenisUsaha: "Perdagangan Besar Barang Hasil Pertanian",
  });

  const [profesiInput, setProfesiInput] = useState<ProfesiInput>({
    penghasilanBruto: 0,
    pengeluaranOperasional: 0,
    jenisProfesi: "Dokter Umum",
    normaPersen: 50,
    statusPajak: "TK/0",
    pph21Dibayar: 0,
    pph22Dibayar: 0,
    pph23Dibayar: 0,
    pph25Dibayar: 0,
  });

  // Calculate on input change
  const calculate = useCallback(() => {
    try {
      switch (activeTab) {
        case "karyawan":
          setResult(calculateTax("karyawan", karyawanInput));
          break;
        case "umkm":
          setResult(calculateTax("umkm", umkmInput));
          break;
        case "norma":
          setResult(calculateTax("norma", normaInput));
          break;
        case "profesi":
          setResult(calculateTax("profesi", profesiInput));
          break;
      }
    } catch (err) {
      console.error("Calculation error:", err);
    }
  }, [activeTab, karyawanInput, umkmInput, normaInput, profesiInput]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // Update norma persen when jenis usaha changes
  useEffect(() => {
    const nppnString = getNPPNByJenisUsaha(normaInput.jenisUsaha);
    const persen = parseNPPN(nppnString);
    setNormaInput((prev) => ({ ...prev, normaPersen: persen }));
  }, [normaInput.jenisUsaha]);

  const handleDownloadPDF = async () => {
    if (!result) return;

    const inputValues: Record<string, string | number> = {};
    if (activeTab === "karyawan") {
      inputValues["Status Pajak"] = STATUS_LABELS[karyawanInput.statusPajak];
      inputValues["Penghasilan Bruto"] = formatRupiah(karyawanInput.penghasilanBruto);
    } else if (activeTab === "umkm") {
      inputValues["Bulan"] = umkmInput.bulan;
      inputValues["Omzet Bulan Ini"] = formatRupiah(umkmInput.omzetBulanIni);
      inputValues["Total Omzet (Jan s.d. Bulan Ini)"] = formatRupiah(umkmInput.totalOmzet);
    } else if (activeTab === "norma") {
      inputValues["Status Pajak"] = STATUS_LABELS[normaInput.statusPajak];
      inputValues["Kategori Usaha"] = normaInput.kategoriUsaha;
      inputValues["Jenis Usaha"] = normaInput.jenisUsaha;
      inputValues["Penghasilan Bruto"] = formatRupiah(normaInput.penghasilanBruto);
    } else if (activeTab === "profesi") {
      inputValues["Status Pajak"] = STATUS_LABELS[profesiInput.statusPajak];
      inputValues["Penghasilan Bruto"] = formatRupiah(profesiInput.penghasilanBruto);
      inputValues["Pengeluaran Operasional"] = formatRupiah(profesiInput.pengeluaranOperasional);
    }

    const doc = await generateTaxPDF(activeTab, result, inputValues);
    doc.save(`pph-calculation-${Date.now()}.pdf`);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      let inputData;
      switch (activeTab) {
        case "karyawan":
          inputData = karyawanInput;
          break;
        case "umkm":
          inputData = umkmInput;
          break;
        case "norma":
          inputData = normaInput;
          break;
        case "profesi":
          inputData = profesiInput;
          break;
      }

      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: activeTab, input: inputData, result }),
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

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) return "bg-white/5 border-white/10 hover:border-white/20";
    
    const colors: Record<string, string> = {
      blue: "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/20",
      emerald: "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/20",
      amber: "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20",
      violet: "bg-violet-500/10 border-violet-500 shadow-lg shadow-violet-500/20",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string, isActive: boolean) => {
    if (!isActive) return "text-slate-400";
    
    const colors: Record<string, string> = {
      blue: "text-blue-400",
      emerald: "text-emerald-400",
      amber: "text-amber-400",
      violet: "text-violet-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
      {/* Left Column - Form */}
      <div className="xl:col-span-7 space-y-6">
        {/* Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TaxModule)}
                aria-label={`${tab.label}: ${tab.description}`}
                aria-pressed={isActive}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-500 text-left overflow-hidden ${
                  isActive 
                    ? "bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30" 
                    : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {/* Glow Background for Active Tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50" />
                )}
                
                <div className={`relative z-10 p-2.5 rounded-xl transition-colors duration-300 ${
                  isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40" : "bg-white/5 text-slate-400 group-hover:text-slate-200"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="relative z-10 flex-1 min-w-0">
                  <h3 className={`font-bold text-sm tracking-wide transition-colors duration-300 ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                    {tab.label}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${isActive ? "text-blue-200/70" : "text-slate-400 group-hover:text-amber-400"}`}>
                    {tab.description}
                  </p>
                </div>

                {isActive ? (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse" />
                ) : (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-white/5 rounded-2xl p-6 lg:p-8 border border-white/10">
          {activeTab === "karyawan" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">PPh Karyawan</h2>
                  <p className="text-sm text-slate-400">Perhitungan PPh Pasal 21 dengan Biaya Jabatan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  label="Status Pajak (PTKP)"
                  id="status-karyawan"
                  value={karyawanInput.statusPajak}
                  onChange={(v) => setKaryawanInput({ ...karyawanInput, statusPajak: v as StatusPajak })}
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
                />
                <RupiahInput
                  label="Penghasilan Bruto Tahunan"
                  id="bruto-karyawan"
                  value={karyawanInput.penghasilanBruto}
                  onChange={(v) => setKaryawanInput({ ...karyawanInput, penghasilanBruto: v })}
                  hint="Biaya Jabatan 5% (max Rp6jt) dihitung otomatis"
                  icon={Wallet}
                  required
                />
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Kredit Pajak yang Sudah Dibayar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <RupiahInput label="PPh 21" id="pph21-karyawan" value={karyawanInput.pph21Dibayar} onChange={(v) => setKaryawanInput({ ...karyawanInput, pph21Dibayar: v })} />
                  <RupiahInput label="PPh 22" id="pph22-karyawan" value={karyawanInput.pph22Dibayar} onChange={(v) => setKaryawanInput({ ...karyawanInput, pph22Dibayar: v })} />
                  <RupiahInput label="PPh 23" id="pph23-karyawan" value={karyawanInput.pph23Dibayar} onChange={(v) => setKaryawanInput({ ...karyawanInput, pph23Dibayar: v })} />
                  <RupiahInput label="PPh 25" id="pph25-karyawan" value={karyawanInput.pph25Dibayar} onChange={(v) => setKaryawanInput({ ...karyawanInput, pph25Dibayar: v })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "umkm" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Store className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">PPh UMKM</h2>
                  <p className="text-sm text-slate-400">PP 55/2022 - Tarif Final 0.5%</p>
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
                  label="Omzet Bulan Ini (Rp)"
                  id="omzet-bulan-ini"
                  value={umkmInput.omzetBulanIni}
                  onChange={(v) => setUmkmInput({ ...umkmInput, omzetBulanIni: v })}
                  icon={Calculator}
                  required
                />
                <RupiahInput
                  label="Total Omzet Jan s.d. Bulan Ini (Rp)"
                  id="total-omzet"
                  value={umkmInput.totalOmzet}
                  onChange={(v) => {
                    setUmkmInput({ ...umkmInput, totalOmzet: v, omsetTahunan: v });
                  }}
                  hint="Digunakan untuk perhitungan PPh"
                  icon={Calculator}
                  required
                />
              </div>

              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Ketentuan UMKM PP 55/2022</h4>
                    <p className="text-sm text-emerald-400">
                      UMKM dengan omset sampai Rp500jt tidak kena pajak (Bebas Pajak).
                      Omset di atas Rp500jt dikenakan tarif final 0.5% hanya untuk bagian yang melebihi Rp500jt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "norma" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Norma (NPPN)</h2>
                  <p className="text-sm text-slate-400">Norma Penghitungan Penghasilan Neto - Jenis Usaha</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  label="Kategori Usaha"
                  id="kategori-usaha"
                  value={normaInput.kategoriUsaha}
                  onChange={(v) => {
                    const firstItem = getJenisUsahaByCategory(v)[0];
                    setNormaInput({ 
                      ...normaInput, 
                      kategoriUsaha: v,
                      jenisUsaha: firstItem?.nama || ""
                    });
                  }}
                  options={getJenisUsahaCategories().map((c) => ({ value: c, label: c }))}
                />
                <SelectInput
                  label="Jenis Usaha"
                  id="jenis-usaha"
                  value={normaInput.jenisUsaha}
                  onChange={(v) => setNormaInput({ ...normaInput, jenisUsaha: v })}
                  options={getJenisUsahaByCategory(normaInput.kategoriUsaha).map((i) => ({ 
                    value: i.nama, 
                    label: `${i.nppn} - ${i.nama}` 
                  }))}
                />
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-300">Presentase NPPN:</span>
                  <span className="text-2xl font-bold text-amber-400">{normaInput.normaPersen}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RupiahInput
                  label="Penghasilan Bruto Tahunan"
                  id="bruto-norma"
                  value={normaInput.penghasilanBruto}
                  onChange={(v) => setNormaInput({ ...normaInput, penghasilanBruto: v })}
                  icon={Wallet}
                  required
                />
                <SelectInput
                  label="Status Pajak (PTKP)"
                  id="status-norma"
                  value={normaInput.statusPajak}
                  onChange={(v) => setNormaInput({ ...normaInput, statusPajak: v as StatusPajak })}
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
                />
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Kredit Pajak yang Sudah Dibayar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <RupiahInput label="PPh 21" id="pph21-norma" value={normaInput.pph21Dibayar} onChange={(v) => setNormaInput({ ...normaInput, pph21Dibayar: v })} />
                  <RupiahInput label="PPh 22" id="pph22-norma" value={normaInput.pph22Dibayar} onChange={(v) => setNormaInput({ ...normaInput, pph22Dibayar: v })} />
                  <RupiahInput label="PPh 23" id="pph23-norma" value={normaInput.pph23Dibayar} onChange={(v) => setNormaInput({ ...normaInput, pph23Dibayar: v })} />
                  <RupiahInput label="PPh 25" id="pph25-norma" value={normaInput.pph25Dibayar} onChange={(v) => setNormaInput({ ...normaInput, pph25Dibayar: v })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "profesi" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Scale className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Profesi Bebas</h2>
                  <p className="text-sm text-slate-400">Norma Penghitungan Penghasilan Neto (NPPN)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  label="Jenis Profesi *10 Ibukota Provinsi*"
                  id="jenis-profesi"
                  value={profesiInput.jenisProfesi}
                  onChange={(v) => {
                    const nppnString = getNPPNByProfesi(v);
                    const nppnNumber = parseNPPN(nppnString);
                    setProfesiInput({ 
                      ...profesiInput, 
                      jenisProfesi: v,
                      normaPersen: nppnNumber,
                      pengeluaranOperasional: Math.floor(profesiInput.penghasilanBruto * (nppnNumber / 100))
                    });
                  }}
                  options={getAllProfesiNames().map((p) => ({ 
                    value: p, 
                    label: `${getNPPNByProfesi(p)} - ${p}` 
                  }))}
                />
                <RupiahInput
                  label="Penghasilan Bruto Tahunan"
                  id="bruto-profesi"
                  value={profesiInput.penghasilanBruto}
                  onChange={(v) => {
                    const nppnNumber = profesiInput.normaPersen;
                    setProfesiInput({ 
                      ...profesiInput, 
                      penghasilanBruto: v,
                      pengeluaranOperasional: Math.floor(v * (nppnNumber / 100))
                    });
                  }}
                  icon={Wallet}
                  required
                />
              </div>

              <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-violet-300">Presentase NPPN:</span>
                  <span className="text-2xl font-bold text-violet-400">{profesiInput.normaPersen}%</span>
                </div>
                <p className="text-xs text-violet-300/70 mt-1">
                  Pengeluaran operasional dihitung otomatis: {formatRupiah(profesiInput.pengeluaranOperasional)}
                </p>
              </div>

              <SelectInput
                label="Status Pajak (PTKP)"
                id="status-profesi"
                value={profesiInput.statusPajak}
                onChange={(v) => setProfesiInput({ ...profesiInput, statusPajak: v as StatusPajak })}
                options={STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
              />

              <div className="pt-6 border-t border-white/10">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Kredit Pajak yang Sudah Dibayar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <RupiahInput label="PPh 21" id="pph21-profesi" value={profesiInput.pph21Dibayar} onChange={(v) => setProfesiInput({ ...profesiInput, pph21Dibayar: v })} />
                  <RupiahInput label="PPh 22" id="pph22-profesi" value={profesiInput.pph22Dibayar} onChange={(v) => setProfesiInput({ ...profesiInput, pph22Dibayar: v })} />
                  <RupiahInput label="PPh 23" id="pph23-profesi" value={profesiInput.pph23Dibayar} onChange={(v) => setProfesiInput({ ...profesiInput, pph23Dibayar: v })} />
                  <RupiahInput label="PPh 25" id="pph25-profesi" value={profesiInput.pph25Dibayar} onChange={(v) => setProfesiInput({ ...profesiInput, pph25Dibayar: v })} />
                </div>
              </div>
            </div>
          )}
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            saveMessage.includes("berhasil")
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {saveMessage.includes("berhasil") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <AlertCircle className="w-5 h-5" />
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
