import type { Jogador } from "@/engine/types";
import { calcularOverall } from "@/engine/engine";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  MEI: "Meio-campista",
  ATA: "Atacante",
};

export function PreTemporadaScreen({ jogador, onAvancar }: { jogador: Jogador; onAvancar: () => void }) {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const temporadaNumero = jogador.historicoTemporadas.length + 1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Temporada {temporadaNumero} — {jogador.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">Pré-temporada no {jogador.clubeAtual.nome}</h1>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Overall" value={overall} />
        <Stat label="Posição" value={NOME_POSICAO[jogador.posicao]} />
        <Stat label="Fama" value={jogador.fama} />
        <Stat label="Confiança do técnico" value={jogador.confiancaTecnico} />
      </div>

      <p className="text-muted-foreground">
        A diretoria do {jogador.clubeAtual.nome} está de olho na sua evolução nesta temporada.
      </p>

      <button
        onClick={onAvancar}
        className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
      >
        {jogador.modo === "completo" ? "Ir para treino" : "Iniciar temporada"}
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
