import {
  TaxBracket,
  TaxBreakdown,
  StatusPajak,
  PTKPMap,
  KaryawanInput,
  UMKMInput,
  NormaInput,
  ProfesiInput,
  TaxModule,
  NormaKotaEntry,
  type JenisUsahaKategori,
  type NPPNItem,
  DATA_NPPN,
} from "@/types";

// Re-export for components
export { DATA_NPPN, type JenisUsahaKategori, type NPPNItem };

// ═══════════════════════════════════════════════════════════════
// TARIF PROGRESIF PPh ORANG PRIBADI (UU HPP 2021 / UU 7/2021)
// ═══════════════════════════════════════════════════════════════

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 60_000_000, rate: 0.05 },
  { min: 60_000_000, max: 250_000_000, rate: 0.15 },
  { min: 250_000_000, max: 500_000_000, rate: 0.25 },
  { min: 500_000_000, max: 5_000_000_000, rate: 0.3 },
  { min: 5_000_000_000, max: Infinity, rate: 0.35 },
];

// ═══════════════════════════════════════════════════════════════
// PTKP (Penghasilan Tidak Kena Pajak) - UU HPP
// Dasar: 54.000.000 | Kawin: +4.500.000 | Tanggungan: +4.500.000/orang (max 3)
// K/I = Kawin Penghasilan Istri Digabung: +54.000.000 (istri)
// ═══════════════════════════════════════════════════════════════

const PTKP: PTKPMap = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0": 58_500_000,
  "K/1": 63_000_000,
  "K/2": 67_500_000,
  "K/3": 72_000_000,
  "K/I/0": 112_500_000,
  "K/I/1": 117_000_000,
  "K/I/2": 121_500_000,
  "K/I/3": 126_000_000,
};

// ═══════════════════════════════════════════════════════════════
// BIAYA JABATAN (Karyawan)
// 5% dari penghasilan bruto, maksimal Rp6.000.000/tahun
// ═══════════════════════════════════════════════════════════════

const BIAYA_JABATAN_RATE = 0.05;
const BIAYA_JABATAN_MAX = 6_000_000;

// ═══════════════════════════════════════════════════════════════
// UMKM (PP 55/2022 / PP 58/2023)
// Tarif Final 0.5%, Bebas Pajak untuk omset ≤ Rp500.000.000
// ═══════════════════════════════════════════════════════════════

const UMKM_RATE = 0.005;
const UMKM_BEBAS_THRESHOLD = 500_000_000;

// ═══════════════════════════════════════════════════════════════
// PPh BADAN (UU HPP 2021)
// Tarif Flat 22%, Pasal 31E: 50% diskon untuk omzet s/d 4.8M
// ═══════════════════════════════════════════════════════════════

const PPH_BADAN_RATE = 0.22;
const PPH_BADAN_PASAL31E_THRESHOLD = 4_800_000_000;
const PPH_BADAN_PASAL31E_DISCOUNT = 0.5;

// ═══════════════════════════════════════════════════════════════
// PPh 21 TER (Tarif Efektif Rata-rata)
// 2024/2025: Bruto × %TER sesuai PTKP
// ═══════════════════════════════════════════════════════════════

const TER_RATES: Record<string, number> = {
  "A": 0.05, // TK/0, TK/1, TK/2, TK/3
  "B": 0.15, // K/0, K/1, K/2, K/3
  "C": 0.25, // K/I/0, K/I/1, K/I/2, K/I/3
};

// ═══════════════════════════════════════════════════════════════
// PPN (PPN 11% - UU HPP 2021)
// ═══════════════════════════════════════════════════════════════

const PPN_RATE = 0.11;

// ═══════════════════════════════════════════════════════════════
// NORMA PENGHITUNGAN PENGHASILAN NETO (NPPN)
// Data per Ibu Kota Provinsi + Jenis Profesi
// ═══════════════════════════════════════════════════════════════

