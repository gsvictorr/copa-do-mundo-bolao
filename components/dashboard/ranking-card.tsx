// components/ranking-card.tsx
"use client";

import { useEffect, useState } from "react";
import { getRanking, EntradaPontuacao } from "@/services/pontuacao";
import { Trophy, Target, Zap, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingCard() {
  const [ranking, setRanking] = useState<EntradaPontuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await getRanking();
      setRanking(data);
      setAtualizadoEm(new Date());
    } finally {
      setLoading(false);
    }
  }

  if (ranking.length === 0) {
    return (
      <div className="border rounded-xl p-6 text-center text-muted-foreground">
        <Trophy className="mx-auto mb-2 opacity-30" size={32} />
        <p>Nenhuma pontuação ainda.</p>
        <p className="text-sm mt-1">Os pontos aparecem após os jogos serem encerrados.</p>
      </div>
    );
  }

  const lider = ranking[0];

  return (
    <div className="border shadow-md rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-yellow-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={22} />
            <h2 className="font-bold text-lg">Ranking</h2>
          </div>
          <Button
            onClick={() => carregar()}
            className="cursor-pointer"
            title="Atualizar"
            disabled={loading}
            variant={"ghost"}

          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
        {atualizadoEm && (
          <p className="text-xs  mt-1">
            Atualizado às {atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>



      {/* Lista */}
      {loading ?
        <div className="flex flex-col">
          <Skeleton className="h-[100px] flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </Skeleton>

          <Skeleton className="h-[100px]  flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </Skeleton>
        </div> :

        <div className="flex flex-col">

          {/* Destaque do líder */}
          <div className="bg-amber-50 dark:bg-amber-500/30 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-bold text-base">{lider.criadoPorNome}</p>
                <p className="text-xs text-muted-foreground">
                  {lider.acertos} placar exato · {lider.parciais} resultado certo
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-amber-500">{lider.pontos}</p>
              <p className="text-xs text-muted-foreground">pontos</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 -mt-6">
            {ranking.map((entrada, index) => {
              const isLider = index === 0;
              const medal = MEDALS[index] ?? null;

              return (
                <div
                  key={entrada.criadoPorId}
                  className={`flex items-center gap-4 px-5 py-3  transition-colors hover:bg-muted/40 ${isLider ? "opacity-0 h-0 overflow-hidden p-0" : ""
                    }`}
                >
                  {/* Posição */}
                  <div className="w-8 text-center">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">
                        {index + 1}º
                      </span>
                    )}
                  </div>

                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{entrada.criadoPorNome}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Target size={11} />
                        {entrada.acertos} exatos
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap size={11} />
                        {entrada.parciais} resultados certos
                      </span>
                    </div>
                  </div>

                  {/* Pontos */}
                  <div className="text-right">
                    <p className="font-black text-lg tabular-nums">{entrada.pontos}</p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      }

      {/* Legenda */}
      <div className="bg-muted/30 px-5 py-3 flex gap-4 text-xs text-muted-foreground border-t">
        <span className="flex items-center gap-1">
          <Target size={11} /> Placar exato = 5 pts
        </span>
        <span className="flex items-center gap-1">
          <Zap size={11} /> Resultado certo = 1 pt
        </span>
      </div>
    </div>
  );
}