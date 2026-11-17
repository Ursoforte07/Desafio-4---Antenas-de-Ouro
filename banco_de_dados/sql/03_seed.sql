INSERT INTO professores (id, nome, email, senha_hash) VALUES
  (1, 'Bernardo', 'bernardo@engnet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

SELECT setval(pg_get_serial_sequence('professores', 'id'), (SELECT MAX(id) FROM professores));

INSERT INTO turmas (id, nome, codigo, horario, professor_id) VALUES
  (1, 'Turma 1', 'LAB-101', 'Seg e Qua, 14h', 1),
  (2, 'Turma 2', 'LAB-202', 'Ter e Qui, 10h', 1),
  (3, 'Turma 3', 'LAB-303', 'Sex, 08h', 1);

SELECT setval(pg_get_serial_sequence('turmas', 'id'), (SELECT MAX(id) FROM turmas));

INSERT INTO alunos (id, nome) VALUES
  (1, 'Amanda Castro Nogueira Barbosa'),
  (2, 'Arthur Oliveira Santos Costa'),
  (3, 'Alice Reis Oliveira Araújo'),
  (4, 'Amélio Cardoso Ferreira de Melo'),
  (5, 'Diego Almeida Carvalho Sousa'),
  (6, 'Eduardo Rocha Dias Monteiro'),
  (7, 'Letícia Costa Fernandes Melo'),
  (8, 'Marina Pereira Gomes Almeida'),
  (9, 'Renato Ferreira Mendes Pinto');

SELECT setval(pg_get_serial_sequence('alunos', 'id'), (SELECT MAX(id) FROM alunos));

INSERT INTO matriculas (id, aluno_id, turma_id) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 2, 3),
  (4, 3, 1),
  (5, 4, 2),
  (6, 5, 1),
  (7, 6, 2),
  (8, 7, 3),
  (9, 8, 3),
  (10, 9, 3),
  (11, 9, 1);

SELECT setval(pg_get_serial_sequence('matriculas', 'id'), (SELECT MAX(id) FROM matriculas));

INSERT INTO aulas (id, turma_id, data, horario) VALUES
  (1, 1, '2026-11-02', '14:00'),
  (2, 1, '2026-11-03', '14:00'),
  (3, 1, '2026-11-04', '14:00'),
  (4, 1, '2026-11-05', '14:00'),
  (5, 1, '2026-11-06', '14:00'),
  (6, 1, '2026-11-07', '14:00'),
  (7, 1, '2026-11-08', '14:00'),
  (8, 1, '2026-11-09', '14:00'),
  (9, 2, '2026-11-02', '14:00'),
  (10, 2, '2026-11-03', '14:00'),
  (11, 2, '2026-11-04', '14:00'),
  (12, 2, '2026-11-05', '14:00'),
  (13, 2, '2026-11-06', '14:00'),
  (14, 2, '2026-11-07', '14:00'),
  (15, 2, '2026-11-08', '14:00'),
  (16, 2, '2026-11-09', '14:00'),
  (17, 3, '2026-11-02', '14:00'),
  (18, 3, '2026-11-03', '14:00'),
  (19, 3, '2026-11-04', '14:00'),
  (20, 3, '2026-11-05', '14:00'),
  (21, 3, '2026-11-06', '14:00'),
  (22, 3, '2026-11-07', '14:00'),
  (23, 3, '2026-11-08', '14:00'),
  (24, 3, '2026-11-09', '14:00');

SELECT setval(pg_get_serial_sequence('aulas', 'id'), (SELECT MAX(id) FROM aulas));

-- Matrícula 1 (Aluno 1, Turma 1): PPPPPPPF
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (1, 1, true), (2, 1, true), (3, 1, true), (4, 1, true),
  (5, 1, true), (6, 1, true), (7, 1, true), (8, 1, false);

-- Matrícula 2 (Aluno 2, Turma 2): PPPPPPFF
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (9, 2, true), (10, 2, true), (11, 2, true), (12, 2, true),
  (13, 2, true), (14, 2, true), (15, 2, false), (16, 2, false);

-- Matrícula 3 (Aluno 2, Turma 3): PFPPFPFP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (17, 2, true), (18, 2, false), (19, 2, true), (20, 2, true),
  (21, 2, false), (22, 2, true), (23, 2, false), (24, 2, true);

-- Matrícula 4 (Aluno 3, Turma 1): PPPPPPPP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (1, 3, true), (2, 3, true), (3, 3, true), (4, 3, true),
  (5, 3, true), (6, 3, true), (7, 3, true), (8, 3, true);

-- Matrícula 5 (Aluno 4, Turma 2): PPFPPFFP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (9, 4, true), (10, 4, true), (11, 4, false), (12, 4, true),
  (13, 4, true), (14, 4, false), (15, 4, false), (16, 4, true);

-- Matrícula 6 (Aluno 5, Turma 1): PPPPPPFP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (1, 5, true), (2, 5, true), (3, 5, true), (4, 5, true),
  (5, 5, true), (6, 5, true), (7, 5, false), (8, 5, true);

-- Matrícula 7 (Aluno 6, Turma 2): PPFPPPFP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (9, 6, true), (10, 6, true), (11, 6, false), (12, 6, true),
  (13, 6, true), (14, 6, true), (15, 6, false), (16, 6, true);

-- Matrícula 8 (Aluno 7, Turma 3): FPFFPFFP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (17, 7, false), (18, 7, true), (19, 7, false), (20, 7, false),
  (21, 7, true), (22, 7, false), (23, 7, false), (24, 7, true);

-- Matrícula 9 (Aluno 8, Turma 3): PFPFPFPF
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (17, 8, true), (18, 8, false), (19, 8, true), (20, 8, false),
  (21, 8, true), (22, 8, false), (23, 8, true), (24, 8, false);

-- Matrícula 10 (Aluno 9, Turma 3): PPPPPPPP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (17, 9, true), (18, 9, true), (19, 9, true), (20, 9, true),
  (21, 9, true), (22, 9, true), (23, 9, true), (24, 9, true);

-- Matrícula 11 (Aluno 9, Turma 1): PPPPPFPP
INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES
  (1, 9, true), (2, 9, true), (3, 9, true), (4, 9, true),
  (5, 9, true), (6, 9, false), (7, 9, true), (8, 9, true);
