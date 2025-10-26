"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    let pathWithoutLocale = pathname;

    // Check if pathname starts with current locale
    if (pathname.startsWith(`/${locale}/`)) {
      pathWithoutLocale = pathname.replace(`/${locale}/`, "/");
    } else if (pathname === `/${locale}`) {
      pathWithoutLocale = "/";
    }

    // Navigate to the new locale
    const newPath = `/${newLocale}${
      pathWithoutLocale === "/" ? "" : pathWithoutLocale
    }`;

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
            locale === language.code
              ? "bg-white dark:bg-neutral-700 text-primary-700 dark:text-primary-400 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
          title={language.name}
        >
          <span className="text-lg">{language.flag}</span>
          <span className="hidden sm:inline">{language.name}</span>
        </button>
      ))}
    </div>
  );
}
