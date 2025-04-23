'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const navLinks = [
  {
    href: "/",
    label: "Dashboard",
    image:"/dashboard.png"
  },
  {
    href: "/fields",
    label: "Fields",
    image:"/fields.png"
  },
  {
    href: "/jobs",
    label: "Jobs",
    image:"/jobs.png"
  },
  {
    href: "/weather",
    label: "Weather",
    image:"/weather.png"
  }
]

export default function Header() {

  const pathname = usePathname();

  return (
    <header>
      <div className="bg-green-800 flex items-center text-zinc-50 p-4 border-b gap-x-4 border-zinc-700">
        <Link href="/"><h1 className= {`sm:text-3xl font-semibold text-xl ${poppins.className}`}>SoilSense</h1></Link>
        <button className="ml-auto bg-white text-green-700 width-[200px] px-2 py-1 sm:text-[14px] text-[12px] rounded-md font-semibold hover:bg-zinc-200">UPGRADE</button>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut><Link href="/sign-in"><button className="bg-zinc-50 text-zinc-900 width-[200px] px-2 py-1 text-[14px] rounded-sm font-semibold hover:bg-zinc-200">Login</button></Link></SignedOut>
      </div>
      <nav className=" hidden sm:flex justify-center">
        <ul className='flex items-center justify-center gap-x-3 p-3 text-[14px] md:text-[16px] border-b w-full border-zinc-400/50 flex-row sm:space-x-5 '>
          {navLinks.map((link) => (
            <li key={link.href} className="flex flex-col  items-center relative">
              <Link className={`flex justify-center items-center ${pathname === link.href ? 'text-green-700 font-semibold' : 'text-zinc-400 '}`} href={link.href}>
                <Image src={link.image} alt={link.label} className="mx-2" width={20} height={20} />
                {link.label}
              </Link>
              {pathname === link.href && <hr className="absolute -bottom-[12px] right-3 w-[50%] border-green-700 rounded-full border-2"></hr>}
            </li>
          ))}
        </ul>
      </nav>

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
              <Image
                src={link.image}
                alt={link.label}
                width={24}
                height={24}
                className="mb-1"
              />
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
