import { CATALOGO_LOJA } from "@/engine/engine";
import type { Jogador } from "@/engine/types";
import { motion } from "framer-motion";
import { Dumbbell, Sparkles, Brain, ArrowLeft, Wallet, Check } from "lucide-react";

const ICONES_CATEGORIA = {
  "personal-trainer": Dumbbell,
  "estilo-de-vida": Sparkles,
  mentalidade: Brain,
} as const;

export function LojaScreen({
  jogador,
  mensagem,
  onComprar,
  onFechar,
}: {
  jogador: Jogador;
  mensagem: string | null;
  onComprar: (itemId: string) => void;
  onFechar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Loja &amp; Personal Trainer
          </span>
          <h1 className="font-display text-4xl uppercase tracking-wide">Invista na sua carreira</h1>
          <p className="mt-2 text-muted-foreground max-w-xl leading-relaxed">
            Use o dinheiro acumulado com salário e patrocínios para reduzir fadiga, cuidar da imagem e
            evoluir sua mentalidade.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-none clip-diagonal border border-white/10 bg-card px-6 py-4">
          <Wallet className="h-6 w-6 text-accent" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Saldo</p>
            <p className="font-sports text-2xl text-accent">
              R$ {jogador.dinheiro.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {mensagem && (
        <div className="rounded-none clip-diagonal border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CATALOGO_LOJA.map((item) => {
          const Icone = ICONES_CATEGORIA[item.categoria];
          const jaComprado = !item.repetivel && jogador.itensComprados.includes(item.id);
          const podeComprar = !jaComprado && jogador.dinheiro >= item.custo;

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-none clip-diagonal border p-6 transition-colors ${
                jaComprado ? "border-primary/40 bg-primary/5" : "border-white/10 bg-card"
              }`}
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <Icone className="h-6 w-6 text-accent" />
                  <h2 className="font-display text-xl uppercase">{item.titulo}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.descricao}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-sports text-lg text-foreground">
                  R$ {item.custo.toLocaleString("pt-BR")}
                </span>
                {jaComprado ? (
                  <span className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-primary">
                    <Check size={16} /> Adquirido
                  </span>
                ) : (
                  <button
                    onClick={() => onComprar(item.id)}
                    disabled={!podeComprar}
                    className="rounded-none clip-diagonal bg-primary px-5 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                  >
                    Comprar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onFechar}
        className="group mx-auto flex items-center gap-2 rounded-none clip-diagonal border border-white/10 bg-card px-8 py-4 font-bold uppercase tracking-widest text-foreground transition-transform hover:scale-105 active:scale-95"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        <span>Voltar</span>
      </button>
    </motion.div>
  );
}
