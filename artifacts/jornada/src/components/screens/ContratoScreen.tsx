import type { Jogador, PropostaContrato } from "@/engine/types";

function formatarSalario(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function ContratoScreen({
  jogador,
  propostas,
  mensagensNegociacao,
  onEscolher,
  onNegociar,
}: {
  jogador: Jogador;
  propostas: PropostaContrato[];
  mensagensNegociacao: Record<string, string>;
  onEscolher: (proposta: PropostaContrato) => void;
  onNegociar: (propostaId: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Fim de contrato — {jogador.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">Hora de decidir seu futuro</h1>
        <p className="mt-2 text-muted-foreground">
          Seu vínculo com o {jogador.clubeAtual.nome} chegou ao fim. Avalie as propostas recebidas — você pode
          negociar uma vez por proposta antes de assinar.
        </p>
      </div>

      {propostas.length === 0 && (
        <p className="text-center text-muted-foreground">
          Todas as propostas saíram da mesa de negociação. Isso não deveria acontecer — recarregue a página.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {propostas.map((proposta) => (
          <div key={proposta.id} className="flex flex-col gap-2 rounded-xl border p-6 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{proposta.clube.nome}</h2>
              <div className="flex gap-1">
                {proposta.ehClubeAtual && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">Clube atual</span>
                )}
                {proposta.clube.tier === "internacional" && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium">Exterior</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {proposta.clube.pais} · Força do elenco: {proposta.clube.tier}
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-primary">{formatarSalario(proposta.salarioAnual)}</span>
              <span className="text-sm text-muted-foreground">/ ano</span>
            </div>
            <p className="text-sm text-muted-foreground">Contrato de {proposta.duracaoAnos} anos</p>
            <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-2 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Luvas</p>
                <p className="font-semibold">{formatarSalario(proposta.clausulas.luvas)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bônus/gol</p>
                <p className="font-semibold">{formatarSalario(proposta.clausulas.bonusPorGol)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Multa</p>
                <p className="font-semibold">{formatarSalario(proposta.clausulas.multaRescisoria)}</p>
              </div>
            </div>

            {mensagensNegociacao[proposta.id] && (
              <p className="mt-1 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                {mensagensNegociacao[proposta.id]}
              </p>
            )}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onEscolher(proposta)}
                className="hover-elevate active-elevate-2 flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Assinar
              </button>
              <button
                onClick={() => onNegociar(proposta.id)}
                disabled={!!mensagensNegociacao[proposta.id]}
                className="hover-elevate active-elevate-2 flex-1 rounded-md border px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Negociar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
