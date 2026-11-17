import Link from "next/link";

type HeaderProps = {
  titulo: string;
  subtitulo?: string;
};

export default function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="w-full bg-[#2D3142] text-white flex items-center justify-between border-b border-gray-700">
      <Link
        href="/"
        className="w-auto md:w-64 px-6 py-5 flex items-center gap-3 hover:bg-white/5 transition-colors shrink-0"
      >
        <img
          src="/Home.png"
          alt="Início"
          className="w-7 h-7 brightness-0 invert"
        />
        <span className="text-lg font-medium uppercase tracking-wide">
          INÍCIO
        </span>
      </Link>

      <div className="flex-1 px-4 md:px-8 py-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide text-white">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="text-sm md:text-lg font-medium uppercase text-gray-200 mt-1">
            {subtitulo}
          </p>
        )}
      </div>

      <div className="px-6 py-4 shrink-0">
        <img
          src="/antenas_de_ouros.png"
          alt="Logo Antenas de Ouro"
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
      </div>
    </header>
  );
}