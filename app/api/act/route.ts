import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { sendTwilioTextMessage } from "@/lib/twilio";
import { NotifyEmailTemplate } from "@/templates/notification/notify-email-template";
import { parsePhoneNumber } from "libphonenumber-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { reminderId } = await request.json();
    console.log(
      "reminderId line 7::::::::::::: reminderId from qstash",
      reminderId
    );
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
    });
    if (!reminder) {
      return NextResponse.json(
        { message: "Reminder not found" },
        { status: 404 }
      );
    }

    // use the user id to get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: reminder?.userId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // get the user's subscription status
    const subscriptionStatus = user?.subscriptionStatus;

    // send email
    if (reminder?.emailNotification && subscriptionStatus === "active") {
      // use the user's email to build the email object
      const template = NotifyEmailTemplate({
        reminderName: reminder.name,
      });
      await sendEmail({
        to: user.email,
        subject: reminder.name,
        body: template,
        textBody: template,
      });
    }

    // send sms
    if (
      reminder?.smsNotification &&
      user?.phone &&
      subscriptionStatus === "active"
    ) {
      // use the user's phone number and convert it to international format
      const phoneNumber = parsePhoneNumber(user.phone as string, "US");
      if (!phoneNumber || !phoneNumber.isValid()) {
        return NextResponse.json(
          { message: "Invalid phone number" },
          { status: 400 }
        );
      }
      await sendTwilioTextMessage({
        to: phoneNumber.formatInternational(),
        body: `🔔 Ding ding! Reminder bell says: "${reminder.name}" - Consider this your friendly digital elbow nudge. -Team Notifoo`,
      });
    }

    // update the reminder to inactive
    console.log("line 71, successfully sent email and/or sms ");
    await prisma.reminder.update({
      where: { id: reminderId },
      data: { isActive: false },
    });

    console.log(
      "line 79, successfully updated reminder to inactive, reminder job completed"
    );

    // create activity
    await prisma.activity.create({
      data: {
        type: "Reminder Sent",
        description: `Reminder sent to ${user.email} and ${user.phone}, ReminderId: ${reminder.id}`,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Reminder created successfully" });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { message: "Error creating reminder" },
      { status: 500 }
    );
  }
}
