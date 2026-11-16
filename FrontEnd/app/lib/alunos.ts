import type { Aluno, LinhaAluno } from "@/app/types/aluno";
import type { Matricula } from "@/app/types/matricula";
import type { Aula } from "@/app/types/aula";
import type { Frequencia } from "@/app/types/frequencia";
import { calcularPresenca } from "@/app/lib/frequencia";

type DadosAlunos = {
  alunos: Aluno[];
  matriculas: Matricula[];
  aulas: Aula[];
  frequencias: Frequencia[];
};

export function montarLinhas({
  alunos,
  matriculas,
  aulas,
  frequencias,
}: DadosAlunos): LinhaAluno[] {
  return matriculas.flatMap((matricula) => {
    const aluno = alunos.find((a) => a.id === matricula.alunoId);

    if (!aluno) return [];

    return [
      {
        matriculaId: matricula.id,
        alunoId: aluno.id,
        nome: aluno.nome,
        turmaId: matricula.turmaId,
        presenca: calcularPresenca(aluno.id, matricula.turmaId, aulas, frequencias),
      },
    ];
  });
}