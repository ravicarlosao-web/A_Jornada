import { calcularOverall, overallLabel } from "@/engine/engine";
import type { Jogador } from "@/engine/types";
import { User, Activity, Star, Calendar, Shield, Trophy, Target, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function StatusBar({ jogador }: { jogador: Jogador }) {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const temporada = jogador.historicoTemporadas.length + 1;

  const label = overallLabel(overall);

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/5 bg-card/80 backdrop-blur-xl shadow-lg"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 text-sm">
        
        {/* Player Profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-none clip-diagonal bg-primary font-sports text-2xl text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              {overall}
            </span>
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white ring-2 ring-background">
              {jogador.posicao}
            </div>
          </div>
          <div>
            <p className="font-display text-xl leading-none text-foreground">{jogador.nome}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <span className="text-accent">{jogador.clubeAtual.nome}</span>
                <span>·</span>
                {jogador.idade} anos
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: label.cor, backgroundColor: `${label.cor}20` }}>
                {label.texto}
              </span>
            </div>
          </div>
        </div>

        {/* Stats HUD */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Temporada <strong className="text-foreground">{temporada}</strong></span>
          </div>
          <Indicador icon={<Star className="h-4 w-4" />} label="Fama" valor={jogador.fama} />
          <Indicador icon={<Target className="h-4 w-4" />} label="Confiança" valor={jogador.confiancaTecnico} />
          <Indicador icon={<User className="h-4 w-4" />} label="Elenco" valor={jogador.relacaoElenco} />
          <Indicador icon={<Activity className="h-4 w-4" />} label="Fadiga" valor={jogador.fadiga} invertido />
          <span className="flex items-center gap-1.5" title="Dinheiro">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="font-sports text-lg text-accent leading-none">
              R$ {jogador.dinheiro.toLocaleString("pt-BR")}
            </span>
          </span>

          <div className="flex gap-4 border-l border-white/10 pl-6">
            {jogador.convocacoesSelecao > 0 && (
              <span className="flex items-center gap-1.5" title="Convocações">
                <Shield className="h-4 w-4 text-secondary" />
                <strong className="text-foreground">{jogador.convocacoesSelecao}</strong>
              </span>
            )}
            {jogador.titulosSelecao.length > 0 && (
              <span className="flex items-center gap-1.5" title="Títulos de Seleção">
                <Trophy className="h-4 w-4 text-accent" />
                <strong className="text-foreground">{jogador.titulosSelecao.length}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* ProgressBar/Decoration */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
    </motion.div>
  );
}

function Indicador({ label, valor, invertido, icon }: { label: string; valor: number; invertido?: boolean; icon?: React.ReactNode }) {
  const cor = invertido
    ? valor >= 70
      ? "text-destructive"
      : valor >= 40
        ? "text-accent"
        : "text-primary"
    : valor >= 70
      ? "text-primary"
      : valor >= 40
        ? "text-accent"
        : "text-destructive";
  
  return (
    <span className="flex items-center gap-1.5" title={label}>
      <span className="opacity-70">{icon}</span>
      <span className={`font-sports text-lg ${cor} w-6 text-right leading-none`}>{Math.round(valor)}</span>
    </span>
  );
}
