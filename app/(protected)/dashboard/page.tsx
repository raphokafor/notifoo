// no cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getActiveReminders } from "@/app/actions/reminder-actions";
import { getUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";
import { Dashboard } from "./DashboardClient";

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: reminders } = await getActiveReminders();

  // build the default reminders from reminders array
  const defaultReminders = reminders?.map((reminder: any) => ({
    id: reminder.id,
    name: reminder.name,
    description: reminder?.description ?? "",
    isActive: reminder.isActive,
    dueDate: reminder.dueDate,
    type: reminder.type,
    emailNotification: reminder.emailNotification,
    smsNotification: reminder.smsNotification,
    recurringNotification: reminder.repeat,
  }));

  return <Dashboard reminders={defaultReminders as any} user={user as any} />;
};

export default DashboardPage;
