import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "aasoo-admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // protect everything else under /admin
  if (pathname.startsWith("/admin")) {
    const authed = request.cookies.get(ADMIN_COOKIE)?.value === "1";
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
