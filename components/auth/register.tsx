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
import { useContext, useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, CircleUserRound, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "@/services/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";


const registerFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Insira um nome com no mínimo 3 caracteres." }).max(50, { message: "Máximo de caracteres: 50." }),
    email: z
        .string()
        .email({ message: "Insira um email válido." })
        .min(10, { message: "Insira um email com no mínimo 10 caracteres." }),
    password: z
        .string()
        .min(8, { message: "Insira uma senha com no mínimo 8 caracteres." }),
});

type RegisterFormType = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormType>({
        resolver: zodResolver(registerFormSchema),
    });


    const onSubmit = async (data: RegisterFormType) => {
        setLoading(true);

        const response = await registerUser(data.name, data.email, data.password);

        if (response.success) {

            toast({
                title: `Conta criada com sucesso!`,
                description: `${response.message}`,
                className: "bg-green-600 text-white"
            });
            setLoading(false);

            router.push("/")

        } else {
            toast({
                title: "Erro ao criar conta!",
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
                className="flex items-center gap-2 border relative z-50 rounded-xl shadow-sm  bg-white dark:bg-zinc-900"
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
                            Crie sua conta para dar palpites.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            <div className="flex flex-col gap-6">

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome e sobrenome</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nome e sobrenome"
                                        {...register("name")}
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        startIcon={CircleUserRound}
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
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        startIcon={Lock}
                                        placeholder="********"
                                        {...register("password")}
                                        disabled={loading}
                                        className=""
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <Button type="submit" size={"lg"} className="w-full cursor-pointer  border-none bg-black text-white rounded-lg dark:bg-green-500 dark:hover:bg-green-600 hover:bg-zinc-900 hover:text-white " disabled={loading}>
                                    {loading ? <span className="flex items-center gap-1"><Loader2 size={"4"} className="animate-spin" /> Cadastrando...</span> : "Cadastrar"}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Já possui uma conta?
                            <Link href="/" className="hover:underline text-green-600 ml-1">
                                Entrar.
                            </Link>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}