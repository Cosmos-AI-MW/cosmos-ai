import Link from "next/link";
import { db } from "~/server/db";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Cosmos AI",
  description:
    "Five integrated AI service lines for Malawian businesses and institutions. Consulting, custom development, product distribution, training, and data analytics.",
};

export default async function ServicesPage() {
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar active="/services" />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            What We Offer
          </div>
          <h1 className="font-display mb-6 text-5xl font-semibold text-white">
            Our Services
          </h1>
          <p className="text-cosmos-mist mx-auto max-w-2xl text-xl leading-relaxed font-light">
            Five integrated service lines covering the full AI value chain.
            Engage one or all — we meet you where you are.
          </p>
        </div>
      </section>

      {/* SERVICE LIST */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="border-cosmos-silver rounded-2xl border bg-white p-8 md:p-12"
            >
              <div className="mb-8 flex items-start gap-6">
                <div className="text-cosmos-teal text-4xl font-bold">
                  {service.number}
                </div>
                <div>
                  <h2 className="font-display text-cosmos-forest text-3xl font-semibold">
                    {service.title}
                  </h2>
                  <p className="text-cosmos-teal mt-1 text-base font-medium">
                    {service.tagline}
                  </p>
                </div>
              </div>

              <p className="text-cosmos-forest mb-8 text-lg leading-relaxed font-light">
                {service.description}
              </p>

              <div className="mb-8">
                <h3 className="font-display text-cosmos-forest mb-4 text-xl font-semibold">
                  Key Deliverables
                </h3>
                <ul className="space-y-3">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="text-cosmos-forest flex items-start gap-3 text-base font-light"
                    >
                      <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-cosmos-silver grid grid-cols-1 gap-4 border-t pt-6 md:grid-cols-2">
                <div>
                  <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                    Pricing
                  </div>
                  <p className="text-cosmos-forest text-base font-light">
                    {service.pricing}
                  </p>
                </div>
                <div>
                  <div className="text-cosmos-teal mb-1 text-sm font-medium tracking-widest uppercase">
                    Ideal For
                  </div>
                  <p className="text-cosmos-forest text-base font-light">
                    {service.ideal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENGAGEMENT MODELS */}
      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              How We Work
            </div>
            <h2 className="font-display text-4xl font-semibold text-white">
              Engagement Models
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 rounded-2xl border p-8">
              <h3 className="font-display mb-3 text-2xl font-semibold text-white">
                Project-Based
              </h3>
              <p className="text-cosmos-mist text-base leading-relaxed font-light">
                A defined scope, fixed deliverables, and a clear end point.
                Ideal for first engagements, specific problems, and
                organisations with capital budgets rather than operating
                budgets.
              </p>
            </div>
            <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 rounded-2xl border p-8">
              <h3 className="font-display mb-3 text-2xl font-semibold text-white">
                Monthly Retainer
              </h3>
              <p className="text-cosmos-mist text-base leading-relaxed font-light">
                An ongoing relationship with a committed number of hours or
                deliverables per month. Ideal for organisations wanting
                continuous AI support, regular training, or sustained
                development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cosmos-night px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-cosmos-sage mb-4 text-4xl font-semibold">
            Not sure where to start?
          </h2>
          <p className="text-cosmos-mist mb-8 text-lg font-light">
            Every engagement starts with a free 60-minute discovery
            conversation. We listen first, then recommend.
          </p>
          <Link
            href="/contact"
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-10 py-3 text-base font-medium tracking-wide text-white transition-colors"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
