import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // get user
    const user_ = await getCurrentUser();
    const user = await prisma.user.findUnique({
      where: { id: user_?.id as string },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // declare price id
    let priceId = process.env
      .NEXT_PUBLIC_MONTHLY_STRIPE_STARTER_PRICE_ID as string;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/billing?plan=${priceId}`,
      cancel_url: `${req.nextUrl.origin}/billing`,
      customer_email: user?.email as string,
      metadata: {
        plan_type: "starter",
        user_id: user_?.id as string,
        priceId,
        userId: user_?.id as string,
        type: "checkout",
      },

      // Optional: Trial period (if supported by your price)
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan_type: "starter",
          user_id: user_?.id as string,
          priceId,
          userId: user_?.id as string,
          type: "checkout",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
