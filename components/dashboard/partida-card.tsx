// partida-card.tsx
"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Loader2, Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getPalpitesByPartida } from "@/services/palpites";


interface PalpiteOutro {
    id: string;
    criadoPorNome: string;
    resultado1: number;
    resultado2: number;
}

interface Props {
    partida: any;
    palpite?: { resultado1: number; resultado2: number, criadoEm: Date } | null;
    userId: string;
    userName: string;
    onPalpiteSalvo: (idPartida: string, r1: number, r2: number) => void;
}

export default function PartidaCard({ partida, palpite, userId, userName, onPalpiteSalvo }: Props) {
    const [r1, setR1] = useState<string>(palpite?.resultado1?.toString() ?? "");
    const [r2, setR2] = useState<string>(palpite?.resultado2?.toString() ?? "");
    const [criadoEm, setCriadoEm] = useState<Date | null>(
        palpite?.criadoEm
            ? (palpite.criadoEm as any)?.toDate?.() ?? new Date(palpite.criadoEm)
            : null
    );
    const [salvando, setSalvando] = useState(false);
    const [salvo, setSalvo] = useState(!!palpite);

    // Palpites dos outros
    const [palpitesOutros, setPalpitesOutros] = useState<PalpiteOutro[]>([]);
    const [mostrandoOutros, setMostrandoOutros] = useState(false);
    const [carregandoOutros, setCarregandoOutros] = useState(false);

    function getStatus(status: string) {
        switch (status) {
            case "TIMED": return "Não iniciado";
            case "IN_PLAY": return "Ao vivo";
            case "PAUSED": return "Intervalo";
            case "FINISHED": return "Encerrado";
            case "SUSPENDED": return "Suspenso";
            default: return status;
        }
    }

    const data = new Date(partida.utcDate);
    const encerrada = partida.status === "FINISHED";
    const acontecendo = partida.status === "IN_PLAY" || partida.status === "PAUSED"


    async function togglePalpitesOutros() {
        if (mostrandoOutros) {
            setMostrandoOutros(false);
            return;
        }

        setCarregandoOutros(true);
        try {
            const todos = await getPalpitesByPartida(String(partida.id));
            // Filtra o próprio usuário
            const outros = todos.filter((p: any) => p.criadoPorId !== userId) as PalpiteOutro[];
            setPalpitesOutros(outros);
            setMostrandoOutros(true);
        } finally {
            setCarregandoOutros(false);
        }
    }

    async function salvarPalpite() {
        if (!r1 || !r2) return;
        setSalvando(true);
        try {
            const res = await fetch("/api/palpites/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    criadoPorId: userId,
                    criadoPorNome: userName,
                    idPartida: String(partida.id),
                    resultado1: r1,
                    resultado2: r2,
                }),
            });
            if (res.ok) {
                setSalvo(true);
                onPalpiteSalvo(String(partida.id), Number(r1), Number(r2));
            }
        } finally {
            setSalvando(false);
        }
    }


    function getCorPalpite(p1: number, p2: number, status: string, rHome?: number, rAway?: number) {
        // Só avalia se o jogo já tem placar (em andamento ou encerrado)
        if (status !== "IN_PLAY" && status !== "PAUSED" && status !== "FINISHED") {
            return "text-zinc-600 dark:text-zinc-200";
        }
        if (rHome === undefined || rAway === undefined) {
            return "text-zinc-600 dark:text-zinc-200";
        }

        // Placar exato
        if (p1 === rHome && p2 === rAway) {
            return "text-green-500 dark:text-green-600";
        }

        // Resultado certo (vencedor ou empate)
        const palpiteResultado = p1 > p2 ? "home" : p1 < p2 ? "away" : "draw";
        const realResultado = rHome > rAway ? "home" : rHome < rAway ? "away" : "draw";

        if (palpiteResultado === realResultado) {
            return "text-yellow-500 dark:text-yellow-400";
        }

        return "text-zinc-600 dark:text-zinc-200";
    }

    return (
        <div className="border rounded-xl p-5 shadow-md">

            <div className="flex flex-col items-center gap-2">

                <div className="text-center flex justify-center items-center gap-2">
                    <span>
                        {data.toLocaleDateString("pt-BR")} -{" "}
                        {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>

                </div>
                <Badge className={getStatus(partida.status) === "Ao vivo" ? "bg-green-500 dark:bg-green-600 text-white dark:text-white" : ""}>{getStatus(partida.status)}</Badge>

            </div>

            <div className="grid grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                    {partida.homeTeam.crest ? <Image src={partida.homeTeam.crest} width={40} height={40} alt="" /> : <Skeleton className="w-[40px] h-[40px]" />}
                    {partida.homeTeam.name}
                </div>
                <div className="text-center font-bold">x</div>
                <div className="flex justify-end items-center gap-3">
                    {partida.awayTeam.name}
                    {partida.awayTeam.crest ? <Image src={partida.awayTeam.crest} width={40} height={40} alt="" /> : <Skeleton className="w-[40px] h-[40px]" />}

                </div>
            </div>

            <div className="text-center font-bold text-2xl mt-2">
                {encerrada || acontecendo
                    ? `${partida.score.fullTime.home} x ${partida.score.fullTime.away}`
                    : ""}
            </div>

            {/* Área de palpite */}
            <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center text-muted-foreground mb-2">Seu palpite</p>
                {salvo ? (
                    <div className="flex flex-col">
                        <p className={`text-center font-semibold text-xl ${getCorPalpite(
                            Number(r1),
                            Number(r2),
                            partida.status,
                            partida.score?.fullTime?.home,
                            partida.score?.fullTime?.away
                        )}`}>
                            {r1} x {r2}
                        </p>
                        <p className="text-xs text-center text-muted-foreground mt-1">
                            Palpite dado em {criadoEm?.toLocaleDateString("pt-BR")}{" "}
                            às {criadoEm?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                ) :
                    <div className="flex flex-col gap-2">
                        {acontecendo || encerrada ?
                            <p className="text-xs text-center text-muted-foreground">Não é possível dar palpites em partidas em andamento ou encerradas.</p>
                            :
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-center items-center gap-3">

                                    <Input
                                        type="number"
                                        min={0}
                                        value={r1}
                                        disabled={salvando}
                                        onChange={e => setR1(e.target.value)}
                                        className="text-center"
                                        placeholder="0"
                                    />
                                    <span className="font-bold">x</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        disabled={salvando}
                                        value={r2}
                                        onChange={e => setR2(e.target.value)}
                                        className="text-center"
                                        placeholder="0"
                                    />


                                </div>
                                <Button
                                    onClick={salvarPalpite}
                                    disabled={salvando || !r1 || !r2}
                                    size={"lg"}
                                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 dark:text-white"
                                >
                                    {salvando ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Salvando...</span> : "Salvar"}
                                </Button>
                            </div>
                        }
                    </div>


                }
            </div>

            <div className="mt-3 border-t pt-3">
                <button
                    onClick={togglePalpitesOutros}
                    className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    {carregandoOutros
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Users size={14} />}
                    {mostrandoOutros ? "Ocultar palpites" : "Ver palpites dos outros"}
                    {mostrandoOutros ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {mostrandoOutros && (
                    <div className="mt-3 flex flex-col gap-2">
                        {palpitesOutros.length === 0 ? (
                            <p className="text-xs text-center text-muted-foreground">
                                Nenhum outro palpite registrado.
                            </p>
                        ) : (
                            palpitesOutros.map(p => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-2 text-sm"
                                >
                                    <span className="font-medium">{p.criadoPorNome}</span>
                                    <div className="flex items-center gap-2">
                                        {partida.homeTeam.crest ? <Image src={partida.homeTeam.crest} width={20} height={20} alt="" /> : <Skeleton className="w-[20px] h-[20px]" />}
                                        <span className="font-bold tabular-nums">
                                            {p.resultado1} x {p.resultado2}
                                        </span>
                                        {partida.awayTeam.crest ? <Image src={partida.awayTeam.crest} width={20} height={20} alt="" /> : <Skeleton className="w-[20px] h-[20px]" />}

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}