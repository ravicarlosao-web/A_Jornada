import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { BASES, calcularOverall, overallLabel, sugerirPosicao } from "@/engine/engine";
import type { Base } from "@/engine/types";

const ATRIB_LABELS: Record<string, string> = {
  ritmo: "Ritmo",
  finalizacao: "Finalização",
  passe: "Passe",
  drible: "Drible",
  defesa: "Defesa",
  fisico: "Físico",
  reflexos: "Reflexos",
  temperamento: "Temperamento",
  carisma: "Carisma",
  foco: "Foco",
  lideranca: "Liderança",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export function BaseScreen({ onEscolher }: { onEscolher: (base: Base) => void }) {
  const [selecionado, setSelecionado] = useState<Base | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  function handleConfirmar() {
    if (!selecionado) return;
    setConfirmado(true);
    setTimeout(() => onEscolher(selecionado), 400);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Origem do Jogador</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase">Escolha sua Base</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Sua origem define seus atributos iniciais e a história do seu jogador. Escolha bem — ela moldará quem você será em campo.
        </p>
      </div>

      {/* Grid de Bases */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BASES.map((base) => {
          const isSel = selecionado?.id === base.id;
          const attrEntries = Object.entries(base.bonus).slice(0, 4);

          return (
            <motion.button
              key={base.id}
              variants={item}
              onClick={() => setSelecionado(isSel ? null : base)}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-none border p-5 text-left transition-all duration-200 ${
                isSel
                  ? "border-2 scale-[1.02] shadow-lg"
                  : "border-white/10 bg-card hover:border-white/30 hover:bg-card/80"
              }`}
              style={isSel ? { borderColor: base.corPrimaria, backgroundColor: `${base.corPrimaria}12`, boxShadow: `0 0 24px ${base.corPrimaria}30` } : {}}
            >
              {isSel && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: base.corPrimaria }}>
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Ícone + Nome */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{base.icone}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base</span>
                  <h2 className="font-display text-xl uppercase leading-tight">{base.nome}</h2>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-sm text-muted-foreground leading-relaxed">{base.descricao}</p>

              {/* Bônus de atributos */}
              <div className="mt-1 flex flex-wrap gap-2">
                {attrEntries.map(([attr, val]) => (
                  <span
                    key={attr}
                    className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: `${base.corPrimaria}20`, color: base.corPrimaria, border: `1px solid ${base.corPrimaria}40` }}
                  >
                    +{val} {ATRIB_LABELS[attr] ?? attr}
                  </span>
                ))}
              </div>

              {/* Historia (expandida quando selecionado) */}
              <AnimatePresence>
                {isSel && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground/80 italic leading-relaxed border-t border-white/10 pt-3"
                  >
                    "{base.historia}"
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Botão de confirmação */}
      <AnimatePresence>
        {selecionado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center"
          >
            <button
              onClick={handleConfirmar}
              disabled={confirmado}
              className="group relative flex items-center gap-3 overflow-hidden rounded-none px-14 py-5 font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: selecionado.corPrimaria }}
            >
              <span>{confirmado ? "Confirmando..." : `Confirmar — ${selecionado.nome}`}</span>
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
