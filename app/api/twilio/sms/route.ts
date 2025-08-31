import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTwilioTextMessage } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio webhook (not JSON)
    const formData = await request.formData();
    const from = formData.get("From") as string; // The sender's phone number
    const body = formData.get("Body") as string; // The message content
    const to = formData.get("To") as string; // The Twilio number that received the SMS

    console.log("Twilio SMS webhook received:", { from, body, to });

    if (!from || !body || !to) {
      console.error("Missing required data in SMS webhook");
      return new NextResponse("Missing data", { status: 400 });
    }

    // Find the callbox with matching Twilio phone number
    const callBox = await prisma.callBox.findFirst({
      where: {
        twilioPhoneNumber: to,
      },
      include: {
        user: true, // Include user data to check subscription
      },
    });

    if (!callBox) {
      console.error(`No callbox found for Twilio number: ${to}`);

      // Send error message to user
      await sendTwilioTextMessage(
        from,
        "❌ Callbox not found. Please contact support."
      );

      return new NextResponse("Callbox not found", { status: 200 });
    }

    console.log(
      `Found callbox: ${callBox.name} for user: ${callBox.user.email}`
    );

    // Check if user has active subscription
    if (callBox.user.subscriptionStatus !== "active") {
      console.log(
        `User ${callBox.user.email} does not have active subscription`
      );

      // Send subscription error message
      await sendTwilioTextMessage(
        from,
        "❌ Access denied. You need an active subscription to control your callbox. Please check your billing status or contact support."
      );

      return new NextResponse("Subscription not active", { status: 200 });
    }

    // Parse the message body for keywords
    const messageText = body.trim().toLowerCase();

    if (messageText === "enable") {
      // Enable the callbox
      await prisma.callBox.update({
        where: { id: callBox.id },
        data: { isActive: true },
      });

      console.log(`Callbox ${callBox.name} enabled by SMS from ${from}`);

      // Send success confirmation
      await sendTwilioTextMessage(
        from,
        `✅ Callbox "${callBox.name}" has been ENABLED.\n\nIncoming calls will now automatically dial your buzz code (${callBox.buzzCode}) to open the gate.`
      );
    } else if (messageText === "disable") {
      // Disable the callbox
      await prisma.callBox.update({
        where: { id: callBox.id },
        data: { isActive: false },
      });

      console.log(`Callbox ${callBox.name} disabled by SMS from ${from}`);

      // Send success confirmation
      await sendTwilioTextMessage(
        from,
        `✅ Callbox "${callBox.name}" has been DISABLED.\n\nIncoming calls will now be forwarded to your phone number (${callBox.phone}) instead of automatically opening the gate.`
      );
    } else {
      // Invalid command
      console.log(`Invalid SMS command received: ${messageText}`);

      // Send help message
      await sendTwilioTextMessage(
        from,
        `❓ Invalid command: "${body}"\n\nValid commands:\n• "enable" - Activate automatic gate opening\n• "disable" - Forward calls to your phone\n\nCurrent status: ${callBox.isActive ? "ENABLED" : "DISABLED"}`
      );
    }

    return new NextResponse("SMS processed", { status: 200 });
  } catch (error) {
    console.error("Error processing Twilio SMS webhook:", error);

    // Try to send error message if we have the sender's number
    try {
      const formData = await request.formData();
      const from = formData.get("From") as string;

      if (from) {
        await sendTwilioTextMessage(
          from,
          "❌ Sorry, there was an error processing your request. Please try again later or contact support."
        );
      }
    } catch (smsError) {
      console.error("Failed to send error SMS:", smsError);
    }

    return new NextResponse("Internal error", { status: 200 });
  }
}

// test GET route
export async function GET(request: NextRequest) {
  return new NextResponse("Hello, world SMS!", { status: 200 });
}
