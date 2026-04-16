import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const authRoutes = ["/auth/login", "/auth/register"];

  // 1. Handle Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (userRole !== "admin") {
      // If logged in but not an admin, send to customer portal
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  // 2. Handle Auth Routes (Login/Register)
  // If already logged in, redirect away from auth pages to appropriate dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  // 3. Handle Account Routes
  if (pathname.startsWith("/customer") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/auth/:path*", 
    "/customer/account/:path*",
    // We don't match /customer/cart as it can be used by guests
  ],
};
