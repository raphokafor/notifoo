import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const {
      propertyType,
      buildingCount,
      unitCount,
      currentSolution,
      primaryConcern,
      planType,
    } = data;

    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    console.log("line 31::::::::", {
      propertyType,
      buildingCount,
      unitCount,
      currentSolution,
      primaryConcern,
      planType,
    });

    // create a new audit log to track the onboarding info
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "onboarding",
        formType: "onboarding_form",
        changes: {
          propertyType,
          buildingCount,
          unitCount,
          currentSolution,
          primaryConcern,
          planType,
        },
      },
    });

    // create a new stripe session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: "price_1QZ002FZ0000000000000000", quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?onboarding=true&&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?onboarding=true&&success=false`,
      metadata: {
        userId: user.id,
        propertyType,
        buildingCount,
        unitCount,
        currentSolution,
        primaryConcern,
        planType,
        type: "onboarding",
      },
    });

    // return NextResponse.json({ url: accountLink.url ?? "" }, { status: 200 });
    return NextResponse.json(
      { url: "https://dashboard.stripe.com/onboarding" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Free trial creation error:", error);
    return NextResponse.json(
      { error: "Unable to start free trial" },
      { status: 500 }
    );
  }
}
