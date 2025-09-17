import { createAuthClient } from "better-auth/react";
import Analytics from "@vercel/analytics";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  // Enable React 19 features
  fetchOptions: {
    onError: (context: any) => {
      // console.error("Auth error:", context);
      // Optional: Add toast notification here
      Analytics.track("auth_error", {
        sessionError: context?.error,
        userId: context?.user?.id,
        email: context?.user?.email,
        name: context?.user?.name,
        ipAddress: context?.session?.ipAddress,
        userAgent: context?.session?.userAgent,
        userCreated: context?.user?.createdAt,
        userRole: context?.user?.role,
      });
    },
    onSuccess: (context: any) => {
      // console.log("Auth success:", context);
      // add vercel analytics
      Analytics.track("auth_success", {
        userId: context?.user?.id,
        email: context?.user?.email,
        name: context?.user?.name,
        ipAddress: context?.session?.ipAddress,
        userAgent: context?.session?.userAgent,
        userCreated: context?.user?.createdAt,
        userRole: context?.user?.role,
      });
    },
  },
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;

// Consistent type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
