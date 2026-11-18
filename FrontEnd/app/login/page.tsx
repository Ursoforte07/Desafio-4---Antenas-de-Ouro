"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [aba, setAba] = useState<"PROFESSOR" | "ADMIN">("PROFESSOR");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao entrar.");
      return;
    }

    if (data.role !== aba) {
      setErro(`Esta conta não pertence ao perfil ${aba}.`);
      return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(data));
    router.push(data.role === "ADMIN" ? "/admin" : "/");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#4F5D75]/50 rounded-2xl overflow-hidden shadow-md">
        <div className="bg-[#2D3142] p-6 flex flex-col items-center text-white">
          <img src="/antenas_de_ouros.png" alt="Logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold uppercase">ANTENAS DE OURO</h1>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-300">
          <button
            type="button"
            onClick={() => setAba("PROFESSOR")}
            className={`py-3 font-semibold uppercase text-sm cursor-pointer ${
              aba === "PROFESSOR"
                ? "bg-[#E1D8CE] text-[#2D3142]"
                : "bg-white text-[#4F5D75]"
            }`}
          >
            PROFESSOR
          </button>
          <button
            type="button"
            onClick={() => setAba("ADMIN")}
            className={`py-3 font-semibold uppercase text-sm cursor-pointer ${
              aba === "ADMIN"
                ? "bg-[#E1D8CE] text-[#2D3142]"
                : "bg-white text-[#4F5D75]"
            }`}
          >
            ADMINISTRADOR
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4 normal-case">
          {erro && <p className="text-red-600 text-sm font-medium">{erro}</p>}

          <div>
            <label className="block text-sm font-medium text-[#4F5D75] mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                aba === "ADMIN" ? "admin@antenas.com" : "professor@escola.com"
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#4F5D75] focus:outline-none focus:border-[#2D3142]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4F5D75] mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-2 text-[#4F5D75] focus:outline-none focus:border-[#2D3142]"
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
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white font-bold uppercase py-3 rounded-lg hover:opacity-90 transition-opacity mt-2 cursor-pointer"
          >
            ENTRAR COMO {aba}
          </button>

          {aba === "ADMIN" && (
            <p className="text-xs text-center text-[#4F5D75]/70 mt-2">
              Acesso inicial: admin@antenas.com | Senha: 123
            </p>
          )}
        </form>
      </div>
    </div>
  );
}