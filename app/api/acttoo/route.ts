import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { sendTwilioTextMessage } from "@/lib/twilio";
import { NotifyEmailTemplate } from "@/templates/notification/notify-email-template";
import { parsePhoneNumber } from "libphonenumber-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const template = NotifyEmailTemplate({
    //   reminderName: "Test Reminder",
    // });
    // const emailResponse = await sendEmail({
    //   to: "okaforworks@gmail.com",
    //   subject: "Test Email",
    //   body: template,
    //   textBody: template,
    // });
    // console.log("line 48, emailResponse", emailResponse);

    // // use the user's phone number and convert it to international format
    // const phoneNumber = parsePhoneNumber("+14042472337", "US");
    // console.log("line 23, phoneNumber", phoneNumber);
    // console.log("line 24, phoneNumber.isValid()", phoneNumber.isValid());
    // if (!phoneNumber || !phoneNumber.isValid()) {
    //   return NextResponse.json(
    //     { message: "Invalid phone number" },
    //     { status: 400 }
    //   );
    // }
    // const smsResponse = await sendTwilioTextMessage({
    //   to: phoneNumber.number,
    //   textBody: `🔔 Ding ding! Reminder bell says: "Test Reminder" - Consider this your friendly digital elbow nudge. -Team Notifoo`,
    // });
    // console.log("line 67, smsResponse", smsResponse);

    return NextResponse.json({ message: "Reminder created successfully" });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { message: "Error creating reminder" },
      { status: 500 }
    );
  }
}
