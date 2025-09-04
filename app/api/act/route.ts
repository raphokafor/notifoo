import { prisma } from "@/lib/prisma";
import twilio from "twilio";
import { sendEmail } from "@/lib/resend";
import { sendTwilioTextMessage } from "@/lib/twilio";
import { NotifyEmailTemplate } from "@/templates/notification/notify-email-template";
import { parsePhoneNumber } from "libphonenumber-js";
import { NextRequest, NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const { reminderId } = await request.json();
    console.log(
      "reminderId line 12::::::::::::: reminderId from qstash",
      reminderId
    );
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        user: true,
      },
    });
    if (!reminder) {
      return NextResponse.json(
        { message: "Reminder not found" },
        { status: 404 }
      );
    }

    console.log("line 28, reminder", {
      reminderName: reminder.name,
      reminderId: reminder.id,
      reminderType: reminder.type,
      reminderDueDate: reminder.dueDate,
      reminderIsActive: reminder.isActive,
      reminderRepeat: reminder.repeat,
      reminderUserEmail: reminder.user?.email,
      reminderUserPhone: reminder.user?.phone,
      reminderEmailNotification: reminder.emailNotification,
      reminderSmsNotification: reminder.smsNotification,
    });

    // get the user's subscription status
    const subscriptionStatus = reminder?.user?.subscriptionStatus;

    // send email
    if (reminder?.emailNotification && reminder?.smsNotification) {
      try {
        // use the user's email to build the email object
        const template = NotifyEmailTemplate({
          reminderName: reminder.name,
        });
        const emailResponse = await sendEmail({
          to: reminder?.user?.email,
          subject: reminder.name,
          body: template,
          textBody: template,
        });
        console.log("line 48, emailResponse", emailResponse);
      } catch (error) {
        console.error("Error sending email:::::::::::::::::", error);
      }
    } else {
      console.log("line 67, not subscribed to for call");
    }

    console.log("line 47, email has been sent");

    // use the user's phone number and convert it to international format
    const phoneNumber = parsePhoneNumber(reminder?.user?.phone as string, "US");
    if (!phoneNumber || !phoneNumber.isValid()) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // send sms
    if (
      reminder?.smsNotification &&
      reminder?.user?.phone &&
      subscriptionStatus === "active"
    ) {
      try {
        const smsResponse = await sendTwilioTextMessage({
          to: phoneNumber.number,
          textBody: `🔔 Ding ding! Reminder bell says: "${reminder.name}" - Consider this your friendly digital elbow nudge. -Team Notifoo`,
        });
        console.log("line 67, smsResponse", smsResponse);
      } catch (error) {
        console.error("Error sending sms:::::::::::::::::", error);
      }
    }

    // call the user phone
    if (reminder?.user?.phone && subscriptionStatus === "active") {
      try {
        const call = await client.calls.create({
          to: phoneNumber.number, // <-- replace with the recipient's number
          from: process.env.TWILIO_PHONE_NUMBER!, // <-- replace with your Twilio number
          twiml: `<Response><Pause length="1"/><Say voice="Polly.Brian">Ding ding! Reminder bell says: "${reminder.name}" - Consider this your friendly digital elbow nudge. -Team Notifoo</Say></Response>`,
        });
        console.log("line 93, call", call);
      } catch (error) {
        console.error("Error calling user phone:::::::::::::::::", error);
      }
    }

    // update the reminder to inactive
    console.log("line 73, successfully sent email and/or sms ");
    const updatedReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: { isActive: false },
      select: {
        isActive: true,
        stashId: true,
        name: true,
      },
    });

    console.log(
      "line 90, successfully updated reminder to inactive, reminder job completed",
      updatedReminder
    );

    // create activity
    await prisma.activity.create({
      data: {
        type: "Reminder Sent",
        description: `Reminder sent to ${reminder?.user?.email} and ${reminder?.user?.phone}, ReminderId: ${reminder.id}`,
        userId: reminder?.user?.id,
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
