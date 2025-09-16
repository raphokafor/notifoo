import React from "react";
import ReminderDetailClient from "./ReminderDetailClient";
import { getReminderById } from "@/app/actions/reminder-actions";

const ReminderDetailPage = async ({
  params,
}: {
  params: Promise<{ reminderId: string }>;
}) => {
  // Await params before accessing its properties
  const { reminderId } = await params;

  // get the reminder by id
  const { data: reminder } = await getReminderById(reminderId);

  return <ReminderDetailClient reminder={reminder as any} />;
};

export default ReminderDetailPage;
