import { type NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes to redirect authenticated users away from
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  // Note: In a production app, you'd verify the Firebase token here
  // For now, this is a placeholder middleware
  // Firebase auth is handled client-side, so we just allow navigation
  
  return NextResponse.next();
}

// Only run middleware on specified routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
