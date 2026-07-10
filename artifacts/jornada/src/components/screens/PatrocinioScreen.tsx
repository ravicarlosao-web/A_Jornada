import type { Patrocinio } from "@/engine/types";

function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function PatrocinioScreen({
  proposta,
  onEscolher,
}: {
  proposta: Patrocinio;
  onEscolher: (aceitar: boolean) => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Proposta de patrocínio</p>
        <h1 className="mt-2 text-3xl font-bold text-primary">{proposta.marca}</h1>
        <p className="mt-2 text-muted-foreground">
          A marca {proposta.marca} quer associar sua imagem à campanha desta temporada.
        </p>
      </div>

      <div className="w-full rounded-xl border border-accent bg-accent/10 p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor anual do contrato de imagem</p>
        <p className="mt-1 text-3xl font-bold">{formatarValor(proposta.valorAnual)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Aceitar aumenta sua presença nas redes sociais, mas cria expectativa: recusar mantém sua imagem livre para
          futuras propostas maiores.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => onEscolher(true)}
          className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
        >
          Aceitar patrocínio
        </button>
        <button
          onClick={() => onEscolher(false)}
          className="hover-elevate active-elevate-2 rounded-md border px-8 py-3 font-semibold"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
