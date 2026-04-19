# Kalkulator Pajak Pribadi Indonesia

Platform modern untuk penghitungan simulasi Pajak Penghasilan (PPh) Orang Pribadi sesuai dengan regulasi terbaru di Indonesia, termasuk UU Harmonisasi Peraturan Perpajakan (HPP) Tahun 2021 dan PP 55/2022.

## Fitur Utama

- Perhitungan PPh 21 Karyawan dengan otomatisasi Biaya Jabatan.
- Perhitungan PPh UMKM sesuai PP 55/2022 (Tarif Final 0.5% dengan batas PTKP omset 500jt).
- Perhitungan PPh menggunakan Norma Penghitungan Penghasilan Neto (NPPN) sesuai Per-17/PJ/2015.
- Perhitungan PPh Profesi Bebas dengan metode pembukuan operasional aktual.
- Export laporan hasil perhitungan ke format PDF profesional.
- Dashboard interaktif dengan desain Glassmorphism modern.
- Optimasi performa tinggi dengan skor Lighthouse 90+.

## Teknologi yang Digunakan

- Next.js 14 (App Router)
- React.js
- Tailwind CSS (Styling)
- Framer Motion (Animasi & Interaksi)
- Lucide React (Icons)
- jsPDF (Laporan PDF)

## Persyaratan Sistem

- Node.js 18.17 atau versi yang lebih baru.

## Panduan Instalasi dan Penggunaan

1. Clone repositori ini:
   git clone https://github.com/DimasAkbarF/pajak-pribadi-app.git

2. Masuk ke direktori proyek:
   cd pajak-pribadi-app

3. Instal dependensi menggunakan npm:
   npm install

4. Jalankan aplikasi dalam mode pengembangan:
   npm run dev

5. Untuk build produksi:
   npm run build
   npm run start

## Keamanan dan Privasi

Aplikasi ini bersifat privat. Seluruh data penghitungan dijalankan langsung di sisi klien (browser) dan tidak disimpan secara permanen di server kecuali jika pengguna memilih untuk menyimpan simulasi ke database melalui fitur yang tersedia.

## Lisensi

Proyek ini dikembangkan untuk tujuan edukasi dan simulasi perpajakan di Indonesia.