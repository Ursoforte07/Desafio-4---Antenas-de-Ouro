"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem("tema");
    const isDark = salvo === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const alternarTema = () => {
    const novo = !dark;
    setDark(novo);
    localStorage.setItem("tema", novo ? "dark" : "light");
    document.documentElement.classList.toggle("dark", novo);
  };

  return (
    <button
      type="button"
      onClick={alternarTema}
      title={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-label="Alternar tema claro ou escuro"
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#2D3142] text-[#D4AF37] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
    >
      {dark ? (
        /* Ícone de Sol (Modo Claro) */
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        /* Ícone de Lua (Modo Escuro) */
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}