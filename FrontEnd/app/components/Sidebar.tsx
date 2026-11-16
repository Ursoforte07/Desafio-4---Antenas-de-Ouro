"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ItemMenuProps = {
  href: string;
  icone: string;
  texto: string;
  ativo: boolean;
  aoClicar: () => void;
};

function ItemMenu({ href, icone, texto, ativo, aoClicar }: ItemMenuProps) {
  return (
    <Link
      href={href}
      onClick={aoClicar}
      aria-current={ativo ? "page" : undefined}
      className={`group flex items-center gap-4 px-6 py-4 text-xl uppercase ${
        ativo
          ? "bg-cabecalho text-fundo"
          : "text-texto hover:bg-detalhe hover:text-fundo"
      }`}
    >
      <img
        src={icone}
        alt=""
        className={`h-8 w-8 ${
          ativo
            ? "brightness-0 invert"
            : "group-hover:brightness-0 group-hover:invert"
        }`}
      />
      {texto}
    </Link>
  );
}

type IndicadorProps = {
  rotulo: string;
  valor: string | number;
  href?: string;
  alerta?: boolean;
};

function Indicador({ rotulo, valor, href, alerta = false }: IndicadorProps) {
  const conteudo = (
    <div className="flex justify-between gap-2">
      <span>{rotulo}</span>
      <strong className={alerta ? "text-red-600" : ""}>{valor}</strong>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block px-2 py-1 hover:bg-detalhe/40">
        {conteudo}
      </Link>
    );
  }

  return <div className="px-2 py-1">{conteudo}</div>;
}

type SidebarProps = {
  totalAlunos: number;
  aulasCadastradas: number;
  presencaMedia: number;
  alunosBaixaFrequencia: number;
};

export default function Sidebar({
  totalAlunos,
  aulasCadastradas,
  presencaMedia,
  alunosBaixaFrequencia,
}: SidebarProps) {
  const temAlerta = alunosBaixaFrequencia > 0;
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        className="relative z-[60] flex items-center self-start p-3 text-texto md:hidden"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <path d={aberto ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {aberto && (
        <div
          onClick={() => setAberto(false)}
          className="absolute inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`absolute inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-texto bg-white pt-14 transition-transform md:static md:translate-x-0 md:pt-0 ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="divide-y divide-texto">
          <ItemMenu
            href="/turmas"
            icone="/people.png"
            texto="Turmas"
            ativo={caminho.startsWith("/turmas")}
            aoClicar={() => setAberto(false)}
          />
          <ItemMenu
            href="/alunos"
            icone="/person.png"
            texto="Alunos"
            ativo={caminho.startsWith("/alunos")}
            aoClicar={() => setAberto(false)}
          />
        </nav>

        <section className="flex flex-col gap-1 border-t border-texto px-4 py-4 text-base">
          <Indicador rotulo="Total de alunos" valor={totalAlunos} />
          <Indicador rotulo="Aulas cadastradas" valor={aulasCadastradas} />
          <Indicador rotulo="Presença média" valor={`${presencaMedia}%`} />
          <Indicador
            rotulo="Baixa frequência"
            valor={alunosBaixaFrequencia}
            alerta={temAlerta}
            href={temAlerta ? "/alunos?filtro=baixa-frequencia" : undefined}
          />
        </section>

        <button
          type="button"
          className="mt-auto border-t border-texto px-6 py-4 text-left text-lg hover:bg-detalhe hover:text-fundo"
        >
          Sair
        </button>
      </aside>
    </>
  );
}