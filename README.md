# 📡 Antenas de Ouro — Sistema de Gestão de Presença Acadêmica

Plataforma web **Full Stack** desenvolvida para modernizar e automatizar o controle de frequência em aulas práticas e laboratoriais, substituindo listas em papel por um fluxo digital centralizado, seguro e responsivo.

Projeto desenvolvido no contexto de consultoria e engenharia de software para a **EngNet**, cobrindo desde o levantamento de requisitos, prototipagem e modelagem de dados até o desenvolvimento do Front-end, Back-end (API REST) e deploy em produção.

---

## 📋 1. Problema Identificado e Solução

O controle manual de presença em ambientes laboratoriais gera gargalos operacionais e administrativos. A tabela abaixo resume como a plataforma resolve cada ponto levantado:

| Problema no Processo Manual | Solução Implementada no Sistema |
| :--- | :--- |
| Assinatura de presença por terceiros e erros de lançamento | Chamada digital autenticada, vinculada individualmente ao professor responsável |
| Desperdício de papel e acúmulo de fichas físicas | Registros armazenados em banco de dados relacional (PostgreSQL) |
| Demora para calcular faltas e gerar relatórios | Cálculo automático em tempo real do percentual de frequência por aluno |
| Dificuldade em identificar alunos em risco de reprovação | Alertas automáticos para frequência inferior a **75%** e classificação visual por faixa |
| Falta de histórico organizado por data e horário | Registro individual de cada aula com data, horário e possibilidade de edição posterior |

---

## 👥 2. Perfis de Usuário e Regras de Negócio

### Perfis do Sistema
* **Administrador (`ADMIN`):** Gerencia os acessos da plataforma, podendo cadastrar, visualizar e remover contas de Professores e outros Administradores.
* **Professor (`PROFESSOR`):** Possui acesso exclusivo às suas próprias turmas, alunos e registros de chamada.
* **Aluno:** Entidade acadêmica vinculada a uma turma para acompanhamento de frequência (não possui login na plataforma).

### Regras de Negócio
1. **Isolamento de Dados:** Cada professor visualiza e gerencia apenas as turmas criadas em sua conta.
2. **Registro Único de Aula:** Cada chamada gera um registro de aula vinculado à turma, data e horário. Caso uma chamada seja aberta novamente na mesma data, o sistema carrega os dados existentes para edição.
3. **Edição Retroativa:** O professor pode consultar e corrigir presenças ou faltas de aulas já encerradas.
4. **Cálculo Automático de Frequência:** O percentual de presença de cada aluno é calculado dinamicamente com base no total de aulas ministradas na turma:
   * **Alta Frequência (`85%` a `100%`):** Indicador em verde.
   * **Frequência Média (`75%` a `84%`):** Indicador em dourado/amarelo.
   * **Baixa Frequência (`< 75%`):** Indicador em vermelho e contabilizado no alerta do painel.

---

## ✨ 3. Funcionalidades e Diferenciais

### Funcionalidades Principais
* **Autenticação e Controle de Rotas:** Login com redirecionamento automático por perfil (`/admin` para administradores e `/` para professores).
* **Dashboard e Calendário Interativo:**
  * Indicadores em tempo real: *Total de Alunos*, *Aulas Cadastradas*, *Presença Média* e *Alunos com Baixa Frequência*.
  * Calendário mensal interativo que permite clicar em qualquer dia e iniciar diretamente a chamada da turma escolhida.
* **Gerenciamento de Turmas (`/turmas`):** Criação, edição, exclusão e visualização de turmas contendo **Nome**, **Código**, **Horário** e **Quantidade de Alunos**.
* **Gestão de Alunos (`/alunos`):** Cadastro vinculado à turma, exclusão e consulta rápida.
* **Controle Digital de Frequência (`/chamada/[turmaId]`):** Seleção de data e horário, alternância rápida entre **Presente** e **Falta**, contador resumido da aula e salvamento persistente.
* **Relatório Individual (`/alunos/[id]`):** Histórico completo de presença aula a aula, percentual geral e situação acadêmica.

