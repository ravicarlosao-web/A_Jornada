import { motion } from "framer-motion";
import { ArrowLeft, Globe, Lock, TrendingUp } from "lucide-react";
import type { Jogador } from "@/engine/types";
import { calcularOverall } from "@/engine/engine";

interface Liga {
  nome: string;
  pais: string;
  bandeira: string;
  prestigio: number; // 1-5
  salarioMedio: string;
  overallMinimo: number;
  descricao: string;
  cor: string;
}

const LIGAS: Liga[] = [
  {
    nome: "Brasileirão Série A",
    pais: "Brasil",
    bandeira: "🇧🇷",
    prestigio: 4,
    salarioMedio: "R$ 80k–500k/ano",
    overallMinimo: 0,
    descricao: "A elite do futebol nacional. Berço de craques e palco de grandes emoções.",
    cor: "#22c55e",
  },
  {
    nome: "Premier League",
    pais: "Inglaterra",
    bandeira: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    prestigio: 5,
    salarioMedio: "€ 500k–5M/ano",
    overallMinimo: 78,
    descricao: "A liga mais assistida do mundo. Ritmo intenso, palcos épicos.",
    cor: "#6366f1",
  },
  {
    nome: "La Liga",
    pais: "Espanha",
    bandeira: "🇪🇸",
    prestigio: 5,
    salarioMedio: "€ 400k–4M/ano",
    overallMinimo: 76,
    descricao: "Técnica e espetáculo. Casa do Real Madrid e Barcelona.",
    cor: "#f59e0b",
  },
  {
    nome: "Serie A",
    pais: "Itália",
    bandeira: "🇮🇹",
    prestigio: 4,
    salarioMedio: "€ 300k–3M/ano",
    overallMinimo: 72,
    descricao: "Táctica apurada, defesas ferrenhas e clubes históricos.",
    cor: "#0ea5e9",
  },
  {
    nome: "Bundesliga",
    pais: "Alemanha",
    bandeira: "🇩🇪",
    prestigio: 4,
    salarioMedio: "€ 350k–3.5M/ano",
    overallMinimo: 70,
    descricao: "Alta intensidade física. O Bayern domina, mas há muita briga.",
    cor: "#ef4444",
  },
  {
    nome: "Liga Portuguesa",
    pais: "Portugal",
    bandeira: "🇵🇹",
    prestigio: 3,
    salarioMedio: "€ 100k–800k/ano",
    overallMinimo: 60,
    descricao: "Porta de entrada para a Europa. Muitos brasileiros trilharam esse caminho.",
    cor: "#a855f7",
  },
  {
    nome: "Saudi Pro League",
    pais: "Arábia Saudita",
    bandeira: "🇸🇦",
    prestigio: 3,
    salarioMedio: "€ 1M–10M/ano",
    overallMinimo: 68,
    descricao: "Salários astronômicos. Destino de veteranos e craques que querem um último desafio.",
    cor: "#f97316",
  },
  {
    nome: "MLS",
    pais: "EUA",
    bandeira: "🇺🇸",
    prestigio: 2,
    salarioMedio: "$ 200k–2M/ano",
    overallMinimo: 55,
    descricao: "Liga em crescimento. Boa qualidade de vida e mercado em expansão.",
    cor: "#3b82f6",
  },
];

function Estrelas({ valor, max = 5 }: { valor: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-full ${i < valor ? "bg-accent" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function OutrasLigasScreen({ jogador, onFechar }: { jogador: Jogador; onFechar: () => void }) {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onFechar} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 border border-sky-500/30">
            <Globe size={20} className="text-sky-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase leading-none">Outras Ligas</h1>
            <p className="text-xs text-muted-foreground">Mercados disponíveis · Seu OVR: <strong className="text-foreground">{overall}</strong></p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Para ingressar numa liga, seu OVR deve atingir o mínimo exigido. Use o <strong className="text-foreground">Mercado de Transferências</strong> para formalizar uma proposta.
      </p>

      {/* Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2">
        {LIGAS.map((liga) => {
          const acessivel = overall >= liga.overallMinimo;
          return (
            <motion.div
              key={liga.nome}
              variants={item}
              className={`relative flex flex-col gap-3 rounded-none border p-5 transition-all ${
                acessivel ? "border-white/10 bg-card hover:border-white/20" : "border-white/5 bg-card/40 opacity-60"
              }`}
            >
              {/* Lock overlay */}
              {!acessivel && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/80 px-2 py-1">
                  <Lock size={10} className="text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground">OVR {liga.overallMinimo}+</span>
                </div>
              )}
              {acessivel && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-2 py-1" style={{ borderColor: `${liga.cor}40`, backgroundColor: `${liga.cor}15` }}>
                  <TrendingUp size={10} style={{ color: liga.cor }} />
                  <span className="text-[10px] font-bold" style={{ color: liga.cor }}>Disponível</span>
                </div>
              )}

              {/* Nome e bandeira */}
              <div className="flex items-center gap-3 pr-24">
                <span className="text-2xl">{liga.bandeira}</span>
                <div>
                  <p className="font-display text-lg uppercase leading-tight">{liga.nome}</p>
                  <p className="text-xs text-muted-foreground">{liga.pais}</p>
                </div>
              </div>

              {/* Prestígio */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Prestígio</span>
                <Estrelas valor={liga.prestigio} />
              </div>

              {/* Descrição */}
              <p className="text-sm text-muted-foreground leading-relaxed">{liga.descricao}</p>

              {/* Salário */}
              <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                <span className="text-xs text-muted-foreground">Salário médio:</span>
                <span className="text-xs font-bold text-accent">{liga.salarioMedio}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
