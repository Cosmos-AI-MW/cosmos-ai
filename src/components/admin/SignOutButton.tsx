"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border-cosmos-sage text-cosmos-sage hover:bg-cosmos-sage hover:text-cosmos-night rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}
