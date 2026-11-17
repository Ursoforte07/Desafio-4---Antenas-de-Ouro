"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const MESES = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];
const DIAS_SEMANA = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

export default function Calendario() {
  const router = useRouter();
  const [mes, setMes] = useState(10); // Novembro
  const [ano, setAno] = useState(2026);
  const [dataModal, setDataModal] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [turmaEscolhida, setTurmaEscolhida] = useState<string>("");

  const anosDisponiveis = useMemo(() => {
    const inicio = Math.min(2024, ano - 5);
    const fim = ano + 10;
    const lista: number[] = [];
    for (let a = inicio; a <= fim; a++) {
      lista.push(a);
    }
    return lista;
  }, [ano]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (user?.id) {
      fetch(`/api/dados?professorId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.turmas) {
            setTurmas(data.turmas);
            if (data.turmas.length > 0) setTurmaEscolhida(String(data.turmas[0].id));
          }
        });
    }
  }, []);

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasMesAnterior = new Date(ano, mes, 0).getDate();

  const celulas: { dia: number; mesAtual: boolean }[] = [];
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    celulas.push({ dia: diasMesAnterior - i, mesAtual: false });
  }
  for (let d = 1; d <= diasNoMes; d++) {
    celulas.push({ dia: d, mesAtual: true });
  }
  const totalCelulas = celulas.length <= 35 ? 35 : 42;
  let proximoDia = 1;
  while (celulas.length < totalCelulas) {
    celulas.push({ dia: proximoDia++, mesAtual: false });
  }

  const avancarMes = () => {
    if (mes === 11) {
      setMes(0);
      setAno((a) => a + 1);
    } else {
      setMes((m) => m + 1);
    }
  };

  const voltarMes = () => {
    if (mes === 0) {
      setMes(11);
      setAno((a) => a - 1);
    } else {
      setMes((m) => m - 1);
    }
  };

  const abrirSelecaoTurma = (dia: number) => {
    const mesFormatado = String(mes + 1).padStart(2, "0");
    const diaFormatado = String(dia).padStart(2, "0");
    setDataModal(`${ano}-${mesFormatado}-${diaFormatado}`);
  };

  const irParaChamada = () => {
    if (!turmaEscolhida || !dataModal) return;
    router.push(`/chamada/${turmaEscolhida}?data=${dataModal}`);
  };

  return (
    <div className="w-full text-[#4F5D75]">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={voltarMes}
          className="px-2 py-1 text-[#4F5D75] hover:bg-[#E1D8CE] rounded transition-colors font-bold cursor-pointer"
          aria-label="Mês anterior"
        >
          &lt;
        </button>

        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="bg-white text-[#4F5D75] border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium uppercase"
        >
          {MESES.map((nomeMes, index) => (
            <option key={nomeMes} value={index}>{nomeMes}</option>
          ))}
        </select>

        <select
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="bg-white text-[#4F5D75] border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium"
        >
          {anosDisponiveis.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={avancarMes}
          className="px-2 py-1 text-[#4F5D75] hover:bg-[#E1D8CE] rounded transition-colors font-bold cursor-pointer"
          aria-label="Próximo mês"
        >
          &gt;
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-gray-400 bg-white shadow-sm">
        <div className="grid grid-cols-7 bg-[#2D3142] text-white">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="py-3 text-center text-xs md:text-sm font-semibold uppercase">
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {celulas.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={!item.mesAtual}
              onClick={() => item.mesAtual && abrirSelecaoTurma(item.dia)}
              className={`h-20 md:h-24 border-t border-r border-gray-300 flex items-center justify-center text-lg transition-colors last:border-r-0 ${
                !item.mesAtual
                  ? "celula-fora-mes bg-[#FDFBF7] text-[#4F5D75]/40 cursor-default"
                  : "bg-white text-[#4F5D75] hover:bg-[#E1D8CE] cursor-pointer font-medium"
              }`}
            >
              {item.dia}
            </button>
          ))}
        </div>
      </div>

      {dataModal && (
        <div
          onClick={() => setDataModal(null)}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FDFBF7] border border-[#4F5D75] rounded-2xl max-w-md w-full p-6 shadow-xl normal-case"
          >
            <h3 className="text-xl font-bold uppercase text-[#2D3142] mb-2">
              REALIZAR CHAMADA
            </h3>
            <p className="text-[#4F5D75] mb-4">
              Data selecionada:{" "}
              <strong>{dataModal.split("-").reverse().join("/")}</strong>
            </p>

            {turmas.length > 0 ? (
              <>
                <label className="block text-sm font-medium text-[#4F5D75] mb-1">
                  Escolha a turma:
                </label>
                <select
                  value={turmaEscolhida}
                  onChange={(e) => setTurmaEscolhida(e.target.value)}
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
                    onClick={() => setDataModal(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#4F5D75] uppercase text-sm cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="button"
                    onClick={irParaChamada}
                    className="px-5 py-2 rounded-lg bg-[#D4AF37] text-white font-bold uppercase text-sm cursor-pointer"
                  >
                    ABRIR CHAMADA
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-red-600 text-sm mb-4">
                  Você ainda não possui turmas cadastradas.
                </p>
                <button
                  type="button"
                  onClick={() => setDataModal(null)}
                  className="px-4 py-2 rounded-lg bg-[#2D3142] text-white uppercase text-sm cursor-pointer"
                >
                  FECHAR
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}