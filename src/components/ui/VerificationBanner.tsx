"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function VerificationBanner({ email }: { email: string }) {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resendVerification = api.auth.resendVerification.useMutation({
    onSuccess: () => {
      setResent(true);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  function handleResend() {
    setLoading(true);
    resendVerification.mutate({ email });
  }

  return (
    <div className="bg-cosmos-night border-cosmos-forest border-b px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-cosmos-gold text-sm">⚠</span>
          <p className="text-cosmos-sage text-sm font-light">
            Please verify your email address to secure your account. Check your
            inbox at <span className="font-medium text-white">{email}</span>
          </p>
        </div>
        {resent ? (
          <span className="text-cosmos-teal shrink-0 text-sm font-medium">
            ✓ Email sent
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="border-cosmos-sage text-cosmos-sage hover:border-cosmos-teal shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors hover:text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend email"}
          </button>
        )}
      </div>
    </div>
  );
}
