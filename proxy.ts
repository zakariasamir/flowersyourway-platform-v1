import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  console.log({ token });

  // Protected routes
  const adminRoutes = ["/admin"];
  const authRoutes = ["/auth/login", "/auth/register"];

  // If user is trying to access admin routes without token, redirect to login
  if (adminRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is logged in and tries to access auth routes, redirect to home
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/account/:path*"],
};
