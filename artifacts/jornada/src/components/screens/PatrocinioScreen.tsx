import type { Patrocinio } from "@/engine/types";
import { motion } from "framer-motion";
import { Handshake, X } from "lucide-react";

function formatarValor(valor: number): string {
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000).toFixed(1)} Milhões`;
  }
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function PatrocinioScreen({
  proposta,
  onEscolher,
}: {
  proposta: Patrocinio;
  onEscolher: (aceitar: boolean) => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-10 px-4 py-16 text-center"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center justify-center gap-2">
          <Handshake size={18} /> Oportunidade Comercial
        </p>
        <h1 className="font-display text-6xl uppercase tracking-wide text-foreground">
          {proposta.marca}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-lg">
          Uma grande marca quer associar a imagem dela à sua campanha para a próxima temporada.
        </p>
      </div>

      <div className="w-full relative overflow-hidden rounded-none clip-diagonal border border-accent/30 bg-card p-10 shadow-[0_0_40px_rgba(234,179,8,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Contrato de Imagem (Anual)
        </p>
        <p className="font-sports text-6xl text-accent drop-shadow-sm">
          {formatarValor(proposta.valorAnual)}
        </p>
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Assinar aumenta sua fama global imediatamente, mas vincula sua imagem à marca. Recusar mantém seu espaço comercial livre para ofertas mais agressivas no futuro.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center mt-4">
        <button
          onClick={() => onEscolher(true)}
          className="group flex flex-1 items-center justify-center gap-3 rounded-none clip-diagonal bg-accent px-8 py-5 font-bold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
        >
          <Handshake size={20} className="transition-transform group-hover:scale-110" /> Fechar Acordo
        </button>
        <button
          onClick={() => onEscolher(false)}
          className="group flex flex-1 items-center justify-center gap-3 rounded-none clip-diagonal border border-white/20 bg-transparent px-8 py-5 font-bold uppercase tracking-widest text-foreground transition-all hover:bg-white/5"
        >
          <X size={20} className="text-muted-foreground transition-colors group-hover:text-destructive" /> Recusar
        </button>
      </div>
    </motion.div>
  );
}
