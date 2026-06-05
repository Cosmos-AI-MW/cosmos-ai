import Link from "next/link";
import { db } from "~/server/db";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Cosmos AI",
  description:
    "Cosmos AI is a Malawian artificial intelligence company built to serve this country and grow with it.",
};

export default async function AboutPage() {
  const [aboutContent, values] = await Promise.all([
    db.aboutContent.findMany(),
    db.value.findMany({ orderBy: { order: "asc" } }),
  ]);

  const content = Object.fromEntries(
    aboutContent.map((item) => [item.key, item.value]),
  );

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar active="/about" />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Who We Are
          </div>
          <h1 className="font-display mb-6 text-5xl font-semibold text-white">
            About Cosmos AI
          </h1>
          <p className="text-cosmos-mist mx-auto max-w-2xl text-xl leading-relaxed font-light">
            {content.hero_tagline}
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Our Story
          </div>
          <h2 className="font-display text-cosmos-forest mb-8 text-4xl font-semibold">
            Why Cosmos AI Exists
          </h2>
          <div className="text-cosmos-forest space-y-6 text-lg leading-relaxed font-light">
            {[
              content.story_paragraph_1,
              content.story_paragraph_2,
              content.story_paragraph_3,
            ]
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 rounded-2xl border p-8">
              <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
                Vision
              </div>
              <h3 className="font-display mb-4 text-2xl font-semibold text-white">
                Where We Are Going
              </h3>
              <p className="text-cosmos-mist text-base leading-relaxed font-light">
                {content.vision}
              </p>
            </div>
            <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 rounded-2xl border p-8">
              <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
                Mission
              </div>
              <h3 className="font-display mb-4 text-2xl font-semibold text-white">
                What We Do Every Day
              </h3>
              <p className="text-cosmos-mist text-base leading-relaxed font-light">
                {content.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              What We Stand For
            </div>
            <h2 className="font-display text-cosmos-forest text-4xl font-semibold">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.id}
                className="border-cosmos-silver rounded-2xl border bg-white p-6"
              >
                <h3 className="font-display text-cosmos-forest mb-3 text-xl font-semibold">
                  {value.title}
                </h3>
                <p className="text-cosmos-forest text-base leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-cosmos-mist px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              The Team
            </div>
            <h2 className="font-display text-cosmos-forest text-4xl font-semibold">
              Built by People Who Care
            </h2>
          </div>
          <div className="border-cosmos-silver rounded-2xl border bg-white p-10 text-center">
            <p className="text-cosmos-forest mx-auto max-w-2xl text-lg leading-relaxed font-light">
              {content.team_description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium tracking-wide text-white transition-colors"
              >
                Work With Us
              </Link>
              <Link
                href="/services"
                className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-base font-medium tracking-wide transition-colors hover:text-white"
              >
                See What We Do
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cosmos-night px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-cosmos-sage mb-4 text-4xl font-semibold">
            Want to work with us?
          </h2>
          <p className="text-cosmos-mist mb-8 text-lg font-light">
            Whether you are a potential client, a collaborator, or a Malawian
            technology partner — we want to hear from you.
          </p>
          <Link
            href="/contact"
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-10 py-3 text-base font-medium tracking-wide text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
