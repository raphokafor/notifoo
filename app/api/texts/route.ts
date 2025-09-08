import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTwilioTextMessage } from "@/lib/twilio";
import { createReminderHook } from "@/app/actions/reminder-actions";
import { TimerData } from "@/types/database";
import OpenAI from "openai";
import twilio from "twilio";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Twilio client for webhook validation
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    // Get the Twilio signature from headers
    const twilioSignature = req.headers.get("X-Twilio-Signature");
    if (!twilioSignature) {
      console.error("Missing Twilio signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the raw body for validation
    const formData = await req.formData();
    const url = req.url;

    // Convert FormData to object for validation
    const bodyObject: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      bodyObject[key] = value.toString();
    }

    // Validate the request came from Twilio
    const isValidRequest = twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN!,
      twilioSignature,
      url,
      bodyObject
    );

    if (!isValidRequest) {
      console.error("Invalid Twilio webhook signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Now extract the validated data
    const fromPhoneNumber = formData.get("From") as string;
    const messageBody = formData.get("Body") as string;

    console.log("Received SMS from:", fromPhoneNumber, "Message:", messageBody);

    // Validate required fields
    if (!fromPhoneNumber || !messageBody) {
      console.error("Missing required fields from Twilio webhook");
      return new Response(createTwiMLResponse(""), {
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Look up user by phone number
    const user = await getUserByPhoneNumber(fromPhoneNumber);

    console.log("line 69, got the user from the phone number", user);

    if (!user) {
      console.log("User not found for phone number:", fromPhoneNumber);
      // Return empty response - no user found
      return new Response(createTwiMLResponse(""), {
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Check subscription status
    // TODO: get subscription status from stripe
    if (user?.subscriptionStatus !== "active") {
      console.log(
        "line 82, user subscription status is not active",
        user?.subscriptionStatus
      );
      const inactiveMessage =
        "Your subscription is not active. Please visit https://www.notifoo.io/billing to activate your subscription and start setting reminders.";
      return new Response(createTwiMLResponse(inactiveMessage), {
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Sanitize the incoming text
    const sanitizedText = sanitizeText(messageBody);

    console.log("line 96, sanitized text", sanitizedText);

    if (!sanitizedText) {
      console.log("line 99, sanitized text is empty");
      return new Response(
        createTwiMLResponse(
          "I received your message but it appears to be empty. Please send a clear reminder request."
        ),
        {
          headers: { "Content-Type": "application/xml" },
        }
      );
    }

    console.log("line 109, right before llm: ", sanitizedText);

    // Process text with LLM
    const llmResult = await processTextWithLLM(sanitizedText);

    console.log("line 115, llm result", llmResult);

    // Handle profanity
    if (llmResult.containsProfanity) {
      console.log("line 119, contains profanity");
      return new Response(
        createTwiMLResponse(
          "Please keep your messages appropriate. I'm here to help you set reminders!"
        ),
        {
          headers: { "Content-Type": "application/xml" },
        }
      );
    }

    console.log("line 129, needs clarification?", llmResult?.confidence);

    // Handle cases where clarification is needed
    if (
      llmResult.needsClarification ||
      !llmResult.isReminderRequest ||
      llmResult.confidence < 0.8
    ) {
      const clarificationMsg =
        llmResult.clarificationMessage ||
        "I'm not sure if you want to set a reminder. Please be more specific about what you'd like to be reminded of and when.";
      return new Response(createTwiMLResponse(clarificationMsg), {
        headers: { "Content-Type": "application/xml" },
      });
    }

    console.log("line 146, is reminder request?", llmResult?.isReminderRequest);

    // Process reminder request
    if (llmResult.isReminderRequest && llmResult.reminderName) {
      console.log(
        "line 150, is reminder request and reminder name, starting the process",
        llmResult?.reminderName
      );
      // Parse the suggested date/time or default to asking for clarification
      let dueDate: Date | null = null;

      if (llmResult.suggestedDateTime) {
        console.log(
          "line 156, suggested date time",
          llmResult.suggestedDateTime
        );
        try {
          dueDate = new Date(llmResult.suggestedDateTime);
          // Validate the date is in the future
          if (dueDate <= new Date()) {
            dueDate = null;
          }
        } catch (error) {
          dueDate = null;
        }
      }

      if (!dueDate) {
        console.log("line 168, no due date");
        return new Response(
          createTwiMLResponse(
            `I understand you want to be reminded about "${llmResult.reminderName}", but I need to know when. Please specify a date and time for your reminder.`
          ),
          {
            headers: { "Content-Type": "application/xml" },
          }
        );
      }

      // Create the reminder
      const reminderData: TimerData & { user: typeof user } = {
        name: llmResult.reminderName,
        description: llmResult.description || "",
        dueDate: dueDate,
        type: "till",
        emailNotification: true,
        smsNotification: true,
        callNotification: false,
        recurringNotification: false,
        user: user,
      };

      console.log("line 192, reminder data", reminderData);

      //   const result = await createReminderHook(reminderData);
      //   console.log("line 197, result from createReminderHook", result);
      // TODO: uncomment this

      const tempTrue = true;

      if (tempTrue) {
        const confirmationMessage = `✅ Reminder set successfully!\n\n📝 What: ${llmResult.reminderName}\n⏰ When: ${dueDate.toLocaleString()}\n\nI'll send you a notification when it's time!`;
        return new Response(createTwiMLResponse(confirmationMessage), {
          headers: { "Content-Type": "application/xml" },
        });
      } else {
        return new Response(
          createTwiMLResponse(
            "Sorry, I encountered an error while setting your reminder. Please try again or contact support."
          ),
          {
            headers: { "Content-Type": "application/xml" },
          }
        );
      }
    }

    // Default response if we reach here
    return new Response(
      createTwiMLResponse(
        "I'm here to help you set reminders! Just tell me what you'd like to be reminded of and when."
      ),
      {
        headers: { "Content-Type": "application/xml" },
      }
    );
  } catch (error) {
    console.error("Error processing SMS webhook:", error);
    return new Response(
      createTwiMLResponse(
        "I'm experiencing technical difficulties. Please try again later."
      ),
      {
        headers: { "Content-Type": "application/xml" },
      }
    );
  }
}

// Function to lookup user by phone number
async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        phone: phoneNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        subscriptionStatus: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error looking up user by phone:", error);
    return null;
  }
}

// Function to sanitize text input
function sanitizeText(text: string): string {
  // Remove excessive whitespace and normalize
  return text.trim().replace(/\s+/g, " ").substring(0, 1000); // Limit to 1000 chars
}

// Function to process text with LLM
async function processTextWithLLM(text: string) {
  try {
    console.log("line 261, processing text with llm: ", text);
    const prompt = `You are a helpful assistant that determines if a text message is requesting a reminder to be set.

Guidelines:
- Only respond with JSON format
- Be conservative - if you're not 100% sure it's a reminder request, set isReminderRequest to false
- Filter out profanity and inappropriate content
- Look for clear intent to remember something for the future
- Extract specific details about WHAT to remember and WHEN

User message: "${text}"

Respond with JSON in this exact format:
{
  "isReminderRequest": boolean,
  "confidence": number (0-1),
  "reminderName": string or null,
  "description": string or null,
  "suggestedDateTime": string or null (ISO format if found),
  "needsClarification": boolean,
  "clarificationMessage": string or null,
  "containsProfanity": boolean
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    console.log("line 292, response from llm: ", response);

    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      console.log("line 296, no response from llm");
      throw new Error("No response from LLM");
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error processing with LLM:", error);
    return {
      isReminderRequest: false,
      confidence: 0,
      reminderName: null,
      description: null,
      suggestedDateTime: null,
      needsClarification: true,
      clarificationMessage:
        "I'm having trouble understanding your message. Could you please rephrase your reminder request?",
      containsProfanity: false,
    };
  }
}

// Function to create TwiML response
function createTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`;
}
