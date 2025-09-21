import { Resend } from "resend";

export const sendEmail = async ({
  from,
  to,
  subject,
  body,
  textBody,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
  textBody: string;
}) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: body,
      text: textBody,
    });

    if (error) {
      console.error(error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to send email",
      };
    }

    return {
      success: true,
      data: data,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to send email",
    };
  }
};

export const addToResendContactList = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const contact = await resend.contacts.create({
      email: email,
      firstName: name?.split(" ")[0],
      lastName: name?.split(" ")[1],
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    return {
      success: true,
      message: "Contact added to resend contact list successfully",
      data: contact,
    };
  } catch (error) {
    console.error("Error adding to resend contact list:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
};
