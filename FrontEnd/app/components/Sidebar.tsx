"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Metricas = {
  totalAlunos: number;
  aulasCadastradas: number;
  presencaMedia: number;
  alunosBaixaFrequencia: number;
};

let cacheMetricas: { professorId: number; dados: Metricas } | null = null;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [metricas, setMetricas] = useState<Metricas>(() => {
    if (typeof window !== "undefined" && cacheMetricas) {
      const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      if (user?.id === cacheMetricas.professorId) {
        return cacheMetricas.dados;
      }
    }
    return {
      totalAlunos: 0,
      aulasCadastradas: 0,
      presencaMedia: 100,
      alunosBaixaFrequencia: 0,
    };
  });

  useEffect(() => {
    const carregarMetricas = async () => {
      const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      if (!user?.id) return;

      const res = await fetch(`/api/dados?professorId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.metricas) {
        cacheMetricas = { professorId: user.id, dados: data.metricas };
        setMetricas((prev) => {
          if (
            prev.totalAlunos === data.metricas.totalAlunos &&
            prev.aulasCadastradas === data.metricas.aulasCadastradas &&
            prev.presencaMedia === data.metricas.presencaMedia &&
            prev.alunosBaixaFrequencia === data.metricas.alunosBaixaFrequencia
          ) {
            return prev;
          }
          return data.metricas;
        });
      }
    };

    carregarMetricas();
    window.addEventListener("atualizarMetricas", carregarMetricas);
    return () => window.removeEventListener("atualizarMetricas", carregarMetricas);
  }, []);

  const handleSair = () => {
    cacheMetricas = null;
    localStorage.removeItem("usuarioLogado");
    router.push("/login");
  };

  const emTurmas = pathname === "/turmas" || pathname.startsWith("/chamada");
  const emAlunos = pathname.startsWith("/alunos");

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white border-t md:border-t-0 md:border-r border-[#4F5D75]/40 flex flex-col justify-between md:min-h-[calc(100vh-80px)]">
      <div className="flex flex-col">
        {/* Guias de navegação: lado a lado no celular, empilhadas no desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-col">
          <Link
            href="/turmas"
            className={`flex items-center justify-center md:justify-start gap-3 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 text-base md:text-lg font-medium uppercase border-b border-r md:border-r-0 border-[#4F5D75]/30 transition-colors ${
              emTurmas
                ? "bg-[#2D3142] text-white"
                : "bg-white text-[#4F5D75] hover:bg-[#E1D8CE]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <span>TURMAS</span>
          </Link>

          <Link
            href="/alunos"
            className={`flex items-center justify-center md:justify-start gap-3 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 text-base md:text-lg font-medium uppercase border-b border-[#4F5D75]/30 transition-colors ${
              emAlunos
                ? "bg-[#2D3142] text-white"
                : "bg-white text-[#4F5D75] hover:bg-[#E1D8CE]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <span>ALUNOS</span>
          </Link>
        </div>

        {/* Métricas: grade 2x2 compacta no celular, lista vertical no desktop */}
        <div className="px-5 md:px-6 py-4 md:py-6 grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-5 text-[#4F5D75] text-sm md:text-base normal-case">
          <p>
            Total de alunos: <strong>{metricas.totalAlunos}</strong>
          </p>
          <p>
            Aulas cadastradas: <strong>{metricas.aulasCadastradas}</strong>
          </p>
          <p>
            Presença média: <strong>{metricas.presencaMedia}%</strong>
          </p>
          <p>
            Baixa frequência: <strong>{metricas.alunosBaixaFrequencia}</strong>
          </p>
        </div>
      </div>

      {/* Botão Sair */}
      <div className="px-5 pb-6 pt-2 md:p-5">
        <button
          type="button"
          onClick={handleSair}
          className="w-full py-2.5 px-4 rounded-xl border border-[#4F5D75]/60 text-[#4F5D75] hover:bg-[#E1D8CE] text-sm font-medium uppercase transition-colors cursor-pointer"
        >
          SAIR DA CONTA
        </button>
      </div>
    </aside>
  );
}