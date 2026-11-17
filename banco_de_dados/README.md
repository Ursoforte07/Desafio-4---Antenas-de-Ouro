# Banco de Dados - Desafio 4 (Antenas de Ouro)

Modelagem e scripts PostgreSQL para o sistema de gestão de frequência acadêmica em aulas práticas e laboratoriais.

## Estrutura dos arquivos

- `sql/01_schema.sql`: criação das tabelas (`professores`, `turmas`, `alunos`, `matriculas`, `aulas` e `frequencias`), chaves primárias, chaves estrangeiras, constraints de unicidade e índices.
- `sql/02_views.sql`: views para cálculo automático de percentual de presença por aluno/turma (`vw_linhas_alunos`), estatísticas por turma (`vw_resumo_turmas`) e indicadores gerais do dashboard (`vw_dashboard`).
- `sql/03_seed.sql`: carga inicial de dados correspondente aos registros de `FrontEnd/app/data/alunos.ts` e `FrontEnd/app/turmas/page.tsx`.
- `sql/04_consultas.sql`: consultas prontas para listagem, filtros de baixa frequência (`< 75%`), relatórios e atualização de chamadas.
- `docker-compose.yml`: sobe o PostgreSQL 16 localmente já executando os scripts de criação e população do banco.
- `.env.example`: modelo das variáveis de conexão com o banco.

## Tabelas e relacionamentos

1. **`professores`**: armazena os dados de acesso do professor (`id`, `nome`, `email`, `senha_hash`).
2. **`turmas`**: armazena `id`, `nome`, `codigo`, `horario` e `professor_id`.
3. **`alunos`**: cadastro dos estudantes (`id`, `nome`).
4. **`matriculas`**: tabela associativa entre `alunos` e `turmas` (`UNIQUE (aluno_id, turma_id)`).
5. **`aulas`**: registro de cada chamada realizada na turma com `data` e `horario` (`UNIQUE (turma_id, data, horario)`).
6. **`frequencias`**: presença ou falta de cada aluno por aula (`UNIQUE (aula_id, aluno_id)`).

## Como executar

### Opção 1: Via Docker
```bash
docker compose up -d
```
O container executa automaticamente `01_schema.sql`, `02_views.sql` e `03_seed.sql` na inicialização.

### Opção 2: Via cliente `psql`
```bash
psql "$DATABASE_URL" -f sql/01_schema.sql
psql "$DATABASE_URL" -f sql/02_views.sql
psql "$DATABASE_URL" -f sql/03_seed.sql
```
