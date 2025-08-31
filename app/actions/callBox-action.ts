"use server";

import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { purchaseAndCreateTwilioPhoneNumber } from "@/lib/twilio";
import { callBoxSchema } from "@/schemas";
import { CallBox } from "@prisma/client";
import parsePhoneNumber from "libphonenumber-js";

export const createCallBox = async (callBox: CallBox) => {
  try {
    let twilioSid = "";
    let twilioPhoneNumber = "";
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // check schema
    const validatedData = callBoxSchema.parse(callBox);
    if (!validatedData) {
      return {
        success: false,
        error: "Invalid data",
      };
    }

    const phoneNumber = parsePhoneNumber(validatedData.phone, "US");
    if (!phoneNumber || !phoneNumber.isValid()) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    const phone = phoneNumber.formatInternational();

    // create new twilio number
    // check if user has an active subscription and if they do, create a new twilio number, else use an existing twilio number
    if (user.subscriptionStatus === "active") {
      const twilioNumber = await purchaseAndCreateTwilioPhoneNumber({
        friendlyName: validatedData.name as string,
        smsUrl: "https://Notifoo.com/api/twilio/sms",
        voiceUrl: "https://Notifoo.com/api/twilio/voice",
        fallbackUrl: "https://Notifoo.com/api/twilio/fallback",
        areaCode: "412",
        notificationPhoneNumber:
          phoneNumber?.formatInternational() ??
          (user.twilioPhoneNumber as string),
      });

      twilioSid = twilioNumber.data?.phoneNumberSid as string;
      twilioPhoneNumber = twilioNumber.data?.phoneNumber as string;
    } else {
      twilioSid = process.env.TWILIO_PHONE_SID as string;
      twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
    }

    // create access codes
    const accessCodes = validatedData.accessCodes?.map((code) => ({
      code: code.code,
      user: code.user,
    }));

    // create call box
    await prisma.callBox.create({
      data: {
        userId: user.id,
        ...validatedData,
        // remove the spaces from the phone number
        phone: phone?.replace(/\s/g, ""),
        // add the other twilio details
        twilioSid: twilioSid,
        twilioPhoneNumber: twilioPhoneNumber,
        // add the access codes
        accessCodes: accessCodes,
      },
    });

    return {
      success: true,
      data: {
        message: "Call box created successfully",
      },
    };
  } catch (error) {
    console.error("Error creating call box:", error);
    return {
      success: false,
      error: "Failed to create call box",
    };
  }
};

export const getCallBoxes = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const callBoxes = await prisma.callBox.findMany({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      data: callBoxes,
    };
  } catch (error) {
    console.error("Error getting call boxes:", error);
    return {
      success: false,
      error: "Failed to get call boxes",
    };
  }
};

export const getCallBox = async (callBoxId: string) => {
  try {
    const callBox = await prisma.callBox.findUnique({
      where: { id: callBoxId },
    });

    return {
      success: true,
      data: callBox,
    };
  } catch (error) {
    console.error("Error getting call box:", error);
    return {
      success: false,
      error: "Failed to get call box",
    };
  }
};

export const updateCallBox = async (callBox: CallBox) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // check schema
    const validatedData = callBoxSchema.parse(callBox);
    if (!validatedData) {
      return {
        success: false,
        error: "Invalid data",
      };
    }

    // update call box
    await prisma.callBox.update({
      where: {
        id: callBox.id,
      },
      data: validatedData,
    });

    return {
      success: true,
      data: {
        message: "Call box updated successfully",
      },
    };
  } catch (error: any) {
    console.error("Error updating call box:", error);
    if (error.message) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to update call box",
    };
  }
};

export const disableCallBox = async (callBoxId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // check if user owns the call box
    const callBox = await prisma.callBox.findUnique({
      where: { id: callBoxId },
    });
    if (!callBox) {
      return {
        success: false,
        error: "Call box not found",
      };
    }
    if (callBox.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // disable call box
    await prisma.callBox.update({
      where: { id: callBoxId },
      data: { isActive: false },
    });

    return {
      success: true,
      data: {
        message: "Call box disabled successfully",
      },
    };
  } catch (error: any) {
    console.error("Error disabling call box:", error);
    if (error.message) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to disable call box",
    };
  }
};

export const deleteCallBox = async (callBoxId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
  } catch (error: any) {
    console.error("Error deleting call box:", error);
    if (error.message) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to delete call box",
    };
  }
};
