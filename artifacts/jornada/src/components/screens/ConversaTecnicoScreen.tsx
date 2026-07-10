import { OPCOES_CONVERSA_TECNICO } from "@/engine/engine";
import type { ConversaTecnicoOpcaoId, Jogador } from "@/engine/types";
import { motion } from "framer-motion";
import { MessageCircleWarning } from "lucide-react";

export function ConversaTecnicoScreen({
  jogador,
  onEscolher,
}: {
  jogador: Jogador;
  onEscolher: (opcao: ConversaTecnicoOpcaoId) => void;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-4 py-16 text-center"
    >
      <div className="flex flex-col items-center">
        <div className="mb-6 rounded-full bg-destructive/10 p-4 text-destructive">
          <MessageCircleWarning size={48} strokeWidth={1.5} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-destructive mb-2">
          Crise Interna — Confiança: {Math.round(jogador.confiancaTecnico)}/100
        </p>
        <h1 className="font-display text-5xl uppercase tracking-wide">Clima Tenso</h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Você perdeu espaço no elenco. O treinador exigiu uma reunião no escritório. Como você vai se portar?
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-4 text-left"
      >
        {OPCOES_CONVERSA_TECNICO.map((opcao) => (
          <motion.button
            key={opcao.id}
            variants={item}
            onClick={() => onEscolher(opcao.id)}
            className="group relative overflow-hidden rounded-none clip-diagonal border border-white/10 bg-card p-6 transition-all hover:border-primary hover:bg-card/80"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-white/10 transition-colors group-hover:bg-primary" />
            <div className="pl-4">
              <p className="font-display text-2xl uppercase tracking-wide">{opcao.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{opcao.descricao}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
