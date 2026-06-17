import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Both entries are required: ":path*" does not match the bare "/admin/dashboard".
  matcher: ["/admin/dashboard", "/admin/dashboard/:path*"],
};
