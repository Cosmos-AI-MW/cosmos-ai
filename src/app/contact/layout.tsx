import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Cosmos AI",
  description: "Get in touch with Cosmos AI.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
