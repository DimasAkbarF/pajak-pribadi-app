"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation } from "framer-motion";

const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"), {
  ssr: false,
});

const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"), {
  ssr: false,
});

const CTASection = dynamic(() => import("@/components/landing/CTASection"), {
  ssr: false,
});

export default function ClientLandingSections() {
  return (
    <LazyMotion features={domAnimation}>
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </LazyMotion>
  );
}
