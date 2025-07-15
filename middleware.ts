import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth-edge"; // ✅ safe version

export async function middleware(req: NextRequest) {
  const session = await auth(req);

  const isLoggedIn = !!session;

  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
