import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.arrayBuffer();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const priceId = session.metadata?.priceId;
    const status = session.status;

    console.log("line 35, session", session);

    if (customerEmail && priceId) {
      try {
        await prisma.user.update({
          where: { email: customerEmail },
          data: { subscriptionStatus: status },
        });

        await prisma.subscription.create({
          data: {
            userId: customerEmail,
            subscriptionStatus: status,
            subscriptionPlan: priceId,
          },
        });
      } catch (error) {
        console.error("line 39, error updating user", error);
      }
    }
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerEmail = subscription.customer as string;
    const priceId = subscription.items.data[0].price.id;
    const status = subscription.status;

    console.log("line 61, subscription", subscription);
  }

  if (event.type === "customer.updated") {
    const customer = event.data.object as Stripe.Customer;
    const customerEmail = customer.email;
    const status = customer.subscriptions?.data[0].status;

    console.log("line 69, customer", customer);
  }

  console.log("line 57, webhook received", event.type);

  return new NextResponse("Webhook received", { status: 200 });
}
