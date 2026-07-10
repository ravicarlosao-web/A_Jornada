import { gerarOpcoesConversaTecnico, type RiscoOpcao } from "@/engine/engine";
import type { ConversaTecnicoOpcaoId, Jogador } from "@/engine/types";
import { motion } from "framer-motion";
import { AlertTriangle, Flame, MessageCircleWarning, Shield, Siren } from "lucide-react";

const RISCO_META: Record<RiscoOpcao, { label: string; color: string; bg: string; border: string; bar: string; Icon: React.ElementType }> = {
  seguro:   { label: "Seguro",   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", bar: "bg-emerald-400", Icon: Shield },
  moderado: { label: "Moderado", color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/30",  bar: "bg-yellow-400",  Icon: AlertTriangle },
  alto:     { label: "Alto",     color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/30",  bar: "bg-orange-400",  Icon: Flame },
  extremo:  { label: "Extremo",  color: "text-red-500",     bg: "bg-red-500/10",     border: "border-red-500/30",     bar: "bg-red-500",     Icon: Siren },
};

const CRISE_HEADER = [
  { label: "1ª Crise", sublabel: "Primeiro confronto com o técnico", accent: "text-orange-400", bar: "bg-orange-400" },
  { label: "2ª Crise", sublabel: "Relação já fragilizada — o técnico está desconfiante", accent: "text-red-400", bar: "bg-red-400" },
  { label: "Crise Recorrente", sublabel: "Ultimato — algo vai mudar, queira você ou não", accent: "text-red-600", bar: "bg-red-600" },
];

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 60 ? "bg-emerald-500" : value >= 35 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-mono font-bold tabular-nums w-12 text-right">{Math.round(value)}/100</span>
    </div>
  );
}

export function ConversaTecnicoScreen({
  jogador,
  onEscolher,
}: {
  jogador: Jogador;
  onEscolher: (opcao: ConversaTecnicoOpcaoId) => void;
}) {
  const opcoes = gerarOpcoesConversaTecnico(jogador);
  const crises = jogador.crisesComTecnico;
  const header = CRISE_HEADER[Math.min(crises, 2)];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="mb-2 rounded-full bg-destructive/10 p-4 text-destructive">
          <MessageCircleWarning size={44} strokeWidth={1.5} />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${header.accent}`}>
            {header.label}
          </span>
          {crises > 0 && (
            <span className="text-xs text-muted-foreground">
              ({crises + 1}ª vez com este técnico)
            </span>
          )}
        </div>

        <h1 className="font-display text-5xl uppercase tracking-wide">Clima Tenso</h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md">
          {header.sublabel}. O treinador convocou uma reunião no escritório.
        </p>

        {/* Confiança atual */}
        <div className="mt-2 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Confiança com o Técnico
          </span>
          <ConfidenceBar value={jogador.confiancaTecnico} />
        </div>

        {/* Memória de crises passadas */}
        {crises > 0 && (
          <div className="mt-1 rounded border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-xs text-orange-300 text-left w-full max-w-sm">
            ⚠ Você já teve {crises} crise{crises > 1 ? "s" : ""} com este técnico antes.
            {crises >= 2 && " Algumas opções agora têm consequências muito mais severas."}
          </div>
        )}
      </div>

      {/* Opções */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {opcoes.map((opcao) => {
          const meta = RISCO_META[opcao.risco];
          const { Icon } = meta;
          return (
            <motion.button
              key={opcao.id}
              variants={item}
              onClick={() => onEscolher(opcao.id)}
              className={`group relative overflow-hidden rounded-none border bg-card p-5 text-left transition-all hover:bg-card/70 ${
                opcao.risco === "extremo"
                  ? "border-red-500/20 hover:border-red-500/50"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 h-full w-1 ${meta.bar ?? "bg-white/10"} opacity-40 transition-opacity group-hover:opacity-100`} />

              <div className="pl-4 flex flex-col gap-2">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-xl uppercase tracking-wide leading-tight">{opcao.titulo}</p>
                  {/* Risk badge */}
                  <span className={`flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${meta.color} ${meta.bg} border ${meta.border}`}>
                    <Icon size={10} />
                    {meta.label}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{opcao.descricao}</p>

                {/* Impact row */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Impacto:</span>
                  <span className={`text-xs font-mono font-semibold ${meta.color}`}>{opcao.impacto}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
