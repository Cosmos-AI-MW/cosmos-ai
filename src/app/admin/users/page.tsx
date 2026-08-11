import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import AdminNavbar from "~/components/admin/AdminNavbar";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!(session.user as { isAdmin?: boolean }).isAdmin)
    redirect("/admin/login");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      tier: true,
      generationsUsed: true,
      generationsLimit: true,
      tierResetDate: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  const totalUsers = users.length;
  const freeUsers = users.filter((u) => u.tier === "free").length;
  const starterUsers = users.filter((u) => u.tier === "starter").length;
  const professionalUsers = users.filter(
    (u) => u.tier === "professional",
  ).length;
  const verifiedUsers = users.filter((u) => u.emailVerified).length;

  const tierColours: Record<string, string> = {
    free: "text-cosmos-sage bg-cosmos-forest/30 border-cosmos-forest",
    starter: "text-cosmos-teal bg-cosmos-teal/10 border-cosmos-teal",
    professional: "text-cosmos-gold bg-cosmos-gold/10 border-cosmos-gold",
  };

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                User Management
              </div>
              <h1 className="font-display text-4xl font-semibold text-white">
                Registered Users
              </h1>
            </div>
            <Link
              href="/admin"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Total Users", value: totalUsers },
              { label: "Free", value: freeUsers },
              { label: "Starter", value: starterUsers },
              { label: "Professional", value: professionalUsers },
              { label: "Verified Email", value: verifiedUsers },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-5"
              >
                <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                  {stat.label}
                </div>
                <div className="font-display text-3xl font-semibold text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Users table */}
          <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
            <h2 className="font-display mb-6 text-xl font-semibold text-white">
              All Users
            </h2>

            {users.length === 0 ? (
              <p className="text-cosmos-sage/60 text-base font-light">
                No registered users yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-cosmos-forest border-b">
                      {[
                        "Email",
                        "Tier",
                        "Usage",
                        "Verified",
                        "Joined",
                        "Next Reset",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-cosmos-teal pb-3 text-left text-xs font-medium tracking-widest uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-cosmos-forest divide-y">
                    {users.map((user) => {
                      const usedPct = Math.min(
                        100,
                        Math.round(
                          (user.generationsUsed / user.generationsLimit) * 100,
                        ),
                      );
                      return (
                        <tr key={user.id}>
                          <td className="text-cosmos-sage py-4 text-sm font-medium">
                            {user.email}
                          </td>
                          <td className="py-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${tierColours[user.tier] ?? tierColours.free}`}
                            >
                              {user.tier.charAt(0).toUpperCase() +
                                user.tier.slice(1)}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-cosmos-forest h-1.5 w-20 rounded-full">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    usedPct >= 90
                                      ? "bg-red-400"
                                      : usedPct >= 70
                                        ? "bg-cosmos-gold"
                                        : "bg-cosmos-teal"
                                  }`}
                                  style={{ width: `${usedPct}%` }}
                                />
                              </div>
                              <span className="text-cosmos-sage text-xs font-light">
                                {user.generationsUsed}/{user.generationsLimit}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`text-sm font-medium ${user.emailVerified ? "text-cosmos-teal" : "text-cosmos-sage/40"}`}
                            >
                              {user.emailVerified ? "✓" : "—"}
                            </span>
                          </td>
                          <td className="text-cosmos-sage py-4 text-sm font-light">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-4">
                            <div className="text-cosmos-sage text-sm font-light">
                              {new Date(
                                new Date(user.tierResetDate).setMonth(
                                  new Date(user.tierResetDate).getMonth() + 1,
                                ),
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-cosmos-sage/50 text-xs font-light">
                              {user.tier === "professional"
                                ? "Unlimited — no reset"
                                : `${user.generationsLimit} generations refresh`}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
