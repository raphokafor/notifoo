import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { sendTwilioTextMessage } from "@/lib/twilio";
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

    console.log("reminder line 19::::::::::::: reminder from db", {
      id: reminder?.id,
      name: reminder?.name,
      description: reminder?.description,
      dueDate: reminder?.dueDate,
      emailNotification: reminder?.emailNotification,
      smsNotification: reminder?.smsNotification,
      stashId: reminder?.stashId,
      userId: reminder?.userId,
      createdAt: reminder?.createdAt,
      updatedAt: reminder?.updatedAt,
    });

    // use the user id to get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: reminder?.userId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // send email and/or sms here
    // if(reminder?.emailNotification){
    //   // use the user's email to build the email object
    //   const template = `<p>Hello ${user.name},</p>
    //   <p>You have a new reminder:</p>
    //   <p>Name: ${reminder.name}</p>
    //   <p>Description: ${reminder.description}</p>
    //   <p>Due Date: ${reminder.dueDate}</p>
    //   <p>Please check your dashboard to view your reminder.</p>
    //   `;
    //   await sendEmail({to: user.email, subject: reminder.name, body: template, textBody: template});
    // }

    // if(reminder?.smsNotification){
    //   // use the user's phone number and convert it to international format
    //   const phoneNumber = parsePhoneNumber(user.twilioPhoneNumber as string, "US");
    //   if(!phoneNumber || !phoneNumber.isValid()){
    //     return NextResponse.json({ message: "Invalid phone number" }, { status: 400 });
    //   }
    //   await sendTwilioTextMessage({to: phoneNumber.formatInternational(), body: reminder.name});
    // }

    return NextResponse.json({ message: "Reminder created successfully" });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { message: "Error creating reminder" },
      { status: 500 }
    );
  }
}
