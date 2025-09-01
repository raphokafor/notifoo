"use server";

import twilio from "twilio";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

interface CreatePhoneNumberParams {
  friendlyName: string;
  smsUrl: string;
  voiceUrl: string;
  fallbackUrl: string;
  phoneNumber: string;
  notificationPhoneNumber: string; // Phone number to send success notification to
}

export async function createTwilioIncomingPhoneNumber({
  friendlyName,
  smsUrl = "https://Notifoo.com/api/twilio/sms",
  voiceUrl = "https://Notifoo.com/api/twilio/voice",
  fallbackUrl = "https://Notifoo.com/api/twilio/fallback",
  phoneNumber,
  notificationPhoneNumber,
}: CreatePhoneNumberParams) {
  try {
    // Create the incoming phone number
    const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber,
      friendlyName: friendlyName,
      smsUrl: smsUrl,
      voiceUrl: voiceUrl,
      smsFallbackUrl: fallbackUrl,
      voiceFallbackUrl: fallbackUrl,
      smsMethod: "POST",
      voiceMethod: "POST",
      statusCallback: "https://Notifoo.com/status",
      statusCallbackMethod: "POST",
      voiceFallbackMethod: "POST",
    });

    // Send success notification SMS
    const message = await client.messages.create({
      body: `✅ Callbox created successfully!\n\nFriendly Name: ${friendlyName}\nPhone Number: ${phoneNumber}\nSID: ${incomingPhoneNumber.sid}`,
      from: process.env.TWILIO_PHONE_NUMBER!, // Your Twilio phone number
      to: notificationPhoneNumber,
    });

    return {
      success: true,
      data: {
        phoneNumberSid: incomingPhoneNumber.sid,
        phoneNumber: incomingPhoneNumber.phoneNumber,
        friendlyName: incomingPhoneNumber.friendlyName,
        messageSid: message.sid,
      },
      message: "Phone number created and notification sent successfully",
    };
  } catch (error) {
    console.error("Error creating Twilio phone number:", error);

    // Send error notification SMS
    try {
      await client.messages.create({
        body: `❌ Failed to create callbox: ${friendlyName}\nError: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: notificationPhoneNumber,
      });
    } catch (smsError) {
      console.error("Failed to send error notification SMS:", smsError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to create phone number",
    };
  }
}

// Alternative version that purchases a new phone number instead of using existing one
export async function purchaseAndCreateTwilioPhoneNumber({
  friendlyName,
  smsUrl = "https://Notifoo.com/api/twilio/sms",
  voiceUrl = "https://Notifoo.com/api/twilio/voice",
  areaCode = "470",
  notificationPhoneNumber,
  fallbackUrl = "https://Notifoo.com/api/twilio/fallback",
}: Omit<CreatePhoneNumberParams, "phoneNumber"> & { areaCode?: string }) {
  try {
    // First, search for available phone numbers
    const availableNumbers = await client
      .availablePhoneNumbers("US")
      .local.list({
        areaCode: areaCode ? parseInt(areaCode, 10) : undefined,
        limit: 1,
      });

    if (availableNumbers.length === 0) {
      throw new Error("No available phone numbers found");
    }

    const selectedNumber = availableNumbers[0].phoneNumber;

    // Purchase and configure the phone number
    const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: selectedNumber,
      friendlyName: friendlyName,
      smsUrl: smsUrl,
      voiceUrl: voiceUrl,
      smsFallbackUrl: fallbackUrl,
      voiceFallbackUrl: fallbackUrl,
      smsMethod: "POST",
      voiceMethod: "POST",
    });

    // Send success notification SMS
    const message = await client.messages.create({
      body: `✅ New callbox purchased and created successfully!\n\nFriendly Name: ${friendlyName}\nPhone Number: ${selectedNumber}\nSID: ${incomingPhoneNumber.sid}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: notificationPhoneNumber,
    });

    return {
      success: true,
      data: {
        phoneNumberSid: incomingPhoneNumber.sid,
        phoneNumber: incomingPhoneNumber.phoneNumber,
        friendlyName: incomingPhoneNumber.friendlyName,
        messageSid: message.sid,
      },
      message: "Phone number purchased and notification sent successfully",
    };
  } catch (error) {
    console.error("Error purchasing Twilio phone number:", error);

    try {
      await client.messages.create({
        body: `❌ Failed to purchase callbox: ${friendlyName}\nError: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: notificationPhoneNumber,
      });
    } catch (smsError) {
      console.error("Failed to send error notification SMS:", smsError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to purchase phone number",
    };
  }
}

export async function sendTwilioTextMessage({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: to,
    });

    return {
      success: true,
      data: {
        messageSid: message.sid,
      },
    };
  } catch (error) {
    console.error("Error sending Twilio text message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to send text message",
    };
  }
}
