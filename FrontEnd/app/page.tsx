import Link from "next/link";
export function Titulo(id: number, variavel: string)
{
    switch(id)
    {
        case 1:
            return "Bem-vindo(a), professor(a) " + variavel;
        
        default: 
            Alert("ERRO: Título não encontrado");
            return "ERRO: Título não encontrado";

    }
}
export default function TelaPrincipal() {
    const NomeProf = "Bernardo";

    return(
        <header className="flex justify-between items-center bg-[#2D3142] text-[#FFFFFF] px-6 py-4">
            <div>
                <Link href = "/" className ="flex items-center gap-2"><img src="/Home.png" alt= "inicio" className="h-6 w-6"/>
                <span>Início</span>
                </Link>
            </div>

            <div className="text-center">
                <h1 className="text-[48px]">{Titulo(1, NomeProf)}</h1>
            </div>

            <div className="w-16 flex justify-end">
                <img src="/antenas_de_ouros.png" alt="Logo" className="h-8 object-contain"/>
            </div>

            
        </header>
    )
} 