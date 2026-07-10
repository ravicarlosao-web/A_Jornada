import { useState } from "react";
import { calcularOverall, sugerirPosicao } from "@/engine/engine";
import type { Atributos, Posicao } from "@/engine/types";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const OPCOES: { posicao: Posicao; nome: string; descricao: string }[] = [
  { posicao: "ATA", nome: "Atacante", descricao: "Feito para decidir jogos e balançar as redes. A glória é sua." },
  { posicao: "MEI", nome: "Meio-campista", descricao: "O motor do time, entre a defesa e o ataque. O cérebro." },
  { posicao: "ZAG", nome: "Zagueiro", descricao: "A base da defesa, onde os jogos e os campeonatos se ganham." },
  { posicao: "GOL", nome: "Goleiro", descricao: "Último a falhar, primeiro a ser cobrado. O paredão." },
];

export function PosicaoScreen({
  atributos,
  onEscolher,
}: {
  atributos: Atributos;
  onEscolher: (posicao: Posicao, nome: string) => void;
}) {
  const [nome, setNome] = useState("");
  const sugerida = sugerirPosicao(atributos);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12"
    >
      <motion.div variants={item} className="text-center">
        <h1 className="font-display text-4xl sm:text-5xl uppercase">Identidade em Campo</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          O DNA dos seus atributos indica que você brilharia como <strong className="text-accent uppercase tracking-wider">{OPCOES.find((o) => o.posicao === sugerida)?.nome}</strong>.
        </p>
      </motion.div>

      <motion.div variants={item} className="mx-auto w-full max-w-md relative">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Nome na Camisa</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value.toUpperCase())}
          placeholder="EX: RONALDO, KAKÁ..."
          className="w-full rounded-none clip-diagonal border-2 border-white/20 bg-black/50 px-6 py-4 text-center font-display text-3xl uppercase tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-0 placeholder:text-white/10"
          maxLength={24}
        />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 mt-4">
        {OPCOES.map((opcao) => {
          const overall = calcularOverall(atributos, opcao.posicao);
          const isRecomendado = opcao.posicao === sugerida;

          return (
            <button
              key={opcao.posicao}
              disabled={!nome.trim()}
              onClick={() => onEscolher(opcao.posicao, nome.trim())}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-none clip-diagonal border p-6 text-left transition-all ${
                isRecomendado ? "border-accent/50 bg-accent/5" : "border-white/10 bg-card"
              } hover:border-primary hover:bg-card/80 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {isRecomendado && (
                <div className="absolute top-0 right-0 bg-accent px-3 py-1 text-[10px] font-bold uppercase text-accent-foreground">
                  Recomendado
                </div>
              )}
              
              <div className="flex w-full items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{opcao.posicao}</span>
                  <h2 className="font-display text-2xl uppercase mt-1">{opcao.nome}</h2>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">OVR Base</span>
                  <span className={`font-sports text-4xl leading-none ${isRecomendado ? 'text-accent' : 'text-primary'}`}>
                    {overall}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed pr-8">{opcao.descricao}</p>
              
              <div className="mt-2 flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Confirmar <Target size={14} className="ml-2" />
              </div>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
