import { db } from "~/server/db";
import ContactForm from "./ContactForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Cosmos AI",
  description: "Book a free exploratory meeting with Cosmos AI.",
};

const FALLBACK_SERVICES = [
  "AI Consulting & Advisory",
  "Custom AI Development",
  "AI Product Distribution",
  "AI Training & Workshops",
  "Data Analytics & Automation",
];

async function getServiceNames() {
  try {
    const rows = await db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true },
    });
    const names = rows.map((r) => r.title);
    return names.length > 0 ? names : FALLBACK_SERVICES;
  } catch (error) {
    console.error("Contact page services failed to load:", error);
    return FALLBACK_SERVICES;
  }
}

export default async function ContactPage() {
  const names = await getServiceNames();
  return <ContactForm services={[...names, "Other / Not sure yet"]} />;
}
