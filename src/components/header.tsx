"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Home, Map, Briefcase, CloudSun, User, Leaf } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import SettingsDropdown from "./settings-dropdown";

const getNavLinks = (t: (key: string) => string, locale: string) => [
  {
    href: `/${locale}`,
    label: t("navigation.dashboard"),
    icon: <Home className="w-5 h-5" />,
  },
  {
    href: `/${locale}/fields`,
    label: t("navigation.fields"),
    icon: <Map className="w-5 h-5" />,
  },
  {
    href: `/${locale}/plants`,
    label: t("navigation.plants"),
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    href: `/${locale}/jobs`,
    label: t("navigation.jobs"),
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    href: `/${locale}/weather`,
    label: t("navigation.weather"),
    icon: <CloudSun className="w-5 h-5" />,
  },
  {
    href: `/${locale}/profile`,
    label: t("common.profile"),
    icon: <User className="w-5 h-5" />,
  },
];

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const navLinks = getNavLinks(t, locale);

  return (
    <>
      {/* Mobile Layout (below md) - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-700 safe-area-inset-bottom">
        <nav className="flex gap-0.5 sm:gap-1 p-1 sm:p-2 overflow-x-auto">
          {navLinks.map((link) => {
            // Show profile tab only for signed-in users, show sign-in for others
            if (link.href === `/${locale}/profile`) {
              return (
                <SignedIn key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-2 sm:py-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex-shrink-0 min-w-[60px] sm:min-w-[70px] ${
                      pathname === link.href
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span className="truncate w-full text-center">
                      {link.label}
                    </span>
                  </Link>
                </SignedIn>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-2 sm:py-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex-shrink-0 min-w-[60px] sm:min-w-[70px] ${
                  pathname === link.href
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {link.icon}
                </span>
                <span className="truncate w-full text-center">
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Settings dropdown for mobile */}
          <div className="flex-shrink-0 flex justify-center min-w-[60px] sm:min-w-[70px]">
            <SettingsDropdown />
          </div>

          {/* Sign In/Sign Out buttons for mobile */}
          <SignedOut>
            <Link
              href={`/${locale}/sign-in`}
              className="flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-2 sm:py-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex-shrink-0 min-w-[60px] sm:min-w-[70px] bg-primary-600 text-white hover:bg-primary-700"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate w-full text-center">
                {t("common.signIn")}
              </span>
            </Link>
          </SignedOut>
        </nav>
      </div>

      {/* Desktop Layout (md and above) */}
      <header className="w-full hidden md:block relative">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {t("common.soilSense")}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("common.agriculturalIntelligence")}
            </p>
          </div>

          {/* Main Navigation */}
          <nav className="flex gap-1 bg-neutral-100/80 dark:bg-neutral-700/80 backdrop-blur-sm rounded-2xl p-1">
            {navLinks.map((link) => {
              // Show profile tab only for signed-in users
              if (link.href === `/${locale}/profile`) {
                return (
                  <SignedIn key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === link.href
                          ? "bg-white dark:bg-neutral-600 text-primary-700 dark:text-primary-400 shadow-soft"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-600/60 hover:text-neutral-900 dark:hover:text-neutral-200"
                      }`}
                    >
                      {link.icon}
                      <span className="hidden lg:inline">{link.label}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-white dark:bg-neutral-600 text-primary-700 dark:text-primary-400 shadow-soft"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-600/60 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  {link.icon}
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-700/80 backdrop-blur-sm rounded-2xl p-1 flex-shrink-0">
            <SettingsDropdown />

            <SignedOut>
              <Link
                href={`/${locale}/sign-in`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-primary-600 text-white hover:bg-primary-700 shadow-soft"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{t("common.signIn")}</span>
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>
    </>
  );
}
