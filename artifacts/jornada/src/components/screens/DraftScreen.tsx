import type { Atributos, OpcaoDraft } from "@/engine/types";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      key={`draft-${rodada}`}
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12"
    >
      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 mb-4"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Draft de Atributos — Giro {rodada} de {totalRodadas}
          </span>
        </motion.div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase">Absorva a Lenda</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {opcoes.map((opcao, i) => (
          <motion.button
            key={`${opcao.legenda}-${i}`}
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEscolher(opcao)}
            className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-8 text-center transition-colors hover:border-primary/50"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              Lendário
            </span>
            <span className="font-display text-2xl uppercase tracking-wide text-foreground my-2">
              {opcao.legenda}
            </span>
            <span className="text-sm uppercase tracking-widest text-muted-foreground">
              {LABELS[opcao.atributo]}
            </span>
            <span className="font-sports text-6xl text-primary drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
              +{opcao.valor}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.div variants={item} className="mt-8 rounded-none border border-white/5 bg-black/40 p-6 shadow-inner">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
          <span>Seu DNA Base</span>
          <span className="bg-white/10 px-2 py-1 rounded text-white">{rodada - 1} escolhas feitas</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(LABELS).map(([key, label]) => {
            const valor = atributos[key as keyof typeof atributos];
            return (
              <div key={key} className="flex flex-col items-center justify-center rounded-sm bg-card p-3 border border-white/5">
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
                <span className={`font-sports text-2xl ${valor > 65 ? 'text-primary' : valor > 50 ? 'text-accent' : 'text-foreground'}`}>
                  {valor}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
