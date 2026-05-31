import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Cosmos AI",
  description:
    "Cosmos AI is a Malawian artificial intelligence company built to serve this country and grow with it.",
};

export default function AboutPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <Navbar active="/about" />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Who We Are
          </div>
          <h1 className="font-display mb-6 text-5xl font-semibold text-white">
            About Cosmos AI
          </h1>
          <p className="text-cosmos-mist mx-auto max-w-2xl text-xl leading-relaxed font-light">
            A Malawian artificial intelligence company built to serve this
            country and grow with it.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ──────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Our Story
          </div>
          <h2 className="font-display text-cosmos-forest mb-8 text-4xl font-semibold">
            Why Cosmos AI Exists
          </h2>
          <div className="text-cosmos-forest space-y-6 text-lg leading-relaxed font-light">
            <p>
              At Cosmos AI, we believe Malawi&apos;s future is built on
              understanding its unique opportunities and strengths. We combine
              deep local knowledge with access to the world&apos;s most advanced
              AI solutions, serving as a bridge between global innovation and
              Malawi&apos;s growing businesses, institutions, and entrepreneurs.
            </p>
            <p>
              We are committed to helping Malawian technology and business
              thrive on their own terms. If you are building the future, we want
              to build it with you.
            </p>
            <p>
              Cosmos AI was built on the belief that Malawi deserves world-class
              AI capability — not as a future ambition, but as a present
              reality. We are here, we are building, and we are in it for the
              long term.
            </p>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ───────────────────────────────── */}
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
                To be the leading artificial intelligence company in Malawi and
                a recognised force across East and Southern Africa — a company
                that demonstrably improves lives, businesses, and public
                services through responsible and accessible AI.
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
                To accelerate AI adoption across Malawi by providing world-class
                consulting, custom-built solutions, curated AI products, and
                practical training — delivered with deep local knowledge,
                integrity, and a commitment to long-term partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ─────────────────────────────────────────── */}
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
            {[
              {
                title: "Accessibility",
                description:
                  "AI should not be the preserve of large corporations or wealthy nations. We design every engagement with inclusion in mind.",
              },
              {
                title: "Integrity",
                description:
                  "We recommend what is right for the client, not what is most profitable for us. Trust is our most valuable asset.",
              },
              {
                title: "Local First",
                description:
                  "We understand Malawi. Our solutions are designed for Malawian infrastructure, budgets, languages, and realities.",
              },
              {
                title: "Excellence",
                description:
                  "We hold ourselves to international standards in everything we deliver — from a training workshop to a full enterprise system.",
              },
              {
                title: "Partnership",
                description:
                  "We do not do one-off transactions. We build long-term relationships and grow alongside our clients.",
              },
              {
                title: "Innovation",
                description:
                  "We stay at the frontier of AI development so our clients always have access to the most effective tools available.",
              },
            ].map((value) => (
              <div
                key={value.title}
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

      {/* ── TEAM ───────────────────────────────────────────── */}
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
              Cosmos AI is led by a team of Malawian professionals with
              expertise spanning artificial intelligence, software engineering,
              business strategy, and enterprise consulting. We are practitioners
              first — every recommendation we make is grounded in real
              experience building and deploying AI systems.
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

      {/* ── CTA ────────────────────────────────────────────── */}
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

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
