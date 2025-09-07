import { getUser } from "@/lib/db-actions";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "There was an issue, Please login and try again." },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId as string,
      return_url: `${req.nextUrl.origin}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("line 22, stripe manage error", error);
    return NextResponse.json(
      { error: "Failed to manage payment" },
      { status: 500 }
    );
  }
}
