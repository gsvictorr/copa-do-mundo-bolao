import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { serialize } from "cookie";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Usuário não autenticado." }, { status: 401 });
  }

  try {
    const decodedToken = await verifyIdToken(token);

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
      },
    });
  } catch (error) {
      const cookie = serialize("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
    
    return NextResponse.json({ success: false, error: "Token inválido ou expirou." },     {
      status: 401,
      headers: { "Set-Cookie": cookie },
    });
  }
}