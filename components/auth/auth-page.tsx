"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { CircleUserRound, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";


const loginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Insira um email válido." })
        .min(10, { message: "Insira um email com no mínimo 10 caracteres." }),
    senha: z
        .string()
        .min(8, { message: "Insira uma senha com no mínimo 8 caracteres." }),
});

type LoginFormType = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
    });


    const onSubmit = async (data: LoginFormType) => {
        setLoading(true);

        const response = await loginUser(data.email, data.senha);

        if (response.success) {

            const { user } = response;

            setUser(user);

            toast({
                title: `Bem-vindo, ${user.displayName}! 🤝`,
                description: `${response.message}`,
                className: "font-bold"
            });
            setLoading(false);
            router.push("/dashboard")

        } else {
            toast({
                title: "Erro ao logar!",
                description: `${response.error}`,
                variant: "destructive"
            });
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-col ">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 border relative z-50 rounded-xl shadow-sm x bg-white dark:bg-zinc-900"
            >
                <Card className="flex w-[350px]  overflow-hidden border-none shadow-none">
                    <CardHeader className="flex flex-col items-center">
                        <CardTitle className="tracking-tighter flex flex-col gap-2" >
                            <div className="relative flex items-center justify-center mr-2">
                                <Image
                                    src={"/foto_copa.png"}
                                    width={200}
                                    height={30}
                                    alt="Logo Nilpel"
                                    className="cursor-pointer w-[40px] h-[60px] relative z-10"
                                />
                            </div>

                            Bolão da Copa do Mundo 2026
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Acesse sua conta para dar palpites.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            <div className="flex flex-col gap-6">

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        startIcon={CircleUserRound}
                                        type="email"
                                        placeholder="m@example.com"
                                        {...register("email")}
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Senha</Label>
                                    </div>
                                    <Input
                                        startIcon={Lock}
                                        id="senha"
                                        type="password"
                                        placeholder="********"
                                        {...register("senha")}
                                        disabled={loading}
                                        className=""
                                    />
                                    {errors.senha && (
                                        <p className="text-sm text-red-500">
                                            {errors.senha.message}
                                        </p>
                                    )}
                                </div>
                                <Button size={"lg"} type="submit" className="w-full cursor-pointer  border-none bg-black text-white rounded-lg dark:bg-green-500 dark:hover:bg-green-600 hover:bg-zinc-900 hover:text-white " disabled={loading}>
                                    {loading ? <span className="flex items-center gap-1"><Loader2 size={"4"} className="animate-spin" /> Entrando...</span> : "Entrar"}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Não possui uma conta?
                            <Link href="/registrar" className="hover:underline text-green-600 ml-1">
                                Cadastre-se
                            </Link>
                        </div>
                    </CardContent>
                </Card>

            </motion.div>
        </div>
    );
}