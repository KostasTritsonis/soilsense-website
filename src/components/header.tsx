"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Home, Map, Briefcase, CloudSun, User } from "lucide-react";

const navLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    href: "/fields",
    label: "Fields",
    icon: <Map className="w-5 h-5" />,
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    href: "/weather",
    label: "Weather",
    icon: <CloudSun className="w-5 h-5" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="w-5 h-5" />,
  },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile Layout (below md) - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-neutral-200">
        {/* Mobile Navigation */}
        <nav className="flex gap-1 p-2">
          {navLinks.map((link) => {
            // Show profile tab only for signed-in users, show sign-in for others
            if (link.href === "/profile") {
              return (
                <SignedIn key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
                      pathname === link.href
                        ? "bg-primary-100 text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    {link.icon}
                    <span className="text-xs">{link.label}</span>
                  </Link>
                </SignedIn>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
                  pathname === link.href
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {link.icon}
                <span className="text-xs">{link.label}</span>
              </Link>
            );
          })}

          {/* Sign In button for mobile */}
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all duration-200 flex-1 bg-primary-600 text-white hover:bg-primary-700"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Sign In</span>
            </Link>
          </SignedOut>
        </nav>
      </div>

      {/* Desktop Layout (md and above) */}
      <header className="w-full hidden md:block">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="pl-4">
              <h1 className="text-2xl font-bold text-neutral-900">SoilSense</h1>
              <p className="text-sm sm:block hidden text-neutral-500">
                Agricultural Intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2 bg-neutral-100/80 backdrop-blur-sm rounded-2xl p-2">
            {navLinks.map((link) => {
              // Show profile tab only for signed-in users
              if (link.href === "/profile") {
                return (
                  <SignedIn key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        pathname === link.href
                          ? "bg-white text-primary-700 shadow-soft"
                          : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                      }`}
                    >
                      {link.icon}
                      <span className="hidden sm:inline">{link.label}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-white text-primary-700 shadow-soft"
                      : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                  }`}
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}

            {/* Sign In button for desktop */}
            <SignedOut>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-primary-600 text-white hover:bg-primary-700 shadow-soft"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </SignedOut>
          </nav>
        </div>
      </header>
    </>
  );
}
