import type { ReactNode } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";

type PainelProps = {
  titulo: string;
  children: ReactNode;
};

export default function Painel({ titulo, children }: PainelProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo={titulo} />

      <div className="relative flex flex-1 flex-col md:flex-row">
        <Sidebar
          totalAlunos={120}
          aulasCadastradas={36}
          presencaMedia={82}
          alunosBaixaFrequencia={5}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}