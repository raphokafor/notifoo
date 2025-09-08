"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

// Get current user from session
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

export async function getUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: {
        id: true,
        email: true,
        name: true,
        fooName: true,
        phone: true,
        image: true,
        status: true,
        emailVerified: true,
        welcomeEmailSent: true,
        twilioPhoneNumber: true,
        hasOnboarded: true,
        subscriptionStatus: true,
        role: true,
        isActive: true,
        stripeCustomerId: true,
        subscriptionId: true,
      },
    });

    return user;
  } catch (error) {
    console.error("line 16, Error getting user", error);
    return null;
  }
}
