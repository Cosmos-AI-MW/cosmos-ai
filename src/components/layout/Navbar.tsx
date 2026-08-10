"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const tools = [
  {
    href: "/tools/cosmos-write",
    label: "Cosmos Write",
    description: "AI business writing assistant",
  },
];

export default function Navbar({ active }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user && !session.user.isAdmin;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-cosmos-forest relative z-50 px-6 py-4">
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

          {/* AI Tools dropdown — click outside to close */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 text-base font-medium tracking-wide transition-colors ${
                active?.startsWith("/tools")
                  ? "text-white"
                  : "text-cosmos-sage hover:text-white"
              }`}
            >
              AI Tools
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {toolsOpen && (
              <div className="border-cosmos-forest-light bg-cosmos-night absolute top-full right-0 mt-2 w-64 rounded-2xl border p-2 shadow-xl">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className="hover:bg-cosmos-forest block rounded-xl px-4 py-3 transition-colors"
                  >
                    <div className="text-sm font-medium text-white">
                      {tool.label}
                    </div>
                    <div className="text-cosmos-sage/70 text-xs font-light">
                      {tool.description}
                    </div>
                  </Link>
                ))}
                <div className="border-cosmos-forest-light mt-1 border-t px-4 py-3">
                  <div className="text-cosmos-sage/40 text-xs font-light">
                    More tools coming soon
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
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
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
              >
                {session?.user?.email?.split("@")[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-cosmos-sage text-cosmos-sage hover:bg-cosmos-sage hover:text-cosmos-night rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-base font-medium tracking-wide text-white transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`bg-cosmos-sage block h-0.5 w-6 transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
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

          <div>
            <div className="text-cosmos-teal mb-2 text-xs font-medium tracking-widest uppercase">
              AI Tools
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMenuOpen(false)}
                className="text-cosmos-sage block py-2 text-base font-medium transition-colors hover:text-white"
              >
                {tool.label}
              </Link>
            ))}
          </div>

          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="text-cosmos-sage text-base font-medium tracking-wide transition-colors hover:text-white"
          >
            Search
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="text-cosmos-sage text-base font-medium transition-colors hover:text-white"
              >
                My Account
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-cosmos-sage text-cosmos-sage hover:bg-cosmos-sage hover:text-cosmos-night rounded-full border px-6 py-3 text-base font-medium transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="text-cosmos-sage text-base font-medium transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="text-cosmos-sage text-base font-medium transition-colors hover:text-white"
              >
                Register
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-3 text-center text-base font-medium tracking-wide text-white transition-colors"
              >
                Get in Touch
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
