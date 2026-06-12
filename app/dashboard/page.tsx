import DashboardCard from "@/components/dashboard/dashboard";
import DashboardPage from "@/components/dashboard/dashboard-page";
import RankingCard from "@/components/dashboard/ranking-card";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolão da Copa do Mundo - Página principal",
  description: "Bolão da Copa do Mundo 2026 !",
};


export default function Dashboard() {


  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 overflow-y-auto">
      <DashboardPage/>
    </div>
  );
}
