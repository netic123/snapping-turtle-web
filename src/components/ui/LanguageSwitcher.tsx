"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(newLocale: string) {
    router.replace(pathname, { locale: newLocale as "sv" | "en" });
  }

  return (
    <div className="flex bg-bark-100 rounded-full p-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            loc === locale
              ? "bg-turtle-600 text-white"
              : "text-bark-600 hover:text-bark-800"
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
