// Example usage in your callback route

import { auth, handleSuccessfulLogin } from "@/lib/auth";

// app/api/auth/callback/[provider]/route.js
export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const response = await auth.handler(request);

    // If successful (redirect response), track the login
    if (response.status === 302) {
      await handleSuccessfulLogin(request);
    }

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return new Response("Authentication error", { status: 500 });
  }
}
