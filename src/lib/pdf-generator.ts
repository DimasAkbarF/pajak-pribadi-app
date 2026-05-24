import { TaxBreakdown, TaxModule } from "@/types";
import { formatRupiah } from "./tax-engine";

const MODULE_LABELS: Record<TaxModule, string> = {
  umkm: "UMKM (PP 55/2022)",
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
  doc.text("Laporan Perhitungan PPh UMKM", 14, 15);
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

  const breakdownRows: string[][] = [];

  if (result.umkmDetail) {
    breakdownRows.push(
      ["Omzet Bulan Ini", formatRupiah(result.umkmDetail.omzetBulanIni)],
      ["Kumulatif Omzet s.d. Bulan Ini", formatRupiah(result.umkmDetail.kumulatifOmzet)],
      ["Bebas PPh (Batas Rp500 Juta)", formatRupiah(result.umkmDetail.bebasPPh)],
      ["Omzet Kena Pajak Bulan Ini", formatRupiah(result.umkmDetail.omzetKenaPajakBulan)],
      ["Tarif PPh Final", `${result.umkmDetail.tarifPPh}%`],
      ["PPh Setor Bulan Ini", formatRupiah(result.umkmDetail.pphSetorBulan)],
      ["Total PPh Kumulatif s.d. Bulan Ini", formatRupiah(result.umkmDetail.totalPPhKumulatif)]
    );
  } else {
    breakdownRows.push(
      ["Total Omzet Tahunan", formatRupiah(result.penghasilanBruto)],
      ["PPh UMKM Final (0.5%)", formatRupiah(result.umkmTax)]
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

  // Final Status
  y = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  const isBebas = result.umkmDetail 
    ? result.umkmDetail.kumulatifOmzet <= 500_000_000 
    : (result.penghasilanBruto <= 500_000_000 && result.umkmTax === 0);

  const statusColor = isBebas ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);

  const pphSetor = result.umkmDetail ? result.umkmDetail.pphSetorBulan : result.totalTax;
  const statusLabel = isBebas
    ? "BEBAS PAJAK (Omzet di bawah Rp500 Juta)"
    : `KURANG BAYAR (PPh Final 0.5%): ${formatRupiah(pphSetor)}`;

  doc.text(statusLabel, 14, y);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Dokumen ini dihasilkan secara otomatis oleh Kalkulator Pajak UMKM. Bukan bukti pembayaran pajak resmi.",
    14,
    doc.internal.pageSize.getHeight() - 10
  );
  doc.text(
    `© ${now.getFullYear()} Kalkulator Pajak UMKM | PP 55/2022 Tarif Final 0.5%`,
    14,
    doc.internal.pageSize.getHeight() - 5
  );

  return doc;
}
