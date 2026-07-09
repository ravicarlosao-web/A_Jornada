import type { Modo } from "@/engine/types";

export function ModoScreen({ onEscolher }: { onEscolher: (modo: Modo) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">Jornada</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Monte seu atleta, viva a carreira e escreva sua própria lenda do futebol.
        </p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <button
          onClick={() => onEscolher("rapido")}
          className="hover-elevate active-elevate-2 rounded-xl border p-6 text-left transition-colors"
        >
          <h2 className="text-xl font-semibold">Modo Rápido</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Uma sessão de poucos minutos. Cada temporada é resumida automaticamente — ideal para
            rodar várias carreiras rapidamente.
          </p>
        </button>
        <button
          onClick={() => onEscolher("completo")}
          className="hover-elevate active-elevate-2 rounded-xl border p-6 text-left transition-colors"
        >
          <h2 className="text-xl font-semibold">Carreira Completa</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Gerencie treino, forma física e decisões da sua carreira temporada após temporada.
          </p>
        </button>
      </div>
    </div>
  );
}