const NORMA_DATA: NormaKotaEntry[] = [
  {
    kota: "DKI Jakarta",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Surabaya",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Bandung",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Semarang",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Medan",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Makassar",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Palembang",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Denpasar",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Yogyakarta",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
  {
    kota: "Manado",
    profesi: [
      { nama: "Dokter/Profesi Medis", persen: 50 },
      { nama: "Notaris/PPAT", persen: 50 },
      { nama: "Konsultan Hukum/Pengacara", persen: 55 },
      { nama: "Akuntan", persen: 50 },
      { nama: "Arsitek", persen: 50 },
      { nama: "Perantara/Makelar", persen: 30 },
      { nama: "Distributor/Faktor", persen: 25 },
      { nama: "Tukang Kayu", persen: 20 },
      { nama: "Tukang Batu", persen: 20 },
      { nama: "Tukang Las", persen: 20 },
      { nama: "Tukang Jahit", persen: 25 },
      { nama: "Tukang Cuci", persen: 25 },
      { nama: "Penata Rambut", persen: 25 },
      { nama: "Penata Rias", persen: 25 },
      { nama: "Mekanik", persen: 20 },
      { nama: "Tukang Listrik", persen: 20 },
      { nama: "Petani/Pekebun", persen: 10 },
      { nama: "Peternak", persen: 10 },
      { nama: "Nelayan", persen: 10 },
      { nama: "Pengemudi", persen: 20 },
      { nama: "Lainnya", persen: 25 },
    ],
  },
];

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
// CORE CALCULATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** Get PTKP value for a given status */
export function getPTKP(status: StatusPajak): number {
  return PTKP[status] ?? 54_000_000;
}

/** Calculate Biaya Jabatan (5% of bruto, max 6jt/year) */
export function calculateBiayaJabatan(bruto: number): number {
  return Math.min(bruto * BIAYA_JABATAN_RATE, BIAYA_JABATAN_MAX);
}

/** Calculate progressive tax from PKP */
export function calculateProgressiveTax(pkp: number): number {
  if (pkp <= 0) return 0;

  let tax = 0;
  let remaining = pkp;

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break;

    const taxableInBracket = Math.min(
      remaining,
      bracket.max === Infinity ? remaining : bracket.max - bracket.min
    );

    if (taxableInBracket > 0) {
      // Only tax the portion within this bracket that hasn't been accounted for
      const bracketRange = bracket.max - bracket.min;
      const amountInBracket = Math.min(remaining, bracketRange);
      tax += amountInBracket * bracket.rate;
      remaining -= amountInBracket;
    }
  }

  return Math.floor(tax);
}

/** Calculate UMKM tax (PP 55/2022) */
export function calculateUMKMTax(omsetTahunan: number): number {
  if (omsetTahunan <= UMKM_BEBAS_THRESHOLD) return 0;
  return Math.floor(UMKM_RATE * (omsetTahunan - UMKM_BEBAS_THRESHOLD));
}

/** Get Norma percentage by city and profession */
export function getNormaPersen(kota: string, profesi: string): number {
  const kotaEntry = NORMA_DATA.find(
    (n) => n.kota.toLowerCase() === kota.toLowerCase()
  );
  if (!kotaEntry) return 25; // default fallback
  const profEntry = kotaEntry.profesi.find(
    (p) => p.nama.toLowerCase() === profesi.toLowerCase()
  );
  return profEntry?.persen ?? 25;
}

/** Get all Norma cities */
export function getNormaCities(): string[] {
  return NORMA_DATA.map((n) => n.kota);
}

/** Get professions for a given city */
export function getProfessionsByCity(kota: string): string[] {
  const kotaEntry = NORMA_DATA.find(
    (n) => n.kota.toLowerCase() === kota.toLowerCase()
  );
  if (!kotaEntry) return ["Lainnya"];
  return kotaEntry.profesi.map((p) => p.nama);
}

