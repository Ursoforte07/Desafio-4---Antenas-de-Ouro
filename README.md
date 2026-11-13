# Desafio-4---Antenas-de-Ouro

## 1. Sobre o projeto

Esta é uma plataforma web desenvolvida para auxiliar professores na gestão de frequência de aulas práticas e laboratoriais.

O sistema busca substituir os registros manuais em papel por um processo digital, facilitando o controle de presença e a consulta de informações.


## 2. Problema identificado

O processo manual de registro de frequência pode gerar problemas como:
- Alunos assinando presença por colegas.
- Erros no lançamento de frequências.
- Dificuldade de acompanhar o histórico de presença.
- Desperdício de papel.
- Demora na geração de relatórios.
- Sobrecarga de trabalho para os professores.

## 3. Objetivo

Desenvolver um sistema que facilite o registro e o acompanhamento da frequência dos alunos, reduza erros e permita a geração rápida de relatórios.


## 4. Usuários do sistema

- **Professores:** podem criar suas próprias contas, realizar login e gerenciar turmas e frequências.
- **Alunos:** são cadastrados como registros, mas não possuem acesso à plataforma.

Cada professor terá acesso exclusivo às turmas sob sua responsabilidade.

## 5. Regras de negócio

- Cada professor pode criar sua própria conta.
- Cada professor possui acesso exclusivo às suas turmas.
- O professor pode criar, editar e excluir suas próprias turmas.
- O professor pode cadastrar, editar e remover alunos de suas turmas.
- O professor pode registrar e corrigir as frequências dos alunos.
- Os alunos não possuem contas ou acesso à plataforma
- Cada chamada deve gerar um registro individual de aula, contendo data e horário.
- A frequência dos alunos deve estar vinculada a uma aula específica.
- O professor pode consultar o histórico de aulas e suas respectivas frequências.
- O professor pode alterar os registros de frequência mesmo após o encerramento da chamada.
- O sistema calcula automaticamente o percentual de frequência de cada aluno com base nas aulas registradas.
- O sistema deve identificar alunos com frequência inferior a 75%.
- Alunos abaixo desse limite devem aparecer como alertas no dashboard.

## 6. Funcionalidades principais

- **Dashboard:** indicadores gerais e alertas de baixa frequência.
- **Gerenciamento de turmas:** criação, edição, remoção e visualização de turmas e alunos.
- **Registro de frequência:** marcação de presença e falta durante as aulas.
- **Relatórios:** consulta de frequência individual, percentual de presença e histórico por turma.
- **Autenticação:** acesso restrito aos professores.

## 7. Tecnologias usadas

- Front-end: Next.js, TypeScript e Tailwind CSS.
- Back-end: NestJS.
- Banco de dados: PostgreSQL.
- Versionamento: Git e GitHub.

## 8. Prototipagem

A interface do sistema foi planejada e prototipada no Figma.

## 9. Equipe

Projeto acadêmico desenvolvido em grupo.

## 10. Funcionamento

Para fazer o frontEnd funcionar, deve-se colocar o comando npm run dev no terminal, estando na pasta FrontEnd.