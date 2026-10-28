"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { api } from "~/trpc/react";

export default function UpgradePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const initiatePayment = api.content.initiatePayment.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError("Could not initiate payment. Please try again.");
        setLoading(null);
      }
    },
    onError: (err) => {
      setError(err.message);
      setLoading(null);
    },
  });

  function handleUpgrade(plan: "starter" | "professional") {
    setLoading(plan);
    setError("");
    initiatePayment.mutate({ plan });
  }

  const currentTier = (session?.user as { tier?: string })?.tier ?? "free";

  const plans = [
    {
      key: "starter" as const,
      name: "Starter",
      price: "MWK 5,000",
      period: "per month",
      generations: "50 generations per month",
      features: [
        "50 AI document generations per month",
        "Full access to all document types",
        "All Malawian sectors covered",
        "Conversation history",
        "Priority over free users",
      ],
      highlight: false,
    },
    {
      key: "professional" as const,
      name: "Professional",
      price: "MWK 15,000",
      period: "per month",
      generations: "Unlimited generations",
      features: [
        "Unlimited AI document generations",
        "Full access to all document types",
        "All Malawian sectors covered",
        "Conversation history",
        "Priority support",
        "Early access to new tools",
      ],
      highlight: true,
    },
  ];

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            Upgrade
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            Choose your plan
          </h1>
          <p className="text-cosmos-mist mt-3 text-lg font-light">
            Unlock more generations and full access to Cosmos AI tools.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400 bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => {
              const isCurrent = currentTier === plan.key;
              return (
                <div
                  key={plan.key}
                  className={`rounded-2xl border p-8 ${
                    plan.highlight
                      ? "border-cosmos-teal bg-cosmos-mist"
                      : "border-cosmos-silver bg-white"
                  }`}
                >
                  {plan.highlight && (
                    <div className="bg-cosmos-teal mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  <h2 className="font-display text-cosmos-forest mb-1 text-2xl font-semibold">
                    {plan.name}
                  </h2>
                  <div className="text-cosmos-forest/60 mb-1 text-sm font-light">
                    {plan.generations}
                  </div>
                  <div className="mt-3 mb-6">
                    <span className="font-display text-cosmos-forest text-3xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-cosmos-forest/60 ml-1 text-sm font-light">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-cosmos-forest/80 flex items-start gap-2 text-sm font-light"
                      >
                        <span className="text-cosmos-teal mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="border-cosmos-teal text-cosmos-teal w-full rounded-full border py-3 text-center text-sm font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.key)}
                      disabled={loading === plan.key}
                      className={`w-full rounded-full py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        plan.highlight
                          ? "bg-cosmos-accent hover:bg-cosmos-forest-light"
                          : "bg-cosmos-forest hover:bg-cosmos-forest-light"
                      }`}
                    >
                      {loading === plan.key
                        ? "Redirecting to payment..."
                        : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-cosmos-silver mt-8 rounded-2xl border bg-white p-6 text-center">
            <p className="text-cosmos-forest/60 text-sm font-light">
              Payments processed securely by{" "}
              <span className="text-cosmos-forest font-medium">Paychangu</span>.
              Accepts Airtel Money, TNM Mpamba, bank transfer, and cards.
            </p>
            <p className="text-cosmos-forest/60 mt-2 text-sm font-light">
              Your plan activates immediately after payment confirmation.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/account"
              className="text-cosmos-forest/60 hover:text-cosmos-forest text-sm font-medium transition-colors"
            >
              ← Back to Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
