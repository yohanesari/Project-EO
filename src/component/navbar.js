"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/service", label: "Service" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-md text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-bold">
          Aeterna
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-yellow-500">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <a href="https://wa.me/628512334223" target="_blank" rel="noopener noreferrer" className="hidden rounded-md bg-[#a48a5a] px-4 py-2 hover:bg-[#7a6643] md:block">
          Konsultasi
        </a>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 bg-black/80 px-4 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)} className="block py-1">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}