/** Calculate Norma deduction */
export function calculateNormaDeduction(
  bruto: number,
  normaPersen: number
): number {
  return Math.floor(bruto * (normaPersen / 100));
}

// ═══════════════════════════════════════════════════════════════
// MODULE CALCULATORS
// ═══════════════════════════════════════════════════════════════

/** KARYAWAN: Full progressive tax calculation */
export function calculateKaryawan(input: KaryawanInput): TaxBreakdown {
  const biayaJabatan = calculateBiayaJabatan(input.penghasilanBruto);
  const penghasilanNeto = input.penghasilanBruto - biayaJabatan;
  const ptkp = getPTKP(input.statusPajak);
  const pkp = Math.max(0, penghasilanNeto - ptkp);
  const pkpRounded = roundDownToThousand(pkp);
  const progressiveTax = calculateProgressiveTax(pkpRounded);

  const kreditPajak = {
    pph21: input.pph21Dibayar,
    pph22: input.pph22Dibayar,
    pph23: input.pph23Dibayar,
    pph25: input.pph25Dibayar,
    total: input.pph21Dibayar + input.pph22Dibayar + input.pph23Dibayar + input.pph25Dibayar,
  };

  const totalTax = progressiveTax;
  const netPosition = totalTax - kreditPajak.total;

  let status: TaxBreakdown["status"];
  let kurangBayar: number;

  if (netPosition > 0) {
    status = "Kurang Bayar";
    kurangBayar = netPosition;
  } else if (netPosition === 0) {
    status = "Nihil";
    kurangBayar = 0;
  } else {
    status = "Lebih Bayar";
    kurangBayar = 0;
  }

  return {
    penghasilanBruto: input.penghasilanBruto,
    biayaJabatan,
    pengeluaranNorma: 0,
    pengeluaranOperasional: 0,
    penghasilanNeto,
    ptkp,
    pkp,
    pkpRounded,
    progressiveTax,
    umkmTax: 0,
    kreditPajak,
    totalTax,
    status,
    kurangBayar,
  };
}

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

/** NORMA: Progressive tax with Norma deduction */
export function calculateNorma(input: NormaInput): TaxBreakdown {
  const normaPersen = input.normaPersen > 0 ? input.normaPersen : getNormaPersen(input.kota, input.jenisProfesi);
  const pengeluaranNorma = calculateNormaDeduction(input.penghasilanBruto, normaPersen);
  const penghasilanNeto = input.penghasilanBruto - pengeluaranNorma;
  const ptkp = getPTKP(input.statusPajak);
  const pkp = Math.max(0, penghasilanNeto - ptkp);
  const pkpRounded = roundDownToThousand(pkp);
  const progressiveTax = calculateProgressiveTax(pkpRounded);

  const kreditPajak = {
    pph21: input.pph21Dibayar,
    pph22: input.pph22Dibayar,
    pph23: input.pph23Dibayar,
    pph25: input.pph25Dibayar,
    total: input.pph21Dibayar + input.pph22Dibayar + input.pph23Dibayar + input.pph25Dibayar,
  };

  const totalTax = progressiveTax;
  const netPosition = totalTax - kreditPajak.total;

  let status: TaxBreakdown["status"];
  let kurangBayar: number;

  if (netPosition > 0) {
    status = "Kurang Bayar";
    kurangBayar = netPosition;
  } else if (netPosition === 0) {
    status = "Nihil";
    kurangBayar = 0;
  } else {
    status = "Lebih Bayar";
    kurangBayar = 0;
  }

  return {
    penghasilanBruto: input.penghasilanBruto,
    biayaJabatan: 0,
    pengeluaranNorma,
    pengeluaranOperasional: 0,
    penghasilanNeto,
    ptkp,
    pkp,
    pkpRounded,
    progressiveTax,
    umkmTax: 0,
    kreditPajak,
    totalTax,
    status,
    kurangBayar,
  };
}

