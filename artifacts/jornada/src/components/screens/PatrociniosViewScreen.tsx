import { motion } from "framer-motion";
import { ArrowLeft, Star, TrendingUp, Clock, Handshake } from "lucide-react";
import type { Jogador } from "@/engine/types";
import { calcularOverall } from "@/engine/engine";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const MARCAS_CORES: Record<string, string> = {
  default: "#f59e0b",
};

function corMarca(marca: string): string {
  const hash = marca.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cores = ["#f59e0b", "#a855f7", "#0ea5e9", "#22c55e", "#ef4444", "#f97316", "#6366f1"];
  return cores[hash % cores.length];
}

export function PatrociniosViewScreen({ jogador, onFechar }: { jogador: Jogador; onFechar: () => void }) {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const totalAnual = jogador.patrocinios.reduce((acc, p) => acc + p.valorAnual, 0);
  const temporadaAtual = jogador.historicoTemporadas.length + 1;

  // Dicas de quando conseguir mais patrocínios
  const proximoTier =
    overall < 60 ? { over: 60, label: "Médio", chance: "patrocínios regionais" } :
    overall < 75 ? { over: 75, label: "Acima da Média", chance: "marcas nacionais" } :
    overall < 85 ? { over: 85, label: "Craque", chance: "grandes marcas" } :
    null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onFechar}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30">
            <Star size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase leading-none">Patrocínios</h1>
            <p className="text-xs text-muted-foreground">
              {jogador.patrocinios.length} ativo{jogador.patrocinios.length !== 1 ? "s" : ""} · R$ {totalAnual.toLocaleString("pt-BR")}/ano
            </p>
          </div>
        </div>
      </div>

      {/* Resumo financeiro */}
      {totalAnual > 0 && (
        <div className="rounded-none border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Receita Total de Patrocínios</p>
          <p className="font-sports text-4xl text-amber-400">R$ {totalAnual.toLocaleString("pt-BR")}<span className="text-lg text-muted-foreground font-normal">/ano</span></p>
          <p className="text-xs text-muted-foreground mt-1">
            + R$ {(jogador.contrato.salarioAnual).toLocaleString("pt-BR")}/ano de salário = <strong className="text-foreground">R$ {(totalAnual + jogador.contrato.salarioAnual).toLocaleString("pt-BR")}/ano total</strong>
          </p>
        </div>
      )}

      {/* Lista de patrocínios ativos */}
      {jogador.patrocinios.length > 0 ? (
        <div>
          <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-3">Contratos Ativos</h2>
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
            {jogador.patrocinios.map((p, i) => {
              const cor = corMarca(p.marca);
              const anosAtivo = temporadaAtual - p.temporadaInicio;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className="flex items-center gap-5 rounded-none border border-white/10 bg-card p-5"
                >
                  {/* Avatar da marca */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                    style={{ backgroundColor: `${cor}20`, border: `2px solid ${cor}50`, color: cor }}
                  >
                    {p.marca.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-foreground">{p.marca}</p>
                      <p className="font-sports text-xl shrink-0" style={{ color: cor }}>
                        R$ {p.valorAnual.toLocaleString("pt-BR")}
                        <span className="text-xs text-muted-foreground font-normal">/ano</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Handshake size={10} />
                        <span>Desde temporada {p.temporadaInicio}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{anosAtivo} ano{anosAtivo !== 1 ? "s" : ""} de parceria</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-card">
            <Star size={28} className="text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-bold text-foreground">Nenhum patrocínio ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Continue jogando bem para atrair o interesse das marcas.
            </p>
          </div>
        </div>
      )}

      {/* Dica para próximo tier */}
      {proximoTier && (
        <div className="rounded-none border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary" />
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Como conseguir mais patrocínios</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Atinja OVR <strong className="text-foreground">{proximoTier.over}</strong> ({proximoTier.label}) para atrair{" "}
            <strong className="text-foreground">{proximoTier.chance}</strong>. Seu OVR atual é <strong className="text-primary">{overall}</strong>.
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, (overall / proximoTier.over) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {overall >= 85 && (
        <div className="rounded-none border border-accent/20 bg-accent/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🏆 Com OVR <strong className="text-accent">{overall}</strong>, você está no radar das maiores marcas do mundo. Novas propostas podem aparecer após ótimas temporadas.
          </p>
        </div>
      )}
    </motion.div>
  );
}
