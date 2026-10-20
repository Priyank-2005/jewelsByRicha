import { NextResponse, type NextRequest } from "next/server";
import { unsealData } from "iron-session";

/**
 * Fast first line of defence: sends visitors without a valid session away from /admin and /account, and rejects
 * unauthenticated /api/admin calls. Every route handler ALSO re-checks the session and role against the database.
 */
const SECRET = process.env.SESSION_SECRET || "dev-only-session-secret-change-me-32chars!!";

async function hasSession(req: NextRequest, cookie: string, role?: string) {
  const raw = req.cookies.get(cookie)?.value;
  if (!raw) return false;
  try {
    const data = await unsealData<{ userId?: string; role?: string }>(raw, { password: SECRET });
    return !!data.userId && (!role || data.role === role);
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login") return NextResponse.next();
    if (!(await hasSession(req, "jbr_admin", "ADMIN"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!(await hasSession(req, "jbr_admin", "ADMIN"))) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/account")) {
    if (!(await hasSession(req, "jbr_session"))) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*"] };
