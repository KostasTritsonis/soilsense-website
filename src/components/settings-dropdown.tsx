"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { SignedIn, useClerk } from "@clerk/nextjs";
import LanguageSwitcher from "./language-switcher";
import ThemeToggle from "./theme-toggle";

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    try {
      signOut({
        redirectUrl: `/${locale}`,
        sessionId: undefined,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-neutral-100/80 dark:bg-neutral-700/80 hover:bg-white/60 dark:hover:bg-neutral-600/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
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
          className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-800 rounded-2xl shadow-large border border-white/60 dark:border-neutral-700/60 p-4"
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

            <SignedIn>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={handleSignOut}
                  className="self-center w-full px-3 py-2 rounded-md text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-soft"
                >
                  {t("common.signOut")}
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </div>
  );
}
