import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import AdminNavbar from "~/components/admin/AdminNavbar";
import EditPromptForm from "~/components/admin/EditPromptForm";

export const dynamic = "force-dynamic";

export default async function AdminPromptsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!(session.user as { isAdmin?: boolean }).isAdmin)
    redirect("/admin/login");

  const [cosmosWritePrompt, whatsappPrompt] = await Promise.all([
    db.systemPrompt.findUnique({ where: { name: "cosmos-write" } }),
    db.systemPrompt.findUnique({ where: { name: "whatsapp" } }),
  ]);

  return (
    <main className="bg-cosmos-night min-h-screen font-sans">
      <AdminNavbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                System Prompts
              </div>
              <h1 className="font-display text-4xl font-semibold text-white">
                AI Prompt Editor
              </h1>
              <p className="text-cosmos-sage/60 mt-1 text-sm font-light">
                Changes take effect immediately — no redeployment needed.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-cosmos-sage text-sm font-medium transition-colors hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="space-y-8">
            {/* Cosmos Write Prompt */}
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    Cosmos Write
                  </h2>
                  <p className="text-cosmos-sage/60 text-sm font-light">
                    Used at cosmosai.mw/tools/cosmos-write
                  </p>
                </div>
                <span className="border-cosmos-teal text-cosmos-teal rounded-full border px-3 py-1 text-xs font-medium">
                  Web App
                </span>
              </div>
              <EditPromptForm
                name="cosmos-write"
                initialContent={cosmosWritePrompt?.content ?? ""}
                updatedAt={cosmosWritePrompt?.updatedAt ?? null}
              />
            </div>

            {/* WhatsApp Prompt */}
            <div className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    Cosmos AI WhatsApp Bot
                  </h2>
                  <p className="text-cosmos-sage/60 text-sm font-light">
                    Used on WhatsApp +265991455490
                  </p>
                </div>
                <span className="border-cosmos-sage text-cosmos-sage rounded-full border px-3 py-1 text-xs font-medium">
                  WhatsApp
                </span>
              </div>
              <EditPromptForm
                name="whatsapp"
                initialContent={whatsappPrompt?.content ?? ""}
                updatedAt={whatsappPrompt?.updatedAt ?? null}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
