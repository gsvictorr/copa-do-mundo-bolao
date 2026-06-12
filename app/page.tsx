import { LoginForm } from "@/components/auth/auth-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bolão da Copa do Mundo - Entrar",
  description: "Bolão da Copa do Mundo 2026 !",
  };


export default function Home() {

  
  return (
        <div className="w-full min-w-screen min-h-screen container flex items-center justify-center">
          
            <LoginForm />
        </div>
  );
}
