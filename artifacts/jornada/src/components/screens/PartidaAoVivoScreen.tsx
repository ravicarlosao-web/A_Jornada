import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Goal, Footprints, Square, ShieldCheck, Flag, ChevronRight } from "lucide-react";
import type { MomentoPartida } from "@/engine/types";

const ICONE_TIPO: Record<MomentoPartida["tipo"], typeof Goal> = {
  gol: Goal,
  assistencia: Footprints,
  cartao: Square,
  lesao: Flag,
  defesa: ShieldCheck,
  final: Flag,
};

const COR_TIPO: Record<MomentoPartida["tipo"], string> = {
  gol: "border-primary/50 bg-primary/10 text-primary",
  assistencia: "border-sky-400/50 bg-sky-400/10 text-sky-300",
  cartao: "border-yellow-400/50 bg-yellow-400/10 text-yellow-300",
  lesao: "border-destructive/50 bg-destructive/10 text-destructive",
  defesa: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  final: "border-white/30 bg-white/5 text-foreground",
};

/**
 * Toca os melhores momentos da temporada como um feed "ao vivo", lance a
 * lance, antes de mostrar o resumo estatístico completo.
 */
export function PartidaAoVivoScreen({
  momentos,
  clube,
  temporada,
  onFinalizar,
}: {
  momentos: MomentoPartida[];
  clube: string;
  temporada: number;
  onFinalizar: () => void;
}) {
  const lista = useMemo(
    () => (momentos.length > 0 ? momentos : [{ jogo: 1, minuto: 90, tipo: "final" as const, texto: "Temporada concluída." }]),
    [momentos],
  );
  const [indice, setIndice] = useState(0);
  const finalizado = indice >= lista.length;

  useEffect(() => {
    if (finalizado) return;
    const timer = setTimeout(() => setIndice((i) => i + 1), 1100);
    return () => clearTimeout(timer);
  }, [indice, finalizado]);

  const visiveis = lista.slice(0, Math.min(indice + 1, lista.length));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          Temporada {temporada} · Ao Vivo
        </p>
        <h1 className="font-display text-4xl uppercase tracking-wide">{clube}</h1>
      </div>

      <div className="flex min-h-[360px] flex-col gap-3 rounded-none border border-white/10 bg-card/40 p-5">
        <AnimatePresence initial={false}>
          {visiveis.map((momento, i) => {
            const Icone = ICONE_TIPO[momento.tipo];
            const isUltimo = i === visiveis.length - 1;
            return (
              <motion.div
                key={`${momento.jogo}-${momento.minuto}-${i}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-3 rounded-none border p-3 ${COR_TIPO[momento.tipo]} ${isUltimo ? "" : "opacity-60"}`}
              >
                <Icone size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">
                    Jogo {momento.jogo} · {momento.minuto}'
                  </p>
                  <p className="text-sm leading-snug">{momento.texto}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!finalizado && (
          <div className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            transmitindo lances da temporada...
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onFinalizar}
          className="group flex items-center justify-center gap-2 rounded-none clip-diagonal bg-primary px-10 py-4 font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all"
        >
          {finalizado ? "Ver Resumo Completo" : "Pular Para o Resumo"}
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
