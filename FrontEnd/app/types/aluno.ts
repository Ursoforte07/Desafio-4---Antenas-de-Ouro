export type Aluno = {
  id: number;
  nome: string;
};

export type LinhaAluno = {
  matriculaId: number;
  alunoId: number;
  nome: string;
  turmaId: number;
  presenca: number | null;
};