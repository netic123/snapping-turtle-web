"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

const INDUSTRIES = [
  "energy",
  "insurance",
  "education",
  "itConsulting",
  "infrastructure",
  "security",
];

export default function Clients() {
  const t = useTranslations("Clients");

  return (
    <section className="py-20 bg-turtle-900">
      <Container>
        <ScrollReveal>
          <p className="text-center text-white/70 text-sm font-medium uppercase tracking-widest mb-12">
            {t("heading")}
          </p>
        </ScrollReveal>
        <div className="flex flex-wrap justify-center gap-3">
          {INDUSTRIES.map((industryKey, i) => (
            <ScrollReveal key={industryKey} delay={i * 0.08}>
              <span className="inline-block px-5 py-2.5 rounded-full border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-sm md:text-base font-medium text-white/90 hover:text-white transition-all duration-300 cursor-default">
                {t(industryKey)}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