### Diferenciais Implementados
* **🌓 Dark Mode Global:** Alternância entre tema claro e escuro via botão flutuante, com suporte completo em tabelas, modais, calendário, menus suspensos e gráficos.
* **📊 Gráficos Dinâmicos em SVG:** Gráfico de pizza interativo na página individual do aluno exibindo a proporção entre presenças e faltas.
* **🔍 Busca, Filtros e Ordenação:** Pesquisa instantânea por nome, filtro por turma, filtro por faixa de frequência (Alta, Média, Baixa) e ordenação crescente/decrescente.
* **📱 Responsividade Mobile-First:** Adaptação completa para **Desktop, Tablet e Smartphone**, priorizando a área de interação no topo da tela em dispositivos móveis.

---

## 🛠️ 4. Tecnologias Utilizadas

* **Front-end (`/FrontEnd`):** Next.js 16 (App Router & Turbopack), React, TypeScript, Tailwind CSS v4.
* **Back-end (`/BackEnd`):** NestJS 10, TypeScript, API REST modular (`auth`, `dashboard`, `turmas`, `alunos`, `chamadas`, `database`) e `node-postgres` (`pg`).
* **Integração Serverless:** Next.js API Routes (`/api/auth` e `/api/dados`) para compatibilidade direta com deploy unificado na Vercel.
* **Banco de Dados:** PostgreSQL (hospedado em nuvem via **Neon**).
* **Hospedagem e Versionamento:** Vercel, Git e GitHub.

---

## 🚀 5. Guia de Utilização (Passo a Passo)

Para testar todas as funcionalidades da plataforma (tanto no link publicado na Vercel quanto localmente), siga o fluxo abaixo:

### Passo 1: Acesso Inicial como Administrador
1. Acesse a tela de login (`/login`).
2. Entre com as credenciais padrão do administrador (criadas automaticamente no banco no primeiro acesso):
   * **E-mail:** `admin@antenas.com`
   * **Senha:** `123`
3. No painel administrativo (`/admin`), cadastre uma conta com o perfil **Professor** (informando nome, e-mail e senha) e clique em **Sair da Conta**.

### Passo 2: Cadastro de Turmas e Alunos (Perfil Professor)
1. Faça login com o e-mail e a senha do **Professor** recém-criado.
2. Acesse a aba **Turmas** e clique em **Adicionar Turma** para cadastrar uma disciplina (ex.: *Laboratório de Redes*, código *ENE001*, horário *Seg/Qua 14h*).
3. Acesse a aba **Alunos** e clique em **Adicionar Aluno** para matricular estudantes na turma criada.

### Passo 3: Registro de Frequência e Consulta de Relatórios
1. Na tela **Início** (pelo calendário) ou dentro de **Turmas** (botão **Realizar Chamada**), selecione a data e o horário da aula.
2. Marque **Presente** ou **Falta** para cada aluno e clique em **Salvar Chamada**.
3. Acesse **Alunos** para visualizar os percentuais atualizados, utilizar os filtros de status/turma ou clicar sobre o nome de um aluno para abrir seu **relatório individual com gráfico**.

---

## 🌐 6. Documentação da API REST (`/BackEnd`)

O servidor NestJS disponibiliza os seguintes endpoints RESTful integrados ao banco PostgreSQL:

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autentica Administrador ou Professor e retorna os dados da sessão |
| `GET` | `/auth/usuarios` | Lista todos os usuários cadastrados |
| `POST` | `/auth/usuarios` | Cadastra um novo Professor ou Administrador |
| `DELETE` | `/auth/usuarios/:id` | Remove um usuário pelo ID |
| `GET` | `/dashboard?professorId={id}` | Retorna métricas gerais e alertas de alunos com frequência `< 75%` |
| `GET` | `/turmas?professorId={id}` | Lista as turmas do professor com o total de alunos matriculados |
| `POST` | `/turmas` | Cria uma nova turma (`nome`, `codigo`, `horario`, `professorId`) |
| `PUT` | `/turmas/:id` | Atualiza os dados de uma turma existente |
| `DELETE` | `/turmas/:id` | Remove uma turma e seus vínculos |
| `GET` | `/alunos?professorId={id}` | Lista alunos com percentual calculado (aceita filtro por `turmaId`) |
| `GET` | `/alunos/:id` | Retorna relatório detalhado e histórico de presenças do aluno |
| `POST` | `/alunos` | Cadastra um novo aluno e realiza sua matrícula na turma |
| `DELETE` | `/alunos/:id` | Remove um aluno do sistema |
| `GET` | `/chamadas?turmaId={id}&data={YYYY-MM-DD}` | Busca a chamada e os alunos de uma turma em determinada data |
| `GET` | `/chamadas/historico?turmaId={id}` | Retorna o histórico de aulas e totais de presentes/faltosos |
| `POST` | `/chamadas` | Registra ou atualiza a chamada e as frequências da aula |

