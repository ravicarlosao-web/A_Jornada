import { calcularOverall } from "@/engine/engine";
import type { Jogador } from "@/engine/types";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  MEI: "Meio-campista",
  ATA: "Atacante",
};

export function StatusBar({ jogador }: { jogador: Jogador }) {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const temporada = jogador.historicoTemporadas.length + 1;

  return (
    <div className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
            {overall}
          </span>
          <div>
            <p className="font-semibold leading-tight">{jogador.nome}</p>
            <p className="text-xs text-muted-foreground leading-tight">
              {NOME_POSICAO[jogador.posicao]} · {jogador.idade} anos
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{jogador.clubeAtual.nome}</strong>
          </span>
          <span>Temporada {temporada}</span>
          <Indicador label="Fama" valor={jogador.fama} />
          <Indicador label="Confiança" valor={jogador.confiancaTecnico} />
          <Indicador label="Fadiga" valor={jogador.fadiga} invertido />
        </div>
      </div>
    </div>
  );
}

function Indicador({ label, valor, invertido }: { label: string; valor: number; invertido?: boolean }) {
  const cor = invertido
    ? valor >= 70
      ? "text-destructive"
      : valor >= 40
        ? "text-accent"
        : "text-primary"
    : valor >= 70
      ? "text-primary"
      : valor >= 40
        ? "text-accent"
        : "text-destructive";
  return (
    <span className="flex items-center gap-1">
      <span>{label}:</span>
      <span className={`font-semibold ${cor}`}>{Math.round(valor)}</span>
    </span>
  );
}
