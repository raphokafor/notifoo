// no cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getReminders } from "@/app/actions/reminder-actions";
import { getUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";
import RemindersClient from "./RemindersClient";

const RemindersPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  const { data: reminders } = await getReminders();

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
    callNotification: reminder.callNotification,
    recurringNotification: reminder.repeat ?? false,
  }));

  return (
    <RemindersClient reminders={defaultReminders as any} user={user as any} />
  );
};

export default RemindersPage;
