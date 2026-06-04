"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ active }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-cosmos-forest px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/cosmos_logo.png"
            alt="Cosmos AI"
            width={48}
            height={48}
            className="rounded"
          />
          <div>
            <div className="font-display text-cosmos-sage text-lg font-semibold tracking-widest">
              COSMOS AI
            </div>
            <div className="text-cosmos-teal text-xs tracking-widest">
              SHAPING TOMORROW WITH AI
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium tracking-wide transition-colors ${
                active === link.href
                  ? "text-white"
                  : "text-cosmos-sage hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-cosmos-sage transition-colors hover:text-white"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-base font-medium tracking-wide text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-transform duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-transform duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-cosmos-forest-light mt-4 flex flex-col gap-4 border-t pt-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-medium tracking-wide transition-colors ${
                active === link.href
                  ? "text-white"
                  : "text-cosmos-sage hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="text-cosmos-sage text-base font-medium tracking-wide transition-colors hover:text-white"
          >
            Search
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-3 text-center text-base font-medium tracking-wide text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      )}
    </nav>
  );
}
