"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Painel from "@/app/components/Painel";

type PresencaItem = {
  id: number;
  presente: boolean;
  data: string;
};

function ConteudoDetalhesAluno() {
  const params = useParams();
  const alunoId = Number(params.id);

  const [aluno, setAluno] = useState<{
    nome: string;
    turma_nome: string;
    presencas: PresencaItem[];
  } | null>(null);

  const carregarAluno = async () => {
    if (!alunoId) return;
    const res = await fetch(`/api/dados?alunoId=${alunoId}`);
    if (res.ok) setAluno(await res.json());
  };

  useEffect(() => {
    carregarAluno();
  }, [alunoId]);

  const alternarStatus = async (presenca: PresencaItem) => {
    await fetch("/api/dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "ALTERAR_PRESENCA_INDIVIDUAL",
        presencaId: presenca.id,
        presente: !presenca.presente,
      }),
    });
    carregarAluno();
  };

  if (!aluno) {
    return (
      <Painel titulo="CARREGANDO...">
        <p className="text-[#4F5D75]">Buscando dados do aluno...</p>
      </Painel>
    );
  }

  const totalAulas = aluno.presencas.length;
  const aulasPresentes = aluno.presencas.filter((p) => p.presente).length;
  const aulasFaltadas = totalAulas - aulasPresentes;
  const pctPresente =
    totalAulas > 0 ? Math.round((aulasPresentes / totalAulas) * 100) : 100;
  const pctFalta = 100 - pctPresente;

  const corStatus =
    pctPresente >= 85
      ? "text-green-600"
      : pctPresente >= 75
      ? "text-[#D4AF37]"
      : "text-red-600";

  return (
    <Painel titulo={aluno.nome} subtitulo={aluno.turma_nome}>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="w-full border border-[#4F5D75]/60 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-[#2D3142] text-white font-semibold uppercase text-lg py-3 text-center">
            <div>DATA</div>
            <div>STATUS</div>
          </div>

          <div className="divide-y divide-[#4F5D75]/40 max-h-72 overflow-y-auto">
            {aluno.presencas.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 items-center py-3 text-center text-[#4F5D75]"
              >
                <div className="border-r border-[#4F5D75]/40">
                  {p.data.split("-").reverse().join("/")}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="font-medium uppercase">
                    {p.presente ? "PRESENTE" : "FALTA"}
                  </span>
                  <button
                    type="button"
                    onClick={() => alternarStatus(p)}
                    title="Alterar status"
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <img src="/lapis.png" alt="Editar" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {aluno.presencas.length === 0 && (
              <p className="p-6 text-center text-[#4F5D75]">
                Nenhuma aula registrada para este aluno ainda.
              </p>
            )}
          </div>
        </div>

        <div className="w-full bg-white border border-[#4F5D75]/60 rounded-2xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="flex items-center justify-center gap-6">
            <div
              className="w-44 h-44 rounded-full relative flex items-center justify-center"
              style={{
                background: `conic-gradient(#2D3142 0% ${pctFalta}%, #4F5D75 ${pctFalta}% 100%)`,
              }}
            >
              {pctFalta > 0 && (
                <span className="absolute top-6 right-7 text-white text-xs font-bold">
                  {pctFalta}%
                </span>
              )}
              <span className="text-white text-base font-bold">
                {pctPresente}%
              </span>
            </div>

            <div className="flex flex-col gap-3 text-sm font-medium text-[#4F5D75] uppercase">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2D3142]" />
                <span>FALTAS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4F5D75]" />
                <span>PRESENÇAS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-lg text-[#4F5D75] normal-case">
            <p>
              Aulas presentes:{" "}
              <span className="font-semibold">{aulasPresentes}</span>
            </p>
            <p>
              Aulas faltadas:{" "}
              <span className="font-semibold">{aulasFaltadas}</span>
            </p>
            <p className="flex items-center gap-2">
              <span>Status:</span>
              <span className={`text-2xl font-bold ${corStatus}`}>
                {pctPresente}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </Painel>
  );
}

export default function DetalhesAlunoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#4F5D75]">Carregando detalhes do aluno...</div>}>
      <ConteudoDetalhesAluno />
    </Suspense>
  );
}