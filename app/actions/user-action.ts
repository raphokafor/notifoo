import { prisma } from "@/lib/prisma";

export const addUserActivity = async (userId: string, activity: string) => {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: {
        message: "Activities fetched successfully",
      },
    };
  } catch (error) {
    console.error("Error getting activities:", error);
    return {
      success: false,
      error: "Failed to get activities",
    };
  }
};
