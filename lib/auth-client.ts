import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Enable React 19 features
  fetchOptions: {
    onError: (context) => {
      console.error("Auth error:", context);
      // Optional: Add toast notification here
    },
    onSuccess: (context) => {
      console.log("Auth success:", context);
    },
  },
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;

// Consistent type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
