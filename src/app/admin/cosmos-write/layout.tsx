import type { ReactNode } from "react";
import { requireAdmin } from "~/server/auth/require-admin";

export default async function AdminCosmosWriteLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
