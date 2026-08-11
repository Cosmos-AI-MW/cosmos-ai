"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");

    const result = await signIn("admin", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  }

  return (
    <main className="bg-cosmos-forest flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-cosmos-sage text-2xl font-semibold tracking-widest"
          >
            COSMOS AI
          </Link>
          <div className="text-cosmos-teal mt-1 text-sm tracking-widest">
            ADMIN ACCESS
          </div>
        </div>

        {/* Card */}
        <div className="border-cosmos-forest-light bg-cosmos-night rounded-2xl border p-8">
          <h1 className="font-display mb-6 text-2xl font-semibold text-white">
            Sign In
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-cosmos-sage mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="border-cosmos-forest-light bg-cosmos-chalk text-cosmos-night focus:border-cosmos-teal placeholder:text-cosmos-forest/40 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none"
              />
            </div>

            <div>
              <label className="text-cosmos-sage mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="border-cosmos-forest-light bg-cosmos-chalk text-cosmos-night focus:border-cosmos-teal placeholder:text-cosmos-forest/40 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="bg-cosmos-accent hover:bg-cosmos-forest-light w-full rounded-full px-8 py-3 text-base font-medium tracking-wide text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-cosmos-sage/40 mt-6 text-center text-sm">
          <Link href="/" className="hover:text-cosmos-sage transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
