import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTwilioTextMessage } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio webhook (not JSON)
    const formData = await request.formData();
    const to = formData.get("To") as string; // The Twilio number being called
    const from = formData.get("From") as string; // The caller's number
    const callSid = formData.get("CallSid") as string;

    console.log("Twilio voice webhook received:", { to, from, callSid });

    if (!to) {
      console.error("No 'To' number provided in webhook");
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Error: Unable to process call.</Say>
          <Hangup/>
        </Response>`,
        {
          status: 200,
          headers: { "Content-Type": "text/xml" },
        }
      );
    }

    // Find the callbox with matching Twilio phone number
    const callBox = await prisma.callBox.findFirst({
      where: {
        twilioPhoneNumber: to,
      },
    });

    if (!callBox) {
      console.error(`No callbox found for Twilio number: ${to}`);
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Callbox not found. Please contact support.</Say>
          <Hangup/>
        </Response>`,
        {
          status: 200,
          headers: { "Content-Type": "text/xml" },
        }
      );
    }

    console.log(`Found callbox: ${callBox.name}, Active: ${callBox.isActive}`);

    if (callBox.isActive) {
      // Callbox is active - dial the buzz code
      console.log(`Dialing buzz code: ${callBox.buzzCode}`);

      // Send success notification SMS asynchronously
      sendTwilioTextMessage(
        callBox.phone,
        `🔔 Gate opened successfully!\n\nCallbox: ${callBox.name}\nBuzz code dialed: ${callBox.buzzCode}\nTime: ${new Date().toLocaleString()}`
      ).catch((error) => {
        console.error("Failed to send success SMS:", error);
      });

      // Return TwiML to dial the buzz code
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial timeout="30">${callBox.buzzCode}</Dial>
        </Response>`,
        {
          status: 200,
          headers: { "Content-Type": "text/xml" },
        }
      );
    } else {
      // Callbox is not active - forward call to the phone number
      console.log(`Forwarding call to: ${callBox.phone}`);

      // Send forwarding notification SMS asynchronously
      sendTwilioTextMessage(
        callBox.phone,
        `📞 Callbox call forwarded!\n\nCallbox: ${callBox.name} is currently INACTIVE.\nIncoming call from: ${from}\nCalls are being forwarded to this number.\n\nTo activate the callbox, please contact support.`
      ).catch((error) => {
        console.error("Failed to send forwarding SMS:", error);
      });

      // Return TwiML to forward the call
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial timeout="30">${callBox.phone}</Dial>
        </Response>`,
        {
          status: 200,
          headers: { "Content-Type": "text/xml" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing Twilio voice webhook:", error);

    // Return error TwiML response
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>We're sorry, there was an error processing your call. Please try again later.</Say>
        <Hangup/>
      </Response>`,
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  return new NextResponse("Hello, world Voice!", { status: 200 });
}
