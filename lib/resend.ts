import { Resend } from "resend";

export const sendEmail = async ({
  to,
  subject,
  body,
  textBody,
}: {
  to: string;
  subject: string;
  body: string;
  textBody: string;
}) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Notifoo <no-reply@Notifoo.com>",
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
