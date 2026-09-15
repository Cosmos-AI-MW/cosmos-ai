import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import AdminNavbar from "~/components/admin/AdminNavbar";

export const dynamic = "force-dynamic";

function StatusBadge({ pct }: { pct: number }) {
  if (pct >= 90)
    return (
      <span className="rounded-full border border-red-500 bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
        Critical — {pct}%
      </span>
    );
  if (pct >= 70)
    return (
      <span className="bg-cosmos-gold/20 border-cosmos-gold text-cosmos-gold rounded-full border px-3 py-1 text-xs font-medium">
        Warning — {pct}%
      </span>
    );
  return (
    <span className="bg-cosmos-teal/20 border-cosmos-teal text-cosmos-teal rounded-full border px-3 py-1 text-xs font-medium">
      Healthy — {pct}%
    </span>
  );
}

function UsageBar({
  used,
  limit,
  label,
}: {
  used: number;
  limit: number;
  label: string;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">
          {label}
        </h3>
        <StatusBadge pct={pct} />
      </div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <span className="font-display text-3xl font-semibold text-white">
            {used.toLocaleString()}
          </span>
          <span className="text-cosmos-sage/50 ml-1 text-sm font-light">
            / {limit.toLocaleString()}
          </span>
        </div>
        <span className="text-cosmos-sage/50 text-sm font-light">
          {limit - used} remaining
        </span>
      </div>
      <div className="bg-cosmos-forest h-3 w-full rounded-full">
        <div
          className={`h-3 rounded-full transition-all ${
            pct >= 90
              ? "bg-red-400"
              : pct >= 70
                ? "bg-cosmos-gold"
                : "bg-cosmos-teal"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 70 && (
        <p className="text-cosmos-sage/50 mt-3 text-xs font-light">
          {pct >= 90
            ? "⚠ Critical — upgrade or reduce usage immediately"
            : "⚠ Approaching limit — monitor closely"}
        </p>
      )}
    </div>
  );
}

export default async function AdminHealthPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!(session.user as { isAdmin?: boolean }).isAdmin)
    redirect("/admin/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    newUsersThisMonth,
    totalGenerations,
    generationsThisMonth,
    totalContacts,
    contactsThisMonth,
    verificationTokens,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: monthStart } } }),
    db.writeGeneration.count(),
    db.writeGeneration.count({ where: { createdAt: { gte: monthStart } } }),
    db.contactSubmission.count(),
    db.contactSubmission.count({ where: { createdAt: { gte: monthStart } } }),
    db.emailVerificationToken.count(),
  ]);

  // Estimate emails sent this month
  // Each new user gets 1 verification email
  // Each contact submission triggers 1 notification email per admin
  const adminEmailCount = 3; // ADMIN_EMAIL, ADMIN_EMAIL_2, ADMIN_EMAIL_3
  const estimatedEmails =
    newUsersThisMonth + contactsThisMonth * adminEmailCount;
  const resendMonthlyLimit = 3000;
  const resendDailyLimit = 100;

  // Neon free tier limits
  const neonStorageLimit = 500; // MB
  const neonComputeLimit = 190; // hours per month

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                System Health
              </div>
              <h1 className="font-display text-4xl font-semibold text-white">
                Health Dashboard
              </h1>
              <p className="text-cosmos-sage/60 mt-1 text-sm font-light">
                Last updated:{" "}
                {now.toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Link
              href="/admin"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total Users", value: totalUsers },
              { label: "New This Month", value: newUsersThisMonth },
              { label: "Total Generations", value: totalGenerations },
              { label: "Generations (Month)", value: generationsThisMonth },
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

          {/* Service limits */}
          <h2 className="font-display mb-4 text-2xl font-semibold text-white">
            Service Limits
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <UsageBar
              used={estimatedEmails}
              limit={resendMonthlyLimit}
              label="Resend — Monthly Emails"
            />
            <UsageBar
              used={newUsersThisMonth}
              limit={resendDailyLimit * 30}
              label="Resend — Daily Email Budget (est.)"
            />
            <UsageBar
              used={totalGenerations}
              limit={10000}
              label="Neon — WriteGeneration Records (est. 10k)"
            />
            <UsageBar
              used={totalUsers}
              limit={1000}
              label="Neon — User Records (est. 1k)"
            />
          </div>

          {/* Activity */}
          <h2 className="font-display mb-4 text-2xl font-semibold text-white">
            Activity This Month
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                label: "New Registrations",
                value: newUsersThisMonth,
                note: `${totalUsers} total`,
              },
              {
                label: "Cosmos Write Uses",
                value: generationsThisMonth,
                note: `${totalGenerations} total`,
              },
              {
                label: "Contact Enquiries",
                value: contactsThisMonth,
                note: `${totalContacts} total`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6"
              >
                <div className="text-cosmos-teal mb-1 text-xs font-medium tracking-widest uppercase">
                  {item.label}
                </div>
                <div className="font-display text-4xl font-semibold text-white">
                  {item.value}
                </div>
                <div className="text-cosmos-sage/50 mt-1 text-xs font-light">
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* Pending verification tokens */}
          <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
            <h2 className="font-display mb-2 text-xl font-semibold text-white">
              Pending Email Verifications
            </h2>
            <p className="text-cosmos-sage/60 mb-4 text-sm font-light">
              Users who registered but have not yet verified their email.
            </p>
            <div className="font-display text-4xl font-semibold text-white">
              {verificationTokens}
            </div>
            <p className="text-cosmos-sage/50 mt-2 text-xs font-light">
              Tokens expire after 24 hours automatically.
            </p>
          </div>

          {/* Upgrade guidance */}
          <div className="border-cosmos-forest-light bg-cosmos-forest/10 mt-8 rounded-2xl border p-6">
            <h2 className="font-display mb-4 text-xl font-semibold text-white">
              Free Tier Limits Reference
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  service: "Resend",
                  free: "3,000 emails/month · 100/day",
                  paid: "Pro: $20/month for 50,000 emails",
                  url: "resend.com/pricing",
                },
                {
                  service: "Neon PostgreSQL",
                  free: "0.5 GB storage · 190 compute hours/month",
                  paid: "Launch: $19/month for 10 GB storage",
                  url: "neon.tech/pricing",
                },
                {
                  service: "Vercel",
                  free: "Hobby: 100 GB bandwidth · 6,000 build minutes",
                  paid: "Pro: $20/month per member",
                  url: "vercel.com/pricing",
                },
                {
                  service: "Anthropic API",
                  free: "Pay as you go — no free tier",
                  paid: "Haiku: ~$0.80 per million tokens",
                  url: "anthropic.com/pricing",
                },
              ].map((item) => (
                <div
                  key={item.service}
                  className="border-cosmos-forest rounded-xl border p-4"
                >
                  <div className="font-display mb-1 text-base font-semibold text-white">
                    {item.service}
                  </div>
                  <div className="text-cosmos-teal mb-1 text-xs font-light">
                    Free: {item.free}
                  </div>
                  <div className="text-cosmos-sage/50 text-xs font-light">
                    Upgrade: {item.paid}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
