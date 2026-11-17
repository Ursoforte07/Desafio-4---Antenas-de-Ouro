"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UsuarioItem = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);

  // Estados do formulário de criação
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [role, setRole] = useState("PROFESSOR");

  // Estados do modal de edição
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioItem | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [mostrarEditSenha, setMostrarEditSenha] = useState(false);
  const [editRole, setEditRole] = useState("PROFESSOR");

  const carregarUsuarios = async () => {
    const res = await fetch("/api/auth");
    if (res.ok) setUsuarios(await res.json());
  };

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!logado || logado.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    carregarUsuarios();
  }, [router]);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "CRIAR_USUARIO", nome, email, senha, role }),
    });
    if (res.ok) {
      setNome("");
      setEmail("");
      setSenha("");
      setMostrarSenha(false);
      carregarUsuarios();
    } else {
      alert("Erro ao criar usuário (e-mail já existe).");
    }
  };

  const abrirModalEdicao = (usuario: UsuarioItem) => {
    setUsuarioEditando(usuario);
    setEditNome(usuario.nome);
    setEditEmail(usuario.email);
    setEditSenha("");
    setMostrarEditSenha(false);
    setEditRole(usuario.role);
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando) return;

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "EDITAR_USUARIO",
        id: usuarioEditando.id,
        nome: editNome,
        email: editEmail,
        senha: editSenha,
        role: editRole,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Erro ao atualizar usuário.");
      return;
    }

    // Se o próprio admin editou seu perfil, atualiza o localStorage
    const logado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (logado && logado.id === usuarioEditando.id) {
      localStorage.setItem("usuarioLogado", JSON.stringify(data));
    }

    setUsuarioEditando(null);
    carregarUsuarios();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <header className="w-full bg-[#2D3142] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/antenas_de_ouros.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold uppercase">PAINEL DO ADMINISTRADOR</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("usuarioLogado");
            router.push("/login");
          }}
          className="bg-[#D4AF37] px-5 py-2 rounded-lg text-sm font-bold uppercase cursor-pointer"
        >
          SAIR
        </button>
      </header>

      <main className="w-full max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Cadastro */}
        <form
          onSubmit={handleCriar}
          className="bg-white border border-[#4F5D75]/50 rounded-2xl p-6 flex flex-col gap-4 normal-case shadow-sm h-fit"
        >
          <h2 className="text-xl font-bold uppercase text-[#2D3142]">
            CADASTRAR USUÁRIO
          </h2>
          <input
            type="text"
            placeholder="Nome completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-[#4F5D75]"
          />
          <input
            type="email"
            placeholder="E-mail de acesso (Login)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-[#4F5D75]"
          />

          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-2.5 text-[#4F5D75]"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F5D75] hover:text-[#2D3142] cursor-pointer"
              title={mostrarSenha ? "Ocultar senha" : "Visualizar senha"}
            >
              {mostrarSenha ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-[#4F5D75]"
          >
            <option value="PROFESSOR">Professor</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button
            type="submit"
            className="bg-[#D4AF37] text-white font-bold uppercase py-3 rounded-lg cursor-pointer hover:opacity-90"
          >
            CRIAR CONTA
          </button>
        </form>

        {/* Lista de Usuários com Botão Editar */}
        <div className="bg-white border border-[#4F5D75]/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold uppercase text-[#2D3142] mb-4">
            USUÁRIOS CADASTRADOS
          </h2>
          <div className="divide-y divide-gray-200 normal-case max-h-96 overflow-y-auto">
            {usuarios.map((u) => (
              <div key={u.id} className="py-3 flex justify-between items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#2D3142] truncate">{u.nome}</p>
                  <p className="text-sm text-[#4F5D75] truncate">{u.email}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#E1D8CE] text-[#2D3142]">
                    {u.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => abrirModalEdicao(u)}
                    title="Editar login e senha"
                    className="p-1.5 rounded-lg hover:bg-[#E1D8CE]/60 transition-colors cursor-pointer"
                  >
                    <img src="/lapis.png" alt="Editar usuário" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Edição de Usuário (Login, Nome, Perfil e Senha) */}
      {usuarioEditando && (
        <div
          onClick={() => setUsuarioEditando(null)}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSalvarEdicao}
            className="bg-[#FDFBF7] border border-[#4F5D75] rounded-2xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4 normal-case"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase text-[#2D3142]">
                EDITAR USUÁRIO
              </h3>
              <button
                type="button"
                onClick={() => setUsuarioEditando(null)}
                className="text-[#4F5D75] hover:text-[#2D3142] font-bold text-lg cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F5D75] mb-1">
                Nome
              </label>
              <input
                type="text"
                required
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-[#4F5D75]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F5D75] mb-1">
                E-mail de acesso (Login)
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-[#4F5D75]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F5D75] mb-1">
                Nova Senha (deixe em branco para manter a atual)
              </label>
              <div className="relative">
                <input
                  type={mostrarEditSenha ? "text" : "password"}
                  placeholder="Digite a nova senha..."
                  value={editSenha}
                  onChange={(e) => setEditSenha(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-lg pl-4 pr-11 py-2 text-[#4F5D75]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarEditSenha((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F5D75] hover:text-[#2D3142] cursor-pointer"
                  title={mostrarEditSenha ? "Ocultar senha" : "Visualizar senha"}
                >
                  {mostrarEditSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F5D75] mb-1">
                Perfil
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-[#4F5D75]"
              >
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setUsuarioEditando(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#4F5D75] uppercase text-sm cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#D4AF37] text-white font-bold uppercase text-sm cursor-pointer hover:opacity-90"
              >
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}