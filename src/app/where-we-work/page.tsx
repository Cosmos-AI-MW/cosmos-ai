import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import Reveal from "~/components/ui/Reveal";
import SectorPhoto from "~/components/ui/SectorPhoto";
import ConstellationField from "~/components/ui/ConstellationField";
import Ridgeline from "~/components/ui/Ridgeline";
import { WORK_POINTS, WORK_EDGES } from "~/lib/constellations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where We Work — Cosmos AI",
  description:
    "The sectors Cosmos AI serves across Malawi, and the AI tools we have built for them.",
};

const WHATSAPP_NUMBER = "+265 991 45 54 90";
const WHATSAPP_LINK = "https://wa.me/265991455490?text=help";

const sectors = [
  {
    file: "agriculture",
    title: "Agriculture",
    alt: "Farming in a field",
    text: "Farmers, cooperatives and agro-dealers: ADMARC and MRFC correspondence, produce agreements and funding proposals.",
  },
  {
    file: "health",
    title: "Health",
    alt: "Health workers in a clinic",
    text: "Clinics, hospitals and health workers: referral letters, compliance correspondence and facility reports.",
  },
  {
    file: "education",
    title: "Education",
    alt: "Students in a classroom",
    text: "Schools, colleges and universities: parent communication, MANEB correspondence and bursary applications.",
  },
  {
    file: "government_and_corporate",
    title: "Government & Corporate",
    alt: "A formal business meeting",
    text: "Ministries, agencies, banks and large organisations: formal correspondence, procurement and reporting.",
  },
  {
    file: "ngo",
    title: "NGOs & Nonprofits",
    alt: "A community workshop",
    text: "Programme teams and nonprofits: donor reports, funding proposals and monitoring and evaluation narratives.",
  },
  {
    file: "technology",
    title: "Technology",
    alt: "People working on laptops",
    text: "Startups and digital businesses: proposals, service agreements and technical documentation.",
  },
  {
    file: "traders",
    title: "Traders & Markets",
    alt: "A market stall",
    text: "Market vendors and small shops: receipts, payment requests and simple records, in plain language.",
  },
  {
    file: "training",
    title: "Training & Workshops",
    alt: "A training session",
    text: "Teams learning to use AI with confidence, from executives to first-time users.",
  },
];

export default function WhereWeWorkPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar active="/where-we-work" />

      {/* HERO */}
      <section className="bg-cosmos-forest relative overflow-hidden px-6 pt-20 pb-36">
        <ConstellationField points={WORK_POINTS} edges={WORK_EDGES} />
        <Ridgeline />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Our Reach
          </div>
          <h1 className="font-display mb-6 text-5xl font-semibold text-white">
            Where We Work
          </h1>
          <p className="text-cosmos-mist mx-auto max-w-2xl text-xl leading-relaxed font-light">
            AI at every Malawian&apos;s fingertips — across the sectors that
            keep the country moving.
          </p>
        </div>
      </section>

      {/* SECTORS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              Sectors We Serve
            </div>
            <h2 className="font-display text-cosmos-forest text-4xl font-semibold">
              Built for Every Sector
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, index) => (
              <Reveal
                key={sector.file}
                delay={(index % 4) * 90}
                className="h-full"
              >
                <div className="group border-cosmos-silver hover:border-cosmos-teal flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-colors">
                  <SectorPhoto
                    src={`/images/where-we-work/${sector.file}.webp`}
                    alt={sector.alt}
                  />
                  <div className="p-6">
                    <h3 className="font-display text-cosmos-forest mb-2 text-xl font-semibold">
                      {sector.title}
                    </h3>
                    <p className="text-cosmos-forest text-sm leading-relaxed font-light">
                      {sector.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-cosmos-forest/60 mx-auto mt-8 max-w-2xl text-center text-sm font-light">
            Photographs on this page are stock images used to illustrate the
            sectors we serve. They do not show Cosmos AI projects.
          </p>
        </div>
      </section>

      {/* WHAT WE'VE BUILT */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
              What We Have Built
            </div>
            <h2 className="font-display text-4xl font-semibold text-white">
              Tools You Can Use Today
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 flex h-full flex-col rounded-2xl border p-8">
                <div className="text-cosmos-teal mb-3 text-sm">✴</div>
                <h3 className="font-display mb-3 text-2xl font-semibold text-white">
                  Cosmos Write
                </h3>
                <p className="text-cosmos-mist mb-6 text-base leading-relaxed font-light">
                  An AI writing assistant that produces complete, professional
                  prompts and documents for Malawians — letters, proposals,
                  reports and more — in seconds.
                </p>
                <Link
                  href="/tools/cosmos-write"
                  className="bg-cosmos-accent hover:bg-cosmos-forest-light mt-auto w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors"
                >
                  Try Cosmos Write
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120} className="h-full">
              <div className="border-cosmos-forest-light bg-cosmos-forest-light/30 flex h-full flex-col rounded-2xl border p-8">
                <div className="text-cosmos-teal mb-3 text-sm">✴</div>
                <h3 className="font-display mb-3 text-2xl font-semibold text-white">
                  Cosmos AI on WhatsApp
                </h3>
                <p className="text-cosmos-mist mb-6 text-base leading-relaxed font-light">
                  The same intelligence in a chat, for everyone. No account
                  needed.
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-4">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-cosmos-sage text-cosmos-sage hover:bg-cosmos-forest-light w-fit rounded-full border px-6 py-2.5 text-sm font-medium transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <span className="text-cosmos-sage/80 text-sm font-light">
                    {WHATSAPP_NUMBER}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cosmos-night px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-cosmos-sage mb-4 text-4xl font-semibold">
            Working in a sector we have not listed?
          </h2>
          <p className="text-cosmos-mist mb-8 text-lg font-light">
            Tell us about your organisation. We will work out where AI can help.
          </p>
          <Link
            href="/contact"
            className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-10 py-3 text-base font-medium tracking-wide text-white transition-colors"
          >
            Start a Conversation
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
