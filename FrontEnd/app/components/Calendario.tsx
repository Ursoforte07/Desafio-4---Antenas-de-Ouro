"use client";

import { useState } from "react";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function gerarCelulas(ano: number, mes: number) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const celulas: (number | null)[] = [];

  for (let i = 0; i < primeiroDiaSemana; i++) {
    celulas.push(null);
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    celulas.push(dia);
  }
  while (celulas.length % 7 !== 0) {
    celulas.push(null);
  }

  return celulas;
}

export default function Calendario() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const celulas = gerarCelulas(ano, mes);
  const anos = Array.from({ length: 11 }, (_, i) => ano - 5 + i);

  function mesAnterior() {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  }

  function proximoMes() {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  }

  return (
    <section aria-label="Calendário de aulas">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={mesAnterior}
          aria-label="Mês anterior"
          className="rounded p-1 text-texto hover:bg-detalhe/40"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          aria-label="Mês"
          className="rounded border border-texto bg-white px-2 py-1 text-sm md:text-base"
        >
          {MESES.map((nome, indice) => (
            <option key={nome} value={indice}>
              {nome}
            </option>
          ))}
        </select>

        <select
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          aria-label="Ano"
          className="rounded border border-texto bg-white px-2 py-1 text-sm md:text-base"
        >
          {anos.map((valor) => (
            <option key={valor} value={valor}>
              {valor}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={proximoMes}
          aria-label="Próximo mês"
          className="rounded p-1 text-texto hover:bg-detalhe/40"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-texto">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="bg-cabecalho py-2 text-center text-xs uppercase text-white sm:text-sm md:text-base"
          >
            <span className="sm:hidden">{dia.slice(0, 3)}</span>
            <span className="hidden sm:inline">{dia}</span>
          </div>
        ))}

        {celulas.map((dia, indice) => (
          <div
            key={indice}
            className={`min-h-16 border-b border-r border-texto/30 p-1 text-sm md:min-h-24 md:p-2 md:text-base ${
              dia === null ? "bg-detalhe/20" : "bg-white"
            }`}
          >
            {dia}
          </div>
        ))}
      </div>
    </section>
  );
}