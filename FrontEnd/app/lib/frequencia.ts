import type { Aula } from "@/app/types/aula";
import type { Frequencia } from "@/app/types/frequencia";

export const LIMITE_BAIXA_FREQUENCIA = 75;
const LIMITE_ATENCAO = 85;

export type NivelFrequencia = "critica" | "atencao" | "boa";

export function nivelFrequencia(presenca: number): NivelFrequencia {
  if (presenca < LIMITE_BAIXA_FREQUENCIA) return "critica";
  if (presenca < LIMITE_ATENCAO) return "atencao";
  return "boa";
}

export const corDoNivel: Record<NivelFrequencia, string> = {
  critica: "text-red-600",
  atencao: "text-destaque",
  boa: "text-green-700",
};

export function calcularPresenca(
  alunoId: number,
  turmaId: number,
  aulas: Aula[],
  frequencias: Frequencia[]
): number | null {
  const idsAulasDaTurma = new Set(
    aulas.filter((aula) => aula.turmaId === turmaId).map((aula) => aula.id)
  );

  const registros = frequencias.filter(
    (f) => f.alunoId === alunoId && idsAulasDaTurma.has(f.aulaId)
  );

  if (registros.length === 0) return null;

  const presentes = registros.filter((r) => r.presente).length;
  return Math.round((presentes / registros.length) * 100);
}