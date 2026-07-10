import type { Jogador, OpcaoPosCarreira, PosCarreiraId } from "@/engine/types";
import { motion } from "framer-motion";
import { Map, ArrowRight } from "lucide-react";

export function PosCarreiraScreen({
  jogador,
  opcoes,
  onEscolher,
}: {
  jogador: Jogador;
  opcoes: OpcaoPosCarreira[];
  onEscolher: (escolha: PosCarreiraId) => void;
}) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex max-w-4xl flex-col items-center gap-12 px-4 py-16 text-center"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Fim da Linha • {jogador.nome}
        </p>
        <h1 className="font-display text-5xl uppercase tracking-wide">Pendurando as Chuteiras</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
          Sua jornada nos gramados acabou, mas o seu nome já está gravado na história. Escolha como quer viver seu legado fora das quatro linhas.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {opcoes.map((opcao) => (
          <motion.button
            key={opcao.id}
            variants={item}
            onClick={() => opcao.disponivel && onEscolher(opcao.id)}
            disabled={!opcao.disponivel}
            className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-none clip-diagonal border p-6 text-left transition-all ${
              opcao.disponivel
                ? "border-white/10 bg-card hover:border-primary hover:bg-card/80 cursor-pointer"
                : "border-white/5 bg-black/40 opacity-50 cursor-not-allowed"
            }`}
          >
            <div>
              <div className={`mb-4 inline-flex p-3 rounded-full ${opcao.disponivel ? 'bg-primary/10 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                <Map size={24} />
              </div>
              <h2 className="font-display text-2xl uppercase">{opcao.titulo}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {opcao.descricao}
              </p>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              {opcao.disponivel ? (
                <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100 flex items-center">
                  Seguir Caminho <ArrowRight size={14} className="ml-1" />
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                  {opcao.motivoIndisponivel || "Não Qualificado"}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
