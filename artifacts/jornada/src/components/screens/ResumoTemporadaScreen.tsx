import type { RegistroTemporada } from "@/engine/types";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, MessageSquare, Shield, Landmark, Newspaper, ChevronRight } from "lucide-react";

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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16"
    >
      <motion.div variants={item} className="text-center mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Fim da Temporada {registro.temporada} • {registro.idade} Anos
        </p>
        <h1 className="font-display text-5xl uppercase tracking-wide">{registro.clube}</h1>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Jogos" value={registro.jogos} />
        <Stat label="Gols" value={registro.gols} highlight />
        <Stat label="Assistências" value={registro.assistencias} />
        <Stat label="Nota Média" value={registro.notaMedia.toFixed(1)} />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Objective */}
        <motion.div variants={item} className={`relative overflow-hidden rounded-none clip-diagonal border p-6 ${registro.objetivoCumprido ? "border-primary bg-primary/5" : "border-destructive bg-destructive/5"}`}>
          <div className="absolute -right-4 -top-4 opacity-5">
            <TrendingUp size={100} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Diretoria</p>
          <p className="font-display text-2xl uppercase tracking-wide mb-3">{registro.objetivo}</p>
          <div className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 ${registro.objetivoCumprido ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>
            {registro.objetivoCumprido ? "Objetivo Alcançado" : "Falha na Missão"}
          </div>
        </motion.div>

        {/* Dynamic Events Area */}
        <div className="flex flex-col gap-4">
          {registro.premio && (
            <motion.div variants={item} className="flex items-center gap-4 rounded-none border border-accent bg-accent/10 p-4">
              <div className="bg-accent text-accent-foreground p-2 rounded-full shrink-0">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Premiação Individual</p>
                <p className="font-display text-xl uppercase tracking-wide">{registro.premio}</p>
              </div>
            </motion.div>
          )}

          {registro.lesao && (
            <motion.div variants={item} className="flex items-center gap-4 rounded-none border border-destructive bg-destructive/10 p-4">
              <div className="bg-destructive text-destructive-foreground p-2 rounded-full shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-destructive">Lesão {registro.lesao.gravidade}</p>
                <p className="font-semibold text-sm">{registro.lesao.descricao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{registro.lesao.jogosPerdidos} jogos perdidos</p>
              </div>
            </motion.div>
          )}

          {registro.eventoVestiario && (
            <motion.div variants={item} className={`flex items-center gap-4 rounded-none border p-4 ${registro.eventoVestiario.tipo === 'harmonia' ? 'border-primary bg-primary/5' : 'border-destructive bg-destructive/5'}`}>
              <div className={`p-2 rounded-full shrink-0 ${registro.eventoVestiario.tipo === 'harmonia' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                <MessageSquare size={20} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${registro.eventoVestiario.tipo === 'harmonia' ? 'text-primary' : 'text-destructive'}`}>Bastidores</p>
                <p className="text-sm font-medium">{registro.eventoVestiario.texto}</p>
              </div>
            </motion.div>
          )}

          {registro.convocadoSelecao && (
            <motion.div variants={item} className="flex items-center gap-4 rounded-none border border-secondary bg-secondary/10 p-4">
              <div className="bg-secondary text-secondary-foreground p-2 rounded-full shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Seleção Nacional</p>
                <p className="font-semibold text-sm">Convocado nesta temporada</p>
                {registro.tituloSelecao && <p className="text-accent text-sm font-bold mt-0.5">{registro.tituloSelecao} Campeão</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Headlines Timeline */}
      {registro.manchetes.length > 0 && (
        <motion.div variants={item} className="mt-4">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-2">
            <Newspaper size={16} /> Manchetes da Temporada
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {registro.manchetes.map((m) => (
              <div key={m.id} className="relative pl-4 border-l-2 border-white/20 py-1">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {m.fonte === "redes-sociais" ? "Trending" : "Imprensa Local"}
                </span>
                <p className="font-display text-lg uppercase tracking-wide leading-tight text-foreground/90">"{m.texto}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={item} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={onContinuar}
          className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-none clip-diagonal bg-primary px-10 py-4 font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          Avançar Carreira <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
        {podeAposentar && (
          <button 
            onClick={onAposentar} 
            className="w-full sm:w-auto rounded-none border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            Anunciar Aposentadoria
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-none clip-diagonal border p-6 text-center ${highlight ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-card'}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 font-sports text-5xl leading-none ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
