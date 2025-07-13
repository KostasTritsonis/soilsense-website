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
    <header className="w-full bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-green-800">SoilSense</span>
      </div>
      <nav className="flex gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-medium transition-colors hover:bg-green-100/60 hover:text-green-800 ${
              pathname === link.href
                ? "bg-green-100/80 text-green-900"
                : "text-zinc-700"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
