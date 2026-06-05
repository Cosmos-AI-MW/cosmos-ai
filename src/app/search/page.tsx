import Link from "next/link";
import { db } from "~/server/db";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Cosmos AI",
  description: "Search across all Cosmos AI services and content.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const [services, aboutContent, values] = query
    ? await Promise.all([
        db.service.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { tagline: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { pricing: { contains: query, mode: "insensitive" } },
              { ideal: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
        db.aboutContent.findMany({
          where: { value: { contains: query, mode: "insensitive" } },
        }),
        db.value.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
      ])
    : [[], [], []];

  const totalResults =
    services.length + (aboutContent.length > 0 ? 1 : 0) + values.length;

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Search
          </div>
          <h1 className="font-display mb-8 text-4xl font-semibold text-white">
            What are you looking for?
          </h1>
          <form method="GET" action="/search">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg
                  className="text-cosmos-sage/50 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search services, about, values..."
                  autoFocus
                  className="border-cosmos-forest-light bg-cosmos-forest/50 focus:border-cosmos-teal placeholder:text-cosmos-sage/40 w-full rounded-full border py-3 pr-4 pl-12 text-base font-light text-white transition-colors outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-3 text-base font-medium text-white transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* RESULTS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {!query && (
            <div className="py-12 text-center">
              <p className="text-cosmos-forest text-lg font-light">
                Type something above to search across all Cosmos AI content.
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="border-cosmos-silver rounded-2xl border bg-white p-12 text-center">
              <p className="text-cosmos-forest mb-2 text-lg font-light">
                No results found for{" "}
                <span className="font-medium">&ldquo;{query}&rdquo;</span>
              </p>
              <p className="text-cosmos-forest/60 text-base font-light">
                Try different keywords or browse our services directly.
              </p>
              <Link
                href="/services"
                className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest mt-6 inline-block rounded-full border px-8 py-3 text-base font-medium transition-colors hover:text-white"
              >
                View All Services
              </Link>
            </div>
          )}

          {query && totalResults > 0 && (
            <div className="space-y-10">
              <p className="text-cosmos-teal text-sm font-medium">
                {totalResults} {totalResults === 1 ? "result" : "results"} for
                &ldquo;{query}&rdquo;
              </p>

              {/* Services results */}
              {services.length > 0 && (
                <div>
                  <div className="text-cosmos-teal mb-4 text-xs font-medium tracking-widest uppercase">
                    Services
                  </div>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href="/services"
                        className="border-cosmos-silver hover:border-cosmos-teal block rounded-2xl border bg-white p-6 transition-colors hover:shadow-sm"
                      >
                        <div className="mb-1 flex items-center gap-3">
                          <span className="text-cosmos-teal text-sm font-bold">
                            {service.number}
                          </span>
                          <h2 className="font-display text-cosmos-forest text-xl font-semibold">
                            {service.title}
                          </h2>
                        </div>
                        <p className="text-cosmos-teal mb-2 text-sm font-medium">
                          {service.tagline}
                        </p>
                        <p className="text-cosmos-forest line-clamp-2 text-base leading-relaxed font-light">
                          {service.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Values results */}
              {values.length > 0 && (
                <div>
                  <div className="text-cosmos-teal mb-4 text-xs font-medium tracking-widest uppercase">
                    Company Values
                  </div>
                  <div className="space-y-4">
                    {values.map((value) => (
                      <Link
                        key={value.id}
                        href="/about"
                        className="border-cosmos-silver hover:border-cosmos-teal block rounded-2xl border bg-white p-6 transition-colors hover:shadow-sm"
                      >
                        <h2 className="font-display text-cosmos-forest mb-2 text-xl font-semibold">
                          {value.title}
                        </h2>
                        <p className="text-cosmos-forest text-base leading-relaxed font-light">
                          {value.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* About results */}
              {aboutContent.length > 0 && (
                <div>
                  <div className="text-cosmos-teal mb-4 text-xs font-medium tracking-widest uppercase">
                    About Cosmos AI
                  </div>
                  <Link
                    href="/about"
                    className="border-cosmos-silver hover:border-cosmos-teal block rounded-2xl border bg-white p-6 transition-colors hover:shadow-sm"
                  >
                    <h2 className="font-display text-cosmos-forest mb-2 text-xl font-semibold">
                      About Cosmos AI
                    </h2>
                    <p className="text-cosmos-forest line-clamp-2 text-base leading-relaxed font-light">
                      {aboutContent[0]?.value}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
