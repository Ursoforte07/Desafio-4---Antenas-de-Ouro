import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

export async function garantirTabelaUsuarios() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      senha VARCHAR(150) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'PROFESSOR'
    );
  `);

  // Cria admin padrão se não houver usuários
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS total FROM usuarios`);
  if (rows[0].total === 0) {
    await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4)`,
      ["Administrador Geral", "admin@antenas.com", "123", "ADMIN"]
    );
  }
}

// Garante que o usuário PROFESSOR exista na tabela "professores" caso o 01_schema.sql a utilize
export async function sincronizarProfessor(usuario: {
  id: number;
  nome: string;
  email: string;
}) {
  const tabelaExiste = await pool.query(`
    SELECT 1 FROM information_schema.tables WHERE table_name = 'professores'
  `);

  if (tabelaExiste.rows.length > 0) {
    // Verifica colunas obrigatórias da tabela professores
    const colsRes = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'professores'
        AND is_nullable = 'NO'
        AND column_default IS NULL
        AND column_name NOT IN ('id', 'nome', 'email')
    `);

    const existeProf = await pool.query(
      `SELECT id FROM professores WHERE id = $1`,
      [usuario.id]
    );

    if (existeProf.rows.length === 0) {
      const colunas = ["id", "nome"];
      const valores: (string | number)[] = [usuario.id, usuario.nome];

      // Verifica se a coluna email existe em professores
      const temEmail = await pool.query(`
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'professores' AND column_name = 'email'
      `);
      if (temEmail.rows.length > 0) {
        colunas.push("email");
        valores.push(usuario.email);
      }

      colsRes.rows.forEach((col, idx) => {
        colunas.push(col.column_name);
        if (col.data_type.includes("int") || col.data_type.includes("numeric")) {
          valores.push(usuario.id);
        } else {
          valores.push(`PROF-${usuario.id}-${idx}`);
        }
      });

      const placeholders = valores.map((_, i) => `$${i + 1}`).join(", ");
      await pool.query(
        `INSERT INTO professores (${colunas.join(", ")}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
        valores
      );
    } else {
      await pool.query(`UPDATE professores SET nome = $1 WHERE id = $2`, [
        usuario.nome,
        usuario.id,
      ]);
    }
  }
}