/** PROFESI: Progressive tax with actual operational expenses */
export function calculateProfesi(input: ProfesiInput): TaxBreakdown {
  const penghasilanNeto = input.penghasilanBruto - input.pengeluaranOperasional;
  const ptkp = getPTKP(input.statusPajak);
  const pkp = Math.max(0, penghasilanNeto - ptkp);
  const pkpRounded = roundDownToThousand(pkp);
  const progressiveTax = calculateProgressiveTax(pkpRounded);

  const kreditPajak = {
    pph21: input.pph21Dibayar,
    pph22: input.pph22Dibayar,
    pph23: input.pph23Dibayar,
    pph25: input.pph25Dibayar,
    total: input.pph21Dibayar + input.pph22Dibayar + input.pph23Dibayar + input.pph25Dibayar,
  };

  const totalTax = progressiveTax;
  const netPosition = totalTax - kreditPajak.total;

  let status: TaxBreakdown["status"];
  let kurangBayar: number;

  if (netPosition > 0) {
    status = "Kurang Bayar";
    kurangBayar = netPosition;
  } else if (netPosition === 0) {
    status = "Nihil";
    kurangBayar = 0;
  } else {
    status = "Lebih Bayar";
    kurangBayar = 0;
  }

  return {
    penghasilanBruto: input.penghasilanBruto,
    biayaJabatan: 0,
    pengeluaranNorma: 0,
    pengeluaranOperasional: input.pengeluaranOperasional,
    penghasilanNeto,
    ptkp,
    pkp,
    pkpRounded,
    progressiveTax,
    umkmTax: 0,
    kreditPajak,
    totalTax,
    status,
    kurangBayar,
  };
}

