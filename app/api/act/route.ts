import { createReminderHook } from "@/app/actions/reminder-actions";
import { intros } from "@/lib/intros";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { sendTwilioTextMessage } from "@/lib/twilio";
import { NotifyEmailTemplate } from "@/templates/notification/notify-email-template";
import { Reminder, User } from "@prisma/client";
import { parsePhoneNumber } from "libphonenumber-js";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const { reminderId } = await request.json();
    console.log(
      "reminderId line 17::::::::::::: reminderId from reminderId",
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

    // generate a random number between 0 and 29
    const randomNumber = Math.floor(Math.random() * intros.length);
    const intro = intros[randomNumber];
    console.log("line 40, intro", {
      randomNumber: randomNumber,
      intro: intro,
    });

    // use the user's phone number and convert it to international format
    const phoneNumber = parsePhoneNumber(reminder?.user?.phone as string, "US");
    const isValidPhoneNumber = phoneNumber && phoneNumber.isValid();

    // get the user's subscription status
    const subscription = await stripe.subscriptions.retrieve(
      reminder?.user?.subscriptionId as string
    );
    const isActiveSubscription =
      subscription?.status === "active" || subscription?.status === "trialing";

    // end early and text the user if their subscription is not active
    if (!isActiveSubscription) {
      await textUser({
        phoneNumber: phoneNumber.number,
        reminderName: `${intro} "Your subscription is not active. Please visit https://www.notifoo.io/billing to activate your subscription and start setting reminders."`,
      });
      return NextResponse.json({ message: "Reminder sent successfully" });
    }

    // send email if the user has opted in for email notifications
    if (reminder?.emailNotification && isActiveSubscription) {
      await sendEmailToUser({
        email: reminder?.user?.email as string,
        reminderName: reminder.name,
      });
    }

    // send sms if the user has opted in for sms notifications
    if (
      reminder?.smsNotification &&
      reminder?.user?.phone &&
      isValidPhoneNumber &&
      isActiveSubscription
    ) {
      await textUser({
        phoneNumber: phoneNumber.number,
        reminderName: `${intro} ${reminder.name}`,
      });
    }

    // call the user phone if the user has opted in for call notifications
    if (
      reminder?.user?.phone &&
      reminder?.callNotification &&
      isValidPhoneNumber &&
      isActiveSubscription
    ) {
      await callUser({
        phoneNumber: phoneNumber.number,
        reminderName: reminder.name,
        intro: intro,
      });
    }

    // update the reminder to inactive if the user has opted in for recurring notifications leave it active if not
    console.log("line 93, successfully sent email, call and/or sms ");
    await prisma.reminder.update({
      where: { id: reminderId },
      data: { isActive: false },
    });

    // if the user has opted in for recurring notifications, create another reminder
    if (reminder.repeat) {
      await createReminderForNextDay({ reminder });
    }

    // create activity
    await prisma.activity.create({
      data: {
        type: "Reminder Sent",
        description: `Reminder sent to ${reminder?.user?.email} and ${reminder?.user?.phone}, ReminderId: ${reminder.id}`,
        userId: reminder?.user?.id,
      },
    });

    console.log(
      "line 114, successfully updated reminder to inactive, reminder job completed"
    );

    return NextResponse.json({ message: "Reminder created successfully" });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { message: "Error creating reminder" },
      { status: 500 }
    );
  }
}

/**
 * all the helper functions
 *
 *
 *
 *
 *
 *
 *
 *
 * @param param0
 */
const sendEmailToUser = async ({
  email,
  reminderName,
}: {
  email: string;
  reminderName: string;
}) => {
  try {
    // use the user's email to build the email object
    const template = NotifyEmailTemplate({
      reminderName: reminderName,
    });
    const emailResponse = await sendEmail({
      from: "Notifoo <no-reply@notifoo.io>",
      to: email,
      subject: reminderName,
      body: template,
      textBody: template,
    });
    console.log("line 146, emailResponse", emailResponse);
  } catch (error) {
    console.error("Error sending email:::::::::::::::::", error);
  }
};

