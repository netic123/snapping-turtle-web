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
    <section className="py-20 bg-turtle-950">
      <Container>
        <ScrollReveal>
          <p className="text-center text-turtle-400 text-sm font-medium uppercase tracking-widest mb-12">
            {t("heading")}
          </p>
        </ScrollReveal>
        <div className="flex flex-wrap justify-center gap-3">
          {INDUSTRIES.map((industryKey, i) => (
            <ScrollReveal key={industryKey} delay={i * 0.08}>
              <span className="inline-block px-5 py-2.5 rounded-full border border-turtle-700/50 hover:border-turtle-500 bg-turtle-900/30 hover:bg-turtle-900/60 text-sm md:text-base font-medium text-turtle-300 hover:text-white transition-all duration-300 cursor-default">
                {t(industryKey)}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
