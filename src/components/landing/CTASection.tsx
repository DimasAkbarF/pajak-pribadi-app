"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </m.div>
  );
}

export default function CTASection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 border border-white/10 backdrop-blur-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap untuk Menghitung Pajak Anda?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Bergabung dengan ribuan pengguna yang telah menggunakan KalkulatorPajak.id
                untuk perhitungan pajak yang akurat dan cepat.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-semibold text-lg transition-colors"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