---

## 💻 7. Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* Uma instância do **PostgreSQL** local ou gratuita na nuvem (ex.: [Neon](https://neon.tech))

### 1. Clonar o repositório
```bash
git clone https://github.com/Ursoforte07/Desafio-4---Antenas-de-Ouro.git
cd Desafio-4---Antenas-de-Ouro
git checkout feat/integracao-frontend-banco
```

### 2. Configurar o Banco de Dados
Execute o script SQL de criação das tabelas (`professores`, `turmas`, `alunos`, `matriculas`, `aulas` e `frequencias`) no seu banco PostgreSQL.

### 3. Configurar e Iniciar o Back-end (NestJS)
Em um terminal, acesse a pasta `BackEnd`, configure as variáveis de ambiente e inicie a API:

```bash
cd BackEnd
cp .env.example .env
```

Edite o arquivo `BackEnd/.env` com a sua string de conexão do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"
PORT=3001
```

Instale as dependências e suba o servidor:

```bash
npm install
npm run start:dev
```
> A API REST estará rodando em [http://localhost:3001](http://localhost:3001).

### 4. Configurar e Iniciar o Front-end (Next.js)
Em outro terminal, acesse a pasta `FrontEnd`, crie o arquivo `.env.local` com a mesma `DATABASE_URL` e inicie a aplicação web:

```bash
cd FrontEnd
echo 'DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"' > .env.local
npm install
npm run dev
```
> A interface web estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 📁 8. Estrutura do Projeto

```text
Desafio-4---Antenas-de-Ouro/
├── BackEnd/                        # API REST em NestJS
│   ├── src/
│   │   ├── alunos/                 # Cadastro, listagem com % e relatório individual
│   │   ├── auth/                   # Autenticação e gestão de usuários
│   │   ├── chamadas/               # Registro, edição e histórico de frequências
│   │   ├── dashboard/              # Indicadores gerais e alertas (< 75%)
│   │   ├── database/               # Conexão global com PostgreSQL (Pool pg)
│   │   ├── turmas/                 # CRUD de turmas por professor
│   │   ├── app.module.ts
│   │   └── main.ts                 # Servidor HTTP (porta 3001)
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── FrontEnd/                       # Aplicação Web em Next.js + Tailwind CSS
│   ├── app/
│   │   ├── admin/                  # Painel administrativo de gestão de usuários
│   │   ├── alunos/                 # Listagem com filtros e relatório individual ([id])
│   │   ├── api/
│   │   │   ├── auth/               # Endpoint REST de autenticação e seed inicial
│   │   │   └── dados/              # Endpoint REST de turmas, alunos, aulas e métricas
│   │   ├── chamada/[turmaId]/      # Tela de registro e edição de frequência
│   │   ├── components/             # Header, Sidebar, Calendario, Painel, Tema, Modais
│   │   ├── lib/                    # Conexão com PostgreSQL (pool pg)
│   │   ├── login/                  # Tela de autenticação
│   │   ├── turmas/                 # Gerenciamento de turmas
│   │   ├── globals.css             # Estilos globais e regras de Dark Mode
│   │   └── page.tsx                # Dashboard inicial com calendário
│   ├── public/                     # Ícones, logos e imagens estáticas
│   └── package.json
│
└── README.md
```

---

## 🤝 9. Equipe

Projeto desenvolvido pela equipe **Antenas de Ouro** durante o Programa Trainee da **EngNet — Consultoria em Engenharia de Redes e Telecomunicações (UnB)**.
