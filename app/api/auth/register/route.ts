import { auth } from "@/lib/firebase";
import { translateError } from "@/lib/translateErrorsFirebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Criar usuário no Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Atualizar nome do usuário
    await updateProfile(userCredential.user, { displayName: name });

    return NextResponse.json({ success: true, message: "Usuário registrado com sucesso!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: translateError(error.code) }, { status: 400 });
  }
}