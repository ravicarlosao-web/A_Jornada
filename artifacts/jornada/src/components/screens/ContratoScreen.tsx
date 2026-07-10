import type { Jogador, PropostaContrato } from "@/engine/types";
import { motion } from "framer-motion";
import { FileSignature, Globe, Landmark, BadgeAlert } from "lucide-react";

function formatarSalario(valor: number): string {
  // Use a more compact format for large numbers, e.g. R$ 5.4M
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000).toFixed(1)}M`;
  }
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function ContratoScreen({
  jogador,
  propostas,
  mensagensNegociacao,
  onEscolher,
  onNegociar,
}: {
  jogador: Jogador;
  propostas: PropostaContrato[];
  mensagensNegociacao: Record<string, string>;
  onEscolher: (proposta: PropostaContrato) => void;
  onNegociar: (propostaId: string) => void;
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
      className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16"
    >
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center justify-center gap-2">
          <FileSignature size={16} /> Agência Livre
        </p>
        <h1 className="font-display text-5xl uppercase tracking-wide">Mercado da Bola</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Seu contrato chegou ao fim. Analise as propostas na mesa. Você tem direito a <strong className="text-foreground">uma rodada de contraproposta</strong> por clube antes de decidir seu destino.
        </p>
      </div>

      {propostas.length === 0 && (
        <div className="text-center p-8 border border-dashed border-white/20 text-muted-foreground">
          Sem propostas na mesa. Tente recarregar.
        </div>
      )}

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-2"
      >
        {propostas.map((proposta) => {
          const isNegociado = !!mensagensNegociacao[proposta.id];
          
          return (
            <motion.div 
              key={proposta.id} 
              variants={item}
              className="flex flex-col rounded-none clip-diagonal border border-white/10 bg-card p-0 shadow-xl"
            >
              {/* Header */}
              <div className="border-b border-white/10 bg-black/40 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide">{proposta.clube.nome}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1 mt-1">
                      {proposta.clube.pais} <span className="opacity-50">•</span> Tier {proposta.clube.tier}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {proposta.ehClubeAtual && (
                      <span className="flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Landmark size={12} /> Clube Atual
                      </span>
                    )}
                    {proposta.clube.tier === "internacional" && (
                      <span className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Globe size={12} /> Exterior
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col grow p-6">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Salário Anual</p>
                    <span className="font-sports text-5xl text-primary leading-none">{formatarSalario(proposta.salarioAnual)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Duração</p>
                    <span className="font-sports text-3xl leading-none">{proposta.duracaoAnos} Anos</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 rounded-sm border border-white/5 bg-black/20 p-1 text-center">
                  <div className="bg-card py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Luvas</p>
                    <p className="font-sports text-xl text-foreground">{formatarSalario(proposta.clausulas.luvas)}</p>
                  </div>
                  <div className="bg-card py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Bônus/Gol</p>
                    <p className="font-sports text-xl text-foreground">{formatarSalario(proposta.clausulas.bonusPorGol)}</p>
                  </div>
                  <div className="bg-card py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Multa</p>
                    <p className="font-sports text-xl text-foreground">{formatarSalario(proposta.clausulas.multaRescisoria)}</p>
                  </div>
                </div>

                {isNegociado ? (
                  <div className="mt-4 flex items-start gap-3 rounded-sm border border-accent/30 bg-accent/5 p-3 text-sm">
                    <BadgeAlert className="h-5 w-5 shrink-0 text-accent" />
                    <p className="text-muted-foreground italic leading-relaxed text-xs">
                      {mensagensNegociacao[proposta.id]}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grow" />
                )}

                {/* Footer Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => onEscolher(proposta)}
                    className="flex-1 bg-primary px-4 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Assinar
                  </button>
                  <button
                    onClick={() => onNegociar(proposta.id)}
                    disabled={isNegociado}
                    className="flex-1 border border-white/20 bg-transparent px-4 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    {isNegociado ? "Oferta Final" : "Exigir Mais"}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
