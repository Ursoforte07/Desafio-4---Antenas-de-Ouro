"use client";

import { useEffect, useState, type ReactNode } from "react";
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
  const [metricas, setMetricas] = useState({
    totalAlunos: 0,
    aulasCadastradas: 0,
    presencaMedia: 100,
    alunosBaixaFrequencia: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!user || user.role !== "PROFESSOR") {
      router.push("/login");
      return;
    }

    fetch(`/api/dados?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.metricas) setMetricas(data.metricas);
      });
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo={titulo} subtitulo={subtitulo} />

      <div className="relative flex flex-1 flex-col md:flex-row">
        <Sidebar
          totalAlunos={metricas.totalAlunos}
          aulasCadastradas={metricas.aulasCadastradas}
          presencaMedia={metricas.presencaMedia}
          alunosBaixaFrequencia={metricas.alunosBaixaFrequencia}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}