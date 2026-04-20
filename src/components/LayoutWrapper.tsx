import Header from "./Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 lg:px-8 py-8 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} KalkulatorPajak
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Sesuai UU HPP 2021 dan PP 55/2022. Hasil perhitungan bersifat simulasi.
          </p>
        </div>
      </footer>
    </>
  );
}
