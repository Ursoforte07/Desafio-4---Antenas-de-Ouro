import Painel from "@/app/components/Painel";
import CardTurma from "@/app/components/CardTurma";
import type { Turma } from "@/app/types/turma";

const turmas: Turma[] = [
  {
    id: 1,
    nome: "Turma 1",
    codigo: "LAB-101",
    horario: "Seg e Qua, 14h",
    totalAlunos: 30,
    aulasCadastradas: 12,
    alunosBaixaFrequencia: 2,
    presenca: 88,
  },
  {
    id: 2,
    nome: "Turma 2",
    codigo: "LAB-202",
    horario: "Ter e Qui, 10h",
    totalAlunos: 25,
    aulasCadastradas: 10,
    alunosBaixaFrequencia: 0,
    presenca: 95,
  },
];

export default function PaginaTurmas() {
  return (
    <Painel titulo="Turmas">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          className="mb-6 flex items-center gap-2 text-sm uppercase text-destaque hover:opacity-80 md:text-base"
        >
          Adicionar turma
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </button>

        <div className="flex flex-col gap-8">
          {turmas.map((turma) => (
            <CardTurma key={turma.id} turma={turma} />
          ))}
        </div>
      </div>
    </Painel>
  );
}