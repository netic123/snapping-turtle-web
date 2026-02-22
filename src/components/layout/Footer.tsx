import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { COMPANY } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-turtle-950 text-white">
      <Container>
        <div className="py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-light.png"
              alt="Snapping Turtle"
              width={80}
              height={45}
              className="h-8 w-auto brightness-0 invert"
            />
            <div>
              <span className="font-bold text-lg text-white block">
                {COMPANY.name}
              </span>
              <p className="text-white/70 text-sm">{t("description")}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`tel:${COMPANY.phone.replace(/[\s-]/g, "")}`}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              {COMPANY.phone}
            </a>
            <a
              href={COMPANY.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 py-6">
          <p className="text-white/60 text-sm text-center">
            {t("copyright", { year })}
          </p>
        </div>
      </Container>
    </footer>
  );
}
