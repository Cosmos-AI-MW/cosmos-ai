import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <Navbar active="/" />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-cosmos-forest px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display mb-6 text-5xl leading-tight font-semibold text-white md:text-7xl">
            Shaping Tomorrow
            <span className="text-cosmos-sage block"> With AI</span>
          </h1>
          <p className="text-cosmos-mist mx-auto mb-10 max-w-2xl text-xl leading-relaxed font-light">
            Cosmos AI brings world-class artificial intelligence tools and
            expertise to Malawi. Helping your organisation make better decisions
            through strategic consulting, eliminating what slows you down with
            custom-built solutions, accessing the tools your teams need today,
            and equipping your people with the skills that matter next.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium tracking-wide text-white transition-colors"
            >
              Start a Conversation
            </Link>
            <Link
              href="/services"
              className="border-cosmos-sage text-cosmos-sage hover:bg-cosmos-forest-light rounded-full border px-8 py-3 text-base font-medium tracking-wide transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ──────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              What We Do
            </div>
            <h2 className="font-display text-cosmos-forest text-4xl font-semibold">
              Five Ways We Deliver Value
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "AI Consulting & Advisory",
                description:
                  "Strategy, readiness assessments, and AI roadmaps — clarity before commitment.",
              },
              {
                number: "02",
                title: "Custom AI Development",
                description:
                  "Bespoke AI systems built for your specific problem and Malawian infrastructure.",
              },
              {
                number: "03",
                title: "AI Product Distribution",
                description:
                  "World-class AI tools with local support, MWK billing, and onboarding.",
              },
              {
                number: "04",
                title: "Training & Workshops",
                description:
                  "Building AI-capable teams at every level — executive to technical.",
              },
              {
                number: "05",
                title: "Data Analytics & Automation",
                description:
                  "Unlock the value in your existing data and automate repetitive processes.",
              },
              {
                number: "→",
                title: "View All Services",
                description:
                  "See full service descriptions, deliverables, and pricing for every offering.",
                isLink: true,
              },
            ].map((service) =>
              service.isLink ? (
                <Link
                  key={service.number}
                  href="/services"
                  className="group border-cosmos-silver hover:border-cosmos-teal hover:bg-cosmos-mist flex flex-col rounded-2xl border-2 border-dashed bg-white p-8 transition-colors"
                >
                  <div className="text-cosmos-teal mb-4 text-3xl font-bold">
                    {service.number}
                  </div>
                  <h3 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-cosmos-forest-light text-base leading-relaxed font-light">
                    {service.description}
                  </p>
                </Link>
              ) : (
                <div
                  key={service.number}
                  className="border-cosmos-silver hover:border-cosmos-teal flex flex-col rounded-2xl border bg-white p-8 transition-colors hover:shadow-sm"
                >
                  <div className="text-cosmos-teal mb-4 text-3xl font-bold">
                    {service.number}
                  </div>
                  <h3 className="font-display text-cosmos-forest mb-3 text-2xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-cosmos-forest text-base leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ───────────────────────────────────── */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              Who We Serve
            </div>
            <h2 className="font-display text-4xl font-semibold text-white">
              Built for Every Sector
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              "Large Corporates & Banks",
              "Government & Public Sector",
              "SMEs & Growing Businesses",
              "NGOs & Nonprofits",
              "Individual Professionals",
            ].map((segment) => (
              <div
                key={segment}
                className="border-cosmos-forest-light bg-cosmos-forest-light/30 text-cosmos-sage rounded-xl border px-4 py-6 text-center text-base font-medium"
              >
                {segment}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ───────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            About Cosmos AI
          </div>
          <h2 className="font-display text-cosmos-forest mb-6 text-4xl font-semibold">
            Malawi&apos;s AI Company
          </h2>
          <p className="text-cosmos-forest mb-10 text-lg leading-relaxed font-light">
            At Cosmos AI, we believe Malawi&apos;s future is built on
            understanding its unique opportunities and strengths. We combine
            deep local knowledge with access to the world&apos;s most advanced
            AI solutions, serving as a bridge between global innovation and
            Malawi&apos;s growing businesses, institutions, and entrepreneurs.
            We are committed to helping Malawian technology and business thrive
            on their own terms. If you are building the future, we want to build
            it with you.
          </p>
          <p className="text-cosmos-forest mb-10 text-lg leading-relaxed font-light">
            Founded and based in Malawi.
          </p>
          <Link
            href="/about"
            className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-base font-medium tracking-wide transition-colors hover:text-white"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="bg-cosmos-night px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-cosmos-sage mb-4 text-4xl font-semibold">
            Ready to explore what AI can do for you?
          </h2>
          <p className="text-cosmos-mist mb-8 text-lg font-light">
            Book a free exploratory meeting. We understand your needs first,
            then advise on the best path forward.
          </p>
          <Link
            href="/contact"
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-10 py-3 text-base font-medium tracking-wide text-white transition-colors"
          >
            Book an Exploratory Meeting
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
