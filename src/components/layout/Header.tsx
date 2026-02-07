"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { COMPANY } from "@/lib/constants";

export default function Header() {
  const t = useTranslations("Header");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: t("services") },
    { href: "#about", label: t("about") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-bark-200">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <a href="#" className="font-bold text-xl text-bark-900">
            {COMPANY.name}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-bark-600 hover:text-turtle-700 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-bark-600 hover:text-bark-900"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-bark-200 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-bark-600 hover:text-turtle-700 font-medium py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
}
