import { sendEmail } from "@/lib/resend";
import { Subscription } from "./../../../../node_modules/.prisma/client/index.d";
import { prisma } from "@/lib/prisma";
import { getSubscriptionWithPaymentMethod, stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SuccessSubscriptionTemplate } from "@/templates/subscription/success";
import { sendTwilioTextMessage } from "@/lib/twilio";

export const runtime = "nodejs"; // ⚠️ Required (webhooks need raw body)
export const dynamic = "force-dynamic"; // Always run on server

export const config = {
  api: {
    bodyParser: false,
  },
};

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// TODO: If you want idempotency across retries, plug in your store here (DB/Redis/etc.)
async function alreadyProcessed(_eventId: string) {
  // TODO: check & store processed event IDs
  return false;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.arrayBuffer();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  //  Checkout session completed - this is entry point for the subscription
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email as string;
    const priceId = session.metadata?.priceId as string;
    const customerId = session.customer as string;
    const paymentStatus = session.payment_status as string;
    const subscriptionId = session.subscription as string;
    const status = paymentStatus === "paid" ? "active" : "pending";

    if (customerEmail && priceId) {
      try {
        // Retrieve the subscription
        const user = await prisma.user.update({
          where: { email: customerEmail },
          data: {
            subscriptionStatus: status,
            status: status,
            stripeCustomerId: customerId,
            subscriptionId: subscriptionId,
          },
        });

        // retrieve the subscription
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.subscription.create({
          data: {
            userId: user?.id,
            subscriptionStatus: status,
            subscriptionPlan: priceId,
            subscriptionId: subscriptionId,
            stripeCustomerId: customerId,
          },
        });

        // if successfully paid send success subscription email
        if (paymentStatus === "paid") {
          // build the body
          const successSubscriptionBody = SuccessSubscriptionTemplate({
            customerName: user?.name,
            appUrl: process.env.NEXT_PUBLIC_APP_URL as string,
          });
          await sendEmail({
            from: "Successful Subscription <welcome@notifoo.io>",
            to: customerEmail,
            subject: "Subscription Success",
            body: successSubscriptionBody,
            textBody: `Congratulations ${user?.name}! You've successfully subscribed and earned your place among the elite ranks of people who actually remember stuff. Go to https://www.notifoo.io to get started.`,
          });

          // try and send text to user about our number, letting them know to add it to their contacts and we will never spam them
          await sendTwilioTextMessage({
            to: user?.phone as string,
            textBody:
              "Thank you for verifying your phone number with Notifoo! As we're your new favorite contact - the one who remembers everything and never asks to borrow your car. Add us and let the remembering begin (spam-free zone, obviously).",
          });
        }
      } catch (error) {
        console.error(
          "line 64, error updating user in checkout session completed",
          error
        );
      }
    }
  }

  // Subscription created - new subscription
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription?.id;
    const customerId = subscription?.customer as string;
    const pmi = subscription?.default_payment_method as string;
    const isMonthly =
      subscription?.items?.data[0]?.price?.recurring?.interval === "month";
    const startDate = subscription?.start_date;
    const subscriptionStatus = subscription?.status;
    const trialEnd = subscription?.trial_end;

    // try to get the subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: { subscriptionId: subscriptionId },
    });
    if (existingSubscription) {
      try {
        // card details
        const cardDetails =
          await getSubscriptionWithPaymentMethod(subscriptionId);
        if (cardDetails) {
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              cardBrand: cardDetails.brand,
              cardExpirationMonth: cardDetails.exp_month,
              cardExpirationYear: cardDetails.exp_year,
              last4Digits: cardDetails.last4,
            },
          });
        }
      } catch (error) {
        console.error("Error updating subscription card details:", error);
      }
    }
  }

  // Subscription updated - existing subscription
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      // get the user
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });

      // update the user's subscription status
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus:
              subscription.status === "active" ||
              subscription.status === "trialing"
                ? "active"
                : "pending",
          },
        });
      }

      console.log("line 109, subscription updated", subscription);
    } catch (error) {
      console.error("Error updating user subscription status:", error);
    }
  }

  // Subscription deleted - cancelled subscription
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    // Revoke access, schedule grace period, etc.

    console.log("line 113, subscription deleted", sub);
  }

  // Invoicing & payments
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email as string;
    const customerName = invoice.customer_name as string;
    const invoiceId = invoice.hosted_invoice_url as string;
    const periodStart = invoice.period_end;
    const periodEnd = invoice.period_end;

    console.log("line 125, invoice payment succeeded");
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;

    console.log("line 135, invoice payment failed", invoice);

    try {
      // TODO: find out what comes with the invoice.payment_failed event
    } catch (error) {
      console.error("Error handling payment failure:", error);
      throw error;
    }
  }

  console.log("line 147, webhook received", event.type);

  return new NextResponse("Webhook received", { status: 200 });
}

// Database update function - Replace with your database logic
const updateUserSubscription = async (data: any) => {
  try {
    // Example query building
    const query: { [key: string]: any } = {};
    if (data.userId) query._id = data.userId;
    if (data.subscriptionId) {
      query.stripeSubscriptionId = data.subscriptionId;
    }

    const updateData: { [key: string]: any } = {
      subscriptionId: data.subscriptionId,
      subscriptionStatus: data.status,
      subscriptionPlan: data.planId,
      subscriptionStartDate: data.currentPeriodStart,
      subscriptionEndDate: data.currentPeriodEnd,
      subscriptionTrialEnd: data.trialEnd,
      subscriptionCancelDate: data.canceledAt,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    console.log("line 136:: Updating user subscription:", updateData);

    // Example Prisma update:
    await prisma.user.upsert({
      where: { id: query.userId },
      update: updateData,
      create: { ...updateData, email: data.email, name: data.name },
    });
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};
