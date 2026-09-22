import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat History — Cosmos AI",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if ((session.user as { isAdmin?: boolean }).isAdmin) redirect("/admin");

  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            My Account
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            Chat History
          </h1>
          <p className="text-cosmos-mist mt-2 text-lg font-light">
            Your past Cosmos Write conversations.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/account"
              className="text-cosmos-forest/60 hover:text-cosmos-forest text-sm font-medium transition-colors"
            >
              ← Back to Account
            </Link>
            <Link
              href="/tools/cosmos-write"
              className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-sm font-medium text-white transition-colors"
            >
              New Conversation
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="border-cosmos-silver rounded-2xl border bg-white p-12 text-center">
              <div className="mb-4 text-5xl">✴</div>
              <h2 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                No conversations yet
              </h2>
              <p className="text-cosmos-forest/60 mb-8 text-base font-light">
                Start a conversation in Cosmos Write and it will appear here.
              </p>
              <Link
                href="/tools/cosmos-write"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium text-white transition-colors"
              >
                Open Cosmos Write
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/tools/cosmos-write?conversation=${conv.id}`}
                  className="border-cosmos-silver hover:border-cosmos-teal block rounded-2xl border bg-white p-6 transition-all hover:shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="font-display text-cosmos-forest line-clamp-1 text-lg font-semibold">
                      {conv.title}
                    </h3>
                    <div className="shrink-0 text-right">
                      <div className="text-cosmos-forest/40 text-xs font-light">
                        {new Date(conv.updatedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-cosmos-forest/30 text-xs font-light">
                        {new Date(conv.updatedAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  {conv.messages[0] && (
                    <p className="text-cosmos-forest/60 line-clamp-2 text-sm font-light">
                      {conv.messages[0].role === "assistant" ? "AI: " : "You: "}
                      {conv.messages[0].content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
