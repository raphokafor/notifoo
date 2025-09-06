import { sendEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, subject } = await req.json();

    // send email to admin
    await sendEmail({
      from: "Application Contact Form <noreply@notifoo.com>",
      to: process.env.ADMIN_EMAIL as string,
      subject: "Contact form submitted",
      body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nSubject: ${subject}`,
      textBody: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nSubject: ${subject}`,
    });

    return NextResponse.json({
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("line 17, error submitting contact form", error);
    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
