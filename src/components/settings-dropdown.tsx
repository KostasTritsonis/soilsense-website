"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import ThemeToggle from "./theme-toggle";

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-neutral-100/80 dark:bg-neutral-700/80 hover:bg-white/60 dark:hover:bg-neutral-600/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">{t("common.settings")}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-large border border-white/60 dark:border-neutral-700/60 p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                {t("theme.theme")}
              </h3>
              <ThemeToggle />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                {t("common.language")}
              </h3>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
