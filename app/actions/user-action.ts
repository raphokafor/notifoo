"use server";

import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { parsePhoneNumber } from "libphonenumber-js";

export const addUserActivity = async (
  userId: string,
  activityType: string,
  description: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // create activity
    await prisma.activity.create({
      data: {
        type: activityType,
        description: description,
        userId: userId,
      },
    });

    return {
      success: true,
      data: {
        message: "User activity added successfully",
      },
    };
  } catch (error) {
    console.error("Error adding user activity:", error);
    return {
      success: false,
      error: "Failed to add user activity",
    };
  }
};

export const getActivities = async (userId: string) => {
  try {
    // get user's activities, order so its createdAt is descending
    const activities = await prisma.activity.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Activities fetched successfully",
      data: activities,
    };
  } catch (error) {
    console.error("Error getting activities:", error);
    return {
      success: false,
      message: "Failed to get activities",
      data: [],
    };
  }
};

export const getUserLogins = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }
  try {
    const logins = await prisma.login.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: logins,
      message: "User logins fetched successfully",
    };
  } catch (error) {
    console.error("Error getting user logins:", error);
    return {
      success: false,
      message: "Failed to get user logins",
      data: [],
    };
  }
};

export const updateUser = async ({
  name,
  phone,
}: {
  name: string;
  phone: string | null;
}) => {
  try {
    console.log("line 101, name", name);
    console.log("line 102, phone", phone);
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // if phone is passed in, format it to international format
    let formattedPhone = phone ?? null;
    if (phone) {
      const phoneNumber = parsePhoneNumber(phone, "US");
      if (!phoneNumber || !phoneNumber.isValid()) {
        return {
          success: false,
          error: "Invalid phone number",
        };
      }
      formattedPhone = phoneNumber.formatInternational().replace(/\s/g, "");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, phone: formattedPhone?.trim() ?? null },
    });

    console.log("line 115, user updated", updatedUser);

    // create activity
    await prisma.activity.create({
      data: {
        type: "User Profile Updated",
        description: `User profile updated: ${name} ${phone ? `and ${phone}` : null}`,
        userId: user.id,
      },
    });

    console.log("line 126, activity created");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Failed to update user",
    };
  }
};
