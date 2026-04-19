import { TaxBreakdown, TaxModule } from "@/types";
import { formatRupiah, getBracketBreakdown } from "./tax-engine";

const MODULE_LABELS: Record<TaxModule, string> = {
  karyawan: "Karyawan / Pegawai",
  umkm: "UMKM (PP 55/2022)",
  norma: "Norma Penghitungan (NPPN)",
  profesi: "Profesi Bebas",
};

export async function generateTaxPDF(
  module: TaxModule,
  result: TaxBreakdown,
  inputValues: Record<string, string | number>
): Promise<any> {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");
  const doc = new jsPDF() as any;

  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const timestamp = now.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Perhitungan PPh OP", 14, 15);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Modul: ${MODULE_LABELS[module]}`, 14, 23);
  doc.text(timestamp, 14, 30);

  doc.setTextColor(0, 0, 0);

  // Input Summary
  let y = 45;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Input", 14, y);
  y += 8;

  const inputRows = Object.entries(inputValues).map(([key, val]) => [
    key,
    typeof val === "number" ? formatRupiah(val) : String(val),
  ]);

  doc.autoTable({
    startY: y,
    head: [["Parameter", "Nilai"]],
    body: inputRows,
    theme: "grid",
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: 14, right: 14 },
  });

  // Calculation Breakdown
  y = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Rincian Perhitungan", 14, y);
  y += 8;

  const breakdownRows = [
    ["Penghasilan Bruto", formatRupiah(result.penghasilanBruto)],
  ];

  if (result.biayaJabatan > 0) {
    breakdownRows.push(["Biaya Jabatan (5%, max 6jt)", `-${formatRupiah(result.biayaJabatan)}`]);
  }
  if (result.pengeluaranNorma > 0) {
    breakdownRows.push(["Pengeluaran Norma (NPPN)", `-${formatRupiah(result.pengeluaranNorma)}`]);
  }
  if (result.pengeluaranOperasional > 0) {
    breakdownRows.push(["Pengeluaran Operasional", `-${formatRupiah(result.pengeluaranOperasional)}`]);
  }

  breakdownRows.push(
    ["Penghasilan Neto", formatRupiah(result.penghasilanNeto)],
    ["PTKP", `-${formatRupiah(result.ptkp)}`],
    ["PKP (sebelum pembulatan)", formatRupiah(result.pkp)],
    ["PKP (dibulatkan ke bawah)", formatRupiah(result.pkpRounded)]
  );

  if (result.progressiveTax > 0) {
    breakdownRows.push(["PPh Progresif", formatRupiah(result.progressiveTax)]);
  }

  if (result.umkmTax > 0) {
    breakdownRows.push(["PPh UMKM Final (0.5%)", formatRupiah(result.umkmTax)]);
  }

  // Kredit Pajak
  if (result.kreditPajak.total > 0) {
    breakdownRows.push(
      ["Kredit Pajak PPh 21", `-${formatRupiah(result.kreditPajak.pph21)}`],
      ["Kredit Pajak PPh 22", `-${formatRupiah(result.kreditPajak.pph22)}`],
      ["Kredit Pajak PPh 23", `-${formatRupiah(result.kreditPajak.pph23)}`],
      ["Kredit Pajak PPh 25", `-${formatRupiah(result.kreditPajak.pph25)}`],
      ["Total Kredit Pajak", `-${formatRupiah(result.kreditPajak.total)}`]
    );
  }

  doc.autoTable({
    startY: y,
    head: [["Komponen", "Jumlah"]],
    body: breakdownRows,
    theme: "grid",
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: 14, right: 14 },
  });

  // Bracket Breakdown (only for progressive modules)
  if (result.pkpRounded > 0 && result.progressiveTax > 0) {
    y = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Rincian Tarif Progresif", 14, y);
    y += 8;

    const bracketRows = getBracketBreakdown(result.pkpRounded).map((b) => [
      b.range,
      `${(b.rate * 100).toFixed(0)}%`,
      formatRupiah(b.tax),
    ]);

    doc.autoTable({
      startY: y,
      head: [["Lapisan PKP", "Tarif", "PPh"]],
      body: bracketRows,
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: 14, right: 14 },
    });
  }

  // Final Status
  y = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  const statusColor = result.status === "Kurang Bayar" ? [220, 38, 38] : result.status === "Nihil" ? [22, 163, 74] : [30, 64, 175];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);

  const statusLabel = result.status === "Kurang Bayar"
    ? `KURANG BAYAR: ${formatRupiah(result.kurangBayar)}`
    : result.status === "Nihil"
    ? "NIHIL (Tidak ada pajak kurang bayar)"
    : `LEBIH BAYAR: ${formatRupiah(Math.abs(result.totalTax - result.kreditPajak.total))}`;

  doc.text(statusLabel, 14, y);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Dokumen ini dihasilkan secara otomatis oleh Kalkulator Pajak Pribadi. Bukan bukti pembayaran pajak resmi.",
    14,
    doc.internal.pageSize.getHeight() - 10
  );
  doc.text(
    `© ${now.getFullYear()} Kalkulator Pajak Pribadi | UU HPP 2021 & PP 55/2022`,
    14,
    doc.internal.pageSize.getHeight() - 5
  );

  return doc;
}
