# 📡 Antenas de Ouro — Sistema de Gestão de Presença Acadêmica

Plataforma web full-stack desenvolvida para modernizar e automatizar o controle de frequência em aulas práticas e laboratoriais, substituindo listas em papel por um fluxo digital centralizado, seguro e responsivo.

Projeto desenvolvido no contexto de consultoria e engenharia de software para a **EngNet**, cobrindo desde o levantamento de requisitos e modelagem de dados até o deploy em produção.

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

* **Front-end:** Next.js 16 (App Router & Turbopack), React, TypeScript, Tailwind CSS v4.
* **Back-end / API:** Next.js API Routes (Arquitetura RESTful em `/api/auth` e `/api/dados`).
* **Banco de Dados:** PostgreSQL (hospedado em nuvem via **Neon**).
* **Hospedagem e Deploy:** Vercel.
* **Versionamento:** Git e GitHub.

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

## 💻 6. Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* Uma instância do **PostgreSQL** local ou gratuita na nuvem (ex.: [Neon](https://neon.tech))

### 1. Clonar o repositório
```bash
git clone https://github.com/rafaeldasilva-byte/Desafio-4---Antenas-de-Ouro.git
cd Desafio-4---Antenas-de-Ouro
git checkout feat/integracao-frontend-banco
```

### 2. Configurar o Banco de Dados
Execute o script SQL de criação das tabelas (`turmas`, `alunos`, `matriculas`, `aulas`, `frequencias` e `usuarios`) no seu banco PostgreSQL.

### 3. Configurar as Variáveis de Ambiente
Dentro da pasta `FrontEnd`, crie um arquivo chamado `.env.local` e adicione a string de conexão do seu banco PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"
```

### 4. Instalar Dependências e Iniciar o Servidor
Entre na pasta `FrontEnd`, instale os pacotes e inicie a aplicação:

```bash
cd FrontEnd
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para utilizar o sistema.

---

## 📁 7. Estrutura do Projeto

```text
Desafio-4---Antenas-de-Ouro/
├── FrontEnd/
│   ├── app/
│   │   ├── admin/              # Painel administrativo de gestão de usuários
│   │   ├── alunos/             # Listagem com filtros e relatório individual ([id])
│   │   ├── api/
│   │   │   ├── auth/           # Endpoint REST de autenticação e seed inicial
│   │   │   └── dados/          # Endpoint REST de turmas, alunos, aulas e métricas
│   │   ├── chamada/[turmaId]/  # Tela de registro e edição de frequência
│   │   ├── components/         # Componentes reutilizáveis (Header, Sidebar, Calendario, Painel, etc.)
│   │   ├── lib/                # Conexão com PostgreSQL (pool pg)
│   │   ├── login/              # Tela de autenticação
│   │   ├── turmas/             # Gerenciamento de turmas
│   │   ├── globals.css         # Estilos globais e regras de Dark Mode
│   │   └── page.tsx            # Dashboard inicial com calendário
│   ├── public/                 # Ícones, logos e imagens estáticas
│   └── package.json
└── README.md
```

---

## 🤝 8. Equipe

Projeto desenvolvido pela equipe de Trainees da **EngNet — Consultoria em Engenharia de Redes e Telecomunicações (UnB)**.