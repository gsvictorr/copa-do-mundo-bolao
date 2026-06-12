// partida-card.tsx
"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Props {
    partida: any;
    palpite?: { resultado1: number; resultado2: number } | null;
    userId: string;
    userName: string;
    onPalpiteSalvo: (idPartida: string, r1: number, r2: number) => void;
}

export default function PartidaCard({ partida, palpite, userId, userName, onPalpiteSalvo }: Props) {
    const [r1, setR1] = useState<string>(palpite?.resultado1?.toString() ?? "");
    const [r2, setR2] = useState<string>(palpite?.resultado2?.toString() ?? "");
    const [salvando, setSalvando] = useState(false);
    const [salvo, setSalvo] = useState(!!palpite);

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
    const podeApostar = partida.status === "TIMED";

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

    return (
        <div className="border rounded-xl p-5 shadow-md">

            <div className="flex flex-col items-center gap-2">

                <div className="text-center flex justify-center items-center gap-2">
                    <span>
                        {data.toLocaleDateString("pt-BR")} -{" "}
                        {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>

                </div>
                <Badge>{getStatus(partida.status)}</Badge>

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
                {encerrada
                    ? `${partida.score.fullTime.home} x ${partida.score.fullTime.away}`
                    : ""}
            </div>

            {/* Área de palpite */}
            <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center text-muted-foreground mb-2">Seu palpite</p>
                {salvo ? (
                    <p className="text-center font-semibold text-green-600">
                        {r1} x {r2}
                    </p>
                ) :
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
        </div>
    );
}