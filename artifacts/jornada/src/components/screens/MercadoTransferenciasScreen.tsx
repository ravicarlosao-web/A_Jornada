import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowLeftRight, TrendingUp, Star, MapPin, Clock, ChevronRight } from "lucide-react";
import type { Jogador } from "@/engine/types";
import { calcularOverall, overallLabel } from "@/engine/engine";

interface Rumor {
  clube: string;
  pais: string;
  bandeira: string;
  tier: "pequeno" | "medio" | "grande" | "internacional";
  interesse: "frio" | "morno" | "quente" | "confirmado";
  valorEstimado: string;
  descricao: string;
  cor: string;
}

function gerarRumores(jogador: Jogador): Rumor[] {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const fama = jogador.fama;
  const rumores: Rumor[] = [];

  // Sempre tem pelo menos 1 clube nacional interessado
  rumores.push({
    clube: overall >= 75 ? "Flamengo" : "Fortaleza",
    pais: "Brasil",
    bandeira: "🇧🇷",
    tier: overall >= 75 ? "grande" : "medio",
    interesse: fama >= 50 ? "quente" : "morno",
    valorEstimado: `R$ ${(overall * 8000).toLocaleString("pt-BR")}`,
    descricao: `Olheiro presente no último jogo ficou impressionado com sua atuação.`,
    cor: "#22c55e",
  });

  if (overall >= 60) {
    rumores.push({
      clube: "Sporting CP",
      pais: "Portugal",
      bandeira: "🇵🇹",
      tier: "grande",
      interesse: overall >= 70 ? "quente" : "frio",
      valorEstimado: `€ ${Math.round(overall * 12000).toLocaleString("pt-BR")}`,
      descricao: "Clube português tem acompanhado seu desempenho nas últimas temporadas.",
      cor: "#a855f7",
    });
  }

  if (overall >= 70) {
    rumores.push({
      clube: "Sevilla FC",
      pais: "Espanha",
      bandeira: "🇪🇸",
      tier: "grande",
      interesse: fama >= 60 ? "morno" : "frio",
      valorEstimado: `€ ${Math.round(overall * 18000).toLocaleString("pt-BR")}`,
      descricao: "Procuram um jogador com seu perfil para a próxima janela de transferências.",
      cor: "#f59e0b",
    });
  }

  if (overall >= 75 && fama >= 50) {
    rumores.push({
      clube: "Bayer Leverkusen",
      pais: "Alemanha",
      bandeira: "🇩🇪",
      tier: "grande",
      interesse: "quente",
      valorEstimado: `€ ${Math.round(overall * 22000).toLocaleString("pt-BR")}`,
      descricao: "Clube da Bundesliga fez contato com seu agente recentemente.",
      cor: "#ef4444",
    });
  }

  if (overall >= 82 && fama >= 65) {
    rumores.push({
      clube: overall >= 88 ? "Manchester City" : "Aston Villa",
      pais: "Inglaterra",
      bandeira: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      tier: "internacional",
      interesse: "confirmado",
      valorEstimado: `€ ${Math.round(overall * 35000).toLocaleString("pt-BR")}`,
      descricao: "Interesse confirmado por fonte próxima ao clube. Proposta formal em breve.",
      cor: "#6366f1",
    });
  }

  if (overall >= 68 && jogador.historicoTemporadas.length >= 4) {
    rumores.push({
      clube: "Al-Hilal",
      pais: "Arábia Saudita",
      bandeira: "🇸🇦",
      tier: "internacional",
      interesse: "morno",
      valorEstimado: `€ ${Math.round(overall * 40000).toLocaleString("pt-BR")}`,
      descricao: "Liga Saudita oferece pacote financeiro milionário. Decisão difícil.",
      cor: "#f97316",
    });
  }

  return rumores;
}

const INTERESSE_CONFIG = {
  frio: { label: "Frio", cor: "#94a3b8", icone: "❄️" },
  morno: { label: "Morno", cor: "#f59e0b", icone: "🌡️" },
  quente: { label: "Quente", cor: "#ef4444", icone: "🔥" },
  confirmado: { label: "Confirmado", cor: "#22c55e", icone: "✅" },
};

const TIER_LABEL = {
  pequeno: "Clube Pequeno",
  medio: "Clube Médio",
  grande: "Grande Clube",
  internacional: "Elite Mundial",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function MercadoTransferenciasScreen({ jogador, onFechar }: { jogador: Jogador; onFechar: () => void }) {
  const [expandido, setExpandido] = useState<number | null>(null);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const label = overallLabel(overall);
  const rumores = gerarRumores(jogador);

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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
            <ArrowLeftRight size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase leading-none">Mercado de Transferências</h1>
            <p className="text-xs text-muted-foreground">{rumores.length} rumores ativos</p>
          </div>
        </div>
      </div>

      {/* Status do jogador */}
      <div className="rounded-none border border-white/10 bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Seu Perfil de Mercado</p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Overall</p>
            <div className="flex items-center gap-2">
              <span className="font-sports text-3xl text-primary">{overall}</span>
              <span className="text-sm font-bold" style={{ color: label.cor }}>{label.texto}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Clube Atual</p>
            <p className="font-bold text-foreground">{jogador.clubeAtual.nome}</p>
            <p className="text-xs text-muted-foreground">{jogador.clubeAtual.pais}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contrato Restante</p>
            <p className="font-bold text-foreground">{jogador.contrato.anosRestantes} ano{jogador.contrato.anosRestantes !== 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fama</p>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-accent" />
              <span className="font-bold text-foreground">{jogador.fama}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rumores */}
      <div>
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-3">Rumores de Mercado</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
          {rumores.map((rumor, i) => {
            const cfg = INTERESSE_CONFIG[rumor.interesse];
            const isExp = expandido === i;

            return (
              <motion.div
                key={i}
                variants={item}
                className={`rounded-none border bg-card cursor-pointer transition-all ${isExp ? "border-white/20" : "border-white/10 hover:border-white/15"}`}
                onClick={() => setExpandido(isExp ? null : i)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Bandeira */}
                  <span className="text-2xl">{rumor.bandeira}</span>

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-foreground">{rumor.clube}</p>
                      <span className="text-xs text-muted-foreground">{TIER_LABEL[rumor.tier]}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{cfg.icone}</span>
                        <span className="text-xs font-bold" style={{ color: cfg.cor }}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} />
                        <span>{rumor.pais}</span>
                      </div>
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Valor estimado</p>
                    <p className="font-bold text-accent text-sm">{rumor.valorEstimado}</p>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`text-muted-foreground transition-transform ${isExp ? "rotate-90" : ""}`}
                  />
                </div>

                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 p-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{rumor.descricao}</p>
                        {rumor.interesse === "confirmado" && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-green-400 font-bold">
                            <TrendingUp size={14} />
                            Use o Mercado de Transferências na próxima renovação de contrato para negociar.
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock size={10} />
                          <span>Janela de transferências abre na próxima temporada</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
