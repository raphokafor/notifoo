import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { addToResendContactList, sendEmail } from "./resend";
import WelcomeEmailTemplate from "@/templates/welcome/welcome-email-template";

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
        `Login logged: ${session.user.email} via ${socialAccount?.providerId}`
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
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    session: {
      create: {
        // Runs after a session is created => on every successful login
        after: async (session, ctx) => {
          try {
            await prisma.login.create({
              data: {
                userId: session.userId,
                sessionId: session.id,
                ipAddress: getClientIP(ctx?.request as Request),
                userAgent:
                  ctx?.request?.headers?.get("user-agent") ?? undefined,
              },
            });
          } catch (e) {
            console.error("Failed to record login event", e);
          }
        },
      },
    },
    user: {
      create: {
        // Runs after a user record is created (email/password OR OAuth)
        after: async (user) => {
          // idempotent guard if you want (e.g., check a "welcomed" flag)
          try {
            console.log("line 97, user created", user);
            if (!user?.email) {
              console.log("line 99, user has no email");
              return;
            }

            // Optionally mark welcomed=true in your own users table/extra column
            await prisma.user.update({
              where: { id: user?.id as string },
              data: { welcomeEmailSent: true },
            });

            // generate welcome email template
            const welcomeEmailTemplate = WelcomeEmailTemplate({
              appUrl: "https://www.notifoo.io/dashboard",
            });
            // send welcome email
            await sendEmail({
              from: "Notifoo <ralph@notifications.notifoo.io>",
              to: user?.email as string,
              subject: "Welcome aboard 👋",
              body: welcomeEmailTemplate,
              textBody: `<p>Hey ${user?.name ?? "there"}, welcome to Notifoo!</p>`,
            });

            // add to resend contact list
            await addToResendContactList({
              email: user?.email as string,
              name: user?.name as string,
            });
          } catch (err) {
            console.error("Welcome email failed", err);
          }
        },
      },
    },
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
