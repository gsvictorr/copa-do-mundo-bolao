'use client';

import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {

    const router = useRouter();

    const onSubmit = async () => {

        const response = await axios.post("/api/auth/logout");

        const data = response.data;

        if (data.success) {

            toast({
                title: `Até mais!`,
                description: `${data.message}`,
            });
            router.push("/")

        } else {
            toast({
                title: "Erro ao deslogar!",
                description: `${data.error}`,
                variant: "destructive"
            });
        }
    }

    return (
        <>
            <Button onClick={onSubmit} size={"lg"}
                variant={"outline"}
                className="text-red-500 hover:text-red-600 cursor-pointer"
            > <LogOut /> Sair</Button>
        </>
    )
}