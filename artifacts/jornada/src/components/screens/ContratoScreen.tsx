import type { Jogador, PropostaContrato } from "@/engine/types";

function formatarSalario(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function ContratoScreen({
  jogador,
  propostas,
  onEscolher,
}: {
  jogador: Jogador;
  propostas: PropostaContrato[];
  onEscolher: (proposta: PropostaContrato) => void;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Fim de contrato — {jogador.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">Hora de decidir seu futuro</h1>
        <p className="mt-2 text-muted-foreground">
          Seu vínculo com o {jogador.clubeAtual.nome} chegou ao fim. Avalie as propostas recebidas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {propostas.map((proposta, i) => (
          <button
            key={`${proposta.clube.nome}-${i}`}
            onClick={() => onEscolher(proposta)}
            className="hover-elevate active-elevate-2 flex flex-col gap-2 rounded-xl border p-6 text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{proposta.clube.nome}</h2>
              {proposta.ehClubeAtual && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">Clube atual</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize">Força do elenco: {proposta.clube.tier}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-primary">{formatarSalario(proposta.salarioAnual)}</span>
              <span className="text-sm text-muted-foreground">/ ano</span>
            </div>
            <p className="text-sm text-muted-foreground">Contrato de {proposta.duracaoAnos} anos</p>
          </button>
        ))}
      </div>
    </div>
  );
}