const callUser = async ({
  phoneNumber,
  reminderName,
  intro,
}: {
  phoneNumber: string;
  reminderName: string;
  intro: string;
}) => {
  // <Response>
  // <Say voice="Google.en-US-Chirp3-HD-Aoede" language="en-US">
  //     <prosody rate="110%" pitch="+7st" volume="+2dB">
  //       Whoa—<emphasis level="strong">${intro}</emphasis>!
  //     </prosody>
  //     <break time="200ms"/>
  //     <prosody rate="112%" pitch="+5st">
  //       ${reminderName}
  //     </prosody>
  //     <break time="180ms"/>
  //   </Say>
  // </Response>

  // <?xml version="1.0" encoding="UTF-8"?>
  // <Response>
  // <Say voice="Google.en-US-Chirp3-HD-Aoede" language="en-US">
  //     <prosody rate="110%" pitch="+7st" volume="+2dB">
  //       Whoa—<emphasis level="strong">${intro}</emphasis>!
  //     </prosody>
  //     <break time="200ms"/>
  //     <prosody rate="112%" pitch="+5st">
  //       ${reminderName}
  //     </prosody>
  //     <break time="180ms"/>
  //   </Say>
  // </Response>

  // const expressiveVoice = `<Response>
  // <Say voice="Google.en-US-Chirp3-HD-Aoede" language="en-US">
  //     <prosody rate="110%" pitch="+7st" volume="+2dB">
  //       Whoa—<emphasis level="strong">${intro}</emphasis>!
  //     </prosody>
  //     <break time="200ms"/>
  //     <prosody rate="112%" pitch="+5st">
  //       ${reminderName}
  //     </prosody>
  //     <break time="180ms"/>
  //   </Say>
  // </Response>`;

  const expressiveVoice_ = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
  <Say voice="Google.en-US-Chirp3-HD-Leda" language="en-US">
      <prosody rate="110%" pitch="+7st" volume="+2dB">
        Whoa—<emphasis level="strong">${intro}</emphasis>!
      </prosody>
      <break time="200ms"/>
      <prosody rate="112%" pitch="+5st">
        ${reminderName}
      </prosody>
      <break time="180ms"/>
    </Say>
  </Response>`;

  const expressiveVoice = `<Response><Pause length="1"/><Say voice="Google.en-US-Chirp3-HD-Leda" language="en-US">"${reminderName}"</Say></Response>`;

  try {
    await client.calls.create({
      to: phoneNumber, // <-- replace with the recipient's number
      from: process.env.TWILIO_PHONE_NUMBER!, // <-- replace with your Twilio number
      twiml: expressiveVoice,

      // TODO: possibly wait for the answer to say something before talking or 2 seconds, which ever comes first
    });
    console.log("line 245, call has been made");
  } catch (error) {
    console.error("Error calling user phone:::::::::::::::::", error);
  }
};

const textUser = async ({
  phoneNumber,
  reminderName,
}: {
  phoneNumber: string;
  reminderName: string;
}) => {
  try {
    await sendTwilioTextMessage({
      to: phoneNumber,
      textBody: `🔔 🔔 🔔 🔔 🔔 "${reminderName}" - Notifoo Team`,
    });
    console.log("line 186, sms has been sent");
  } catch (error) {
    console.error("Error sending sms:::::::::::::::::", error);
  }
};

const createReminderForNextDay = async ({
  reminder,
}: {
  reminder: Reminder & { user: User };
}) => {
  // not using try catch here because if the reminder has a repeat, that repeat needs to be created or  through an error
  console.log("line 197, creating a new reminder for the next day");
  // get the due date
  const dueDate = reminder.dueDate;
  console.log("line 200, dueDate", dueDate);

  // add 1 day to the due date
  const newDueDate = new Date(dueDate.getTime() + 24 * 60 * 60 * 1000);
  console.log("line 204, newDueDate", newDueDate);

  // create a new reminder with the new due date
  const res = await createReminderHook({
    name: reminder.name,
    dueDate: newDueDate,
    type: reminder.type as "till" | "from",
    emailNotification: reminder.emailNotification,
    smsNotification: reminder.smsNotification,
    callNotification: reminder.callNotification,
    recurringNotification: reminder.repeat,
    user: reminder.user,
  });

  if (res.success) {
    console.log("line 218, new reminder created for the next day");
  } else {
    console.error(
      "line 220, error creating new reminder for the next day",
      res
    );
  }
};
