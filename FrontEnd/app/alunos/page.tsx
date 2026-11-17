"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Painel from "@/app/components/Painel";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";

type AlunoItem = {
  id: number;
  nome: string;
  turmaId: number;
  turmaNome: string;
  frequencia: number;
};

type FiltroStatus = "TODOS" | "ALTA" | "MEDIA" | "BAIXA";
type OrdemStatus = "NENHUMA" | "DESC" | "ASC";

function ConteudoPaginaAlunos() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const turmaIdUrl = searchParams.get("turmaId");

  const [alunos, setAlunos] = useState<AlunoItem[]>([]);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [busca, setBusca] = useState("");

  // Estados dos filtros das setinhas STATUS ▼ e TURMA ▼
  const [filtroTurma, setFiltroTurma] = useState<string>(turmaIdUrl || "TODAS");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("TODOS");
  const [ordemStatus, setOrdemStatus] = useState<OrdemStatus>("NENHUMA");
  const [menuAberto, setMenuAberto] = useState<"STATUS" | "TURMA" | null>(null);

  // Estados de criação e exclusão
  const [modalCriar, setModalCriar] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [alunoExcluir, setAlunoExcluir] = useState<AlunoItem | null>(null);

  const cabecalhoRef = useRef<HTMLDivElement>(null);

  // Sincroniza caso o parâmetro ?turmaId mude na URL
  useEffect(() => {
    setFiltroTurma(turmaIdUrl || "TODAS");
  }, [turmaIdUrl]);

  // Fecha dropdown ao clicar fora do cabeçalho
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (cabecalhoRef.current && !cabecalhoRef.current.contains(e.target as Node)) {
        setMenuAberto(null);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const carregarDados = async () => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!user?.id) return;
    const res = await fetch(`/api/dados?professorId=${user.id}`);
    const data = await res.json();
    if (data.alunos) setAlunos(data.alunos);
    if (data.turmas) {
      setTurmas(data.turmas);
      if (data.turmas.length > 0) {
        setTurmaSelecionada(turmaIdUrl || String(data.turmas[0].id));
      }
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Aplica busca por nome, filtro de turma, filtro de status e ordenação
  const alunosFiltrados = useMemo(() => {
    let lista = alunos.filter((al) =>
      al.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (filtroTurma !== "TODAS") {
      lista = lista.filter((al) => String(al.turmaId) === filtroTurma);
    }

    if (filtroStatus === "ALTA") {
      lista = lista.filter((al) => al.frequencia >= 85);
    } else if (filtroStatus === "MEDIA") {
      lista = lista.filter((al) => al.frequencia >= 75 && al.frequencia < 85);
    } else if (filtroStatus === "BAIXA") {
      lista = lista.filter((al) => al.frequencia < 75);
    }

    if (ordemStatus === "DESC") {
      lista = [...lista].sort((a, b) => b.frequencia - a.frequencia);
    } else if (ordemStatus === "ASC") {
      lista = [...lista].sort((a, b) => a.frequencia - b.frequencia);
    }

    return lista;
  }, [alunos, busca, filtroTurma, filtroStatus, ordemStatus]);

  const nomeTurmaFiltrada = useMemo(() => {
    if (filtroTurma === "TODAS") return null;
    return turmas.find((t) => String(t.id) === filtroTurma)?.nome || null;
  }, [filtroTurma, turmas]);

  const handleCriarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !turmaSelecionada) return;

    const res = await fetch("/api/dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "CRIAR_ALUNO",
        nome: novoNome.toUpperCase(),
        turmaId: Number(turmaSelecionada),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(`Erro ao criar aluno: ${data.error}`);
      return;
    }

    setNovoNome("");
    setModalCriar(false);
    carregarDados();
  };

  const confirmarExclusao = async () => {
    if (!alunoExcluir) return;
    await fetch(`/api/dados?tipo=ALUNO&id=${alunoExcluir.id}`, {
      method: "DELETE",
    });
    setAlunoExcluir(null);
    carregarDados();
  };

  const getCorStatus = (pct: number) => {
    if (pct >= 85) return "text-green-600";
    if (pct >= 75) return "text-[#D4AF37]";
    return "text-red-600";
  };

  const limparFiltroTurma = () => {
    setFiltroTurma("TODAS");
    if (turmaIdUrl) router.push("/alunos");
  };

  return (
    <Painel titulo={nomeTurmaFiltrada ? `ALUNOS - ${nomeTurmaFiltrada}` : "ALUNOS"}>
      <div className="w-full h-[calc(100vh-140px)] flex flex-col">
        {/* Barra superior: Busca, Badge de Filtro Ativo e Adicionar Aluno */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 shrink-0">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="PROCURAR POR UM NOME"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-5 pr-11 text-sm text-[#4F5D75] focus:outline-none focus:border-[#2D3142]"
              />
              <img
                src="/lupa.png"
                alt="Buscar"
                className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Tag indicando filtro ativo com opção rápida de limpar */}
            {(filtroTurma !== "TODAS" || filtroStatus !== "TODOS" || ordemStatus !== "NENHUMA") && (
              <button
                type="button"
                onClick={() => {
                  limparFiltroTurma();
                  setFiltroStatus("TODOS");
                  setOrdemStatus("NENHUMA");
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#E1D8CE] text-[#2D3142] text-xs font-semibold uppercase flex items-center gap-2 hover:opacity-80 cursor-pointer"
              >
                <span>LIMPAR FILTROS</span>
                <span>✕</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setModalCriar(true)}
            className="flex items-center gap-2 text-[#D4AF37] hover:opacity-80 font-medium text-base uppercase cursor-pointer"
          >
            <span>ADICIONAR ALUNO</span>
            <img src="/add_circle.png" alt="Adicionar" className="w-6 h-6" />
          </button>
        </div>

        {/* Quadro da Tabela */}
        <div className="w-full flex-1 flex flex-col border border-[#4F5D75]/60 bg-white overflow-visible shadow-sm">
          {/* Cabeçalho com Dropdowns interativos em STATUS ▼ e TURMA ▼ */}
          <div
            ref={cabecalhoRef}
            className="grid grid-cols-12 bg-[#2D3142] text-white font-semibold uppercase text-lg py-3.5 px-6 shrink-0 relative select-none"
          >
            <div className="col-span-7 text-center">NOME</div>

            {/* Coluna STATUS ▼ */}
            <div className="col-span-3 flex justify-center relative">
              <button
                type="button"
                onClick={() =>
                  setMenuAberto((prev) => (prev === "STATUS" ? null : "STATUS"))
                }
                className="flex items-center gap-2 hover:text-[#E1D8CE] transition-colors cursor-pointer"
              >
                <span>STATUS</span>
                <span className="text-xs">▼</span>
              </button>

              {menuAberto === "STATUS" && (
                <div className="absolute top-11 z-40 w-56 bg-[#FDFBF7] border border-[#4F5D75] rounded-xl shadow-xl py-2 text-sm text-[#4F5D75] font-medium normal-case">
                  <p className="px-4 py-1 text-xs font-bold uppercase text-[#2D3142]/60">
                    Filtrar por faixa
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroStatus("TODOS");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] cursor-pointer ${
                      filtroStatus === "TODOS" ? "font-bold text-[#2D3142] bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Todos os status
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroStatus("ALTA");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] text-green-700 cursor-pointer ${
                      filtroStatus === "ALTA" ? "font-bold bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Alta (85% a 100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroStatus("MEDIA");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] text-[#D4AF37] cursor-pointer ${
                      filtroStatus === "MEDIA" ? "font-bold bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Média (75% a 84%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroStatus("BAIXA");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] text-red-600 cursor-pointer ${
                      filtroStatus === "BAIXA" ? "font-bold bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Baixa frequência (&lt; 75%)
                  </button>

                  <div className="my-1 border-t border-gray-300" />
                  <p className="px-4 py-1 text-xs font-bold uppercase text-[#2D3142]/60">
                    Ordenar
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOrdemStatus("DESC");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] cursor-pointer ${
                      ordemStatus === "DESC" ? "font-bold text-[#2D3142] bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Maior presença primeiro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrdemStatus("ASC");
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] cursor-pointer ${
                      ordemStatus === "ASC" ? "font-bold text-[#2D3142] bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    Menor presença primeiro
                  </button>
                </div>
              )}
            </div>

            {/* Coluna TURMA ▼ */}
            <div className="col-span-2 flex justify-center relative">
              <button
                type="button"
                onClick={() =>
                  setMenuAberto((prev) => (prev === "TURMA" ? null : "TURMA"))
                }
                className="flex items-center gap-2 hover:text-[#E1D8CE] transition-colors cursor-pointer"
              >
                <span>TURMA</span>
                <span className="text-xs">▼</span>
              </button>

              {menuAberto === "TURMA" && (
                <div className="absolute right-0 top-11 z-40 w-48 bg-[#FDFBF7] border border-[#4F5D75] rounded-xl shadow-xl py-2 text-sm text-[#4F5D75] font-medium uppercase">
                  <button
                    type="button"
                    onClick={() => {
                      limparFiltroTurma();
                      setMenuAberto(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] cursor-pointer ${
                      filtroTurma === "TODAS" ? "font-bold text-[#2D3142] bg-[#E1D8CE]/40" : ""
                    }`}
                  >
                    TODAS AS TURMAS
                  </button>
                  {turmas.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setFiltroTurma(String(t.id));
                        setMenuAberto(null);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#E1D8CE] cursor-pointer ${
                        filtroTurma === String(t.id)
                          ? "font-bold text-[#2D3142] bg-[#E1D8CE]/40"
                          : ""
                      }`}
                    >
                      {t.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lista de Alunos Filtrados */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#4F5D75]/40">
            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                className="grid grid-cols-12 items-center bg-white hover:bg-[#FDFBF7]"
              >
                <div className="col-span-7 flex items-center justify-between px-6 py-4 border-r border-[#4F5D75]/40">
                  <Link
                    href={`/alunos/${aluno.id}`}
                    className="text-[#4F5D75] hover:text-[#D4AF37] uppercase text-base truncate pr-4"
                  >
                    {aluno.nome}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAlunoExcluir(aluno)}
                    className="cursor-pointer hover:scale-110"
                  >
                    <img src="/trash.png" alt="Excluir" className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className={`col-span-3 py-4 text-center font-medium text-xl border-r border-[#4F5D75]/40 ${getCorStatus(
                    aluno.frequencia
                  )}`}
                >
                  {aluno.frequencia}%
                </div>

                <div className="col-span-2 py-4 text-center text-[#4F5D75] text-lg">
                  {aluno.turmaNome}
                </div>
              </div>
            ))}

            {alunosFiltrados.length === 0 && (
              <div className="p-8 text-center text-[#4F5D75] normal-case">
                Nenhum aluno encontrado com os filtros selecionados.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Criar Aluno */}
      {modalCriar && (
        <div
          onClick={() => setModalCriar(false)}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCriarAluno}
            className="bg-[#FDFBF7] border border-[#4F5D75] rounded-2xl max-w-md w-full p-6 shadow-xl normal-case"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold uppercase text-[#2D3142]">
                NOVO ALUNO
              </h3>
              <button
                type="button"
                onClick={() => setModalCriar(false)}
                className="text-[#4F5D75] hover:text-[#2D3142] font-bold text-lg cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            {turmas.length > 0 ? (
              <>
                <input
                  type="text"
                  required
                  placeholder="Nome completo do aluno"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 mb-4 text-[#4F5D75]"
                />
                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-6 bg-white text-[#4F5D75]"
                >
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
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
                    className="px-5 py-2 rounded-lg bg-[#D4AF37] text-white font-bold uppercase text-sm cursor-pointer"
                  >
                    SALVAR ALUNO
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-red-600 text-sm mb-6">
                  Crie uma turma primeiro antes de cadastrar alunos.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalCriar(false)}
                    className="px-5 py-2 rounded-lg bg-[#2D3142] text-white font-semibold uppercase text-sm cursor-pointer"
                  >
                    FECHAR
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      <ModalConfirmacao
        aberto={!!alunoExcluir}
        titulo="EXCLUIR ALUNO"
        mensagem={`Tem certeza que deseja excluir ${alunoExcluir?.nome}?`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setAlunoExcluir(null)}
      />
    </Painel>
  );
}

export default function PaginaAlunos() {
  return (
    <Suspense fallback={<div className="p-8 text-[#4F5D75]">Carregando alunos...</div>}>
      <ConteudoPaginaAlunos />
    </Suspense>
  );
}