"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type Tier = "free" | "starter" | "professional";

const tierLabels: Record<Tier, string> = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
};

const tierColours: Record<Tier, string> = {
  free: "border-cosmos-sage text-cosmos-sage",
  starter: "border-cosmos-teal text-cosmos-teal",
  professional: "border-cosmos-gold text-cosmos-gold",
};

export default function UpgradeTierButton({
  userId,
  currentTier,
  email,
}: {
  userId: string;
  currentTier: string;
  email: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState<Tier | null>(null);

  const upgrade = api.content.upgradeUser.useMutation({
    onSuccess: () => {
      setOpen(false);
      setConfirming(null);
      router.refresh();
    },
  });

  const tiers: Tier[] = ["free", "starter", "professional"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:text-white"
      >
        Change Tier
      </button>

      {open && (
        <div className="border-cosmos-forest-light bg-cosmos-night absolute top-full right-0 z-10 mt-2 w-56 rounded-2xl border p-3 shadow-xl">
          <p className="text-cosmos-sage/50 mb-2 truncate text-xs font-light">
            {email}
          </p>
          <div className="space-y-2">
            {tiers.map((tier) => (
              <div key={tier}>
                {confirming === tier ? (
                  <div className="border-cosmos-teal bg-cosmos-forest/30 rounded-xl border p-2">
                    <p className="text-cosmos-sage mb-2 text-xs font-light">
                      Upgrade to {tierLabels[tier]}?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => upgrade.mutate({ userId, tier })}
                        disabled={upgrade.isPending}
                        className="bg-cosmos-accent hover:bg-cosmos-forest-light flex-1 rounded-full px-3 py-1 text-xs font-medium text-white transition-colors disabled:opacity-50"
                      >
                        {upgrade.isPending ? "..." : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        className="border-cosmos-forest-light text-cosmos-sage flex-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(tier)}
                    disabled={tier === currentTier}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors disabled:opacity-30 ${
                      tier === currentTier
                        ? tierColours[tier]
                        : "border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal hover:text-white"
                    }`}
                  >
                    {tierLabels[tier]}
                    {tier === currentTier && (
                      <span className="text-cosmos-sage/50 ml-2">current</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              setConfirming(null);
            }}
            className="text-cosmos-sage/40 hover:text-cosmos-sage mt-3 w-full text-center text-xs font-light transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
