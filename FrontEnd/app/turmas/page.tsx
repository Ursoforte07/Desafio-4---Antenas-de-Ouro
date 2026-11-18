"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Painel from "@/app/components/Painel";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";
import GraficoPizza from "@/app/components/GraficoPizza";

type TurmaItem = {
  id: number;
  nome: string;
  totalAlunos: number;
  aulasCadastradas: number;
  baixaFrequencia: number;
  percentualPresentes: number;
};

export default function PaginaTurmas() {
  const [turmas, setTurmas] = useState<TurmaItem[]>([]);
  const [modalCriar, setModalCriar] = useState(false);
  const [novaTurma, setNovaTurma] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [turmaExcluir, setTurmaExcluir] = useState<TurmaItem | null>(null);

  const carregarTurmas = async () => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!user?.id) return;
    const res = await fetch(`/api/dados?professorId=${user.id}`);
    const data = await res.json();
    if (data.turmas) setTurmas(data.turmas);
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!user?.id || !novaTurma.trim()) return;

    setSalvando(true);
    const res = await fetch("/api/dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "CRIAR_TURMA",
        nome: novaTurma.toUpperCase(),
        professorId: user.id,
      }),
    });

    const data = await res.json();
    setSalvando(false);

    if (!res.ok) {
      alert(`Erro ao criar turma: ${data.error}`);
      return;
    }

    setNovaTurma("");
    setModalCriar(false);
    await carregarTurmas();
  };

  const confirmarExclusao = async () => {
    if (!turmaExcluir) return;
    await fetch(`/api/dados?tipo=TURMA&id=${turmaExcluir.id}`, {
      method: "DELETE",
    });
    setTurmaExcluir(null);
    carregarTurmas();
  };

  return (
    <Painel titulo="TURMAS">
      <div className="w-full flex flex-col gap-8 pb-8">
        <div className="w-full flex items-center justify-start">
          <button
            type="button"
            onClick={() => setModalCriar(true)}
            className="flex items-center gap-2 text-[#D4AF37] hover:opacity-80 font-medium text-lg uppercase cursor-pointer"
          >
            <span>ADICIONAR TURMA</span>
            <img src="/add_circle.png" alt="Adicionar" className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-8">
          {turmas.map((turma) => (
            <div key={turma.id} className="w-full flex flex-col">
              <div className="w-full flex items-center justify-between mb-2 px-1">
                <Link
                  href={`/alunos?turmaId=${turma.id}`}
                  className="text-xl md:text-2xl font-medium uppercase text-[#4F5D75] hover:text-[#D4AF37] transition-colors"
                >
                  {turma.nome}
                </Link>

                <button
                  type="button"
                  onClick={() => setTurmaExcluir(turma)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium uppercase cursor-pointer"
                >
                  <span>EXCLUIR TURMA</span>
                  <img src="/trash.png" alt="Excluir" className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full bg-white border border-[#4F5D75]/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                  <GraficoPizza
                    percentualPresentes={turma.percentualPresentes}
                    labelFaltosos="Faltosos"
                    labelPresentes="Presentes"
                  />

                  <div className="flex flex-col gap-5 text-[#4F5D75] text-lg md:text-xl normal-case md:pl-8">
                    <p>Total de alunos: <strong>{turma.totalAlunos}</strong></p>
                    <p>Aulas cadastradas: <strong>{turma.aulasCadastradas}</strong></p>
                    <p>Baixa frequência: <strong>{turma.baixaFrequencia}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {turmas.length === 0 && (
            <p className="text-[#4F5D75] text-base normal-case">
              Nenhuma turma cadastrada ainda. Clique em &quot;ADICIONAR TURMA&quot; acima.
            </p>
          )}
        </div>
      </div>

      {modalCriar && (
        <div
          onClick={() => setModalCriar(false)}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCriarTurma}
            className="bg-[#FDFBF7] border border-[#4F5D75] rounded-2xl max-w-md w-full p-6 shadow-xl normal-case"
          >
            <h3 className="text-xl font-bold uppercase text-[#2D3142] mb-4">
              NOVA TURMA
            </h3>
            <input
              type="text"
              required
              placeholder="Ex: TURMA 1"
              value={novaTurma}
              onChange={(e) => setNovaTurma(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 mb-6 text-[#4F5D75]"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalCriar(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#4F5D75] uppercase text-sm cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-5 py-2 rounded-lg bg-[#D4AF37] text-white font-bold uppercase text-sm cursor-pointer disabled:opacity-50"
              >
                {salvando ? "CRIANDO..." : "CRIAR TURMA"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ModalConfirmacao
        aberto={!!turmaExcluir}
        titulo="EXCLUIR TURMA"
        mensagem={`Tem certeza que deseja excluir a ${turmaExcluir?.nome}? Todos os alunos e chamadas dela serão apagados.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setTurmaExcluir(null)}
      />
    </Painel>
  );
}