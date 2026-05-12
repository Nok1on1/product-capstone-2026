import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ka"];
const defaultLocale = "en";

// Routes that don't require email verification
const publicRoutes = ["/login", "/signup", "/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude static files and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next).*)',
  ],
};
