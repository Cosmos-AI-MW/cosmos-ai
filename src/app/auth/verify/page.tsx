"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  const verify = api.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus("success");
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      verify.mutate({ token });
    } else {
      setStatus("error");
      setMessage("No verification token found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="bg-cosmos-chalk flex min-h-screen items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link
            href="/"
            className="font-display text-cosmos-forest text-2xl font-semibold tracking-widest"
          >
            COSMOS AI
          </Link>
        </div>

        <div className="border-cosmos-silver rounded-2xl border bg-white p-12">
          {status === "loading" && (
            <>
              <div className="mb-4 text-5xl">✴</div>
              <h1 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                Verifying your email...
              </h1>
              <p className="text-cosmos-forest/60 text-base font-light">
                Please wait a moment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 text-5xl">✓</div>
              <h1 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                Email verified
              </h1>
              <p className="text-cosmos-forest mb-8 text-base font-light">
                Your Cosmos AI account is now active. Sign in to start using
                Cosmos Write.
              </p>
              <Link
                href="/auth/login"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium text-white transition-colors"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4 text-5xl">✴</div>
              <h1 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                Verification failed
              </h1>
              <p className="text-cosmos-forest mb-8 text-base font-light">
                {message}
              </p>
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/auth/register"
                  className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium text-white transition-colors"
                >
                  Register Again
                </Link>
                <Link
                  href="/contact"
                  className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-base font-medium transition-colors hover:text-white"
                >
                  Contact Support
                </Link>
              </div>
            </>
          )}
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
