export type TaxModule = "umkm";

export interface UMKMInput {
  bulan: string; // Jan - Dec
  omzetBulanIni: number;
  totalOmzet: number; // Januari s.d. bulan ini
  omsetTahunan: number; // keep for backward compatibility
}

export type TaxInput = UMKMInput;

export interface TaxBreakdown {
  penghasilanBruto: number;
  biayaJabatan: number;
  pengeluaranNorma: number;
  pengeluaranOperasional: number;
  penghasilanNeto: number;
  ptkp: number;
  pkp: number;
  pkpRounded: number;
  progressiveTax: number;
  umkmTax: number;
  kreditPajak: {
    pph21: number;
    pph22: number;
    pph23: number;
    pph25: number;
    total: number;
  };
  totalTax: number;
  status: "Kurang Bayar" | "Nihil" | "Lebih Bayar";
  kurangBayar: number;
  umkmDetail?: {
    bulan: string;
    omzetBulanIni: number;
    kumulatifOmzet: number;
    bebasPPh: number;
    omzetKenaPajakBulan: number;
    tarifPPh: number;
    pphSetorBulan: number;
    totalPPhKumulatif: number;
  };
}

export interface SimulationRecord {
  _id?: string;
  module: TaxModule;
  input: TaxInput;
  result: TaxBreakdown;
  createdAt: Date;
}
