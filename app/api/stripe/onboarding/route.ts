import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      phoneNumber,
      reminderType,
      notificationPreference,
      forgetfulness,
      hearAbout,
      isMonthly = true,
    } = await req.json();

    // get user
    const user_ = await getCurrentUser();
    const user = await prisma.user.update({
      where: { id: user_?.id as string },
      data: {
        status: "pending",
        hasOnboarded: true,
      },
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

    try {
      // fire and forget onboarding data
      await prisma.onboarding.upsert({
        where: { id: user_?.id as string },
        update: {
          isCompleted: true,
          reminderType,
          notificationPreference,
          forgetfulness,
          hearAbout,
          name: "none atm",
        },
        create: {
          userId: user_?.id as string,
          isCompleted: true,
          reminderType,
          name: "none atm",
          notificationPreference,
          forgetfulness,
          hearAbout,
        },
      });
    } catch (error) {
      console.error("Error creating onboarding user:", error);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/billing?plan=${priceId}`,
      cancel_url: `${req.nextUrl.origin}/onboarding`,
      customer_email: user?.email as string,
      metadata: {
        plan_type: "starter",
        user_id: user_?.id as string,
        priceId,
        name: "none atm",
        reminderType,
        notificationPreference,
        forgetfulness,
        hearAbout,
        subscriptionPeriod: isMonthly ? "monthly" : "yearly",
        userId: user_?.id as string,
        type: "onboarding",
      },

      // Optional: Trial period (if supported by your price)
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan_type: "starter",
          user_id: user_?.id as string,
          priceId,
          name: "none atm",
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
