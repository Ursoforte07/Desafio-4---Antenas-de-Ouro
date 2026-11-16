import type { Turma } from "@/app/types/turma";

const COR_FALTOSOS = "#2D3142";
const COR_PRESENTES = "#4F5D75";

type CardTurmaProps = {
  turma: Turma;
};

export default function CardTurma({ turma }: CardTurmaProps) {
  const faltosos = 100 - turma.presenca;

  return (
    <article>
      <div className="mb-2 flex items-end justify-between gap-2">
        <div>
          <h3 className="font-titulo text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium uppercase">
            {turma.nome}
          </h3>
          <p className="text-sm">
            {turma.codigo} · {turma.horario}
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-xs uppercase text-red-500 hover:text-red-700 sm:text-sm"
        >
          Excluir turma
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-lg border border-texto bg-white p-4 shadow-sm sm:flex-row sm:justify-around sm:p-6">
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label={`${turma.presenca}% de presentes e ${faltosos}% de faltosos`}
            className="h-32 w-32 shrink-0 rounded-full md:h-40 md:w-40"
            style={{
              background: `conic-gradient(${COR_FALTOSOS} 0 ${faltosos}%, ${COR_PRESENTES} 0)`,
            }}
          />

          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 bg-texto" />
              Presentes {turma.presenca}%
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 bg-cabecalho" />
              Faltosos {faltosos}%
            </li>
          </ul>
        </div>

        <ul className="flex flex-col gap-2 text-base md:text-lg">
          <li>Total de alunos: {turma.totalAlunos}</li>
          <li>Aulas cadastradas: {turma.aulasCadastradas}</li>
          <li>
            Baixa frequência:{" "}
            <span className={turma.alunosBaixaFrequencia > 0 ? "text-red-600" : ""}>
              {turma.alunosBaixaFrequencia}
            </span>
          </li>
        </ul>
      </div>
    </article>
  );
}