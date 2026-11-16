import Painel from "@/app/components/Painel";
import ListaAlunos from "@/app/components/ListaAlunos";
import {
  alunosProvisorios,
  matriculasProvisorias,
  aulasProvisorias,
  frequenciasProvisorias,
} from "@/app/data/alunos";
import { montarLinhas } from "@/app/lib/alunos";

export default function PaginaAlunos() {
  const linhas = montarLinhas({
    alunos: alunosProvisorios,
    matriculas: matriculasProvisorias,
    aulas: aulasProvisorias,
    frequencias: frequenciasProvisorias,
  });

  return (
    <Painel titulo="Alunos">
      <ListaAlunos linhas={linhas} />
    </Painel>
  );
}