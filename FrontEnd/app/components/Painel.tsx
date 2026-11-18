"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";

type PainelProps = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

export default function Painel({ titulo, subtitulo, children }: PainelProps) {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!user || user.role !== "PROFESSOR") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo={titulo} subtitulo={subtitulo} />

      <div className="relative flex flex-1 flex-col md:flex-row">
        <main className="order-1 md:order-2 flex-1 p-4 md:p-6">
          {children}
        </main>
        <div className="order-2 md:order-1 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}