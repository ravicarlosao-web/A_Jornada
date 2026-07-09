import type { Jogador } from "@/engine/types";

export function PreTemporadaScreen({ jogador, onAvancar }: { jogador: Jogador; onAvancar: () => void }) {
  const temporadaNumero = jogador.historicoTemporadas.length + 1;
  const contratoRestante = jogador.contrato.anosRestantes;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Temporada {temporadaNumero} — {jogador.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">Pré-temporada no {jogador.clubeAtual.nome}</h1>
      </div>

      <p className="text-muted-foreground">
        A diretoria do {jogador.clubeAtual.nome} está de olho na sua evolução nesta temporada.
        {contratoRestante <= 1 && " Seu contrato está próximo do fim — uma nova negociação se aproxima."}
      </p>

      <div className="grid w-full grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Contrato</p>
          <p className="mt-1 text-lg font-bold">
            {contratoRestante} {contratoRestante === 1 ? "ano restante" : "anos restantes"}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Prêmios na carreira</p>
          <p className="mt-1 text-lg font-bold">{jogador.premios.length}</p>
        </div>
      </div>

      <button
        onClick={onAvancar}
        className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
      >
        {jogador.modo === "completo" ? "Ir para treino" : "Iniciar temporada"}
      </button>
    </div>
  );
}
