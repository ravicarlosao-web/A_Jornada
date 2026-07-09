import type { Dificuldade } from "@/engine/types";

export function DificuldadeScreen({ onEscolher }: { onEscolher: (d: Dificuldade) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <h1 className="text-3xl font-bold">Escolha a dificuldade</h1>
        <p className="mt-2 text-muted-foreground">Isso afeta a variação de qualidade no draft de atributos.</p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <button
          onClick={() => onEscolher("amador")}
          className="hover-elevate active-elevate-2 rounded-xl border p-6 text-left"
        >
          <h2 className="text-xl font-semibold">Amador</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Draft mais previsível, ideal para iniciantes na jornada.
          </p>
        </button>
        <button
          onClick={() => onEscolher("pro")}
          className="hover-elevate active-elevate-2 rounded-xl border p-6 text-left"
        >
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Mais risco e mais recompensa — atributos podem sair muito bons ou muito ruins.
          </p>
        </button>
      </div>
    </div>
  );
}
