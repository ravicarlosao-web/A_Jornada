import { useState } from "react";
import type { Jogador } from "@/engine/types";
import { motion } from "framer-motion";
import { CalendarDays, Trophy, UserPlus, Play, ShoppingBag, MessageCircle } from "lucide-react";

export function PreTemporadaScreen({
  jogador,
  onAvancar,
  onAbrirLoja,
  onAbrirConversaTecnico,
}: {
  jogador: Jogador;
  onAvancar: (mentorarJovem?: boolean) => void;
  onAbrirLoja: () => void;
  onAbrirConversaTecnico: () => void;
}) {
  const temporadaNumero = jogador.historicoTemporadas.length + 1;
  const contratoRestante = jogador.contrato.anosRestantes;
  const [mentorar, setMentorar] = useState(false);
  const podeMentorar = jogador.modo === "completo" && jogador.idade >= 24;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 py-16"
    >
      <div className="text-center">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
          Temporada {temporadaNumero} • {jogador.idade} Anos
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide">
          Pré-Temporada no <span className="text-accent">{jogador.clubeAtual.nome}</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          A diretoria, a comissão técnica e a torcida estão de olho na sua preparação. 
          {contratoRestante <= 1 && <span className="text-destructive font-semibold ml-1">Seu contrato expira ao final desta temporada.</span>}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center rounded-none clip-diagonal border border-white/10 bg-card p-8 text-center">
          <CalendarDays className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo de Contrato</p>
          <p className="mt-2 font-sports text-4xl text-foreground">
            {contratoRestante} {contratoRestante === 1 ? "ANO" : "ANOS"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-none clip-diagonal border border-white/10 bg-card p-8 text-center">
          <Trophy className="mb-3 h-8 w-8 text-accent/50" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prêmios na Carreira</p>
          <p className="mt-2 font-sports text-4xl text-accent">
            {jogador.premios.length}
          </p>
        </div>
      </div>

      {podeMentorar && (
        <label className={`w-full cursor-pointer overflow-hidden rounded-none clip-diagonal border p-6 transition-all ${mentorar ? 'border-primary bg-primary/10' : 'border-white/10 bg-card hover:border-white/30'}`}>
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={mentorar}
              onChange={(e) => setMentorar(e.target.checked)}
              className="peer sr-only"
            />
            <div
              aria-hidden="true"
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border mt-1 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${mentorar ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}
            >
              {mentorar && <UserPlus size={14} />}
            </div>
            <div>
              <span className="block font-display text-2xl uppercase">Mentorar Promessa da Base</span>
              <span className="mt-2 block text-sm text-muted-foreground leading-relaxed">
                Invista seu tempo livre orientando um jovem atleta. Você ganhará atributos de liderança e melhorará sua relação com o elenco, mas sacrificará parte do seu descanso.
              </span>
            </div>
          </div>
        </label>
      )}

      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={() => onAvancar(mentorar)}
          className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-none clip-diagonal bg-primary px-12 py-5 font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <span>{jogador.modo === "completo" ? "Avançar para Treinos" : "Iniciar Temporada"}</span>
          <Play size={18} className="fill-current transition-transform group-hover:translate-x-1" />
        </button>
        <button
          onClick={onAbrirLoja}
          className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-none clip-diagonal border border-accent/40 bg-accent/10 px-10 py-5 font-bold uppercase tracking-widest text-accent transition-transform hover:scale-105 active:scale-95"
        >
          <ShoppingBag size={18} />
          <span>Loja (R$ {jogador.dinheiro.toLocaleString("pt-BR")})</span>
        </button>
        {jogador.modo === "completo" && (
          <button
            onClick={onAbrirConversaTecnico}
            className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-none clip-diagonal border border-white/10 bg-card px-10 py-5 font-bold uppercase tracking-widest text-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle size={18} />
            <span>Falar com o Técnico</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
