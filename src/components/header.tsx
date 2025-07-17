"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Home, Map, Briefcase, CloudSun } from "lucide-react";

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
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-medium">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">SoilSense</h1>
          <p className="text-sm text-neutral-500">Agricultural Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2 bg-neutral-100/80 backdrop-blur-sm rounded-2xl p-2">
        {navLinks.map((link) => (
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
        ))}
      </nav>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-2xl shadow-soft",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-colors shadow-soft hover:shadow-medium"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
