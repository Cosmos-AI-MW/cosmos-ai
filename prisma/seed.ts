import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── SERVICES ─────────────────────────────────────────────────
  await db.service.deleteMany();

  await db.service.createMany({
    data: [
      {
        number: "01",
        title: "AI Consulting & Advisory",
        tagline: "Clarity before commitment.",
        description:
          "Before investing in any AI tool or solution, you need an honest assessment of what AI can genuinely achieve for your organisation. Our advisory service provides exactly that — independent, objective guidance grounded in real AI expertise and deep knowledge of the Malawian business environment.",
        deliverables: [
          "AI Readiness Assessment — structured evaluation of your people, processes, data, and infrastructure",
          "AI Opportunity Mapping — identifying the highest-value AI use cases for your organisation",
          "Strategic AI Roadmap — a phased plan aligned to your budget and goals",
          "Vendor & Tool Selection — independent evaluation and recommendation of AI platforms",
          "Executive AI Briefings — board and leadership sessions on AI risks, opportunities, and strategy",
          "Responsible AI Policy — governance frameworks for ethical and compliant AI use",
        ],
        pricing:
          "Project-based from MWK 350,000 · Monthly partnership from MWK 120,000/month",
        ideal:
          "C-suite and board-level decision makers, strategy teams, and organisations planning their first AI investment.",
        order: 1,
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
          "Project-based from MWK 800,000 depending on scope · Monthly partnership available post-deployment",
        ideal:
          "Banks, manufacturing companies, logistics providers, healthcare facilities, government agencies, and any organisation with a specific operational problem.",
        order: 2,
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
        order: 3,
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
        order: 4,
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
          "Project-based from MWK 450,000 · Monthly partnership from MWK 180,000/month",
        ideal:
          "Operations managers, finance teams, NGO programme managers, government departments, and any organisation currently relying on manual Excel-based reporting.",
        order: 5,
      },
    ],
  });

  console.log("✓ Services seeded");

  // ── ABOUT CONTENT ────────────────────────────────────────────
  await db.aboutContent.deleteMany();

  await db.aboutContent.createMany({
    data: [
      {
        key: "hero_tagline",
        value:
          "A Malawian artificial intelligence company built to serve this country and grow with it.",
      },
      {
        key: "story_paragraph_1",
        value:
          "At Cosmos AI, we believe Malawi's future is built on understanding its unique opportunities and strengths. We combine deep local knowledge with access to the world's most advanced AI solutions, serving as a bridge between global innovation and Malawi's growing businesses, institutions, and entrepreneurs.",
      },
      {
        key: "story_paragraph_2",
        value:
          "We are not here to introduce AI to Malawi as a foreign concept. We are here because we believe this country has everything it needs to lead with technology — the talent, the ambition, and the drive. Our job is to make sure the right tools and knowledge are in the right hands.",
      },
      {
        key: "story_paragraph_3",
        value:
          "Cosmos AI was built on the belief that Malawi deserves world-class AI capability — not as a future ambition, but as a present reality. We are here, we are building, and we are in it for the long term.",
      },
      {
        key: "vision",
        value:
          "To be the leading artificial intelligence company in Malawi and a recognised force across East and Southern Africa — a company that demonstrably improves lives, businesses, and public services through responsible and accessible AI.",
      },
      {
        key: "mission",
        value:
          "To accelerate AI adoption across Malawi by providing world-class advisory, custom-built solutions, curated AI products, and practical training — delivered with deep local knowledge, integrity, and a commitment to long-term partnerships.",
      },
      {
        key: "team_description",
        value:
          "Cosmos AI is led by a team of Malawian professionals with expertise spanning artificial intelligence, software engineering, business strategy, and enterprise advisory. We are practitioners first — every recommendation we make is grounded in real experience building and deploying AI systems.",
      },
    ],
  });

  console.log("✓ About content seeded");

  // ── VALUES ───────────────────────────────────────────────────
  await db.value.deleteMany();

  await db.value.createMany({
    data: [
      {
        title: "Accessibility",
        description:
          "AI should not be the preserve of large corporations or wealthy nations. We design every engagement with inclusion in mind.",
        order: 1,
      },
      {
        title: "Integrity",
        description:
          "We recommend what is right for the client, not what is most profitable for us. Trust is our most valuable asset.",
        order: 2,
      },
      {
        title: "Local First",
        description:
          "We understand Malawi. Our solutions are designed for Malawian infrastructure, budgets, languages, and realities.",
        order: 3,
      },
      {
        title: "Excellence",
        description:
          "We hold ourselves to international standards in everything we deliver — from a training workshop to a full enterprise system.",
        order: 4,
      },
      {
        title: "Partnership",
        description:
          "We do not do one-off transactions. We build long-term relationships and grow alongside our clients.",
        order: 5,
      },
      {
        title: "Innovation",
        description:
          "We stay at the frontier of AI development so our clients always have access to the most effective tools available.",
        order: 6,
      },
    ],
  });

  console.log("✓ Values seeded");
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
