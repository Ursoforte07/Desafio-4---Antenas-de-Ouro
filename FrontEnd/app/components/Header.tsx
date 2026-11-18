"use client";

import Link from "next/link";

type HeaderProps = {
  titulo: string;
  subtitulo?: string;
};

export default function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="w-full bg-[#2D3142] text-white px-4 sm:px-6 md:px-8 py-3.5 md:py-5 shadow-sm">
      {/* Layout Mobile: barra superior com Início + Logo e título com largura total abaixo */}
      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:text-[#E1D8CE] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span>INÍCIO</span>
          </Link>

          <img
            src="/antenas_de_ouros.png"
            alt="Antenas de Ouro"
            className="w-8 h-8 object-contain"
          />
        </div>

        <div className="border-t border-white/10 pt-2 text-center">
          <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide leading-snug px-2">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-xs text-[#E1D8CE] uppercase tracking-wider mt-0.5">
              {subtitulo}
            </p>
          )}
        </div>
      </div>

      {/* Layout Desktop: mantém o visual original em linha única */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-medium uppercase tracking-wide hover:text-[#E1D8CE] transition-colors shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span>INÍCIO</span>
        </Link>

        <div className="text-center flex-1 px-4">
          <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-wide">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-sm text-[#E1D8CE] uppercase tracking-wider mt-0.5">
              {subtitulo}
            </p>
          )}
        </div>

        <img
          src="/antenas_de_ouros.png"
          alt="Antenas de Ouro"
          className="w-10 h-10 object-contain shrink-0"
        />
      </div>
    </header>
  );
}