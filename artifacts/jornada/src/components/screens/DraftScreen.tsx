import type { Atributos, OpcaoDraft } from "@/engine/types";

const LABELS: Record<string, string> = {
  ritmo: "Ritmo",
  finalizacao: "Finalização",
  passe: "Passe",
  drible: "Drible",
  defesa: "Defesa",
  fisico: "Físico",
  reflexos: "Reflexos",
};

export function DraftScreen({
  rodada,
  totalRodadas,
  opcoes,
  atributos,
  onEscolher,
}: {
  rodada: number;
  totalRodadas: number;
  opcoes: OpcaoDraft[];
  atributos: Atributos;
  onEscolher: (opcao: OpcaoDraft) => void;
}) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Draft de Atributos — Giro {rodada} de {totalRodadas}
        </p>
        <h1 className="mt-1 text-3xl font-bold">Roube um atributo de uma lenda</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {opcoes.map((opcao, i) => (
          <button
            key={`${opcao.legenda}-${i}`}
            onClick={() => onEscolher(opcao)}
            className="hover-elevate active-elevate-2 flex flex-col items-center gap-3 rounded-xl border p-6 text-center"
          >
            <span className="text-sm text-muted-foreground">Lendário</span>
            <span className="text-lg font-semibold">{opcao.legenda}</span>
            <span className="text-sm text-muted-foreground">{LABELS[opcao.atributo]}</span>
            <span className="text-3xl font-bold text-primary">+{opcao.valor}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Seus atributos atuais
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span>{label}</span>
              <span className="font-semibold">{atributos[key as keyof typeof atributos]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
