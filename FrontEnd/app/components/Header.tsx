import Link from "next/link";

type HeaderProps = {
  titulo: string;
};

export default function Header({ titulo }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 bg-[#2D3142] px-[clamp(0.75rem,3vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] text-white">
      
      <Link href="/" title="Início" className="flex shrink-0 items-center gap-2">
        <img src="/Home.png" alt="" className="h-[clamp(2rem,5vw,3rem)] w-[clamp(2rem,5vw,3rem)]"/> 
        <span className="hidden text-[clamp(1.25rem,2.5vw,1.875rem)] sm:inline"> Início </span>
      </Link>

      <h1 className="flex-1 text-center text-[clamp(1.125rem,4vw,3rem)] font-semibold">
        {titulo}
      </h1>

      <img src="/antenas_de_ouros.png" alt="Logo Antenas de Ouro" className="h-[clamp(2rem,5vw,3rem)] shrink-0 object-contain"/>
    
    </header>
  );
}