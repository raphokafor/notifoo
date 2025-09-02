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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return user;
}
