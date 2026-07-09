import { calcularOverall, calcularTierFinal } from "@/engine/engine";
import type { Jogador } from "@/engine/types";

export function ResultadoFinalScreen({
  jogador,
  onNovaCarreira,
}: {
  jogador: Jogador;
  onNovaCarreira: () => void;
}) {
  const { tier, score } = calcularTierFinal(jogador);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const totalGols = jogador.historicoTemporadas.reduce((acc, t) => acc + t.gols, 0);
  const totalAssist = jogador.historicoTemporadas.reduce((acc, t) => acc + t.assistencias, 0);
  const totalJogos = jogador.historicoTemporadas.reduce((acc, t) => acc + t.jogos, 0);
  const titulos = jogador.historicoTemporadas.filter((t) => t.objetivoCumprido).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Fim de carreira — {jogador.nome}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-primary">{tier.nome}</h1>
        <p className="mt-2 text-muted-foreground">{tier.descricao}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Pontuação" value={score} />
        <Stat label="Overall final" value={overall} />
        <Stat label="Temporadas" value={jogador.historicoTemporadas.length} />
        <Stat label="Objetivos cumpridos" value={titulos} />
        <Stat label="Jogos" value={totalJogos} />
        <Stat label="Gols" value={totalGols} />
        <Stat label="Assistências" value={totalAssist} />
        <Stat label="Prêmios" value={jogador.premios.length} />
      </div>

      <button
        onClick={onNovaCarreira}
        className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
      >
        Começar nova jornada
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
