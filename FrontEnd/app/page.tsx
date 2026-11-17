"use client";

import { Suspense, useEffect, useState } from "react";
import Painel from "@/app/components/Painel";
import Calendario from "@/app/components/Calendario";

export default function TelaPrincipal() {
  const [nomeProf, setNomeProf] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (user?.nome) setNomeProf(user.nome);
  }, []);

  return (
    <Painel titulo={`BEM VINDO, PROFESSOR ${nomeProf}`}>
      <div className="-mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6 overflow-hidden border-b border-gray-300">
        <img
          src="/banner.png"
          alt="Banner escolar"
          className="w-full h-40 md:h-52 object-cover block"
        />
      </div>

      <Suspense fallback={<p>Carregando calendário...</p>}>
        <Calendario />
      </Suspense>
    </Painel>
  );
}