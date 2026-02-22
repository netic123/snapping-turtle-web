"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="bg-turtle-50/30 py-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <SectionHeading>{t("heading")}</SectionHeading>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              {t("text1")}
            </p>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed">
              {t("text2")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex justify-center">
            <svg
              className="w-64 h-64 text-turtle-600 opacity-80 cursor-pointer"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <style>{`
                .turtle-head {
                  transition: transform 0.3s ease;
                }
                svg:hover .turtle-head {
                  transform: translate(-8px, -3px);
                }
              `}</style>

              {/* Tail */}
              <ellipse cx="162" cy="110" rx="14" ry="4" opacity="0.6" transform="rotate(-10 162 110)" />
              {/* Legs */}
              <ellipse cx="58" cy="142" rx="10" ry="6" opacity="0.7" />
              <ellipse cx="142" cy="142" rx="10" ry="6" opacity="0.7" />
              <ellipse cx="52" cy="78" rx="8" ry="5" opacity="0.7" transform="rotate(-20 52 78)" />
              <ellipse cx="148" cy="80" rx="8" ry="5" opacity="0.7" transform="rotate(20 148 80)" />
              {/* Head (behind shell) */}
              <g className="turtle-head">
                <circle cx="40" cy="100" r="16" opacity="0.8" />
                <circle cx="33" cy="97" r="3" fill="white" />
                <circle cx="32" cy="97" r="1.5" fill="#1c1917" />
              </g>
              {/* Shell shadow */}
              <ellipse cx="100" cy="110" rx="60" ry="45" opacity="0.2" />
              {/* Shell (on top) */}
              <ellipse cx="100" cy="105" rx="55" ry="40" />
              {/* Shell pattern */}
              <path d="M70 95 Q100 75 130 95" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
              <path d="M65 105 Q100 85 135 105" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
              <path d="M70 115 Q100 95 130 115" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
            </svg>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
