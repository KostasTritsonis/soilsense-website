'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Dashboard from "../../public/dashboard.svg";
import Fields from "../../public/fields.svg";
import Jobs from "../../public/jobs.svg";
import Weather from "../../public/weather.svg";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const navLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon:Dashboard,
  },
  {
    href: "/fields",
    label: "Fields",
    icon:Fields,
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon:Jobs,
  },
  {
    href: "/weather",
    label: "Weather",
    icon:Weather,
  }
]

export default function Header() {

  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 mx-auto">
      <Link href="/"><h1 className= {`sm:text-3xl font-semibold text-xl text-green-700 ${poppins.className}`}>SoilSense</h1></Link>
      <nav className=" hidden sm:flex">  
        <ul className='flex gap-x-3 p-3 text-[14px] md:text-[16px]  w-full flex-row sm:space-x-5 '>
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <Link className={`flex items-center ${pathname === link.href ? 'text-green-700 font-semibold' : 'text-zinc-400 '}`} href={link.href}>
                <link.icon alt={link.label} className={`w-5 h-5 mx-2 ${pathname === link.href ? 'text-green-700' : 'text-zinc-400'}`} />
                {link.label}
              </Link>
              {pathname === link.href && <hr className="absolute -bottom-[12px] right-3 w-[50%] border-green-700 rounded-full border-2"></hr>}
            </li>
          ))}
        </ul>
      </nav>
      <section className="flex items-center gap-x-2 sm:gap-x-4">
        <button className=" bg-green-700 text-white width-[200px] px-2 py-1 sm:text-[14px] text-[12px] rounded-md font-semibold hover:bg-green-500">UPGRADE</button>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in"><button className="bg-zinc-50 text-zinc-900 width-[200px] px-2 py-1 text-[14px] rounded-sm font-semibold hover:bg-zinc-200">Login</button></Link>
        </SignedOut>
      </section>
     
      

      <nav className="fixed bg-[#F9F5EA] bottom-0 left-0 right-0 border-t z-50 border-zinc-200 sm:hidden">
        <ul className="flex justify-around items-center py-0.5">
          {navLinks.map((link) => (
            <li key={link.href} className="flex flex-col items-center">
              <Link
                href={link.href}
                className={`flex flex-col items-center ${
                  pathname === link.href ? 'text-green-800 font-semibold' : 'text-zinc-400'
                }`}
              >
                <link.icon alt={link.label} className={`w-5 h-5 mx-2 ${pathname === link.href ? 'text-green-700' : 'text-zinc-400'}`} />
                <span className="text-xs">{link.label}</span>
              </Link>
              {pathname === link.href &&<hr className=" w-[50%] border-green-700 rounded-full border-2"></hr>}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
