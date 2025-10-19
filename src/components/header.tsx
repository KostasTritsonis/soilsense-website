"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
  Home,
  Map,
  Briefcase,
  CloudSun,
  User,
  LogOut,
  Leaf,
} from "lucide-react";
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
  const { signOut } = useClerk();
  const t = useTranslations();
  const locale = useLocale();
  const navLinks = getNavLinks(t, locale);

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

  return (
    <>
      {/* Mobile Layout (below md) - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-700">
        <nav className="flex gap-1 p-2">
          {navLinks.map((link) => {
            // Show profile tab only for signed-in users, show sign-in for others
            if (link.href === "/profile") {
              return (
                <SignedIn key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all flex-1 ${
                      pathname === link.href
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </SignedIn>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all flex-1 ${
                  pathname === link.href
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Settings dropdown for mobile */}
          <div className="flex-1 flex justify-center">
            <SettingsDropdown />
          </div>

          {/* Sign In/Sign Out buttons for mobile */}
          <SignedOut>
            <Link
              href={`/${locale}/sign-in`}
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all flex-1 bg-primary-600 text-white hover:bg-primary-700"
            >
              <User className="w-5 h-5" />
              <span>{t("common.signIn")}</span>
            </Link>
          </SignedOut>

          <SignedIn>
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("common.signOut")}</span>
            </button>
          </SignedIn>
        </nav>
      </div>

      {/* Desktop Layout (md and above) */}
      <header className="w-full hidden md:block relative">
        <div className="flex items-center justify-between gap-6">
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
          <div className="flex items-center gap-2 flex-shrink-0">
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

            <SignedIn>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-soft"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">{t("common.signOut")}</span>
              </button>
            </SignedIn>
          </div>
        </div>
      </header>
    </>
  );
}
