import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  applyMiddlewareSecurity,
  applySecurityHeaders,
  applyCORSHeaders,
  rateLimitByIP,
  generateCSRFToken,
  setCSRFCookie,
  logSecurityEvent,
  RATE_LIMITS,
} from "@/lib/security";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============= SECURITY CHECKS =============

  // Apply security checks (block suspicious requests)
  const securityBlock = applyMiddlewareSecurity(request);
  if (securityBlock) {
    return securityBlock;
  }

  // ============= RATE LIMITING =============

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    const limit = rateLimitByIP(request, {
      maxRequests: pathname.includes("/auth/")
        ? RATE_LIMITS.auth.maxRequests
        : pathname.includes("/checkout")
        ? RATE_LIMITS.checkout.maxRequests
        : RATE_LIMITS.api.maxRequests,
      windowMs: pathname.includes("/auth/")
        ? RATE_LIMITS.auth.windowMs
        : pathname.includes("/checkout")
        ? RATE_LIMITS.checkout.windowMs
        : RATE_LIMITS.api.windowMs,
    });

    if (!limit.allowed) {
      logSecurityEvent({
        level: "warn",
        type: "rate_limit",
        message: `Rate limit exceeded for ${request.nextUrl.pathname}`,
        ip: request.headers.get("x-forwarded-for") || "unknown",
        path: pathname,
        method: request.method,
      });

      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(limit.resetAt / 1000).toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // ============= ADMIN PROTECTION =============

  // Protected routes
  const protectedPaths = ["/account", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // ============= CORS =============

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    applyCORSHeaders(request, response);
    return response;
  }

  // ============= CSRF TOKEN =============

  // Set CSRF token cookie for page requests
  const response = NextResponse.next();

  if (request.method === "GET" && !pathname.startsWith("/api/")) {
    const csrfToken = generateCSRFToken();
    setCSRFCookie(response, csrfToken);
  }

  // ============= SECURITY HEADERS =============

  applySecurityHeaders(response);
  applyCORSHeaders(request, response);

  // Add request ID
  const requestId = crypto.randomUUID();
  response.headers.set("x-request-id", requestId);

  // Rate limit headers
  if (pathname.startsWith("/api/")) {
    const limit = rateLimitByIP(request);
    response.headers.set("X-RateLimit-Remaining", limit.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(limit.resetAt / 1000).toString());
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
