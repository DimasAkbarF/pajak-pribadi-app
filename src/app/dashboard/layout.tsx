import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Kalkulator Pajak Pribadi",
  description: "Dashboard perhitungan pajak PPh Orang Pribadi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dashboard has its own sidebar, no need for header
  return <>{children}</>;
}
