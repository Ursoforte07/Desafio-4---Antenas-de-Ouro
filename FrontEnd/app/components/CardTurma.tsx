"use client";

type CardTurmaProps = {
  id: number | string;
  nome: string;
  totalAlunos: number;
  aulasCadastradas: number;
  baixaFrequencia: number;
  percentualPresentes?: number;
  onExcluir?: (id: number | string) => void;
};

export default function CardTurma({
  id,
  nome,
  totalAlunos,
  aulasCadastradas,
  baixaFrequencia,
  percentualPresentes = 88,
  onExcluir,
}: CardTurmaProps) {
  const percentualFaltosos = 100 - percentualPresentes;

  return (
    <div className="w-full flex flex-col">
      {/* Cabeçalho externo do Card: Nome da Turma à esquerda e Excluir à direita */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <h2 className="text-xl md:text-2xl font-medium uppercase text-[#4F5D75]">
          {nome}
        </h2>

        {onExcluir && (
          <button
            type="button"
            onClick={() => onExcluir(id)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-xs md:text-sm font-medium uppercase transition-colors cursor-pointer"
          >
            <span>EXCLUIR TURMA</span>
            <img src="/trash.png" alt="Excluir turma" className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>

      {/* Quadro principal ampliado */}
      <div className="w-full bg-white border border-[#4F5D75]/60 rounded-2xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Lado Esquerdo: Gráfico circular de Presença x Faltas */}
          <div className="flex items-center justify-center relative py-2">
            {/* Gráfico de pizza feito em CSS puro (conic-gradient) nas cores exatas do Style Guide */}
            <div
              className="w-44 h-44 md:w-52 md:h-52 rounded-full relative flex items-center justify-center shadow-inner"
              style={{
                background: `conic-gradient(#2D3142 0% ${percentualFaltosos}%, #4F5D75 ${percentualFaltosos}% 100%)`,
              }}
            >
              {/* Rótulo Faltosos */}
              <span className="absolute top-6 right-8 text-white text-xs md:text-sm font-semibold">
                {percentualFaltosos}%
              </span>

              {/* Rótulo Presentes */}
              <span className="absolute bottom-8 left-12 text-white text-sm md:text-base font-semibold">
                {percentualPresentes}%
              </span>
            </div>

            {/* Legenda lateral do gráfico */}
            <div className="ml-6 flex flex-col justify-between h-36 text-sm md:text-base text-[#4F5D75] font-medium normal-case">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2D3142] inline-block"></span>
                <span>Faltosos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4F5D75] inline-block"></span>
                <span>Presentes</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Métricas da Turma */}
          <div className="flex flex-col justify-center gap-5 md:gap-6 text-[#4F5D75] text-lg md:text-xl font-normal normal-case md:pl-8">
            <p>
              Total de alunos:{" "}
              <span className="font-semibold">{totalAlunos}</span>
            </p>
            <p>
              Aulas cadastradas:{" "}
              <span className="font-semibold">{aulasCadastradas}</span>
            </p>
            <p>
              Baixa frequência:{" "}
              <span className="font-semibold">{baixaFrequencia}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}