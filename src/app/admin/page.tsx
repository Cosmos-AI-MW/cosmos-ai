import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import MarkReadButton from "~/components/admin/MarkReadButton";
import SignOutButton from "~/components/admin/SignOutButton";
import AdminNavbar from "~/components/admin/AdminNavbar";

const PER_PAGE = 10;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const skip = (currentPage - 1) * PER_PAGE;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { organisation: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [submissions, total, allSubmissions] = await Promise.all([
    db.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE,
    }),
    db.contactSubmission.count({ where }),
    db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const unread = allSubmissions.filter((s) => !s.read).length;

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      {/* HEADER */}
      <AdminNavbar q={q} />

      {/* STATS */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Total Enquiries
              </div>
              <div className="font-display text-4xl font-semibold text-white">
                {allSubmissions.length}
              </div>
            </div>
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Unread
              </div>
              <div className="font-display text-4xl font-semibold text-white">
                {unread}
              </div>
            </div>
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Latest
              </div>
              <div className="font-display text-lg font-semibold text-white">
                {allSubmissions[0]
                  ? new Date(allSubmissions[0].createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : "No enquiries yet"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="px-6 pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <a
            href="/admin/content"
            className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:text-white"
          >
            ⚙ Manage Content
          </a>
          <a
            href="/admin/cosmos-write"
            className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:text-white"
          >
            📈 Cosmos Write Stats
          </a>
          <a
            href="/admin/users"
            className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:text-white"
          >
            ◎ Registered Users
          </a>
        </div>
      </section>

      {/* SUBMISSIONS */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-white">
              {q ? `Results for "${q}"` : "Contact Submissions"}
            </h2>
            <p className="text-cosmos-sage/60 text-sm">
              {total} {total === 1 ? "submission" : "submissions"}
              {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-12 text-center">
              <p className="text-cosmos-sage text-lg font-light">
                {q
                  ? `No submissions found for "${q}".`
                  : "No submissions yet. They will appear here when someone contacts you."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`rounded-2xl border p-6 transition-colors ${
                    submission.read
                      ? "border-cosmos-forest bg-cosmos-forest/10"
                      : "border-cosmos-teal bg-cosmos-forest/30"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-semibold text-white">
                            {submission.name}
                          </h3>
                          {!submission.read && (
                            <span className="bg-cosmos-teal rounded-full px-2 py-0.5 text-xs font-medium text-white">
                              New
                            </span>
                          )}
                        </div>
                        <MarkReadButton
                          id={submission.id}
                          read={submission.read}
                        />
                      </div>
                      {submission.organisation && (
                        <p className="text-cosmos-sage mt-1 text-sm">
                          {submission.organisation}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-cosmos-sage text-sm">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </div>
                      <div className="text-cosmos-sage/60 text-xs">
                        {new Date(submission.createdAt).toLocaleTimeString(
                          "en-GB",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                        Email
                      </div>
                      <p className="text-cosmos-sage text-sm font-light">
                        {submission.email}
                      </p>
                    </div>
                    {submission.phone && (
                      <div>
                        <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                          Phone
                        </div>
                        <p className="text-cosmos-sage text-sm font-light">
                          {submission.phone}
                        </p>
                      </div>
                    )}
                    {submission.service && (
                      <div>
                        <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                          Service
                        </div>
                        <p className="text-cosmos-sage text-sm font-light">
                          {submission.service}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                      Message
                    </div>
                    <p className="text-cosmos-mist text-base leading-relaxed font-light">
                      {submission.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {currentPage > 1 && (
                <Link
                  href={`/admin?${q ? `q=${q}&` : ""}page=${currentPage - 1}`}
                  className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:text-white"
                >
                  ← Previous
                </Link>
              )}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/admin?${q ? `q=${q}&` : ""}page=${pageNum}`}
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? "bg-cosmos-accent text-white"
                          : "border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal border hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ),
                )}
              </div>
              {currentPage < totalPages && (
                <Link
                  href={`/admin?${q ? `q=${q}&` : ""}page=${currentPage + 1}`}
                  className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:text-white"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
