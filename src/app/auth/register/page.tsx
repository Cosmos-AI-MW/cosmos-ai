"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = api.auth.register.useMutation({
    onSuccess: () => {
      router.push("/auth/login?registered=true");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleRegister() {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    register.mutate({ email, password });
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
            CREATE YOUR ACCOUNT
          </div>
        </div>

        {/* Card */}
        <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
          <h1 className="font-display text-cosmos-forest mb-2 text-2xl font-semibold">
            Get started free
          </h1>
          <p className="text-cosmos-forest/60 mb-6 text-sm font-light">
            10 free generations every month. No credit card required.
          </p>

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
                placeholder="At least 8 characters"
                className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal placeholder:text-cosmos-forest/30 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal placeholder:text-cosmos-forest/30 w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={
                register.isPending || !email || !password || !confirmPassword
              }
              className="bg-cosmos-accent hover:bg-cosmos-forest-light w-full rounded-full px-8 py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {register.isPending ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-cosmos-forest/60 text-center text-sm font-light">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-cosmos-teal font-medium hover:underline"
              >
                Sign in
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
