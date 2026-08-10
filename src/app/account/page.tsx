import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account — Cosmos AI",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) redirect("/auth/login");
  if (session.user.isAdmin) redirect("/admin");

  // Always fetch fresh data from database — session token can be stale
  const freshUser = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!freshUser) redirect("/auth/login");

  const user = {
    ...session.user,
    generationsUsed: freshUser.generationsUsed,
    generationsLimit: freshUser.generationsLimit,
    tier: freshUser.tier,
  };

  const remaining = Math.max(0, user.generationsLimit - user.generationsUsed);
  const usedPct = Math.min(
    100,
    Math.round((user.generationsUsed / user.generationsLimit) * 100),
  );

  const tierLabels: Record<string, string> = {
    free: "Free",
    starter: "Starter",
    professional: "Professional",
  };

  const tierColours: Record<string, string> = {
    free: "text-cosmos-sage",
    starter: "text-cosmos-teal",
    professional: "text-cosmos-gold",
  };

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            My Account
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            {user.email}
          </h1>
          <div
            className={`mt-2 text-base font-medium ${tierColours[user.tier] ?? "text-cosmos-sage"}`}
          >
            {tierLabels[user.tier] ?? "Free"} Plan
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Usage card */}
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
            <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
              Cosmos Write Usage
            </h2>

            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-cosmos-forest text-4xl font-bold">
                  {user.generationsUsed}
                  <span className="text-cosmos-forest/50 text-lg font-light">
                    /{user.generationsLimit}
                  </span>
                </div>
                <div className="text-cosmos-forest/60 mt-1 text-sm font-light">
                  generations used this month
                </div>
              </div>
              <div className="text-right">
                <div className="text-cosmos-teal text-2xl font-bold">
                  {remaining}
                </div>
                <div className="text-cosmos-forest/60 text-sm font-light">
                  remaining
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-cosmos-mist mb-6 h-3 w-full rounded-full">
              <div
                className={`h-3 rounded-full transition-all ${usedPct >= 90 ? "bg-red-400" : usedPct >= 70 ? "bg-cosmos-gold" : "bg-cosmos-teal"}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/cosmos-write"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-center text-base font-medium text-white transition-colors"
              >
                Open Cosmos Write
              </Link>
              {user.tier === "free" && (
                <Link
                  href="/contact"
                  className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-center text-base font-medium transition-colors hover:text-white"
                >
                  Upgrade Plan
                </Link>
              )}
            </div>
          </div>

          {/* Plan details */}
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
            <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
              Your Plan
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  label: "Free",
                  gens: "10 generations/month",
                  price: "MWK 0",
                  current: user.tier === "free",
                },
                {
                  label: "Starter",
                  gens: "50 generations/month",
                  price: "MWK 5,000/month",
                  current: user.tier === "starter",
                },
                {
                  label: "Professional",
                  gens: "Unlimited generations",
                  price: "MWK 15,000/month",
                  current: user.tier === "professional",
                },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className={`rounded-2xl border p-6 ${
                    plan.current
                      ? "border-cosmos-teal bg-cosmos-mist"
                      : "border-cosmos-silver"
                  }`}
                >
                  <div className="font-display text-cosmos-forest mb-1 text-xl font-semibold">
                    {plan.label}
                    {plan.current && (
                      <span className="text-cosmos-teal ml-2 text-sm font-light">
                        current
                      </span>
                    )}
                  </div>
                  <div className="text-cosmos-forest/70 mb-3 text-sm font-light">
                    {plan.gens}
                  </div>
                  <div className="text-cosmos-forest font-medium">
                    {plan.price}
                  </div>
                </div>
              ))}
            </div>
            {user.tier === "free" && (
              <p className="text-cosmos-forest/60 mt-6 text-sm font-light">
                To upgrade your plan contact us at{" "}
                <Link
                  href="/contact"
                  className="text-cosmos-teal hover:underline"
                >
                  cosmosai.mw/contact
                </Link>{" "}
                — Paychangu payment integration coming soon.
              </p>
            )}
          </div>

          {/* Account details */}
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
            <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                  Email
                </div>
                <div className="text-cosmos-forest text-base font-light">
                  {user.email}
                </div>
              </div>
              <div>
                <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                  Account Type
                </div>
                <div className="text-cosmos-forest text-base font-light">
                  Individual — {tierLabels[user.tier] ?? "Free"} Plan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
