// app/api/checkout/route.ts
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      reminderType,
      notificationPreference,
      forgetfulness,
      hearAbout,
      isMonthly,
      userId,
      email,
    } = await req.json();

    // declare price id
    let priceId = "";
    if (isMonthly) {
      priceId = process.env
        .NEXT_PUBLIC_MONTHLY_STRIPE_STARTER_PRICE_ID as string;
    } else {
      priceId = process.env
        .NEXT_PUBLIC_YEARLY_STRIPE_STARTER_PRICE_ID as string;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/billing?plan=${priceId}`,
      cancel_url: `${req.nextUrl.origin}/onboarding`,
      customer_email: email,
      metadata: {
        name,
        reminderType,
        notificationPreference,
        forgetfulness,
        hearAbout,
        subscriptionPeriod: isMonthly ? "monthly" : "yearly",
        userId,
        type: "onboarding",
      },

      // Optional: Trial period (if supported by your price)
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan_type: "premium",
          user_id: userId,
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
