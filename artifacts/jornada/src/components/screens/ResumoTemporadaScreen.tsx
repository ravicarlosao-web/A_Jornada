import type { RegistroTemporada } from "@/engine/types";

export function ResumoTemporadaScreen({
  registro,
  onContinuar,
  onAposentar,
  podeAposentar,
}: {
  registro: RegistroTemporada;
  onContinuar: () => void;
  onAposentar: () => void;
  podeAposentar: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Fim da temporada {registro.temporada} — {registro.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">{registro.clube}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Jogos" value={registro.jogos} />
        <Stat label="Gols" value={registro.gols} />
        <Stat label="Assistências" value={registro.assistencias} />
        <Stat label="Nota média" value={registro.notaMedia.toFixed(1)} />
      </div>

      <div
        className={`rounded-xl border p-4 ${
          registro.objetivoCumprido ? "border-primary" : "border-destructive"
        }`}
      >
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Objetivo da diretoria</p>
        <p className="mt-1 font-semibold">{registro.objetivo}</p>
        <p className={`mt-1 text-sm ${registro.objetivoCumprido ? "text-primary" : "text-destructive"}`}>
          {registro.objetivoCumprido ? "Cumprido ✓" : "Não cumprido"}
        </p>
      </div>

      {registro.premio && (
        <div className="rounded-xl border border-primary bg-primary/10 p-4 text-center">
          <p className="font-semibold">Prêmio conquistado: {registro.premio}</p>
        </div>
      )}

      {registro.lesao && (
        <div className="rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
          <p className="font-semibold">
            Lesão {registro.lesao.gravidade}: {registro.lesao.descricao}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {registro.lesao.jogosPerdidos} jogos perdidos por lesão
          </p>
        </div>
      )}

      {registro.eventoVestiario && (
        <div
          className={`rounded-xl border p-4 text-center ${
            registro.eventoVestiario.tipo === "harmonia"
              ? "border-primary bg-primary/10"
              : "border-destructive bg-destructive/10"
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Vestiário</p>
          <p className="mt-1 font-semibold">{registro.eventoVestiario.texto}</p>
        </div>
      )}

      {registro.manchetes.map((m) => (
        <div key={m.id} className="rounded-xl border p-4 italic text-muted-foreground">
          <span className="mr-2 not-italic text-xs uppercase tracking-wide text-muted-foreground/70">
            {m.fonte === "redes-sociais" ? "📱 redes sociais" : "📰 imprensa"}
          </span>
          "{m.texto}"
        </div>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onContinuar}
          className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
        >
          Continuar carreira
        </button>
        {podeAposentar && (
          <button onClick={onAposentar} className="hover-elevate active-elevate-2 rounded-md border px-8 py-3 font-semibold">
            Encerrar carreira
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
