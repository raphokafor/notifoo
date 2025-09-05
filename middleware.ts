import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, type User } from "./lib/auth";

const publicRoutes = ["/", "/login", "/signup", "/landing"];
const adminRoutes = ["/admin"];
const supervisorRoutes = ["/reports", "/audit-logs"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = session.user as User;

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Role-based access control
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (supervisorRoutes.some((route) => pathname.startsWith(route))) {
      if (!["ADMIN", "SUPERVISOR"].includes(user.role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Check read-only access for non-GET requests
    if (user.role === "READONLY" && request.method !== "GET") {
      return NextResponse.json(
        { error: "Read-only access - modifications not allowed" },
        { status: 403 }
      );
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  } catch (error) {
    console.error("Middleware auth error:", error);
    // Redirect to login on auth errors
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
  // Remove the runtime specification to let Next.js choose
};
