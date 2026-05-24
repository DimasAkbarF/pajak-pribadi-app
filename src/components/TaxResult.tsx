"use client";

import { TaxBreakdown } from "@/types";
import { formatRupiah } from "@/lib/tax-engine";
import { Download, Calculator, Wallet, Save, CheckCircle, AlertTriangle, Receipt, Calendar } from "lucide-react";

// Helper to get next month for due date
function getNextMonth(bulan: string): string {
  const bulanList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const idx = bulanList.indexOf(bulan);
  return bulanList[(idx + 1) % 12] || "Januari";
}

interface TaxResultProps {
  result: TaxBreakdown | null;
  onDownloadPDF: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

function EmptyState() {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl p-8 lg:p-12 text-center border border-white/5 shadow-xl">
      <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/10">
        <Calculator className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">Siap Menghitung Pajak UMKM</h3>
      <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
        Masukkan rincian data omzet bulanan pada form untuk melihat hasil PPh Final 0.5% Anda secara otomatis.
      </p>
    </div>
  );
}

export default function TaxResult({ result, onDownloadPDF, onSave, isSaving }: TaxResultProps) {
  if (!result) {
    return <EmptyState />;
  }

  const isBebas = result.umkmDetail 
    ? result.umkmDetail.kumulatifOmzet <= 500_000_000 
    : (result.penghasilanBruto <= 500_000_000 && result.umkmTax === 0);

  const getStatusColor = () => {
    if (isBebas) {
      return { 
        bg: "bg-gradient-to-br from-[#0b1730] via-slate-900 to-[#071120]", 
        border: "border-cyan-500/20 shadow-sm shadow-cyan-950/20", 
        text: "text-cyan-400", 
        icon: "text-cyan-400", 
        light: "bg-cyan-500/10 border border-cyan-500/20" 
      };
    } else {
      return { 
        bg: "bg-gradient-to-br from-blue-950/30 via-slate-900 to-[#071120]", 
        border: "border-blue-500/20 shadow-sm shadow-blue-950/25", 
        text: "text-blue-400", 
        icon: "text-blue-400", 
        light: "bg-blue-600/10 border border-blue-500/20" 
      };
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      {/* Status Card */}
      <div className={`rounded-3xl p-6 ${statusColor.bg} border ${statusColor.border} transition-all duration-300`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Status Perhitungan
            </p>
            <p className={`text-2xl font-extrabold mt-1.5 ${statusColor.text}`}>
              {isBebas ? "Bebas Pajak (Nihil)" : "Wajib Setor"}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusColor.light}`}>
            <Wallet className={`w-5 h-5 ${statusColor.icon}`} />
          </div>
        </div>
        
        {isBebas ? (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Omzet kumulatif di bawah Rp500 Juta. Anda dibebaskan dari kewajiban menyetor PPh bulanan.
              </p>
            </div>
          </div>
        ) : (
          result.umkmDetail && (
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  PPh Final Setor Bulan Ini
                </p>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatRupiah(result.umkmDetail.pphSetorBulan)}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pajak atas bagian omzet bruto masa {result.umkmDetail.bulan} yang telah melewati ambang batas Rp500 Juta.
              </p>
            </div>
          )
        )}
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/5">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Rincian Perhitungan Pajak</h3>
            <p className="text-[10px] text-slate-400">Dasar Pengenaan Pajak (DPP) & PPh Terutang</p>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {result.umkmDetail ? (
            <>
              <div className="flex justify-between items-center py-2 px-2.5 rounded-xl hover:bg-white/[0.01] transition-colors duration-200">
                <span className="text-xs text-slate-400">Omzet Bulan {result.umkmDetail.bulan}</span>
                <span className="text-sm font-bold text-slate-200">{formatRupiah(result.umkmDetail.omzetBulanIni)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-2.5 rounded-xl hover:bg-white/[0.01] transition-colors duration-200">
                <span className="text-xs text-slate-400">Kumulatif Omzet (Jan - {result.umkmDetail.bulan})</span>
                <span className="text-sm font-bold text-slate-200">{formatRupiah(result.umkmDetail.kumulatifOmzet)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                <span className="text-xs font-semibold text-cyan-300/90">Bebas Pajak (s.d Rp500 Juta)</span>
                <span className="text-sm font-bold text-cyan-400">{formatRupiah(result.umkmDetail.bebasPPh)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-2.5 rounded-xl hover:bg-white/[0.01] transition-colors duration-200">
                <span className="text-xs text-slate-400">Omzet Kena Pajak Bulan Ini</span>
                <span className="text-sm font-bold text-slate-200">{formatRupiah(result.umkmDetail.omzetKenaPajakBulan)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-2.5 rounded-xl hover:bg-white/[0.01] transition-colors duration-200">
                <span className="text-xs text-slate-400">Tarif PPh Final UMKM</span>
                <span className="text-sm font-bold text-blue-400">{result.umkmDetail.tarifPPh}%</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-xs font-semibold text-blue-300">PPh Masa Harus Setor</span>
                <span className="text-sm font-extrabold text-blue-400">{formatRupiah(result.umkmDetail.pphSetorBulan)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">Total PPh Setor Kumulatif</span>
                <span className="text-sm font-bold text-white">{formatRupiah(result.umkmDetail.totalPPhKumulatif)}</span>
              </div>
              
              {!isBebas && (
                <div className="flex items-center gap-2 py-3 px-3 rounded-2xl bg-white/[0.01] border border-white/5 text-[10px] text-slate-400 mt-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>
                    Batas penyetoran PPh Final paling lambat tanggal 15 bulan <strong>{getNextMonth(result.umkmDetail.bulan)}</strong>.
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-2 px-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-400">Total Omzet Tahunan</span>
                <span className="text-sm font-bold text-slate-200">{formatRupiah(result.penghasilanBruto)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">Total PPh Terutang</span>
                <span className="text-sm font-bold text-white">{formatRupiah(result.totalTax)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 bg-[#0b1730] hover:bg-[#101b36] text-slate-200 font-bold py-3 px-4 rounded-2xl border border-slate-700 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm text-sm"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Unduh PDF</span>
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-500/10 disabled:shadow-none text-sm"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
