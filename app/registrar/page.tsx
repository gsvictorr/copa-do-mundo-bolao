import { RegisterForm } from "@/components/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolão da Copa do Mundo - Registrar",
  description: "Bolão da Copa do Mundo 2026 !",
};


export default function Registrar() {


  return (
    <>
      <div className="w-full min-w-screen min-h-screen container flex items-center justify-center">
        <RegisterForm />
      </div>
    </>
  );
}
