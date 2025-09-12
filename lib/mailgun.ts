import FormData from "form-data"; // or built-in FormData
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

/**
 * @param {string} name - The name of the recipient
 * @param {string} email - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {any} template - The HTML template of the email
 * @param {string} text - The text version of the email
 * @param {string} fromEmail - The email address of the sender
 */
export const sendEmailMailgun = async ({
  name,
  email,
  subject,
  template,
  text,
  fromEmail,
}: {
  name: string;
  email: string;
  subject: string;
  template: any;
  text?: string;
  fromEmail?: string;
}) => {
  try {
    const emailData = {
      from: fromEmail ?? "Ralph at Notifoo <ralph@notifications.notifoo.io>",
      to: email,
      subject,
      name,
      html: template,
      text: text,
    };

    return await mg.messages.create(
      process.env.MAILGUN_DOMAIN as string,
      emailData
    );
  } catch (error) {
    console.log("line 86 error_", { email, name, fromEmail });
    console.error("Error_sending_email:", error);
  }
};
