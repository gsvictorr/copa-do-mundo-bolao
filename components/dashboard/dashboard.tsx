// dashboard-card.tsx
"use client";

import { useEffect, useState } from "react";
import { getJogosHistorico, getJogosHoje } from "@/services/partidas";
import { getPalpitesByUser } from "@/services/palpites";
import PartidaCard from "./partida-card";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";


export default function DashboardCard() {
    const [jogos, setJogos] = useState<any[]>([]);
    const [palpitesMap, setPalpitesMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<string>("HOJE");

    const user = useAuth();


    useEffect(() => {
        if (user) {
            setUserId(user.user?.uid!)
        }
    }, [user])

    useEffect(() => {
        if (userId) carregarJogosHoje();

    }, [userId]);


    useEffect(() => {
        // Verifica pontuação ao carregar e a cada 5 minutos
        fetch("/api/verificar-pontuacao");
        const interval = setInterval(() => {
            fetch("/api/verificar-pontuacao");
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    async function carregarJogosHoje() {
        try {
            const [response, palpites] = await Promise.all([
                getJogosHoje(),
                getPalpitesByUser(userId!),
            ]);
            setJogos(response);

            // Transforma array em mapa: idPartida -> palpite
            const mapa: Record<string, any> = {};
            palpites.forEach((p: any) => {
                mapa[p.idPartida] = p;
            });
            setPalpitesMap(mapa);
        } finally {
            setLoading(false);
        }
    }


    async function carregarHistoricoJogos() {
        try {
            const [response, palpites] = await Promise.all([
                getJogosHistorico(),
                getPalpitesByUser(userId!),
            ]);
            setJogos(response);

            // Transforma array em mapa: idPartida -> palpite
            const mapa: Record<string, any> = {};
            palpites.forEach((p: any) => {
                mapa[p.idPartida] = p;
            });
            setPalpitesMap(mapa);
        } finally {
            setLoading(false);
        }
    }

    const carregarDados = (tipo: string) => {
        setSelecionado(tipo);
        setLoading(true)
        if(tipo === "HOJE"){
            carregarJogosHoje();
        } else {
            carregarHistoricoJogos();
        }
    }

    function handlePalpiteSalvo(idPartida: string, r1: number, r2: number) {
        setPalpitesMap(prev => ({
            ...prev,
            [idPartida]: { resultado1: r1, resultado2: r2},
        }));
    }
    return (
        <>
            {loading ?

                <div className="flex flex-col gap-2">
                    <Skeleton className="h-[200px] flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </Skeleton>

                    <Skeleton className="h-[200px]  flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </Skeleton>
                </div> :

                <div className="flex flex-col gap-5">

                    <div className="flex items-center gap-2">
                        <Button onClick={() => carregarDados("HOJE")} variant={"outline"} className={`${selecionado === "HOJE" ? "bg-green-500 dark:bg-green-600 text-white" : ""} hover:bg-green-600 dark:hover:bg-green-500 dark:hover:text-white hover:text-white cursor-pointer`}>
                            Jogos de hoje
                        </Button>

                        <Button onClick={() => carregarDados("TODOS")} variant={"outline"} className={`${selecionado === "TODOS" ? "bg-green-500 dark:bg-green-600 text-white" : ""} hover:bg-green-600 dark:hover:bg-green-500 dark:hover:text-white hover:text-white cursor-pointer`}>
                            Todos os jogos
                        </Button>

                    </div>

                    <h3 className="text-lg font-bold text-zinc-600 dark:text-zinc-200 my-1">{selecionado === "HOJE" ? "Jogos de hoje" : "Todos os jogos"}</h3>

                    {jogos.map((jogo: any) => (
                        <PartidaCard
                            key={jogo.id}
                            partida={jogo}
                            userName={user.user?.displayName || ""}
                            palpite={palpitesMap[String(jogo.id)] ?? null}
                            userId={user.user?.uid || ""}
                            onPalpiteSalvo={handlePalpiteSalvo}
                        />
                    ))}

                </div>
            }
        </>
    );
}