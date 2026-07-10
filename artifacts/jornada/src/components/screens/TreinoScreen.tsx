import { useState } from "react";
import type { FocoTreino } from "@/engine/types";
import { motion } from "framer-motion";
import { Activity, Dumbbell, Route, Minus, Plus } from "lucide-react";

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

  const progresso = (usado / TOTAL_PONTOS) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16"
    >
      <div className="text-center">
        <h1 className="font-display text-5xl uppercase tracking-wide">Foco Semanal</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Distribua seu tempo e energia na base de treinamento antes da temporada começar.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
          <span className="text-muted-foreground">Pontos Usados</span>
          <span className={restante === 0 ? "text-primary" : "text-accent"}>
            {usado} / {TOTAL_PONTOS}
          </span>
        </div>
        <div className="h-2 w-full bg-card overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${restante === 0 ? "bg-primary" : "bg-accent"}`} 
            style={{ width: `${progresso}%` }} 
          />
        </div>
        {restante > 0 && (
          <p className="text-center text-xs font-bold uppercase tracking-widest text-accent mt-3">
            {restante} {restante === 1 ? 'ponto restante' : 'pontos restantes'}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Linha
          icon={<Dumbbell className="text-primary" />}
          titulo="Técnico & Físico"
          descricao="Desenvolve finalização, passe, drible, defesa, ritmo e reflexos."
          valor={tecnico}
          onMenos={() => ajustar("tecnico", -1)}
          onMais={() => ajustar("tecnico", 1)}
          maxReached={restante === 0}
        />
        <Linha
          icon={<Activity className="text-secondary" />}
          titulo="Recuperação"
          descricao="Reduz a fadiga acumulada e o risco de lesão muscular."
          valor={recuperacao}
          onMenos={() => ajustar("recuperacao", -1)}
          onMais={() => ajustar("recuperacao", 1)}
          maxReached={restante === 0}
        />
        <Linha
          icon={<Route className="text-accent" />}
          titulo="Tática Coletiva"
          descricao="Melhora sua adequação ao esquema e confiança do técnico."
          valor={tatica}
          onMenos={() => ajustar("tatica", -1)}
          onMais={() => ajustar("tatica", 1)}
          maxReached={restante === 0}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          disabled={restante !== 0}
          onClick={() => onConfirmar({ tecnico, recuperacao, tatica })}
          className="group relative overflow-hidden rounded-none clip-diagonal bg-primary px-12 py-5 font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Confirmar Rotina
        </button>
      </div>
    </motion.div>
  );
}

function Linha({
  icon,
  titulo,
  descricao,
  valor,
  onMenos,
  onMais,
  maxReached
}: {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  valor: number;
  onMenos: () => void;
  onMais: () => void;
  maxReached: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-none clip-diagonal border border-white/10 bg-card p-6 transition-colors hover:border-white/20">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-white/5">
          {icon}
        </div>
        <div>
          <p className="font-display text-2xl uppercase tracking-wide">{titulo}</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">{descricao}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 self-end sm:self-auto bg-background p-2 border border-white/5">
        <button
          onClick={onMenos}
          disabled={valor === 0}
          aria-label={`Diminuir foco em ${titulo}`}
          className="flex h-10 w-10 items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-30"
        >
          <Minus size={16} />
        </button>
        <div className="flex w-8 justify-center">
          <span className="font-sports text-3xl">{valor}</span>
        </div>
        <button
          onClick={onMais}
          disabled={maxReached}
          aria-label={`Aumentar foco em ${titulo}`}
          className="flex h-10 w-10 items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
