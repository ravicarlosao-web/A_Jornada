import { useState } from "react";
import type { FocoTreino } from "@/engine/types";

const TOTAL_PONTOS = 10;

export function TreinoScreen({ onConfirmar }: { onConfirmar: (foco: FocoTreino) => void }) {
  const [tecnico, setTecnico] = useState(6);
  const [recuperacao, setRecuperacao] = useState(2);
  const [tatica, setTatica] = useState(2);

  const usado = tecnico + recuperacao + tatica;
  const restante = TOTAL_PONTOS - usado;

  function ajustar(campo: "tecnico" | "recuperacao" | "tatica", delta: number) {
    const setters = { tecnico: setTecnico, recuperacao: setRecuperacao, tatica: setTatica };
    const valores = { tecnico, recuperacao, tatica };
    const novoValor = valores[campo] + delta;
    if (novoValor < 0) return;
    if (delta > 0 && restante <= 0) return;
    setters[campo](novoValor);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Semana de treinamento</h1>
        <p className="mt-2 text-muted-foreground">
          Distribua {TOTAL_PONTOS} pontos de foco entre as áreas de desenvolvimento.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Linha
          titulo="Atributos técnicos"
          descricao="Desenvolve ritmo, finalização, passe, drible, defesa, físico e reflexos."
          valor={tecnico}
          onMenos={() => ajustar("tecnico", -1)}
          onMais={() => ajustar("tecnico", 1)}
        />
        <Linha
          titulo="Recuperação"
          descricao="Reduz a fadiga acumulada e o risco de lesão."
          valor={recuperacao}
          onMenos={() => ajustar("recuperacao", -1)}
          onMais={() => ajustar("recuperacao", 1)}
        />
        <Linha
          titulo="Tática do time"
          descricao="Melhora sua adequação ao esquema do técnico."
          valor={tatica}
          onMenos={() => ajustar("tatica", -1)}
          onMais={() => ajustar("tatica", 1)}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Pontos restantes: <strong>{restante}</strong>
      </p>

      <button
        disabled={restante !== 0}
        onClick={() => onConfirmar({ tecnico, recuperacao, tatica })}
        className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground disabled:opacity-50"
      >
        Confirmar treino e iniciar temporada
      </button>
    </div>
  );
}

function Linha({
  titulo,
  descricao,
  valor,
  onMenos,
  onMais,
}: {
  titulo: string;
  descricao: string;
  valor: number;
  onMenos: () => void;
  onMais: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <div>
        <p className="font-semibold">{titulo}</p>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenos}
          className="hover-elevate active-elevate-2 h-8 w-8 rounded-md border font-bold"
        >
          −
        </button>
        <span className="w-6 text-center font-bold">{valor}</span>
        <button
          onClick={onMais}
          className="hover-elevate active-elevate-2 h-8 w-8 rounded-md border font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}
