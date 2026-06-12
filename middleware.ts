import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/perfil", "/configuracoes"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard",],
};