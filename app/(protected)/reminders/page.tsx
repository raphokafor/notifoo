import React from "react";
import RemindersClient from "./RemindersClient";
import { getReminders } from "@/app/actions/reminders";

const RemindersPage = async () => {
  const { data: reminders } = await getReminders();

  // build the default reminders from reminders array
  const defaultReminders = reminders?.map((reminder) => ({
    id: reminder.id,
    name: reminder.name,
    description: reminder?.description ?? "",
    isActive: reminder.isActive,
    dueDate: reminder.dueDate,
    type: reminder.type,
  }));

  return <RemindersClient reminders={defaultReminders as any} />;
};

export default RemindersPage;
