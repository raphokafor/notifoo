import { getCurrentUser } from "@/lib/db-actions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user_ = await getCurrentUser();
    const user = await prisma.user.findUnique({
      where: { id: user_?.id as string },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user?.id;

    // try to delete the account for user
    try {
      const userAcct = await prisma.account.findFirst({
        where: { userId },
      });

      if (userAcct) {
        await prisma.account.delete({
          where: { id: userAcct.id },
        });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    // delete activities
    await prisma.activity.deleteMany({
      where: { userId },
    });

    // delete reminders if any
    await prisma.reminder.deleteMany({
      where: { userId },
    });

    // delete logins
    await prisma.login.deleteMany({
      where: { userId },
    });

    // delete sessions
    await prisma.session.deleteMany({
      where: { userId },
    });

    // delete onboardings
    await prisma.onboarding.deleteMany({
      where: { userId },
    });

    // cancel subscription
    await stripe.subscriptions.cancel(user.subscriptionId as string);

    // delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    // return success
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
