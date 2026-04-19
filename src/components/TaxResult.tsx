"use client";

import { TaxBreakdown } from "@/types";
import { formatRupiah, getBracketBreakdown } from "@/lib/tax-engine";
import { Download, TrendingUp, Calculator, Wallet, FileText, Save, CheckCircle, AlertTriangle, Info, Receipt } from "lucide-react";

interface TaxResultProps {
  result: TaxBreakdown | null;
  onDownloadPDF: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calculator className="w-10 h-10 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Siap Menghitung Pajak</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
        Masukkan data penghasilan Anda pada form di sebelah kiri untuk melihat hasil perhitungan PPh
      </p>
    </div>
  );
}

export default function TaxResult({ result, onDownloadPDF, onSave, isSaving }: TaxResultProps) {
  if (!result) {
    return <EmptyState />;
  }

  const brackets = getBracketBreakdown(result.pkpRounded);
  const isBebas = result.penghasilanBruto <= 500_000_000 && result.umkmTax === 0;

  const getStatusColor = () => {
    switch (result.status) {
      case "Kurang Bayar": return { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-400", icon: "text-red-600 dark:text-red-400", light: "bg-red-100 dark:bg-red-800/50" };
      case "Nihil": return { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-400", icon: "text-green-600 dark:text-green-400", light: "bg-green-100 dark:bg-green-800/50" };
      default: return { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", icon: "text-blue-600 dark:text-blue-400", light: "bg-blue-100 dark:bg-blue-800/50" };
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Status Card */}
      <div className={`rounded-2xl p-6 ${statusColor.bg} border ${statusColor.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status Perhitungan
            </p>
            <p className={`text-3xl font-bold mt-2 ${statusColor.text}`}>
              {result.status}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${statusColor.light}`}>
            <Wallet className={`w-8 h-8 ${statusColor.icon}`} />
          </div>
        </div>
        
        {result.status === "Kurang Bayar" && (
          <div className="mt-5 pt-4 border-t border-red-200 dark:border-red-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jumlah Kurang Bayar</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatRupiah(result.kurangBayar)}
            </p>
          </div>
        )}
        
        {result.status === "Lebih Bayar" && (
          <div className="mt-5 pt-4 border-t border-blue-200 dark:border-blue-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jumlah Lebih Bayar</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatRupiah(result.kreditPajak.total - result.totalTax)}
            </p>
          </div>
        )}
        
        {isBebas && (
          <div className="mt-5 pt-4 border-t border-green-200 dark:border-green-800/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Penghasilan dalam batas "Bebas Pajak"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Receipt className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rincian Perhitungan</h3>
        </div>
        
        <div className="space-y-1">
          {/* Income Section */}
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
            <span className="text-sm text-gray-600 dark:text-gray-400">Penghasilan Bruto</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(result.penghasilanBruto)}</span>
          </div>
          
          {result.biayaJabatan > 0 && (
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Biaya Jabatan (5%, max 6jt)
              </span>
              <span className="font-medium text-red-500 dark:text-red-400">-{formatRupiah(result.biayaJabatan)}</span>
            </div>
          )}
          
          {result.pengeluaranNorma > 0 && (
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Pengeluaran Norma
              </span>
              <span className="font-medium text-red-500 dark:text-red-400">-{formatRupiah(result.pengeluaranNorma)}</span>
            </div>
          )}
          
          {result.pengeluaranOperasional > 0 && (
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Pengeluaran Operasional
              </span>
              <span className="font-medium text-red-500 dark:text-red-400">-{formatRupiah(result.pengeluaranOperasional)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border-y border-blue-100 dark:border-blue-800/30">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Penghasilan Neto</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">{formatRupiah(result.penghasilanNeto)}</span>
          </div>
          
          {/* PKP Section */}
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              PTKP (Penghasilan Tidak Kena Pajak)
            </span>
            <span className="font-medium text-orange-500 dark:text-orange-400">-{formatRupiah(result.ptkp)}</span>
          </div>
          
          {result.pkp !== result.pkpRounded && (
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-sm text-gray-500 dark:text-gray-500">PKP (sebelum pembulatan)</span>
              <span className="font-medium text-gray-600 dark:text-gray-400">{formatRupiah(result.pkp)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-violet-50/50 dark:bg-violet-900/20 border-y border-violet-100 dark:border-violet-800/30">
            <span className="text-sm font-semibold text-violet-900 dark:text-violet-300">PKP (Penghasilan Kena Pajak)</span>
            <span className="font-bold text-violet-700 dark:text-violet-400">{formatRupiah(result.pkpRounded)}</span>
          </div>
          
          {/* Tax Section */}
          {result.progressiveTax > 0 && (
            <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/30 mt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PPh Progresif Terhitung</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatRupiah(result.progressiveTax)}</span>
            </div>
          )}
          
          {result.umkmTax > 0 && (
            <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">PPh UMKM Final (0.5%)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(result.umkmTax)}</span>
            </div>
          )}
          
          {/* Tax Credits */}
          {result.kreditPajak.total > 0 && (
            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 mb-2">Kredit Pajak</p>
              {result.kreditPajak.pph21 > 0 && (
                <div className="flex justify-between items-center py-1.5 px-3">
                  <span className="text-sm text-gray-500 dark:text-gray-500">PPh Pasal 21</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-{formatRupiah(result.kreditPajak.pph21)}</span>
                </div>
              )}
              {result.kreditPajak.pph22 > 0 && (
                <div className="flex justify-between items-center py-1.5 px-3">
                  <span className="text-sm text-gray-500 dark:text-gray-500">PPh Pasal 22</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-{formatRupiah(result.kreditPajak.pph22)}</span>
                </div>
              )}
              {result.kreditPajak.pph23 > 0 && (
                <div className="flex justify-between items-center py-1.5 px-3">
                  <span className="text-sm text-gray-500 dark:text-gray-500">PPh Pasal 23</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-{formatRupiah(result.kreditPajak.pph23)}</span>
                </div>
              )}
              {result.kreditPajak.pph25 > 0 && (
                <div className="flex justify-between items-center py-1.5 px-3">
                  <span className="text-sm text-gray-500 dark:text-gray-500">PPh Pasal 25</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-{formatRupiah(result.kreditPajak.pph25)}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center py-4 px-4 mt-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900">
            <span className="font-semibold">Total PPh Terutang</span>
            <span className="text-xl font-bold">{formatRupiah(result.totalTax)}</span>
          </div>
        </div>
      </div>

      {/* Bracket Breakdown */}
      {result.pkpRounded > 0 && result.progressiveTax > 0 && brackets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rincian Tarif Progresif UU HPP</h3>
          </div>
          <div className="space-y-2">
            {brackets.map((b, i) => (
              <div key={i} className="flex justify-between items-center py-3 px-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 shadow-sm flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {(b.rate * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{b.range}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(b.tax)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              Tarif progresif sesuai UU HPP No. 7 Tahun 2021
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3.5 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
