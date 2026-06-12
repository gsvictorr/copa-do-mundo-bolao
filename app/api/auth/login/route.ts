import { auth } from "@/lib/firebase";
import { translateError } from "@/lib/translateErrorsFirebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const cookie = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
      path: "/", 
      maxAge: 60 * 60 * 2,
    });

    return new NextResponse(JSON.stringify(
      {
        success: true,
        message: "Login realizado com sucesso!",
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        },
      }),
      { status: 200, headers: { "Set-Cookie": cookie } }
    );

  } catch (error: any) {
    return NextResponse.json({ success: false, error: translateError(error.code) }, { status: 400 });
  }
}