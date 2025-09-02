import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Simple ObjectId-like string generator for edge runtime
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");
  const randomBytes = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");
  return timestamp + randomBytes.slice(0, 16);
}

// Helper function to extract IP address
function getClientIP(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const connectingIP = request.headers.get("x-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (connectingIP) {
    return connectingIP;
  }
  return null;
}

// Manual tracking function to call after successful authentication
export async function handleSuccessfulLogin(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      // Get the most recent social account for this user
      const socialAccount = await prisma.account.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      await prisma.login.create({
        data: {
          userId: session.user.id,
          ipAddress: getClientIP(request),
          userAgent: request?.headers?.get("user-agent"),
          sessionId: session.session.id,
        },
      });

      console.log(
        `Login tracked: ${session.user.email} via ${socialAccount?.providerId}`
      );
      return session;
    }
  } catch (error) {
    console.error("Failed to track login:", error);
  }
  return null;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    // Remove generateSessionToken completely
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
      hasOnboarded: {
        type: "boolean",
        defaultValue: false,
      },
      subscriptionId: {
        type: "string",
        required: false,
      },
      subscriptionStatus: {
        type: "string",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
      },
      subscriptionStartDate: {
        type: "date",
        required: false,
      },
      subscriptionEndDate: {
        type: "date",
        required: false,
      },
      subscriptionRenewalDate: {
        type: "date",
        required: false,
      },
      subscriptionCancelDate: {
        type: "date",
        required: false,
      },
      twilioPhoneNumber: {
        type: "string",
        required: false,
      },
      facilityId: {
        type: "string",
        required: false,
      },
      licenseNumber: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
    },
  },
  advanced: {
    database: {
      generateId: generateObjectId,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
