import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import AdminNavbar from "~/components/admin/AdminNavbar";

export default async function CosmosWriteStatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [total, byType, recentSessions, dailyStats] = await Promise.all([
    db.writeGeneration.count(),

    db.writeGeneration.groupBy({
      by: ["documentType"],
      _count: { documentType: true },
      orderBy: { _count: { documentType: "desc" } },
    }),

    db.writeGeneration.groupBy({
      by: ["sessionId"],
      _count: { sessionId: true },
      orderBy: { _count: { sessionId: "desc" } },
    }),

    db.writeGeneration.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        documentType: true,
        sessionId: true,
        createdAt: true,
      },
    }),
  ]);

  const uniqueSessions = recentSessions.length;
  const avgPerSession =
    uniqueSessions > 0 ? (total / uniqueSessions).toFixed(1) : "0";

  // Group by day for simple chart data
  const byDay = dailyStats.reduce<Record<string, number>>((acc, gen) => {
    const day = new Date(gen.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  const maxDay = Math.max(...Object.values(byDay), 1);

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Cosmos Write
              </div>
              <h1 className="font-display text-4xl font-semibold text-white">
                Usage Statistics
              </h1>
            </div>
            <Link
              href="/admin"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Stats overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: "Total Generations", value: total.toString() },
              { label: "Unique Sessions", value: uniqueSessions.toString() },
              { label: "Avg per Session", value: avgPerSession },
              { label: "Document Types Used", value: byType.length.toString() },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6"
              >
                <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                  {stat.label}
                </div>
                <div className="font-display text-4xl font-semibold text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* By document type */}
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
              <h2 className="font-display mb-6 text-xl font-semibold text-white">
                Generations by Type
              </h2>
              {byType.length === 0 ? (
                <p className="text-cosmos-sage/60 text-base font-light">
                  No generations yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {byType.map((item) => {
                    const count = item._count.documentType;
                    const pct =
                      total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={item.documentType}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-cosmos-sage text-sm font-medium">
                            {item.documentType}
                          </span>
                          <span className="text-cosmos-teal text-sm font-medium">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="bg-cosmos-forest h-2 w-full rounded-full">
                          <div
                            className="bg-cosmos-teal h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily activity */}
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
              <h2 className="font-display mb-6 text-xl font-semibold text-white">
                Recent Daily Activity
              </h2>
              {Object.keys(byDay).length === 0 ? (
                <p className="text-cosmos-sage/60 text-base font-light">
                  No activity yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(byDay)
                    .slice(0, 10)
                    .map(([day, count]) => {
                      const pct = Math.round((count / maxDay) * 100);
                      return (
                        <div key={day}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-cosmos-sage text-sm font-medium">
                              {day}
                            </span>
                            <span className="text-cosmos-teal text-sm font-medium">
                              {count}
                            </span>
                          </div>
                          <div className="bg-cosmos-forest h-2 w-full rounded-full">
                            <div
                              className="bg-cosmos-accent h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Recent generations */}
          <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
            <h2 className="font-display mb-6 text-xl font-semibold text-white">
              Recent Generations
            </h2>
            {dailyStats.length === 0 ? (
              <p className="text-cosmos-sage/60 text-base font-light">
                No generations yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-cosmos-forest border-b">
                      <th className="text-cosmos-teal pb-3 text-left text-xs font-medium tracking-widest uppercase">
                        Type
                      </th>
                      <th className="text-cosmos-teal pb-3 text-left text-xs font-medium tracking-widest uppercase">
                        Session
                      </th>
                      <th className="text-cosmos-teal pb-3 text-left text-xs font-medium tracking-widest uppercase">
                        Date
                      </th>
                      <th className="text-cosmos-teal pb-3 text-left text-xs font-medium tracking-widest uppercase">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-cosmos-forest divide-y">
                    {dailyStats.map((gen) => (
                      <tr key={gen.id}>
                        <td className="text-cosmos-sage py-3 text-sm font-medium">
                          {gen.documentType}
                        </td>
                        <td className="text-cosmos-sage/50 py-3 font-mono text-xs">
                          {gen.sessionId.substring(0, 8)}...
                        </td>
                        <td className="text-cosmos-sage py-3 text-sm font-light">
                          {new Date(gen.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="text-cosmos-sage py-3 text-sm font-light">
                          {new Date(gen.createdAt).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
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
