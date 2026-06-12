'use client'

import { useAuth } from "@/context/auth-context";
import { ThemeSwitch } from "../ui/theme-switch"
import DashboardCard from "./dashboard"
import RankingCard from "./ranking-card"
import LogoutButton from "../auth/btn-sair";



export default function DashboardPage() {

    const user = useAuth();

    return (
        <>
            <div className="flex items-center justify-between ">
                {user && <span className="text-xl font-bold">Olá, {user.user?.displayName}! 👋</span>}
                <div className="flex items-center gap-2">
                    <ThemeSwitch />
                    <LogoutButton />
                </div>
            </div>

            <RankingCard />
            <DashboardCard />
        </>
    )

}