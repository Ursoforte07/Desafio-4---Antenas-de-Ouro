import type { Aluno } from "@/app/types/aluno";
import type { Matricula } from "@/app/types/matricula";
import type { Aula } from "@/app/types/aula";
import type { Frequencia } from "@/app/types/frequencia";

export const alunosProvisorios: Aluno[] = [
  { id: 1, nome: "Amanda Castro Nogueira Barbosa" },
  { id: 2, nome: "Arthur Oliveira Santos Costa" },
  { id: 3, nome: "Alice Reis Oliveira Araújo" },
  { id: 4, nome: "Amélio Cardoso Ferreira de Melo" },
  { id: 5, nome: "Diego Almeida Carvalho Sousa" },
  { id: 6, nome: "Eduardo Rocha Dias Monteiro" },
  { id: 7, nome: "Letícia Costa Fernandes Melo" },
  { id: 8, nome: "Marina Pereira Gomes Almeida" },
  { id: 9, nome: "Renato Ferreira Mendes Pinto" },
];

export const matriculasProvisorias: Matricula[] = [
  { id: 1, alunoId: 1, turmaId: 1 },
  { id: 2, alunoId: 2, turmaId: 2 },
  { id: 3, alunoId: 2, turmaId: 3 },
  { id: 4, alunoId: 3, turmaId: 1 },
  { id: 5, alunoId: 4, turmaId: 2 },
  { id: 6, alunoId: 5, turmaId: 1 },
  { id: 7, alunoId: 6, turmaId: 2 },
  { id: 8, alunoId: 7, turmaId: 3 },
  { id: 9, alunoId: 8, turmaId: 3 },
  { id: 10, alunoId: 9, turmaId: 3 },
  { id: 11, alunoId: 9, turmaId: 1 },
];

export const aulasProvisorias: Aula[] = [1, 2, 3].flatMap((turmaId, i) =>
  Array.from({ length: 8 }, (_, n) => ({
    id: i * 8 + n + 1,
    turmaId,
    data: `2026-11-${String(n + 2).padStart(2, "0")}`,
    horario: "14:00",
  }))
);

const marcacoes: Record<number, string> = {
  1: "PPPPPPPF",
  2: "PPPPPPFF",
  3: "PFPPFPFP",
  4: "PPPPPPPP",
  5: "PPFPPFFP",
  6: "PPPPPPFP",
  7: "PPFPPPFP",
  8: "FPFFPFFP",
  9: "PFPFPFPF",
  10: "PPPPPPPP",
  11: "PPPPPFPP",
};

export const frequenciasProvisorias: Frequencia[] = matriculasProvisorias.flatMap(
  (matricula) => {
    const aulasDaTurma = aulasProvisorias.filter(
      (aula) => aula.turmaId === matricula.turmaId
    );

    return aulasDaTurma.map((aula, n) => ({
      aulaId: aula.id,
      alunoId: matricula.alunoId,
      presente: marcacoes[matricula.id][n] === "P",
    }));
  }
);