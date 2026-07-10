import { useState } from "react";
import type { Modo } from "@/engine/types";
import { HallFamaScreen } from "@/components/screens/HallFamaScreen";
import { motion } from "framer-motion";
import { Trophy, Zap, Clock, ChevronRight } from "lucide-react";

export function ModoScreen({ onEscolher }: { onEscolher: (modo: Modo) => void }) {
  const [mostrarHallFama, setMostrarHallFama] = useState(false);

  if (mostrarHallFama) {
    return <HallFamaScreen onVoltar={() => setMostrarHallFama(false)} />;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center gap-12 px-4 py-16"
    >
      <motion.div variants={item} className="text-center">
        <h1 className="font-sports text-8xl font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          JORNADA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto uppercase tracking-widest font-medium">
          Sua lenda começa no vestiário e termina na história.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid w-full gap-6 sm:grid-cols-2">
        <button
          onClick={() => onEscolher("rapido")}
          className="group relative overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-8 text-left transition-all hover:border-primary/50 hover:bg-card/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20 group-hover:text-primary">
            <Zap size={64} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/20 p-3 text-primary">
              <Zap size={24} />
            </div>
            <h2 className="font-display text-3xl">Modo Rápido</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Sessões ágeis. Cada temporada é resumida automaticamente. Foco na progressão e nos resultados, ideal para jogar várias carreiras.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-primary uppercase tracking-wider">
              Iniciar <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </button>

        <button
          onClick={() => onEscolher("completo")}
          className="group relative overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-8 text-left transition-all hover:border-accent/50 hover:bg-card/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20 group-hover:text-accent">
            <Clock size={64} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-accent/20 p-3 text-accent">
              <Clock size={24} />
            </div>
            <h2 className="font-display text-3xl">Carreira Completa</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Gestão total. Controle treinamentos, forma física, negociações, relacionamentos no vestiário e entrevistas com o técnico.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-accent uppercase tracking-wider">
              Iniciar <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </button>
      </motion.div>

      <motion.div variants={item} className="flex justify-center mt-4">
        <button
          onClick={() => setMostrarHallFama(true)}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
        >
          <Trophy size={16} className="text-accent" />
          Hall da Fama
        </button>
      </motion.div>
    </motion.div>
  );
}
