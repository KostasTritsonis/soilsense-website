"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Home,
  Map,
  Work,
  WbSunny,
  Person,
  Park,
  Menu,
  Add,
} from "@mui/icons-material";
import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import SettingsDropdown from "./settings-dropdown";

const getPrimaryNavLinks = (t: (key: string) => string, locale: string) => [
  {
    href: `/${locale}`,
    label: t("navigation.home"),
    icon: <Home fontSize="small" />,
  },
  {
    href: `/${locale}/fields`,
    label: t("navigation.fields"),
    icon: <Map fontSize="small" />,
  },
  {
    href: `/${locale}/plants`,
    label: t("navigation.plants"),
    icon: <Park fontSize="small" />,
  },
];

const getSecondaryNavLinks = (t: (key: string) => string, locale: string) => [
  {
    href: `/${locale}/jobs`,
    label: t("navigation.jobs"),
    icon: <Work fontSize="small" />,
  },
  {
    href: `/${locale}/weather`,
    label: t("navigation.weather"),
    icon: <WbSunny fontSize="small" />,
  },
  {
    href: `/${locale}/profile`,
    label: t("common.profile"),
    icon: <Person fontSize="small" />,
    requiresAuth: true,
  },
];

function NavLinkItem({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1.5 px-2 py-1.5 flex-1 min-w-0"
    >
      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <span className={isActive ? "text-primary-500" : "text-neutral-500"}>
          {icon}
        </span>
      </span>
      <span
        className={`truncate w-full text-center text-xs leading-tight ${
          isActive
            ? "text-primary-500 font-medium"
            : "text-neutral-500 font-normal"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

function MoreMenuDropdownMobile({
  pathname,
  locale,
}: {
  pathname: string;
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const secondaryLinks = getSecondaryNavLinks(t, locale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const isActive = secondaryLinks.some(
    (link) => pathname === link.href && (!link.requiresAuth || true) // Will be filtered by SignedIn component
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-col items-center justify-center gap-1.5 px-2 py-1.5 w-full"
      >
        <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <span className={isActive ? "text-primary-500" : "text-neutral-500"}>
            <Menu fontSize="small" />
          </span>
        </span>
        <span
          className={`truncate w-full text-center text-xs leading-tight ${
            isActive
              ? "text-primary-500 font-medium"
              : "text-neutral-500 font-normal"
          }`}
        >
          {t("common.more")}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
            style={{ bottom: "73px" }}
          />
          {/* Menu */}
          <div
            className="fixed bottom-[73px] left-0 right-0 bg-neutral-900 dark:bg-neutral-900 border-t border-neutral-800 dark:border-neutral-800 shadow-large z-50 rounded-t-2xl"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <div className="p-3 space-y-1">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  {t("common.more")}
                </p>
              </div>
              {secondaryLinks.map((link) => {
                if (link.requiresAuth) {
                  return (
                    <SignedIn key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full ${
                          pathname === link.href
                            ? "bg-primary-600/20 text-primary-400"
                            : "text-neutral-400 hover:bg-neutral-800"
                        }`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    </SignedIn>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full ${
                      pathname === link.href
                        ? "bg-primary-600/20 text-primary-400"
                        : "text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const primaryLinks = getPrimaryNavLinks(t, locale);
  const secondaryLinks = getSecondaryNavLinks(t, locale);

  return (
    <>
      {/* Mobile Layout (below md) - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 dark:bg-neutral-900">
        <nav className="relative flex items-center justify-around p-1 gap-1">
          {/* Dashboard */}
          <NavLinkItem
            href={primaryLinks[0].href}
            icon={primaryLinks[0].icon}
            label={primaryLinks[0].label}
            pathname={pathname}
          />

          {/* Fields */}
          <NavLinkItem
            href={primaryLinks[1].href}
            icon={primaryLinks[1].icon}
            label={primaryLinks[1].label}
            pathname={pathname}
          />

          {/* Floating Add Field Button - Between Fields and Plants with halo effect */}
          <div className="relative flex-shrink-0 ">
            <Link
              href={`/${locale}/fields`}
              className="flex items-center justify-center w-16 h-16 -mt-8 z-10 relative"
            >
              {/* Outer ring/halo */}
              <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-md"></div>
              {/* Inner circle */}
              <div className="relative w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center shadow-lg transition-all hover:scale-105">
                <Add fontSize="medium" className="text-white" />
              </div>
            </Link>
          </div>

          {/* Plants */}
          <NavLinkItem
            href={primaryLinks[2].href}
            icon={primaryLinks[2].icon}
            label={primaryLinks[2].label}
            pathname={pathname}
          />

          {/* More Menu for Secondary Links - Always visible */}
          <div className="flex-1 min-w-0">
            <MoreMenuDropdownMobile pathname={pathname} locale={locale} />
          </div>

          {/* Sign In button - Only when signed out */}
          <SignedOut>
            <Link
              href={`/${locale}/sign-in`}
              className="flex flex-col items-center justify-center gap-1.5 px-2 py-1.5 flex-1 min-w-0"
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <Person fontSize="small" className="text-neutral-500" />
              </span>
              <span className="truncate w-full text-center text-xs leading-tight text-neutral-500 font-normal">
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
          <Link
            href={`/${locale}`}
            className="flex-shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="SoilSense Logo"
              width={60}
              height={60}
              className="w-12 h-12 md:w-14 md:h-14"
              priority
            />
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {t("common.soilSense")}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("common.agriculturalIntelligence")}
              </p>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="flex gap-1 bg-neutral-100/80 dark:bg-neutral-700/80 backdrop-blur-sm rounded-2xl p-1">
            {/* Primary Navigation Links */}
            {primaryLinks.map((link) => (
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
            ))}

            {/* Secondary Navigation Links - Direct on Desktop */}
            {secondaryLinks.map((link) => {
              if (link.requiresAuth) {
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
                <Person fontSize="small" />
                <span className="hidden lg:inline">{t("common.signIn")}</span>
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>
    </>
  );
}
