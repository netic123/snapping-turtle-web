"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CLIENTS = [
  { name: "E.ON", industryKey: "energy" },
  { name: "Trygg-Hansa", industryKey: "insurance" },
  { name: "Academedia", industryKey: "education" },
  { name: "Softronic", industryKey: "itConsulting" },
  { name: "Nexer", industryKey: "itConsulting" },
  { name: "Öresundsbron", industryKey: "infrastructure" },
  { name: "ASSA ABLOY", industryKey: "security" },
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
        <div className="flex flex-wrap justify-center gap-6">
          {CLIENTS.map((client, i) => (
            <ScrollReveal key={client.name} delay={i * 0.1}>
              <div className="group flex flex-col items-center justify-center py-8 px-6 w-40 md:w-48 rounded-2xl border border-turtle-800 hover:border-turtle-600 bg-turtle-900/50 hover:bg-turtle-900 transition-all duration-300">
                <span className="text-lg md:text-xl font-bold text-white/80 group-hover:text-white transition-colors duration-300 text-center">
                  {client.name}
                </span>
                <span className="text-turtle-500 text-sm mt-2">
                  {t(client.industryKey)}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
