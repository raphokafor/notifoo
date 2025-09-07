import { createAuthClient } from "better-auth/react";
import Analytics from "@vercel/analytics";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  // Enable React 19 features
  fetchOptions: {
    onError: (context) => {
      console.error("Auth error:", context);
      // Optional: Add toast notification here
    },
    onSuccess: (context) => {
      console.log("Auth success:", context);
      // add vercel analytics
      // Analytics.track("auth_success", {
      //   userId: context?.session?.user?.id,
      //   email: context?.session?.user?.email,
      //   name: context?.session?.user?.name,
      // });
    },
  },
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;

// Consistent type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
