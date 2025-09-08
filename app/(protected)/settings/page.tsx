import { getActivities } from "@/app/actions/user-actions";
import { getUser } from "@/lib/db-actions";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import CustomerSettingsPage from "./CustomerSettingsPage";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  // get user's logins
  const { data: activities } = await getActivities(user.id);

  return (
    <CustomerSettingsPage user={user as User} activities={activities as any} />
  );
}
