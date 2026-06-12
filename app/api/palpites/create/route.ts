// /api/palpites/create/route.ts
import { db } from "@/lib/firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // use JSON, não formData
        const { criadoPorId, criadoPorNome, idPartida, resultado1, resultado2 } = body;

        // Evita duplicata: verifica se já existe palpite pra essa partida
        const q = query(
            collection(db, "palpites"),
            where("criadoPorId", "==", criadoPorId),
            where("criadoPorNome", "==", criadoPorNome),
            where("idPartida", "==", idPartida)
        );
        const existing = await getDocs(q);
        if (!existing.empty) {
            return NextResponse.json({ success: false, error: "Palpite já registrado." }, { status: 409 });
        }

        await addDoc(collection(db, "palpites"), {
            idPartida,
            resultado1: Number(resultado1),
            resultado2: Number(resultado2),
            criadoPorId,
            criadoPorNome,
            criadoEm: new Date(),
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}