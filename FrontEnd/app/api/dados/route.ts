import { NextResponse } from "next/server";
import { pool, garantirTabelaUsuarios, sincronizarProfessor } from "@/app/lib/db";

async function detectarEsquema() {
  const cols = await pool.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
  `);

  const temColuna = (tabela: string, coluna: string) =>
    cols.rows.some((r) => r.table_name === tabela && r.column_name === coluna);

  const tabelas = [...new Set(cols.rows.map((r) => r.table_name))];

  const alunoTemTurmaId = temColuna("alunos", "turma_id");
  const tabelaVinculo =
    tabelas.find(
      (t) =>
        t !== "alunos" &&
        t !== "turmas" &&
        t !== "aulas" &&
        temColuna(t, "aluno_id") &&
        temColuna(t, "turma_id")
    ) || null;

  const tabelaFreq =
    tabelas.find((t) => temColuna(t, "aluno_id") && temColuna(t, "aula_id")) ||
    "frequencias";

  const colPresente = temColuna(tabelaFreq, "presente")
    ? "presente"
    : temColuna(tabelaFreq, "status")
    ? "status"
    : "presente";

  const infoColPresente = cols.rows.find(
    (r) => r.table_name === tabelaFreq && r.column_name === colPresente
  );
  const presenteEhBoolean = infoColPresente?.data_type === "boolean";

  const colDataAula = temColuna("aulas", "data")
    ? "data"
    : temColuna("aulas", "data_aula")
    ? "data_aula"
    : "data";

  return {
    alunoTemTurmaId,
    tabelaVinculo,
    tabelaFreq,
    colPresente,
    presenteEhBoolean,
    colDataAula,
  };
}

// Helper para preencher colunas NOT NULL extras automaticamente
async function obterColunasExtrasObrigatorias(
  tabela: string,
  ignorar: string[],
  valorPadraoTexto: string
) {
  const colsRes = await pool.query(
    `SELECT column_name, data_type
     FROM information_schema.columns
     WHERE table_name = $1
       AND is_nullable = 'NO'
       AND column_default IS NULL`,
    [tabela]
  );

  const colunas: string[] = [];
  const valores: (string | number)[] = [];

  colsRes.rows.forEach((col, idx) => {
    if (!ignorar.includes(col.column_name)) {
      colunas.push(col.column_name);
      if (col.data_type.includes("int") || col.data_type.includes("numeric")) {
        valores.push(1);
      } else {
        valores.push(`${valorPadraoTexto}-${idx}`);
      }
    }
  });

  return { colunas, valores };
}

export async function GET(req: Request) {
  try {
    await garantirTabelaUsuarios();
    const esc = await detectarEsquema();
    const { searchParams } = new URL(req.url);
    const professorId = Number(searchParams.get("professorId"));
    const turmaId = Number(searchParams.get("turmaId"));
    const alunoId = Number(searchParams.get("alunoId"));
    const data = searchParams.get("data");

    const exprPresenteBool = esc.presenteEhBoolean
      ? `f.${esc.colPresente}`
      : `(f.${esc.colPresente}::text IN ('true', 't', '1', 'PRESENTE', 'P', 'presente'))`;

    // 1. Detalhes de um aluno específico
    if (alunoId) {
      const joinTurma = esc.alunoTemTurmaId
        ? `JOIN turmas t ON t.id = a.turma_id`
        : esc.tabelaVinculo
        ? `JOIN ${esc.tabelaVinculo} v ON v.aluno_id = a.id JOIN turmas t ON t.id = v.turma_id`
        : `LEFT JOIN turmas t ON TRUE`;

      const alunoRes = await pool.query(
        `SELECT a.id, a.nome, t.id AS turma_id, COALESCE(t.nome, 'SEM TURMA') AS turma_nome
         FROM alunos a
         ${joinTurma}
         WHERE a.id = $1
         LIMIT 1`,
        [alunoId]
      );

      if (alunoRes.rows.length === 0) {
        return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
      }

      const presencasRes = await pool.query(
        `SELECT f.id, ${exprPresenteBool} AS presente, au.${esc.colDataAula}::text AS data
         FROM ${esc.tabelaFreq} f
         JOIN aulas au ON au.id = f.aula_id
         WHERE f.aluno_id = $1
         ORDER BY au.${esc.colDataAula} ASC`,
        [alunoId]
      );

      return NextResponse.json({
        ...alunoRes.rows[0],
        presencas: presencasRes.rows,
      });
    }

    // 2. Dados da chamada de uma turma em uma data
    if (turmaId && data) {
      const turmaRes = await pool.query(`SELECT id, nome FROM turmas WHERE id = $1`, [turmaId]);

      const alunosRes = esc.alunoTemTurmaId
        ? await pool.query(
            `SELECT id, nome FROM alunos WHERE turma_id = $1 ORDER BY nome ASC`,
            [turmaId]
          )
        : esc.tabelaVinculo
        ? await pool.query(
            `SELECT a.id, a.nome FROM alunos a
             JOIN ${esc.tabelaVinculo} v ON v.aluno_id = a.id
             WHERE v.turma_id = $1 ORDER BY a.nome ASC`,
            [turmaId]
          )
        : await pool.query(`SELECT id, nome FROM alunos ORDER BY nome ASC`);

      const aulaRes = await pool.query(
        `SELECT id FROM aulas WHERE turma_id = $1 AND ${esc.colDataAula} = $2`,
        [turmaId, data]
      );

      let presencasExistentes: { aluno_id: number; presente: boolean }[] = [];
      if (aulaRes.rows.length > 0) {
        const pRes = await pool.query(
          `SELECT f.aluno_id, ${exprPresenteBool} AS presente FROM ${esc.tabelaFreq} f WHERE f.aula_id = $1`,
          [aulaRes.rows[0].id]
        );
        presencasExistentes = pRes.rows;
      }

      return NextResponse.json({
        turma: turmaRes.rows[0],
        alunos: alunosRes.rows,
        presencasExistentes,
      });
    }

    // 3. Painel completo do Professor
    if (professorId) {
      const turmasRes = await pool.query(
        `SELECT id, nome FROM turmas WHERE professor_id = $1 ORDER BY id ASC`,
        [professorId]
      );

      let alunosRows = [];
      if (esc.alunoTemTurmaId) {
        const res = await pool.query(
          `SELECT a.id, a.nome, a.turma_id, t.nome AS turma_nome,
                  COUNT(f.id)::int AS total_aulas,
                  COALESCE(SUM(CASE WHEN ${exprPresenteBool} THEN 1 ELSE 0 END), 0)::int AS aulas_presentes
           FROM alunos a
           JOIN turmas t ON t.id = a.turma_id
           LEFT JOIN ${esc.tabelaFreq} f ON f.aluno_id = a.id
           WHERE t.professor_id = $1
           GROUP BY a.id, a.nome, a.turma_id, t.nome
           ORDER BY a.nome ASC`,
          [professorId]
        );
        alunosRows = res.rows;
      } else if (esc.tabelaVinculo) {
        const res = await pool.query(
          `SELECT a.id, a.nome, v.turma_id, t.nome AS turma_nome,
                  COUNT(f.id)::int AS total_aulas,
                  COALESCE(SUM(CASE WHEN ${exprPresenteBool} THEN 1 ELSE 0 END), 0)::int AS aulas_presentes
           FROM alunos a
           JOIN ${esc.tabelaVinculo} v ON v.aluno_id = a.id
           JOIN turmas t ON t.id = v.turma_id
           LEFT JOIN ${esc.tabelaFreq} f ON f.aluno_id = a.id
           WHERE t.professor_id = $1
           GROUP BY a.id, a.nome, v.turma_id, t.nome
           ORDER BY a.nome ASC`,
          [professorId]
        );
        alunosRows = res.rows;
      }

      const aulasRes = await pool.query(
        `SELECT au.id, au.turma_id
         FROM aulas au
         JOIN turmas t ON t.id = au.turma_id
         WHERE t.professor_id = $1`,
        [professorId]
      );

      const alunosFormatados = alunosRows.map((al) => {
        const frequencia =
          al.total_aulas > 0 ? Math.round((al.aulas_presentes / al.total_aulas) * 100) : 100;
        return {
          id: al.id,
          nome: al.nome,
          turmaId: al.turma_id,
          turmaNome: al.turma_nome,
          frequencia,
        };
      });

      const turmasFormatadas = turmasRes.rows.map((t) => {
        const alunosDaTurma = alunosFormatados.filter((a) => a.turmaId === t.id);
        const aulasDaTurma = aulasRes.rows.filter((au) => au.turma_id === t.id).length;
        const baixaFreq = alunosDaTurma.filter((a) => a.frequencia < 75).length;
        const mediaPresentes =
          alunosDaTurma.length > 0
            ? Math.round(
                alunosDaTurma.reduce((acc, cur) => acc + cur.frequencia, 0) /
                  alunosDaTurma.length
              )
            : 100;

        return {
          id: t.id,
          nome: t.nome,
          totalAlunos: alunosDaTurma.length,
          aulasCadastradas: aulasDaTurma,
          baixaFrequencia: baixaFreq,
          percentualPresentes: mediaPresentes,
        };
      });

      const totalAlunos = alunosFormatados.length;
      const presencaMedia =
        totalAlunos > 0
          ? Math.round(
              alunosFormatados.reduce((acc, cur) => acc + cur.frequencia, 0) / totalAlunos
            )
          : 100;

      return NextResponse.json({
        metricas: {
          totalAlunos,
          aulasCadastradas: aulasRes.rows.length,
          presencaMedia,
          alunosBaixaFrequencia: alunosFormatados.filter((a) => a.frequencia < 75).length,
        },
        turmas: turmasFormatadas,
        alunos: alunosFormatados,
      });
    }

    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Erro GET /api/dados:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno no banco" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await garantirTabelaUsuarios();
    const esc = await detectarEsquema();
    const body = await req.json();

    if (body.acao === "CRIAR_TURMA") {
      const profId = Number(body.professorId);
      const userRes = await pool.query(
        `SELECT id, nome, email FROM usuarios WHERE id = $1`,
        [profId]
      );
      if (userRes.rows.length > 0) {
        await sincronizarProfessor(userRes.rows[0]);
      }

      const extras = await obterColunasExtrasObrigatorias(
        "turmas",
        ["id", "nome", "professor_id"],
        `TURMA-${Date.now()}`
      );

      const colunas = ["nome", "professor_id", ...extras.colunas];
      const valores = [body.nome, profId, ...extras.valores];
      const placeholders = valores.map((_, i) => `$${i + 1}`).join(", ");

      const { rows } = await pool.query(
        `INSERT INTO turmas (${colunas.join(", ")}) VALUES (${placeholders}) RETURNING id, nome`,
        valores
      );
      return NextResponse.json(rows[0]);
    }

    if (body.acao === "CRIAR_ALUNO") {
      const turmaId = Number(body.turmaId);
      const extras = await obterColunasExtrasObrigatorias(
        "alunos",
        ["id", "nome", "turma_id"],
        `MAT-${Date.now()}`
      );

      const colunas = esc.alunoTemTurmaId
        ? ["nome", "turma_id", ...extras.colunas]
        : ["nome", ...extras.colunas];
      const valores = esc.alunoTemTurmaId
        ? [body.nome, turmaId, ...extras.valores]
        : [body.nome, ...extras.valores];

      const placeholders = valores.map((_, i) => `$${i + 1}`).join(", ");
      const { rows } = await pool.query(
        `INSERT INTO alunos (${colunas.join(", ")}) VALUES (${placeholders}) RETURNING id, nome`,
        valores
      );

      if (!esc.alunoTemTurmaId && esc.tabelaVinculo) {
        await pool.query(
          `INSERT INTO ${esc.tabelaVinculo} (aluno_id, turma_id) VALUES ($1, $2)`,
          [rows[0].id, turmaId]
        );
      }

      return NextResponse.json(rows[0]);
    }

    if (body.acao === "SALVAR_CHAMADA") {
      const turmaId = Number(body.turmaId);
      const data = body.data;
      const presencas: { alunoId: number; presente: boolean }[] = body.presencas;

      const aulaRes = await pool.query(
        `SELECT id FROM aulas WHERE turma_id = $1 AND ${esc.colDataAula} = $2`,
        [turmaId, data]
      );

      let aulaId: number;
      if (aulaRes.rows.length === 0) {
        const extrasAula = await obterColunasExtrasObrigatorias(
          "aulas",
          ["id", "turma_id", esc.colDataAula],
          "Aula Regular"
        );
        const colsAula = ["turma_id", esc.colDataAula, ...extrasAula.colunas];
        const valsAula = [turmaId, data, ...extrasAula.valores];
        const phAula = valsAula.map((_, i) => `$${i + 1}`).join(", ");

        const novaAula = await pool.query(
          `INSERT INTO aulas (${colsAula.join(", ")}) VALUES (${phAula}) RETURNING id`,
          valsAula
        );
        aulaId = novaAula.rows[0].id;
      } else {
        aulaId = aulaRes.rows[0].id;
      }

      for (const item of presencas) {
        const valorPresenca = esc.presenteEhBoolean
          ? item.presente
          : item.presente
          ? "PRESENTE"
          : "FALTA";

        const existe = await pool.query(
          `SELECT id FROM ${esc.tabelaFreq} WHERE aula_id = $1 AND aluno_id = $2`,
          [aulaId, item.alunoId]
        );
        if (existe.rows.length > 0) {
          await pool.query(
            `UPDATE ${esc.tabelaFreq} SET ${esc.colPresente} = $1 WHERE id = $2`,
            [valorPresenca, existe.rows[0].id]
          );
        } else {
          await pool.query(
            `INSERT INTO ${esc.tabelaFreq} (aula_id, aluno_id, ${esc.colPresente}) VALUES ($1, $2, $3)`,
            [aulaId, item.alunoId, valorPresenca]
          );
        }
      }

      return NextResponse.json({ ok: true });
    }

    if (body.acao === "ALTERAR_PRESENCA_INDIVIDUAL") {
      const valorPresenca = esc.presenteEhBoolean
        ? Boolean(body.presente)
        : body.presente
        ? "PRESENTE"
        : "FALTA";

      await pool.query(
        `UPDATE ${esc.tabelaFreq} SET ${esc.colPresente} = $1 WHERE id = $2`,
        [valorPresenca, Number(body.presencaId)]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Erro POST /api/dados:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar no banco" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const id = Number(searchParams.get("id"));

    if (tipo === "TURMA") {
      await pool.query(`DELETE FROM turmas WHERE id = $1`, [id]);
      return NextResponse.json({ ok: true });
    }

    if (tipo === "ALUNO") {
      await pool.query(`DELETE FROM alunos WHERE id = $1`, [id]);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao excluir" },
      { status: 500 }
    );
  }
}