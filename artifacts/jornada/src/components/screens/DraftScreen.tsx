import { useState } from "react";
import type { Atributos, OpcaoDraft } from "@/engine/types";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  ritmo: "Ritmo",
  finalizacao: "Finalização",
  passe: "Passe",
  drible: "Drible",
  defesa: "Defesa",
  fisico: "Físico",
  reflexos: "Reflexos",
};

const ATRIB_ORDER = ["ritmo", "finalizacao", "passe", "drible", "defesa", "fisico", "reflexos"] as const;

type EficienciaLabel = {
  texto: string;
  icon: React.ReactNode;
  cor: string;
  bg: string;
  border: string;
};

function calcularEficiencia(atual: number, valor: number): EficienciaLabel {
  const efetivo = Math.min(99, atual + valor) - atual;
  const desperdicado = valor - efetivo;

  if (atual >= 93) return {
    texto: "Quase no Limite",
    icon: <XCircle size={12} />,
    cor: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  };
  if (atual >= 85) return {
    texto: desperdicado > 0 ? `Cap corta ${desperdicado} pts` : "Perto do Teto",
    icon: <AlertTriangle size={12} />,
    cor: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  };
  if (atual >= 75) return {
    texto: "Ganho Médio",
    icon: <TrendingUp size={12} />,
    cor: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
  };
  return {
    texto: "Alto Impacto",
    icon: <CheckCircle size={12} />,
    cor: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  };
}

function corValor(v: number) {
  if (v >= 85) return "text-primary";
  if (v >= 70) return "text-accent";
  if (v >= 55) return "text-foreground";
  return "text-muted-foreground";
}

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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [escolhido, setEscolhido] = useState<OpcaoDraft | null>(null);

  const hoveredOpcao = hoveredIdx !== null ? opcoes[hoveredIdx] : null;
  const progressoPct = ((rodada - 1) / totalRodadas) * 100;

  function handleEscolher(opcao: OpcaoDraft) {
    setEscolhido(opcao);
    setTimeout(() => {
      setEscolhido(null);
      onEscolher(opcao);
    }, 250);
  }

  return (
    <motion.div
      key={`draft-${rodada}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Draft de Atributos — Giro {rodada} de {totalRodadas}
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase">Absorva a Lenda</h1>

        {/* Progress bar */}
        <div className="mx-auto mt-4 max-w-xs">
          <div className="h-1.5 w-full bg-card overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${((rodada - 2) / totalRodadas) * 100}%` }}
              animate={{ width: `${progressoPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {Array.from({ length: totalRodadas }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i < rodada - 1 ? "bg-primary" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content — 2 columns */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

        {/* LEFT: DNA Panel — always visible, live preview */}
        <div className="flex flex-col gap-3 rounded-none border border-white/10 bg-card/60 p-5 self-start sticky top-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Seu DNA Base
            </h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5">
              {rodada - 1}/{totalRodadas} picks
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ATRIB_ORDER.map((key) => {
              const atual = atributos[key];
              const isAlvo = hoveredOpcao?.atributo === key;
              const ganhoPreview = isAlvo ? Math.min(99, atual + hoveredOpcao.valor) - atual : 0;
              const novoValor = atual + ganhoPreview;
              const barPct = (atual / 99) * 100;
              const previewPct = (ganhoPreview / 99) * 100;

              return (
                <motion.div
                  key={key}
                  animate={isAlvo ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={`rounded-none p-3 transition-all duration-200 ${
                    isAlvo
                      ? "border border-primary/50 bg-primary/5"
                      : "border border-white/5 bg-background/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                        isAlvo ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {LABELS[key]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-sports text-lg leading-none ${corValor(atual)}`}>
                        {atual}
                      </span>
                      <AnimatePresence>
                        {isAlvo && ganhoPreview > 0 && (
                          <motion.span
                            key="preview"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            className="flex items-center gap-0.5 font-bold text-primary text-xs"
                          >
                            <ChevronRight size={10} />
                            <span className="font-sports text-base">{novoValor}</span>
                          </motion.span>
                        )}
                        {isAlvo && ganhoPreview === 0 && (
                          <motion.span
                            key="cap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-destructive font-bold"
                          >
                            MAX
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Stat bar */}
                  <div className="h-1.5 w-full bg-black/30 overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className={`h-full transition-all duration-300 ${isAlvo ? "bg-white/30" : "bg-white/20"}`}
                        style={{ width: `${barPct}%` }}
                      />
                      {isAlvo && ganhoPreview > 0 && (
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${previewPct}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* No hover hint */}
          {hoveredOpcao === null && (
            <p className="text-center text-xs text-muted-foreground/50 mt-2">
              Passe o mouse nas cartas para ver o impacto
            </p>
          )}
        </div>

        {/* RIGHT: Draft cards */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Escolha <span className="text-foreground font-bold">1 de 3</span> atributos inspirados em lendas do futebol.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {opcoes.map((opcao, i) => {
              const atualStat = atributos[opcao.atributo];
              const ganhoEfetivo = Math.min(99, atualStat + opcao.valor) - atualStat;
              const desperdicado = opcao.valor - ganhoEfetivo;
              const eficiencia = calcularEficiencia(atualStat, opcao.valor);
              const isHovered = hoveredIdx === i;
              const isEscolhido = escolhido?.atributo === opcao.atributo && escolhido?.legenda === opcao.legenda;

              return (
                <motion.button
                  key={`${opcao.legenda}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isEscolhido ? 0.5 : 1,
                    y: 0,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                  onClick={() => handleEscolher(opcao)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-none border bg-card p-6 text-center transition-all duration-200 ${
                    isHovered
                      ? "border-primary/70 shadow-[0_0_20px_rgba(34,197,94,0.12)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Glow BG */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent transition-opacity duration-200 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Legend label */}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Inspirado em
                  </span>

                  {/* Name */}
                  <span className="font-display text-2xl uppercase tracking-wide text-foreground leading-tight">
                    {opcao.legenda}
                  </span>

                  {/* Stat name */}
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-t border-white/10 pt-3 w-full text-center">
                    {LABELS[opcao.atributo]}
                  </span>

                  {/* Current → New value */}
                  <div className="flex items-center gap-2">
                    <span className={`font-sports text-2xl ${corValor(atualStat)}`}>{atualStat}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                    <span className="font-sports text-5xl text-primary drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                      {Math.min(99, atualStat + opcao.valor)}
                    </span>
                  </div>

                  {/* Gain badge */}
                  <span className="font-bold text-primary text-sm">
                    +{ganhoEfetivo}
                    {desperdicado > 0 && (
                      <span className="text-destructive/70 ml-1 text-xs">(+{desperdicado} perdido no cap)</span>
                    )}
                  </span>

                  {/* Efficiency label */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${eficiencia.cor} ${eficiencia.bg} ${eficiencia.border}`}>
                    {eficiencia.icon}
                    {eficiencia.texto}
                  </div>

                  {/* Stat bar preview */}
                  <div className="w-full h-1 bg-black/30 overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="h-full bg-white/25"
                        style={{ width: `${(atualStat / 99) * 100}%` }}
                      />
                      {ganhoEfetivo > 0 && (
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(ganhoEfetivo / 99) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Helper tips */}
          <div className="mt-2 rounded-none border border-white/5 bg-card/40 p-4 text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground/60 uppercase tracking-wide">Dica: </span>
            Atributos acima de <span className="text-amber-400 font-bold">85</span> têm diminuição de retorno no treino — priorize atributos baixos ou os que definem sua posição.
            Valor acima de <span className="text-destructive font-bold">99</span> é cortado pelo sistema.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
