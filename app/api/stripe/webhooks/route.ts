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

    if (customerEmail && priceId) {
      let plan = "basic";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID)
        plan = "standard";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID)
        plan = "premium";

      // Update user in DB
      //   await prisma.user.update({
      //     where: { email: customerEmail },
      //     data: { plan },
      //   });
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
