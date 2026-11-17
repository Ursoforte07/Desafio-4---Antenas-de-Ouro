"use client";

type GraficoPizzaProps = {
  percentualPresentes: number;
  labelFaltosos?: string;
  labelPresentes?: string;
};

export default function GraficoPizza({
  percentualPresentes,
  labelFaltosos = "Faltosos",
  labelPresentes = "Presentes",
}: GraficoPizzaProps) {
  const pctPres = Math.max(0, Math.min(100, Math.round(percentualPresentes)));
  const pctFalt = 100 - pctPres;

  const cx = 120;
  const cy = 115;
  const r = 88;

  const polarParaCartesiano = (anguloGraus: number, raio: number) => {
    const rad = ((anguloGraus - 90) * Math.PI) / 180;
    return {
      x: cx + raio * Math.cos(rad),
      y: cy + raio * Math.sin(rad),
    };
  };

  const criarCaminhoFatia = (inicioGraus: number, fimGraus: number) => {
    const inicio = polarParaCartesiano(fimGraus, r);
    const fim = polarParaCartesiano(inicioGraus, r);
    const arcoGrande = fimGraus - inicioGraus <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${inicio.x} ${inicio.y} A ${r} ${r} 0 ${arcoGrande} 0 ${fim.x} ${fim.y} Z`;
  };

  // Fatia de faltosos inicia no topo-direito (20°)
  const inicioFalt = 20;
  const anguloFaltosos = (pctFalt / 100) * 360;
  const fimFalt = inicioFalt + anguloFaltosos;

  // Ângulo central de cada fatia
  const meioFalt = inicioFalt + anguloFaltosos / 2;
  const meioPres = fimFalt + (360 - anguloFaltosos) / 2;

  // Posição dos números percentuais dentro de cada fatia
  const raioTextoFalt = pctFalt < 18 ? r * 0.68 : r * 0.52;
  const raioTextoPres = pctPres < 18 ? r * 0.68 : r * 0.52;
  const posTextoFalt = polarParaCartesiano(meioFalt, raioTextoFalt);
  const posTextoPres = polarParaCartesiano(meioPres, raioTextoPres);

  // Ponto de origem das setas (próximo à borda externa do meio de cada fatia)
  const origemSetaFalt =
    pctFalt === 100 ? { x: cx + r * 0.65, y: cy } : polarParaCartesiano(meioFalt, r * 0.82);

  const origemSetaPres =
    pctPres === 100 ? { x: cx + r * 0.65, y: cy } : polarParaCartesiano(meioPres, r * 0.82);

  // Define qual legenda fica em cima e qual fica embaixo para as setas nunca se cruzarem
  const presentesVaiPorCima = pctFalt >= 35 && pctFalt <= 68;
  const destinoXFimSeta = 248;
  const textoX = 256;

  const alvoYFalt = presentesVaiPorCima ? 175 : 35;
  const alvoYPres = presentesVaiPorCima ? 35 : 195;

  // Constrói curva suave que parte de dentro da fatia sem atravessar o círculo
  const gerarCurvaSeta = (origem: { x: number; y: number }, destinoY: number) => {
    // Se a fatia estiver na metade esquerda do círculo, contorna por fora (cima ou baixo)
    if (origem.x < cx) {
      const vaiPorCima = destinoY < cy;
      const controleX = cx + 25;
      const controleY = vaiPorCima ? cy - r - 32 : cy + r + 32;
      return `M ${origem.x.toFixed(1)} ${origem.y.toFixed(1)} Q ${controleX} ${controleY} ${destinoXFimSeta} ${destinoY}`;
    }

    // Se a fatia estiver na metade direita, curva diretamente para a legenda
    const controleX = (origem.x + destinoXFimSeta) / 2;
    return `M ${origem.x.toFixed(1)} ${origem.y.toFixed(1)} Q ${controleX.toFixed(1)} ${destinoY} ${destinoXFimSeta} ${destinoY}`;
  };

  return (
    <div className="flex items-center justify-center select-none">
      <svg
        viewBox="0 0 365 230"
        className="w-72 sm:w-80 md:w-96 h-auto overflow-visible"
      >
        {/* Sombra suave do círculo */}
        <circle cx={cx} cy={cy + 3} r={r} fill="rgba(0,0,0,0.12)" />

        {/* 100% Presentes */}
        {pctFalt === 0 && (
          <>
            <circle cx={cx} cy={cy} r={r} fill="#4F5D75" />
            <text
              x={cx}
              y={cy}
              fill="#FFFFFF"
              fontSize="15"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              100%
            </text>
          </>
        )}

        {/* 100% Faltosos */}
        {pctPres === 0 && (
          <>
            <circle cx={cx} cy={cy} r={r} fill="#2D3142" />
            <text
              x={cx}
              y={cy}
              fill="#FFFFFF"
              fontSize="15"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              100%
            </text>
          </>
        )}

        {/* Fatias mistas */}
        {pctFalt > 0 && pctPres > 0 && (
          <>
            <path d={criarCaminhoFatia(fimFalt, inicioFalt + 360)} fill="#4F5D75" />
            <path d={criarCaminhoFatia(inicioFalt, fimFalt)} fill="#2D3142" />

            <text
              x={posTextoFalt.x}
              y={posTextoFalt.y}
              fill="#FFFFFF"
              fontSize={pctFalt < 12 ? "11" : "14"}
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pctFalt}%
            </text>

            <text
              x={posTextoPres.x}
              y={posTextoPres.y}
              fill="#FFFFFF"
              fontSize={pctPres < 12 ? "11" : "14"}
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pctPres}%
            </text>
          </>
        )}

        {/* Seta e legenda: Faltosos (só desenha a seta se houver faltosos > 0%) */}
        {pctFalt > 0 && (
          <>
            <path
              d={gerarCurvaSeta(origemSetaFalt, alvoYFalt)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#4F5D75]"
            />
            <polyline
              points={`${destinoXFimSeta - 5},${alvoYFalt - 4} ${destinoXFimSeta + 1},${alvoYFalt} ${destinoXFimSeta - 5},${alvoYFalt + 4}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#4F5D75]"
            />
          </>
        )}
        <text
          x={textoX}
          y={alvoYFalt + 5}
          fill="currentColor"
          fontSize="16"
          fontWeight="500"
          className="text-[#4F5D75]"
        >
          {labelFaltosos}
        </text>

        {/* Seta e legenda: Presentes (só desenha a seta se houver presentes > 0%) */}
        {pctPres > 0 && (
          <>
            <path
              d={gerarCurvaSeta(origemSetaPres, alvoYPres)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#4F5D75]"
            />
            <polyline
              points={`${destinoXFimSeta - 5},${alvoYPres - 4} ${destinoXFimSeta + 1},${alvoYPres} ${destinoXFimSeta - 5},${alvoYPres + 4}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#4F5D75]"
            />
          </>
        )}
        <text
          x={textoX}
          y={alvoYPres + 5}
          fill="currentColor"
          fontSize="16"
          fontWeight="500"
          className="text-[#4F5D75]"
        >
          {labelPresentes}
        </text>
      </svg>
    </div>
  );
}