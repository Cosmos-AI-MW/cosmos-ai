import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

// Use at the top of every admin page. Signed-in customers are NOT admins.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect("/admin/login");
  }
  return session;
}
