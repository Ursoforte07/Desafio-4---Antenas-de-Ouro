CREATE OR REPLACE VIEW vw_linhas_alunos AS
SELECT
  m.id AS matricula_id,
  a.id AS aluno_id,
  a.nome,
  m.turma_id,
  t.nome AS turma_nome,
  t.codigo AS turma_codigo,
  COUNT(f.id)::INTEGER AS total_aulas,
  COUNT(f.id) FILTER (WHERE f.presente = true)::INTEGER AS aulas_presentes,
  COUNT(f.id) FILTER (WHERE f.presente = false)::INTEGER AS aulas_faltas,
  CASE
    WHEN COUNT(f.id) = 0 THEN NULL
    ELSE ROUND((COUNT(f.id) FILTER (WHERE f.presente = true)::NUMERIC / COUNT(f.id)) * 100)::INTEGER
  END AS presenca,
  CASE
    WHEN COUNT(f.id) = 0 THEN 'boa'
    WHEN ROUND((COUNT(f.id) FILTER (WHERE f.presente = true)::NUMERIC / COUNT(f.id)) * 100) < 75 THEN 'critica'
    WHEN ROUND((COUNT(f.id) FILTER (WHERE f.presente = true)::NUMERIC / COUNT(f.id)) * 100) < 85 THEN 'atencao'
    ELSE 'boa'
  END AS nivel,
  CASE
    WHEN COUNT(f.id) = 0 THEN 'GREEN'
    WHEN ROUND((COUNT(f.id) FILTER (WHERE f.presente = true)::NUMERIC / COUNT(f.id)) * 100) <= 74 THEN 'RED'
    WHEN ROUND((COUNT(f.id) FILTER (WHERE f.presente = true)::NUMERIC / COUNT(f.id)) * 100) <= 84 THEN 'YELLOW'
    ELSE 'GREEN'
  END AS status_color
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN turmas t ON t.id = m.turma_id
LEFT JOIN aulas au ON au.turma_id = m.turma_id
LEFT JOIN frequencias f ON f.aula_id = au.id AND f.aluno_id = m.aluno_id
GROUP BY m.id, a.id, a.nome, m.turma_id, t.nome, t.codigo;

CREATE OR REPLACE VIEW vw_resumo_turmas AS
SELECT
  t.id,
  t.nome,
  t.codigo,
  t.horario,
  t.professor_id,
  COUNT(DISTINCT la.aluno_id)::INTEGER AS total_alunos,
  (SELECT COUNT(*)::INTEGER FROM aulas au WHERE au.turma_id = t.id) AS aulas_cadastradas,
  COUNT(DISTINCT la.aluno_id) FILTER (WHERE la.presenca IS NOT NULL AND la.presenca < 75)::INTEGER AS alunos_baixa_frequencia,
  COALESCE(ROUND(AVG(la.presenca))::INTEGER, 100) AS presenca,
  100 - COALESCE(ROUND(AVG(la.presenca))::INTEGER, 100) AS faltosos_percentual
FROM turmas t
LEFT JOIN vw_linhas_alunos la ON la.turma_id = t.id
GROUP BY t.id, t.nome, t.codigo, t.horario, t.professor_id;

CREATE OR REPLACE VIEW vw_dashboard AS
SELECT
  (SELECT COUNT(*)::INTEGER FROM turmas) AS total_turmas,
  (SELECT COUNT(*)::INTEGER FROM alunos) AS total_alunos,
  (SELECT COUNT(*)::INTEGER FROM aulas) AS aulas_cadastradas,
  COALESCE((SELECT ROUND(AVG(presenca))::INTEGER FROM vw_linhas_alunos WHERE presenca IS NOT NULL), 100) AS presenca_media,
  (SELECT COUNT(*)::INTEGER FROM vw_linhas_alunos WHERE presenca IS NOT NULL AND presenca < 75) AS alunos_baixa_frequencia;
