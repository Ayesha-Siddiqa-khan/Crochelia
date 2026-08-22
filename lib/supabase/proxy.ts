import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

const PUBLIC_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/auth",
  "/api/health",
  "/_next",
  "/favicon.ico",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

function isPublicPath(pathname: string) {
  if (
    pathname === "/" ||
    pathname.startsWith("/discover") ||
    pathname.startsWith("/patterns") ||
    pathname.startsWith("/community")
  ) {
    return true;
  }
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims() verifies the JWT locally (no round trip to the auth server) —
  // the right check for route protection. PROJECT.md §10.4.
  const { data } = await supabase.auth.getClaims();
  const isAuthed = Boolean(data?.claims);

  if (!isAuthed && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && (request.nextUrl.pathname === "/sign-in" || request.nextUrl.pathname === "/sign-up")) {
    // Use the canonical check here, not getClaims(). A JWT can pass local
    // signature verification (isAuthed above) even after the underlying user
    // no longer exists — e.g. deleted, banned. If this redirect trusted that
    // same fast check, it would bounce back to /dashboard, whose layout does
    // the canonical check, finds no real user, and bounces back to /sign-in:
    // an infinite loop with no escape but manually clearing cookies.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
