import type { Jogador, OpcaoPosCarreira, PosCarreiraId } from "@/engine/types";

export function PosCarreiraScreen({
  jogador,
  opcoes,
  onEscolher,
}: {
  jogador: Jogador;
  opcoes: OpcaoPosCarreira[];
  onEscolher: (escolha: PosCarreiraId) => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Aposentadoria — {jogador.nome}
        </p>
        <h1 className="mt-1 text-3xl font-bold">O que vem depois dos gramados?</h1>
        <p className="mt-2 text-muted-foreground">
          Escolha um caminho para fechar sua história. Isso não muda seu tier final, mas conta o resto da sua
          jornada.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {opcoes.map((opcao) => (
          <button
            key={opcao.id}
            onClick={() => opcao.disponivel && onEscolher(opcao.id)}
            disabled={!opcao.disponivel}
            className={`rounded-xl border p-4 text-left transition ${
              opcao.disponivel
                ? "hover-elevate active-elevate-2 cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <p className="font-semibold">{opcao.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{opcao.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
