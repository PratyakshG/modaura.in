import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

interface SessionUser {
  isAdmin?: boolean;
}

export async function withAdminAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      const session = await auth();

      if (!session || !session.user) {
        NextResponse.redirect(new URL("/sign-in", req.url));
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const isAdmin = (session.user as SessionUser).isAdmin === true;
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 },
        );
      }

      return handler(req);
    } catch (e) {
      console.error("Admin auth error:", e);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export async function checkAdminAuth() {
  const session = await auth();
  const isAdmin =
    session?.user && (session.user as SessionUser).isAdmin === true;
  return { session, isAdmin };
}
