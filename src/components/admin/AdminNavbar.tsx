"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOutButton from "~/components/admin/SignOutButton";

export default function AdminNavbar({ q = "" }: { q?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="border-cosmos-forest bg-cosmos-forest border-b px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/admin" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/cosmos_logo.png"
            alt="Cosmos AI"
            width={40}
            height={40}
            className="rounded"
          />
          <div>
            <div className="font-display text-cosmos-sage text-lg font-semibold tracking-widest">
              COSMOS AI
            </div>
            <div className="text-cosmos-teal text-xs tracking-widest">
              ADMIN DASHBOARD
            </div>
          </div>
        </Link>

        {/* Desktop — search + links */}
        <div className="hidden max-w-sm flex-1 items-center gap-2 md:flex">
          <form method="GET" action="/admin" className="relative flex-1">
            <svg
              className="text-cosmos-sage/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
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
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search submissions..."
              className="border-cosmos-forest-light bg-cosmos-forest/50 focus:border-cosmos-teal placeholder:text-cosmos-sage/40 w-full rounded-full border py-2 pr-4 pl-9 text-sm font-light text-white transition-colors outline-none"
            />
          </form>
          {q && (
            <Link
              href="/admin"
              className="text-cosmos-sage/60 hover:text-cosmos-sage text-xs whitespace-nowrap transition-colors"
            >
              Clear
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
          >
            View Site
          </Link>
          <SignOutButton />
        </div>

        {/* Mobile — search icon + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-cosmos-sage transition-colors hover:text-white"
            aria-label="Toggle search"
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
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5"
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
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="mt-3 md:hidden">
          <form
            method="GET"
            action="/admin"
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <svg
                className="text-cosmos-sage/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
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
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search submissions..."
                autoFocus
                className="border-cosmos-forest-light bg-cosmos-forest/50 focus:border-cosmos-teal placeholder:text-cosmos-sage/40 w-full rounded-full border py-2 pr-4 pl-9 text-sm font-light text-white transition-colors outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-cosmos-accent rounded-full px-4 py-2 text-sm font-medium text-white"
            >
              Go
            </button>
            {q && (
              <Link
                href="/admin"
                className="text-cosmos-sage/60 hover:text-cosmos-sage text-xs transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-cosmos-forest-light mt-3 flex flex-col gap-4 border-t pt-4 md:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-cosmos-sage text-base font-medium transition-colors hover:text-white"
          >
            View Site
          </Link>
          <SignOutButton />
        </div>
      )}
    </nav>
  );
}
