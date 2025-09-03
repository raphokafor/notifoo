// no cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import RemindersClient from "./RemindersClient";
import { getReminders } from "@/app/actions/reminders";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/db-actions";

const RemindersPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
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
  }));

  return (
    <RemindersClient reminders={defaultReminders as any} user={user as any} />
  );
};

export default RemindersPage;