/** Master dispatch function */
export function calculateTax(
  module: TaxModule,
  input: KaryawanInput | UMKMInput | NormaInput | ProfesiInput
): TaxBreakdown {
  switch (module) {
    case "karyawan":
      return calculateKaryawan(input as KaryawanInput);
    case "umkm":
      return calculateUMKM(input as UMKMInput);
    case "norma":
      return calculateNorma(input as NormaInput);
    case "profesi":
      return calculateProfesi(input as ProfesiInput);
    default:
      throw new Error(`Unknown tax module: ${module}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// NEW TAX CALCULATION FUNCTIONS (2026 Compliance)
// ═══════════════════════════════════════════════════════════════

/** PPh 21 TER (Tarif Efektif Rata-rata) - 2024/2025 */
export function calculatePPh21TER(brutoTahunan: number, ptkpCategory: "A" | "B" | "C"): number {
  const terRate = TER_RATES[ptkpCategory] || TER_RATES["A"];
  return Math.floor(brutoTahunan * terRate);
}

/** Get TER category from PTKP status */
export function getTERCategoryFromPTKP(status: StatusPajak): "A" | "B" | "C" {
  if (status.startsWith("K/I")) return "C";
  if (status.startsWith("K")) return "B";
  return "A";
}

/** PPh Badan - Flat 22% with Pasal 31E discount */
export function calculatePPhBadan(penghasilanKenaPajak: number): {
  tax: number;
  pasal31EDiscount: number;
  finalTax: number;
} {
  const baseTax = Math.floor(penghasilanKenaPajak * PPH_BADAN_RATE);
  
  let pasal31EDiscount = 0;
  if (penghasilanKenaPajak <= PPH_BADAN_PASAL31E_THRESHOLD) {
    pasal31EDiscount = Math.floor(baseTax * PPH_BADAN_PASAL31E_DISCOUNT);
  }
  
  const finalTax = baseTax - pasal31EDiscount;
  
  return {
    tax: baseTax,
    pasal31EDiscount,
    finalTax,
  };
}

/** UMKM - 0.5% Final with 500m threshold (enhanced version) */
export function calculateUMKMEnhanced(omsetTahunan: number): {
  tax: number;
  taxablePortion: number;
  isBebas: boolean;
} {
  const isBebas = omsetTahunan <= UMKM_BEBAS_THRESHOLD;
  const taxablePortion = isBebas ? 0 : omsetTahunan - UMKM_BEBAS_THRESHOLD;
  const tax = isBebas ? 0 : Math.floor(taxablePortion * UMKM_RATE);
  
  return {
    tax,
    taxablePortion,
    isBebas,
  };
}

/** PPN - 11% with include/exclude modes */
export function calculatePPN(amount: number, mode: "include" | "exclude"): {
  ppn: number;
  subtotal: number;
  total: number;
} {
  if (mode === "exclude") {
    const ppn = Math.floor(amount * PPN_RATE);
    return {
      ppn,
      subtotal: amount,
      total: amount + ppn,
    };
  } else {
    const subtotal = Math.floor(amount / (1 + PPN_RATE));
    const ppn = amount - subtotal;
    return {
      ppn,
      subtotal,
      total: amount,
    };
  }
}

/** Get detailed bracket breakdown for display */
export function getBracketBreakdown(pkp: number): { range: string; rate: number; tax: number }[] {
  const result: { range: string; rate: number; tax: number }[] = [];
  let remaining = pkp;

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break;

    const bracketRange = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
    const amountInBracket = Math.min(remaining, bracketRange);

    if (amountInBracket > 0) {
      const maxLabel = bracket.max === Infinity ? "+" : formatRupiah(bracket.max);
      result.push({
        range: `${formatRupiah(bracket.min)} - ${maxLabel}`,
        rate: bracket.rate,
        tax: Math.floor(amountInBracket * bracket.rate),
      });
      remaining -= amountInBracket;
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// JENIS USAHA (KLU) HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** Get all jenis usaha categories */
export function getJenisUsahaCategories(): string[] {
  return DATA_NPPN.JENIS_USAHA.map((k: JenisUsahaKategori) => k.kategori);
}

/** Get all items for a specific category */
export function getJenisUsahaByCategory(kategori: string): NPPNItem[] {
  const found = DATA_NPPN.JENIS_USAHA.find((k: JenisUsahaKategori) => k.kategori === kategori);
  return found?.list || [];
}

/** Get NPPN percentage for a specific jenis usaha by name (searches both JENIS_USAHA and JENIS_PROFESI) */
export function getNPPNByJenisUsaha(nama: string): string {
  // Search in JENIS_USAHA
  for (const kategori of DATA_NPPN.JENIS_USAHA) {
    const item = kategori.list.find((i: NPPNItem) => i.nama === nama);
    if (item) return item.nppn;
  }
  // Search in JENIS_PROFESI
  const profesiItem = DATA_NPPN.JENIS_PROFESI.find((i: NPPNItem) => i.nama === nama);
  if (profesiItem) return profesiItem.nppn;
  return "15%"; // default fallback
}

/** Get NPPN for a specific profesi by name */
export function getNPPNByProfesi(nama: string): string {
  const item = DATA_NPPN.JENIS_PROFESI.find((i: NPPNItem) => i.nama === nama);
  return item?.nppn || "50%"; // default 50% for profesi
}

/** Parse NPPN string (e.g., "30%") to number (30) */
export function parseNPPN(nppnString: string): number {
  const clean = nppnString.replace("%", "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 15 : num; // default 15% if parsing fails
}

/** Get all jenis usaha names (flattened) for dropdown */
export function getAllJenisUsahaNames(): string[] {
  return DATA_NPPN.JENIS_USAHA.flatMap((k: JenisUsahaKategori) => k.list.map((i: NPPNItem) => i.nama));
}

/** Get all profesi names for dropdown */
export function getAllProfesiNames(): string[] {
  return DATA_NPPN.JENIS_PROFESI.map((i: NPPNItem) => i.nama);
}
