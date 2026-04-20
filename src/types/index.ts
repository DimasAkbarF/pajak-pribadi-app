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
  bulan: string; // Jan - Dec
  omzetBulanIni: number;
  totalOmzet: number; // Januari s.d. bulan ini
  omsetTahunan: number; // keep for backward compatibility
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
  jenisProfesi: string;
  pph21Dibayar: number;
  pph22Dibayar: number;
  pph23Dibayar: number;
  pph25Dibayar: number;
  normaPersen: number;
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
  // UMKM detail fields
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

export interface NormaKotaEntry {
  kota: string;
  profesi: NormaProfesiEntry[];
}

export interface NormaProfesiEntry {
  nama: string;
  persen: number;
}

// NPPN Data Structure (KLU - Kode Lapangan Usaha & Profesi)
export interface NPPNItem {
  nama: string;
  nppn: string; // e.g., "30%"
}

export interface JenisUsahaKategori {
  kategori: string;
  list: NPPNItem[];
}

export interface DataNPPN {
  JENIS_USAHA: JenisUsahaKategori[];
  JENIS_PROFESI: NPPNItem[];
}

export const DATA_NPPN: DataNPPN = {
  JENIS_USAHA: [
    {
      kategori: "Perdagangan (10 Ibukota Provinsi)",
      list: [
        { nama: "Perdagangan Besar Barang Hasil Pertanian", nppn: "30%" },
        { nama: "Perdagangan Besar Lainnya", nppn: "25%" },
        { nama: "Perdagangan Eceran & Pengecer Bahan Bakar", nppn: "25%" },
        { nama: "Perdagangan Eceran Lainnya", nppn: "20%" },
        { nama: "Penjual Makanan dan Minuman Eceran", nppn: "20%" },
        { nama: "Agen, Perwakilan, Makelar, Komisioner", nppn: "15%" },
      ],
    },
    {
      kategori: "Industri/Pengolahan (10 Ibukota Provinsi)",
      list: [
        { nama: "Industri Tekstil, Pakaian Jadi dan Kulit", nppn: "25%" },
        { nama: "Industri Makanan dan Minuman", nppn: "20%" },
        { nama: "Industri Kayu dan Barang dari Kayu", nppn: "20%" },
        { nama: "Industri Kertas dan Barang dari Kertas", nppn: "20%" },
        { nama: "Industri Barang, Galian bukan Logam", nppn: "20%" },
        { nama: "Industri Pengolahan Lainnya", nppn: "15%" },
      ],
    },
    {
      kategori: "Jasa dan Pekerjaan Bebas (10 Ibukota Provinsi)",
      list: [
        { nama: "Jasa Pengiriman, Ekspedisi dan Kurir", nppn: "40%" },
        { nama: "Jasa Konstruksi dan Instalasi", nppn: "30%" },
        { nama: "Jasa Percetakan dan Penerbitan", nppn: "30%" },
        { nama: "Jasa Reparasi dan Perawatan Kendaraan", nppn: "30%" },
        { nama: "Jasa Transportasi dan Pergudangan", nppn: "25%" },
        { nama: "Jasa Hotel, Losmen, dan Penginapan", nppn: "20%" },
        { nama: "Jasa Restoran, Rumah Makan, dan Warung", nppn: "20%" },
        { nama: "Jasa Hiburan dan Rekreasi", nppn: "20%" },
        { nama: "Jasa Bengkel dan Service Peralatan", nppn: "20%" },
        { nama: "Jasa Salon, Kecantikan, dan Kebugaran", nppn: "15%" },
        { nama: "Jasa Loundry dan Pinatu", nppn: "15%" },
        { nama: "Jasa Lainnya (tidak terinci di atas)", nppn: "15%" },
      ],
    },
    {
      kategori: "Pertanian/Peternakan/Perikanan",
      list: [
        { nama: "Pertanian Tanaman Pangan dan Hortikultura", nppn: "15%" },
        { nama: "Perkebunan dan Kehutanan Rakyat", nppn: "15%" },
        { nama: "Peternakan", nppn: "15%" },
        { nama: "Perikanan (Tangkap dan Budidaya)", nppn: "10%" },
      ],
    },
  ],
  JENIS_PROFESI: [
    { nama: "Dokter Umum / Spesialis / Dokter Gigi", nppn: "50%" },
    { nama: "Pengacara / Advokat", nppn: "50%" },
    { nama: "Akuntan / Auditor", nppn: "50%" },
    { nama: "Arsitek", nppn: "50%" },
    { nama: "Konsultan (Pajak, Manajemen, Hukum, Bisnis)", nppn: "50%" },
    { nama: "Notaris / PPAT", nppn: "50%" },
    { nama: "Penilai / Akutuaris", nppn: "50%" },
    { nama: "Artis / Penyanyi / Presentaser / Influencer", nppn: "50%" },
    { nama: "Pengawas / Pengelola", nppn: "40%" },
    { nama: "Agen Iklan", nppn: "40%" },
    { nama: "Olahragawan Profesional", nppn: "40%" },
    { nama: "Peneliti / Pengarang / Penerjamah", nppn: "40%" },
    { nama: "Agen Asuransi", nppn: "30%" },
    { nama: "Perantara / Makelar", nppn: "30%" },
  ],
};
