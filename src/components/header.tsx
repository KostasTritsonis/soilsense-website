'use client';
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/",
    label: "Dashboard"
  },
  {
    href: "/fields",
    label: "Fields"
  },
  {
    href: "/weather",
    label: "Weather"
  }
]

export default function Header() {

  const pathname = usePathname();

  return (
    <header>
      <div className="bg-black flex items-center text-zinc-50 p-4 border-b gap-x-4 border-zinc-700">
        <h1 className="sm:text-xl text-lg">SoilSense</h1>
        <button className="ml-auto bg-zinc-50 text-zinc-900 width-[200px] px-2 py-1 sm:text-[14px] text-[12px] rounded-sm font-semibold hover:bg-zinc-200">UPGRADE</button>
        <button className="bg-zinc-50 text-zinc-900 width-[200px] px-2 py-1 text-[14px] rounded-sm font-semibold hover:bg-zinc-200">Help?</button>
      </div>
      <nav className="flex justify-center">
        <ul className='flex gap-x-3 pt-5 text-[14px] md:text-[16px] border-b border-zinc-300/50 flex-row sm:space-x-5 '>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a className={`${pathname === link.href ? 'text-zinc-900' : 'text-zinc-400 '}`} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
