"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type SidebarProps = {
  totalAlunos: number;
  aulasCadastradas: number;
  presencaMedia: number;
  alunosBaixaFrequencia: number;
};

export default function Sidebar({
  totalAlunos,
  aulasCadastradas,
  presencaMedia,
  alunosBaixaFrequencia,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isTurmas = pathname.startsWith("/turmas") || pathname.startsWith("/chamada");
  const isAlunos = pathname.startsWith("/alunos");

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    router.push("/login");
  };

  return (
    <aside className="w-full md:w-64 bg-[#FDFBF7] border-r border-gray-300 flex flex-col justify-between">
      <div>
        <Link
          href="/turmas"
          className={`flex items-center gap-3 px-6 py-4 border-b border-gray-300 uppercase font-medium transition-colors ${
            isTurmas
              ? "bg-[#2D3142] text-white"
              : "bg-transparent text-[#4F5D75] hover:bg-[#E1D8CE]"
          }`}
        >
          <img
            src="/people.png"
            alt="Turmas"
            className={`w-6 h-6 ${isTurmas ? "brightness-0 invert" : ""}`}
          />
          <span>TURMAS</span>
        </Link>

        <Link
          href="/alunos"
          className={`flex items-center gap-3 px-6 py-4 border-b border-gray-300 uppercase font-medium transition-colors ${
            isAlunos
              ? "bg-[#2D3142] text-white"
              : "bg-transparent text-[#4F5D75] hover:bg-[#E1D8CE]"
          }`}
        >
          <img
            src="/person.png"
            alt="Alunos"
            className={`w-6 h-6 ${isAlunos ? "brightness-0 invert" : ""}`}
          />
          <span>ALUNOS</span>
        </Link>

        <div className="p-6 flex flex-col gap-5 text-[#4F5D75] text-base font-normal normal-case">
          <p>
            Total de alunos: <span className="font-semibold">{totalAlunos}</span>
          </p>
          <p>
            Aulas cadastradas:{" "}
            <span className="font-semibold">{aulasCadastradas}</span>
          </p>
          <p>
            Presença média:{" "}
            <span className="font-semibold">{presencaMedia}%</span>
          </p>
          <p>
            Baixa frequência:{" "}
            <span className="font-semibold">{alunosBaixaFrequencia}</span>
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-gray-300">
        <button
          type="button"
          onClick={handleSair}
          className="w-full py-2 px-4 rounded-lg border border-[#4F5D75] text-[#4F5D75] hover:bg-[#2D3142] hover:text-white transition-colors text-sm font-semibold uppercase cursor-pointer"
        >
          SAIR DA CONTA
        </button>
      </div>
    </aside>
  );
}