import { NextResponse } from "next/server";
import { pool, garantirTabelaUsuarios, sincronizarProfessor } from "@/app/lib/db";

export async function GET() {
  await garantirTabelaUsuarios();
  const { rows } = await pool.query(
    `SELECT id, nome, email, role FROM usuarios ORDER BY id ASC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await garantirTabelaUsuarios();
  const body = await req.json();

  // Criar novo usuário
  if (body.acao === "CRIAR_USUARIO") {
    try {
      const { rows } = await pool.query(
        `INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, role`,
        [body.nome, body.email, body.senha, body.role || "PROFESSOR"]
      );
      if (rows[0].role === "PROFESSOR") {
        await sincronizarProfessor(rows[0]);
      }
      return NextResponse.json(rows[0]);
    } catch {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }
  }

  // Editar usuário existente
  if (body.acao === "EDITAR_USUARIO") {
    try {
      const id = Number(body.id);
      let rows;
      if (body.senha && body.senha.trim() !== "") {
        const res = await pool.query(
          `UPDATE usuarios SET nome = $1, email = $2, senha = $3, role = $4 WHERE id = $5 RETURNING id, nome, email, role`,
          [body.nome, body.email, body.senha, body.role, id]
        );
        rows = res.rows;
      } else {
        const res = await pool.query(
          `UPDATE usuarios SET nome = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, nome, email, role`,
          [body.nome, body.email, body.role, id]
        );
        rows = res.rows;
      }

      if (rows[0]?.role === "PROFESSOR") {
        await sincronizarProfessor(rows[0]);
      }
      return NextResponse.json(rows[0]);
    } catch {
      return NextResponse.json(
        { error: "Erro ao atualizar. Verifique se o e-mail já está em uso." },
        { status: 400 }
      );
    }
  }

  // Login
  const { rows } = await pool.query(
    `SELECT id, nome, email, role FROM usuarios WHERE email = $1 AND senha = $2`,
    [body.email, body.senha]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  // Garante sincronização mesmo para professores já criados anteriormente
  if (rows[0].role === "PROFESSOR") {
    await sincronizarProfessor(rows[0]);
  }

  return NextResponse.json(rows[0]);
}