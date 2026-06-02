import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import SignOutButton from "~/components/admin/SignOutButton";
import MarkReadButton from "~/components/admin/MarkReadButton";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      {/* HEADER */}
      <nav className="border-cosmos-forest bg-cosmos-forest border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <div className="font-display text-cosmos-sage text-lg font-semibold tracking-widest">
              COSMOS AI
            </div>
            <div className="text-cosmos-teal text-xs tracking-widest">
              ADMIN DASHBOARD
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              View Site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>

      {/* STATS */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Total Enquiries
              </div>
              <div className="font-display text-4xl font-semibold text-white">
                {submissions.length}
              </div>
            </div>
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Unread
              </div>
              <div className="font-display text-4xl font-semibold text-white">
                {submissions.filter((s) => !s.read).length}
              </div>
            </div>
            <div className="border-cosmos-forest bg-cosmos-forest/30 rounded-2xl border p-6">
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                Latest
              </div>
              <div className="font-display text-lg font-semibold text-white">
                {submissions[0]
                  ? new Date(submissions[0].createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : "No enquiries yet"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBMISSIONS */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-6 text-2xl font-semibold text-white">
            Contact Submissions
          </h2>

          {submissions.length === 0 ? (
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-12 text-center">
              <p className="text-cosmos-sage text-lg font-light">
                No submissions yet. They will appear here when someone contacts
                you.
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
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-xl font-semibold text-white">
                          {submission.name}
                        </h3>
                        {!submission.read && (
                          <span className="bg-cosmos-teal rounded-full px-2 py-0.5 text-xs font-medium text-white">
                            New
                          </span>
                        )}
                        <MarkReadButton
                          id={submission.id}
                          read={submission.read}
                        />
                      </div>
                      {submission.organisation && (
                        <p className="text-cosmos-sage text-sm">
                          {submission.organisation}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-cosmos-sage text-sm">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
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
        </div>
      </section>
    </main>
  );
}
