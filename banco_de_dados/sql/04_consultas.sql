-- 1. Indicadores gerais do Dashboard / Sidebar
SELECT * FROM vw_dashboard;

-- 2. Listagem de turmas com total de alunos, aulas cadastradas, baixa frequência e percentual de presença
SELECT * FROM vw_resumo_turmas ORDER BY id;

-- 3. Listagem de alunos por matrícula (formato LinhaAluno do FrontEnd)
SELECT
  matricula_id AS "matriculaId",
  aluno_id AS "alunoId",
  nome,
  turma_id AS "turmaId",
  presenca,
  nivel,
  status_color AS "statusColor"
FROM vw_linhas_alunos
ORDER BY matricula_id;

-- 4. Filtro de alunos com baixa frequência (< 75%) para alertas do Dashboard
SELECT
  matricula_id AS "matriculaId",
  aluno_id AS "alunoId",
  nome,
  turma_id AS "turmaId",
  turma_nome AS "turmaNome",
  presenca
FROM vw_linhas_alunos
WHERE presenca < 75
ORDER BY presenca ASC;

-- 5. Busca de aluno por nome (case-insensitive)
SELECT *
FROM vw_linhas_alunos
WHERE LOWER(nome) LIKE LOWER('%amanda%');

-- 6. Histórico de aulas e chamadas de uma turma específica
SELECT
  au.id AS aula_id,
  au.turma_id,
  au.data,
  au.horario,
  COUNT(f.id)::INTEGER AS total_registros,
  COUNT(f.id) FILTER (WHERE f.presente = true)::INTEGER AS presentes,
  COUNT(f.id) FILTER (WHERE f.presente = false)::INTEGER AS faltas
FROM aulas au
LEFT JOIN frequencias f ON f.aula_id = au.id
WHERE au.turma_id = 1
GROUP BY au.id, au.turma_id, au.data, au.horario
ORDER BY au.data ASC;

-- 7. Alterar/corrigir registro de frequência mesmo após o encerramento da chamada (Upsert)
INSERT INTO frequencias (aula_id, aluno_id, presente, atualizado_em)
VALUES (1, 1, true, now())
ON CONFLICT (aula_id, aluno_id)
DO UPDATE SET
  presente = EXCLUDED.presente,
  atualizado_em = now();
