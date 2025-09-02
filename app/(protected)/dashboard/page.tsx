import { getActiveReminders } from "@/app/actions/reminders";
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
  const defaultReminders = reminders?.map((reminder) => ({
    id: reminder.id,
    name: reminder.name,
    description: reminder?.description ?? "",
    isActive: reminder.isActive,
    dueDate: reminder.dueDate,
    type: reminder.type,
    emailNotification: reminder.emailNotification,
    smsNotification: reminder.smsNotification,
  }));

  return <Dashboard reminders={defaultReminders as any} user={user as any} />;
};

export default DashboardPage;
