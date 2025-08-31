import { getCurrentUser } from "@/lib/db-actions";
import CustomerSettingsPage from "./CustomerSettingsPage";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return <CustomerSettingsPage user={user as User} />;
}
