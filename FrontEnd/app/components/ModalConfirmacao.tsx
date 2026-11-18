"use client";

type ModalConfirmacaoProps = {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border border-[#4F5D75] rounded-2xl max-w-md w-full p-6 shadow-xl">
        <h3 className="text-xl font-bold uppercase text-[#2D3142] mb-2">
          {titulo}
        </h3>
        <p className="text-[#4F5D75] text-base normal-case mb-6">{mensagem}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-[#4F5D75] hover:bg-[#E1D8CE]/50 font-medium uppercase cursor-pointer"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium uppercase cursor-pointer"
          >
            EXCLUIR
          </button>
        </div>
      </div>
    </div>
  );
}