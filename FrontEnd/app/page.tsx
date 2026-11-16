import { Suspense } from "react";
import Painel from "@/app/components/Painel";
import Calendario from "@/app/components/Calendario";

export default function TelaPrincipal() {
  const nomeProf = "Bernardo";

  return (
    <Painel titulo={`Bem-vindo(a), professor(a) ${nomeProf}`}>
      <Suspense fallback={<p>Carregando calendário...</p>}>
        <Calendario />
      </Suspense>
    </Painel>
  );
}