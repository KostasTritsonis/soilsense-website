"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const t = useTranslations();

  const themes = [
    { value: "light" as const, icon: Sun, label: t("theme.light") },
    { value: "dark" as const, icon: Moon, label: t("theme.dark") },
  ];

  return (
    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all flex-1 ${
            theme === value
              ? "bg-white dark:bg-neutral-700 text-primary-700 dark:text-primary-400 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
