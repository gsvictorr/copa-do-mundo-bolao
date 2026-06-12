// /services/pontuacao.ts
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface EntradaPontuacao {
  criadoPorId: string;
  criadoPorNome: string;
  pontos: number;
  acertos: number;       // placar exato (3 pts)
  parciais: number;      // acertou vencedor (1 pt)
  totalPalpites: number;
}

export const getRanking = async (): Promise<EntradaPontuacao[]> => {
  const snap = await getDocs(collection(db, "pontuacao"));

  const mapa: Record<string, EntradaPontuacao> = {};

  snap.docs.forEach(doc => {
    const d = doc.data() as any;
    const user = d.criadoPorId;
    const userName = d.criadoPorNome;

    if (!mapa[user]) {
      mapa[user] = { criadoPorId: user, criadoPorNome: userName, pontos: 0, acertos: 0, parciais: 0, totalPalpites: 0 };
    }

    mapa[user].pontos += d.pontos ?? 0;
    mapa[user].totalPalpites += 1;
    if (d.pontos === 5) mapa[user].acertos += 1;
    if (d.pontos === 1) mapa[user].parciais += 1;
  });

  return Object.values(mapa).sort((a, b) => b.pontos - a.pontos);
};