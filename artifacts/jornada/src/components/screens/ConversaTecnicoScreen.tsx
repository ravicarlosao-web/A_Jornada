import { OPCOES_CONVERSA_TECNICO } from "@/engine/engine";
import type { ConversaTecnicoOpcaoId, Jogador } from "@/engine/types";

export function ConversaTecnicoScreen({
  jogador,
  onEscolher,
}: {
  jogador: Jogador;
  onEscolher: (opcao: ConversaTecnicoOpcaoId) => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Relação com o técnico — {jogador.confiancaTecnico}/100
        </p>
        <h1 className="mt-1 text-3xl font-bold">Sua confiança com o técnico está em baixa</h1>
        <p className="mt-2 text-muted-foreground">
          Você sente que precisa fazer algo a respeito. Como {jogador.nome} vai lidar com isso?
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {OPCOES_CONVERSA_TECNICO.map((opcao) => (
          <button
            key={opcao.id}
            onClick={() => onEscolher(opcao.id)}
            className="hover-elevate active-elevate-2 rounded-xl border p-4 text-left"
          >
            <p className="font-semibold">{opcao.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{opcao.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
