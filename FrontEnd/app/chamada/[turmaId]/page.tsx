"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Painel from "@/app/components/Painel";

function ConteudoChamada() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const turmaId = Number(params.turmaId);
  const hoje = new Date().toISOString().split("T")[0];
  const dataSelecionada = searchParams.get("data") || hoje;

  const [nomeTurma, setNomeTurma] = useState("TURMA");
  const [presencas, setPresencas] = useState<
    { alunoId: number; nome: string; presente: boolean }[]
  >([]);
  const [salvando, setSalvando] = useState(false);

  const dataFormatada = dataSelecionada.split("-").reverse().join("/");

  useEffect(() => {
    if (!turmaId) return;
    fetch(`/api/dados?turmaId=${turmaId}&data=${dataSelecionada}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.turma) {
          setNomeTurma(resData.turma.nome);
          const mapaExistente = new Map<number, boolean>();
          resData.presencasExistentes?.forEach(
            (p: { aluno_id: number; presente: boolean }) =>
              mapaExistente.set(p.aluno_id, p.presente)
          );

          setPresencas(
            resData.alunos.map((al: { id: number; nome: string }) => ({
              alunoId: al.id,
              nome: al.nome,
              presente: mapaExistente.get(al.id) ?? false,
            }))
          );
        }
      });
  }, [turmaId, dataSelecionada]);

  const togglePresenca = (alunoId: number) => {
    setPresencas((prev) =>
      prev.map((item) =>
        item.alunoId === alunoId ? { ...item, presente: !item.presente } : item
      )
    );
  };

  const handleSalvar = async () => {
    setSalvando(true);
    const res = await fetch("/api/dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "SALVAR_CHAMADA",
        turmaId,
        data: dataSelecionada,
        presencas: presencas.map(({ alunoId, presente }) => ({
          alunoId,
          presente,
        })),
      }),
    });

    const data = await res.json();
    setSalvando(false);

    if (!res.ok) {
      alert(`Erro ao salvar chamada: ${data.error}`);
      return;
    }

    router.push("/turmas");
  };

  return (
    <Painel titulo={`${nomeTurma} - ${dataFormatada}`}>
      <div className="w-full max-w-6xl mx-auto flex flex-col border border-[#4F5D75]/60 bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-[#2D3142] text-white font-semibold uppercase text-lg md:text-xl py-4 px-6 shrink-0">
          <div className="col-span-9 text-center">NOME</div>
          <div className="col-span-3 text-center">PRESENÇA</div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto divide-y divide-[#4F5D75]/40">
          {presencas.map((item) => (
            <div
              key={item.alunoId}
              className="grid grid-cols-12 items-center bg-white hover:bg-[#FDFBF7] transition-colors"
            >
              <div className="col-span-9 px-6 py-5 border-r border-[#4F5D75]/40 text-[#4F5D75] uppercase text-lg md:text-xl font-medium">
                {item.nome}
              </div>

              <div className="col-span-3 py-5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => togglePresenca(item.alunoId)}
                  className="cursor-pointer hover:scale-110 transition-transform"
                >
                  <img
                    src={item.presente ? "/check_full.png" : "/check_blank.png"}
                    alt={item.presente ? "Presente" : "Falta"}
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          ))}

          {presencas.length === 0 && (
            <p className="p-8 text-center text-[#4F5D75] text-lg">
              Nenhum aluno cadastrado nesta turma ainda.
            </p>
          )}
        </div>

        <div className="border-t border-[#4F5D75]/40 px-6 py-4 flex justify-end bg-white shrink-0">
          <button
            type="button"
            disabled={salvando}
            onClick={handleSalvar}
            className="bg-[#D4AF37] text-white font-semibold uppercase text-base px-7 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            <span>{salvando ? "SALVANDO..." : "SALVAR"}</span>
            <img src="/check.png" alt="Salvar" className="w-5 h-5 brightness-0 invert" />
          </button>
        </div>
      </div>
    </Painel>
  );
}

export default function PaginaChamada() {
  return (
    <Suspense fallback={<div className="p-8 text-[#4F5D75]">Carregando chamada...</div>}>
      <ConteudoChamada />
    </Suspense>
  );
}