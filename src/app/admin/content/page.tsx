import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import AdminNavbar from "~/components/admin/AdminNavbar";

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
              Content Management
            </div>
            <h1 className="font-display text-4xl font-semibold text-white">
              Manage Website Content
            </h1>
            <p className="text-cosmos-sage mt-3 text-base font-light">
              Edit services, about page content, and company values. Changes
              appear on the website immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link
              href="/admin/content/services"
              className="border-cosmos-forest bg-cosmos-forest/30 hover:border-cosmos-teal rounded-2xl border p-8 transition-colors"
            >
              <div className="text-cosmos-teal mb-3 text-3xl font-bold">
                01–05
              </div>
              <h2 className="font-display mb-2 text-2xl font-semibold text-white">
                Services
              </h2>
              <p className="text-cosmos-sage text-base font-light">
                Edit service titles, descriptions, deliverables, and pricing.
              </p>
            </Link>

            <Link
              href="/admin/content/about"
              className="border-cosmos-forest bg-cosmos-forest/30 hover:border-cosmos-teal rounded-2xl border p-8 transition-colors"
            >
              <div className="text-cosmos-teal mb-3 text-3xl font-bold">◎</div>
              <h2 className="font-display mb-2 text-2xl font-semibold text-white">
                About
              </h2>
              <p className="text-cosmos-sage text-base font-light">
                Edit company story, vision, mission, and team description.
              </p>
            </Link>

            <Link
              href="/admin/content/values"
              className="border-cosmos-forest bg-cosmos-forest/30 hover:border-cosmos-teal rounded-2xl border p-8 transition-colors"
            >
              <div className="text-cosmos-teal mb-3 text-3xl font-bold">6</div>
              <h2 className="font-display mb-2 text-2xl font-semibold text-white">
                Values
              </h2>
              <p className="text-cosmos-sage text-base font-light">
                Edit the six company values shown on the about page.
              </p>
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/admin"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
