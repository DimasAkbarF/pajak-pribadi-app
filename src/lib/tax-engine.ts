import {
  TaxBreakdown,
  UMKMInput,
  TaxModule,
} from "@/types";

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** Round down PKP to nearest thousand (Per-11/2016) */
export function roundDownToThousand(value: number): number {
  return Math.floor(value / 1_000) * 1_000;
}

/** Format number to Indonesian Rupiah string */
export function formatRupiah(value: number): string {
  if (value === 0) return "Rp0";
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const formatted = abs
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${isNegative ? "-" : ""}Rp${formatted}`;
}

/** Parse Rupiah-formatted string back to number */
export function parseRupiahInput(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

// ═══════════════════════════════════════════════════════════════
// CORE CALCULATION FUNCTIONS (UMKM PP 55/2022)
// ═══════════════════════════════════════════════════════════════

/** UMKM: Final tax calculation (PP 55/2022) with monthly breakdown */
export function calculateUMKM(input: UMKMInput): TaxBreakdown {
  const { bulan, omzetBulanIni, totalOmzet } = input;
  
  // Constants
  const BEBAS_THRESHOLD = 500_000_000;
  const TARIF = 0.005; // 0.5%
  
  // Calculate
  const bebasPPh = Math.min(totalOmzet, BEBAS_THRESHOLD);
  const omzetKenaPajakTotal = Math.max(0, totalOmzet - BEBAS_THRESHOLD);
  const totalPPhKumulatif = Math.floor(omzetKenaPajakTotal * TARIF);
  
  // Determine if this month's omzet is taxable
  const kumulatifSebelumBulanIni = totalOmzet - omzetBulanIni;
  let omzetKenaPajakBulan = 0;
  
  if (totalOmzet <= BEBAS_THRESHOLD) {
    // Still under threshold, no tax
    omzetKenaPajakBulan = 0;
  } else if (kumulatifSebelumBulanIni >= BEBAS_THRESHOLD) {
    // Already passed threshold in previous months
    omzetKenaPajakBulan = omzetBulanIni;
  } else {
    // This month crosses the threshold
    omzetKenaPajakBulan = totalOmzet - BEBAS_THRESHOLD;
  }
  
  const pphSetorBulan = Math.floor(omzetKenaPajakBulan * TARIF);
  const isBebas = totalOmzet <= BEBAS_THRESHOLD;
  
  return {
    penghasilanBruto: totalOmzet,
    biayaJabatan: 0,
    pengeluaranNorma: 0,
    pengeluaranOperasional: 0,
    penghasilanNeto: totalOmzet,
    ptkp: 0,
    pkp: 0,
    pkpRounded: 0,
    progressiveTax: 0,
    umkmTax: totalPPhKumulatif,
    kreditPajak: { pph21: 0, pph22: 0, pph23: 0, pph25: 0, total: 0 },
    totalTax: totalPPhKumulatif,
    status: isBebas ? "Nihil" : "Kurang Bayar",
    kurangBayar: isBebas ? 0 : pphSetorBulan,
    umkmDetail: {
      bulan,
      omzetBulanIni,
      kumulatifOmzet: totalOmzet,
      bebasPPh,
      omzetKenaPajakBulan,
      tarifPPh: 0.5,
      pphSetorBulan,
      totalPPhKumulatif,
    },
  };
}

/** Master dispatch function */
export function calculateTax(
  module: TaxModule,
  input: UMKMInput
): TaxBreakdown {
  if (module === "umkm") {
    return calculateUMKM(input);
  }
  throw new Error(`Unknown tax module: ${module}`);
}
