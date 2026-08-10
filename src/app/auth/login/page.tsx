"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");

    const result = await signIn("user", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/account");
    }
  }

  return (
    <main className="bg-cosmos-chalk flex min-h-screen items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-cosmos-forest text-2xl font-semibold tracking-widest"
          >
            COSMOS AI
          </Link>
          <div className="text-cosmos-teal mt-1 text-sm tracking-widest">
            SIGN IN TO YOUR ACCOUNT
          </div>
        </div>

        {/* Card */}
        <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
          <h1 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
            Welcome back
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal placeholder:text-cosmos-forest/30 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal placeholder:text-cosmos-forest/30 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="bg-cosmos-accent hover:bg-cosmos-forest-light w-full rounded-full px-8 py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-cosmos-forest/60 text-center text-sm font-light">
              Do not have an account?{" "}
              <Link
                href="/auth/register"
                className="text-cosmos-teal font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-cosmos-forest/40 mt-6 text-center text-sm">
          <Link href="/" className="hover:text-cosmos-forest transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
