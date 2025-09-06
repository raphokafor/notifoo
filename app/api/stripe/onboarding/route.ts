import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
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
      isMonthly = true,
    } = await req.json();

    console.log("linr 17 ", name);
    console.log("linr 20, reminderType", reminderType);
    console.log("linr 21, notificationPreference", notificationPreference);
    console.log("linr 22, forgetfulness", forgetfulness);
    console.log("linr 23, hearAbout", hearAbout);
    console.log("linr 24, isMonthly", isMonthly);

    // get user
    const user_ = await getCurrentUser();
    const user = await prisma.user.findUnique({
      where: { id: user_?.id as string },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // declare price id
    let priceId = "";
    if (isMonthly) {
      priceId = process.env
        .NEXT_PUBLIC_MONTHLY_STRIPE_STARTER_PRICE_ID as string;
    } else {
      priceId = process.env
        .NEXT_PUBLIC_YEARLY_STRIPE_STARTER_PRICE_ID as string;
    }

    // update onboarding status
    await prisma.onboarding.upsert({
      where: { id: user_?.id as string },
      update: {
        isCompleted: true,
        name,
        reminderType,
        notificationPreference,
        forgetfulness,
        hearAbout,
      },
      create: {
        userId: user_?.id as string,
        isCompleted: true,
        name,
        reminderType,
        notificationPreference,
        forgetfulness,
        hearAbout,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/billing?plan=${priceId}`,
      cancel_url: `${req.nextUrl.origin}/onboarding`,
      customer_email: user?.email as string,

      // Optional: Trial period (if supported by your price)
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan_type: "starter",
          user_id: user_?.id as string,
          priceId,
          name,
          reminderType,
          notificationPreference,
          forgetfulness,
          hearAbout,
          subscriptionPeriod: isMonthly ? "monthly" : "yearly",
          userId: user_?.id as string,
          type: "onboarding",
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
