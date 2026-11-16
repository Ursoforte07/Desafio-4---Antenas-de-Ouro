"use client";

import { useState } from "react";
import type { LinhaAluno } from "@/app/types/aluno";
import { nivelFrequencia, corDoNivel } from "@/app/lib/frequencia";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type ListaAlunosProps = {
  linhas: LinhaAluno[];
};

export default function ListaAlunos({ linhas }: ListaAlunosProps) {
  const [busca, setBusca] = useState("");

  const linhasFiltradas = linhas.filter((linha) =>
    normalizar(linha.nome).includes(normalizar(busca))
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Procurar por um nome</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar por um nome"
            className="w-full rounded-full border border-detalhe bg-white py-2 pl-4 pr-11 text-sm shadow-sm placeholder:uppercase placeholder:text-texto/50 focus:outline-none focus:ring-2 focus:ring-destaque md:text-base"
          />
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cabecalho"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </label>

        <button
          type="button"
          className="flex items-center gap-2 text-sm uppercase text-destaque hover:opacity-80 md:text-base"
        >
          Adicionar aluno
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
      </div>

      <div className="max-h-[60vh] overflow-auto rounded-lg border border-texto bg-white">
        <table className="w-full min-w-[28rem] border-collapse">
          <thead>
            <tr>
              <th className="sticky top-0 bg-cabecalho px-4 py-3 text-center font-titulo text-base font-medium uppercase text-white md:text-xl">
                Nome
              </th>
              <th className="sticky top-0 bg-cabecalho px-4 py-3 text-center font-titulo text-base font-medium uppercase text-white md:text-xl">
                Status
              </th>
              <th className="sticky top-0 bg-cabecalho px-4 py-3 text-center font-titulo text-base font-medium uppercase text-white md:text-xl">
                Turma
              </th>
            </tr>
          </thead>

          <tbody>
            {linhasFiltradas.map((linha) => (
              <tr key={linha.matriculaId} className="group border-b border-texto/40">
                <td className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-sm uppercase md:text-base">
                    <span className="group-hover:text-destaque">{linha.nome}</span>
                    <button
                      type="button"
                      aria-label={`Excluir ${linha.nome} da turma ${linha.turmaId}`}
                      className="shrink-0 text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="h-5 w-5"
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
                </td>

                <td
                  className={`border-l border-texto/40 px-4 py-3 text-center text-base font-medium md:text-xl ${
                    linha.presenca === null
                      ? ""
                      : corDoNivel[nivelFrequencia(linha.presenca)]
                  }`}
                >
                  {linha.presenca === null ? "—" : `${linha.presenca}%`}
                </td>

                <td className="border-l border-texto/40 px-4 py-3 text-center text-base md:text-xl">
                  {linha.turmaId}
                </td>
              </tr>
            ))}

            {linhasFiltradas.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center">
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}