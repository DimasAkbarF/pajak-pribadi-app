export type TaxModule = "karyawan" | "umkm" | "norma" | "profesi";

export type StatusPajak =
  | "TK/0"
  | "TK/1"
  | "TK/2"
  | "TK/3"
  | "K/0"
  | "K/1"
  | "K/2"
  | "K/3"
  | "K/I/0"
  | "K/I/1"
  | "K/I/2"
  | "K/I/3";

export interface PTKPMap {
  [key: string]: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface KaryawanInput {
  penghasilanBruto: number;
  statusPajak: StatusPajak;
  penghasilanIstri: number;
  pph21Dibayar: number;
  pph22Dibayar: number;
  pph23Dibayar: number;
  pph25Dibayar: number;
}

export interface UMKMInput {
  omsetTahunan: number;
}

export interface NormaInput {
  penghasilanBruto: number;
  kota: string;
  jenisProfesi: string;
  normaPersen: number;
  statusPajak: StatusPajak;
  pph21Dibayar: number;
  pph22Dibayar: number;
  pph23Dibayar: number;
  pph25Dibayar: number;
}

export interface ProfesiInput {
  penghasilanBruto: number;
  pengeluaranOperasional: number;
  statusPajak: StatusPajak;
  pph21Dibayar: number;
  pph22Dibayar: number;
  pph23Dibayar: number;
  pph25Dibayar: number;
}

export type TaxInput = KaryawanInput | UMKMInput | NormaInput | ProfesiInput;

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
}

export interface SimulationRecord {
  _id?: string;
  module: TaxModule;
  input: TaxInput;
  result: TaxBreakdown;
  createdAt: Date;
}

export interface NormaKotaEntry {
  kota: string;
  profesi: NormaProfesiEntry[];
}

export interface NormaProfesiEntry {
  nama: string;
  persen: number;
}
