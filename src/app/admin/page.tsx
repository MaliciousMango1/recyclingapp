import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { AdminContent } from "~/components/admin/admin-content";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <AdminContent />;
}
