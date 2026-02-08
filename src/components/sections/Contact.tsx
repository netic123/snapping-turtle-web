"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";

export default function Contact() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-turtle-50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading>{t("heading")}</SectionHeading>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <ScrollReveal delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                name="name"
                type="text"
                placeholder={t("namePlaceholder")}
                required
                className="w-full px-4 py-3 rounded-lg border border-bark-300 bg-white shadow-sm focus:ring-2 focus:ring-turtle-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                className="w-full px-4 py-3 rounded-lg border border-bark-300 bg-white shadow-sm focus:ring-2 focus:ring-turtle-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <textarea
                name="message"
                rows={5}
                placeholder={t("messagePlaceholder")}
                required
                className="w-full px-4 py-3 rounded-lg border border-bark-300 bg-white shadow-sm focus:ring-2 focus:ring-turtle-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? t("sending") : t("submit")}
            </Button>

            {status === "success" && (
              <p className="text-turtle-700 font-medium">{t("success")}</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-medium">{t("error")}</p>
            )}
          </form>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-bark-600 text-lg">{t("info")}</p>
            <a
              href={`tel:${COMPANY.phone.replace(/[\s-]/g, "")}`}
              className="inline-flex items-center gap-2 text-turtle-700 hover:text-turtle-800 font-medium text-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              {COMPANY.phone}
            </a>
            <a
              href={COMPANY.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-turtle-700 hover:text-turtle-800 font-medium text-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
