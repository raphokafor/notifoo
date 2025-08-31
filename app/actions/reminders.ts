"use server";

import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { TimerData } from "@/types/database";
import { Client } from "@upstash/qstash";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// TODO: if reminder has a recurring schedule, create cron instead of delay
export async function createReminder(reminder: TimerData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error("User not found error");
      return {
        success: false,
        message: "Unable to create reminder",
      };
    }

    // Convert to UTC for consistent scheduling
    const utcDueDate = new Date(reminder.dueDate.getTime());

    const newReminder = await prisma.reminder.create({
      data: {
        name: reminder.name,
        description: reminder.description ?? "",
        dueDate: utcDueDate, // Store as UTC
        userId: user.id,
      },
    });

    // Calculate delay using UTC timestamps
    const nowUtc = new Date();
    const delaySeconds = Math.floor(
      (utcDueDate.getTime() - nowUtc.getTime()) / 1000
    );

    // Ensure we don't schedule in the past
    if (delaySeconds <= 0) {
      return {
        success: false,
        message: "Cannot schedule reminder in the past",
      };
    }

    // Schedule exact delivery
    const res = await qstash.publishJSON({
      url: `${process.env.BASE_URL}/api/act`,
      delay: delaySeconds,
      body: { reminderId: newReminder.id },
    });

    // update the reminder with the stash id
    if (res.messageId) {
      await prisma.reminder.update({
        where: { id: newReminder.id },
        data: { stashId: res.messageId },
      });
    }

    return {
      success: true,
      message: "Reminder created successfully",
    };
  } catch (error) {
    console.error("Error creating reminder:", error);
    return {
      success: false,
      message: "Failed to create reminder",
    };
  }
}

export async function getReminders() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        data: [],
      };
    }
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.id,
      },
    });
    return {
      success: true,
      data: reminders,
    };
  } catch (error) {
    console.error("Error getting reminders:", error);
    return {
      success: false,
      error: "Failed to get reminders",
      data: [],
    };
  }
}

export async function updateReminder(reminder: TimerData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unable to update reminder",
      };
    }

    const res = await prisma.reminder.update({
      where: { id: reminder.id, userId: user.id },
      data: {
        name: reminder.name,
        description: reminder.description ?? "",
      },
    });

    // cancel the existing schedule if it exists
    if (res.stashId) {
      try {
        await qstash.messages.delete(res.stashId);
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    }

    // Convert to UTC for consistent scheduling
    const utcDueDate = new Date(reminder.dueDate.getTime());

    // Calculate delay using UTC timestamps
    const nowUtc = new Date();
    const delaySeconds = Math.floor(
      (utcDueDate.getTime() - nowUtc.getTime()) / 1000
    );

    // Ensure we don't schedule in the past
    if (delaySeconds <= 0) {
      return {
        success: false,
        message: "Cannot schedule reminder in the past",
      };
    }

    // create new qstash schedule
    const response = await qstash.publishJSON({
      url: `${process.env.BASE_URL}/api/act`,
      delay: delaySeconds,
      body: { reminderId: res.id },
    });

    // update the reminder with the stash id
    if (response.messageId) {
      await prisma.reminder.update({
        where: { id: res.id },
        data: { stashId: response.messageId },
      });
    }

    return {
      success: true,
      message: "Reminder updated successfully",
    };
  } catch (error) {
    console.error("Error updating reminder:", error);
    return {
      success: false,
      message: "Failed to update reminder",
    };
  }
}

export async function deleteReminder(reminderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unable to delete reminder",
      };
    }

    const reminder = await prisma.reminder.delete({
      where: { id: reminderId, userId: user.id },
    });

    // delete the qstash schedule
    if (reminder.stashId) {
      try {
        await qstash.messages.delete(reminder.stashId);
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    }

    return {
      success: true,
      message: "Reminder deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return {
      success: false,
      message: "Failed to delete reminder",
    };
  }
}
