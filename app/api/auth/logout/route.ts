import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return new NextResponse(
    JSON.stringify({ success: true, message: "Logout realizado com sucesso!" }),
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
}