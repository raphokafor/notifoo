import { NextRequest, NextResponse } from "next/server";
import { sendTwilioTextMessage } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio webhook (not JSON)
    const formData = await request.formData();
    const from = formData.get("From") as string; // The sender's/caller's phone number
    const to = formData.get("To") as string; // The Twilio number

    console.log("Twilio fallback webhook received:", { from, to });

    if (from) {
      // Send error message to the phone number that contacted us
      await sendTwilioTextMessage(
        from,
        "⚠️ We're experiencing technical difficulties. Please try again later or contact support for assistance."
      );

      console.log(`Sent fallback error message to ${from}`);
    }

    // Send notification to admin/support about the fallback being triggered
    const adminPhoneNumber =
      process.env.ADMIN_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
    if (adminPhoneNumber && adminPhoneNumber !== from) {
      await sendTwilioTextMessage(
        adminPhoneNumber,
        `🚨 FALLBACK TRIGGERED\n\nTwilio fallback route was called.\nFrom: ${from || "Unknown"}\nTo: ${to || "Unknown"}\nTime: ${new Date().toLocaleString()}\n\nPlease check system status.`
      );

      console.log(`Sent fallback notification to admin: ${adminPhoneNumber}`);
    }

    return NextResponse.json({ message: "Fallback processed" });
  } catch (error) {
    console.error("Error in fallback route:", error);
    return NextResponse.json({ message: "Fallback error" }, { status: 500 });
  }
}
