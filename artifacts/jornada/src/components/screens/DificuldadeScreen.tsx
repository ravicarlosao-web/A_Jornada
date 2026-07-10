import type { Dificuldade } from "@/engine/types";
import { motion } from "framer-motion";
import { Medal, Flame, ChevronRight } from "lucide-react";

export function DificuldadeScreen({ onEscolher }: { onEscolher: (d: Dificuldade) => void }) {
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
      className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center gap-12 px-4 py-16 text-center"
    >
      <motion.div variants={item}>
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-2">Preparação</p>
        <h1 className="font-display text-5xl">Escolha a Dificuldade</h1>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          A dificuldade afeta os tetos e os pisos durante o draft de atributos da lenda.
        </p>
      </motion.div>
      
      <motion.div variants={item} className="grid w-full gap-6 sm:grid-cols-2">
        <button
          onClick={() => onEscolher("amador")}
          className="group relative overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-8 text-left transition-all hover:border-primary/50 hover:bg-card/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10 group-hover:text-primary">
            <Medal size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl">Amador</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Draft equilibrado. Menos riscos de atributos muito baixos, porém tetos de atributos lendários também são limitados. Ideal para primeira viagem.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-primary uppercase tracking-wider">
              Selecionar <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => onEscolher("pro")}
          className="group relative overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-8 text-left transition-all hover:border-destructive/50 hover:bg-card/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10 group-hover:text-destructive">
            <Flame size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl text-destructive">Pro</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Alta volatilidade. Você pode draftar atributos absurdamente altos, mas também pode acabar com deficiências brutais que exigirão muito treino.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-destructive uppercase tracking-wider">
              Selecionar <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}
