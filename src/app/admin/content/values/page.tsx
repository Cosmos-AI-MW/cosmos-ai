import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import AdminNavbar from "~/components/admin/AdminNavbar";
import Link from "next/link";
import { db } from "~/server/db";
import EditValuesForm from "~/components/admin/EditValuesForm";

export default async function EditValuesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const values = await db.value.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
              Content Management
            </div>
            <h1 className="font-display text-4xl font-semibold text-white">
              Edit Values
            </h1>
          </div>
          <EditValuesForm values={values} />
          <div className="mt-8">
            <Link
              href="/admin/content"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Content
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
