// /api/verificar-pontuacao/route.ts
import { db } from "@/lib/firebase";
import {
    collection, query, where, getDocs,
    doc, setDoc, serverTimestamp
} from "firebase/firestore";
import { NextResponse } from "next/server";

// Regras de pontuação:
// Acertou resultado exato → 5 pts
// Acertou vencedor/empate → 1 pt
// Errou → 0 pts
function calcularPontos(
    pHome: number, pAway: number,   // palpite
    rHome: number, rAway: number    // resultado real
): number {
    if (pHome === rHome && pAway === rAway) return 5;
    const pWinner = pHome > pAway ? "home" : pHome < pAway ? "away" : "draw";
    const rWinner = rHome > rAway ? "home" : rHome < rAway ? "away" : "draw";
    if (pWinner === rWinner) return 1;
    return 0;
}

export async function GET() {
    try {
        // 1. Busca todos os palpites
        const palpitesSnap = await getDocs(collection(db, "palpites"));
        const palpites = palpitesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        // 2. Busca jogos de hoje da football-data
        const res = await fetch(
            "https://api.football-data.org/v4/competitions/WC/matches",
            { headers: { "X-Auth-Token": process.env.API_FUTEBOL_TOKEN! } }
        );
        const { matches } = await res.json();

        const hoje = new Date();

        const jogosHoje = matches.filter((match: any) => {
            const dataJogo = new Date(match.utcDate);

            return (
                dataJogo.toLocaleDateString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                }) ===
                hoje.toLocaleDateString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                })
            );
        });

        // Apenas partidas encerradas
        const encerradas = jogosHoje.filter((m: any) => m.status === "FINISHED");
        const mapaJogos: Record<string, any> = {};
        encerradas.forEach((m: any) => { mapaJogos[String(m.id)] = m; });

        // 3. Para cada palpite, calcula pontos e salva em /pontuacao/{criadoPor}_{idPartida}
        const promises = palpites
            .filter((p: any) => mapaJogos[p.idPartida])
            .map(async (p: any) => {
                const jogo = mapaJogos[p.idPartida];
                const pontos = calcularPontos(
                    p.resultado1, p.resultado2,
                    jogo.score.fullTime.home, jogo.score.fullTime.away
                );

                const docId = `${p.criadoPorId}_${p.idPartida}`;
                await setDoc(doc(db, "pontuacao", docId), {
                    criadoPorId: p.criadoPorId,
                    criadoPorNome: p.criadoPorNome,
                    idPartida: p.idPartida,
                    palpite: { home: p.resultado1, away: p.resultado2 },
                    resultado: { home: jogo.score.fullTime.home, away: jogo.score.fullTime.away },
                    pontos,
                    atualizadoEm: serverTimestamp(),
                });
            });

        await Promise.all(promises);

        return NextResponse.json({ success: true, processados: promises.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}