import Link from "next/link";

const services = [
  {
    number: "01",
    title: "AI Consulting & Advisory",
    tagline: "Clarity before commitment.",
    description:
      "Before investing in any AI tool or solution, you need an honest assessment of what AI can genuinely achieve for your organisation. Our consulting service provides exactly that — independent, objective advisory grounded in real AI expertise and deep knowledge of the Malawian business environment.",
    deliverables: [
      "AI Readiness Assessment — structured evaluation of your people, processes, data, and infrastructure",
      "AI Opportunity Mapping — identifying the highest-value AI use cases for your organisation",
      "Strategic AI Roadmap — a phased plan aligned to your budget and goals",
      "Vendor & Tool Selection — independent evaluation and recommendation of AI platforms",
      "Executive AI Briefings — board and leadership sessions on AI risks, opportunities, and strategy",
      "Responsible AI Policy — governance frameworks for ethical and compliant AI use",
    ],
    pricing: "Project-based from MWK 350,000 · Retainer from MWK 120,000/month",
    ideal:
      "C-suite and board-level decision makers, strategy teams, and organisations planning their first AI investment.",
  },
  {
    number: "02",
    title: "Custom AI Development",
    tagline: "Built for your problem. Built for Malawi.",
    description:
      "When off-the-shelf tools do not fit, we build. Our development team designs and builds bespoke AI-powered systems tailored to the specific workflows, data environments, and technical constraints of your organisation. All solutions are built to professional standards, fully documented, and supported after deployment.",
    deliverables: [
      "Intelligent Document Processing — automated extraction and processing of forms, reports, and records",
      "Conversational AI — AI assistants for customer service, internal helpdesks, and operations",
      "Predictive Analytics — forecasting demand, risk, churn, or outcomes from your data",
      "Computer Vision — image recognition for quality control, security, or monitoring",
      "Process Automation — AI-powered workflows replacing manual, repetitive tasks",
      "Custom AI Dashboards — decision-support interfaces giving teams real-time AI-powered insights",
      "System Integration — connecting AI capabilities to your existing software and databases",
    ],
    pricing:
      "Project-based from MWK 800,000 depending on scope · Post-deployment support retainer available",
    ideal:
      "Banks, manufacturing companies, logistics providers, healthcare facilities, government agencies, and any organisation with a specific operational problem.",
  },
  {
    number: "03",
    title: "AI Product Distribution",
    tagline: "The world's best AI tools, delivered locally.",
    description:
      "We curate, evaluate, and distribute leading global AI platforms to the Malawian market. We do the hard work of assessing which tools are genuinely useful in the local context, handling local billing and compliance, and providing local support. You get world-class AI tools without the friction of dealing with foreign vendors directly.",
    deliverables: [
      "Curated catalogue of productivity AI tools for businesses and professionals",
      "Industry-specific AI platforms across legal, financial, agricultural, and healthcare sectors",
      "AI tools for developers and technical teams",
      "Local licensing, invoicing in MWK, and local support",
      "Onboarding and setup assistance included with all subscriptions",
      "Regular catalogue updates as new tools emerge globally",
    ],
    pricing:
      "Subscription-based pricing at competitive local rates · Volume discounts for teams",
    ideal:
      "SMEs seeking affordable AI productivity tools, professionals, and organisations looking to equip teams without the complexity of direct international procurement.",
  },
  {
    number: "04",
    title: "AI Training & Workshops",
    tagline: "Building the AI-capable workforce Malawi needs.",
    description:
      "AI tools are only as powerful as the people using them. Our training programmes build genuine AI capability at every level of an organisation — from the boardroom to the frontline. All training is practical and hands-on. We do not deliver slide-deck-only sessions.",
    deliverables: [
      "Executive AI Literacy — half-day or full-day programmes for leadership teams",
      "Departmental AI Tools Training — customised by function across finance, HR, marketing, and operations",
      "Technical AI Workshops — for developers and data professionals",
      "Public Open Enrolment Workshops — in Malawi, open to individuals",
      "Online and Hybrid Training — for remote teams and regional participants",
      "Train-the-Trainer — equipping internal teams to sustain AI capability independently",
    ],
    pricing:
      "In-house training from MWK 280,000/day · Public workshop tickets from MWK 15,000/person",
    ideal:
      "HR and L&D teams, corporate teams being upskilled, universities, and individual professionals investing in their own capabilities.",
  },
  {
    number: "05",
    title: "Data Analytics & Automation",
    tagline: "Your data is already valuable. We unlock it.",
    description:
      "Most organisations are sitting on data that could dramatically improve their decisions and operations. Our data analytics and automation service helps you structure, analyse, and act on that data — and automates the repetitive processes that drain time and create errors.",
    deliverables: [
      "Data Audit & Strategy — assessing what data you have, what it is worth, and what you need",
      "Business Intelligence Dashboards — real-time reporting for management and operations",
      "Process Automation — replacing manual data entry, reporting, and approvals with automated workflows",
      "Predictive Reporting — forecasting models for sales, operations, risk, and planning",
      "Data Pipeline Development — building reliable data infrastructure for growing organisations",
      "System Integration — connecting disparate data sources into a unified analytical environment",
    ],
    pricing:
      "Project-based from MWK 450,000 · Monthly analytics retainer from MWK 180,000/month",
    ideal:
      "Operations managers, finance teams, NGO programme managers, government departments, and any organisation currently relying on manual Excel-based reporting.",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="bg-cosmos-forest px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-cosmos-sage text-lg font-semibold tracking-widest"
          >
            COSMOS AI
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/services"
              className="text-base font-medium tracking-wide text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-cosmos-sage text-base font-medium tracking-wide transition-colors hover:text-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-base font-medium tracking-wide text-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
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

      {/* ── SERVICE LIST ───────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {services.map((service) => (
            <div
              key={service.number}
              className="border-cosmos-silver rounded-2xl border bg-white p-8 md:p-12"
            >
              {/* Header */}
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

              {/* Description */}
              <p className="text-cosmos-forest mb-8 text-lg leading-relaxed font-light">
                {service.description}
              </p>

              {/* Deliverables */}
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

              {/* Pricing and ideal */}
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

      {/* ── ENGAGEMENT MODELS ──────────────────────────────── */}
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

      {/* ── CTA ────────────────────────────────────────────── */}
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

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-cosmos-forest px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="font-display text-cosmos-sage text-base tracking-widest">
            COSMOS AI
          </div>
          <div className="text-cosmos-sage/60 text-sm">
            © {new Date().getFullYear()} Cosmos AI · Malawi
          </div>
          <div className="text-cosmos-sage flex gap-6 text-base">
            <Link
              href="/services"
              className="transition-colors hover:text-white"
            >
              Services
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
