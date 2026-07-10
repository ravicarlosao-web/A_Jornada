import { useState } from "react";
import { calcularOverall, calcularTierFinal } from "@/engine/engine";
import type { Jogador } from "@/engine/types";
import { HallFamaScreen } from "@/components/screens/HallFamaScreen";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, Bookmark, Goal, Activity, Shield, Users } from "lucide-react";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  MEI: "Meio-campista",
  ATA: "Atacante",
};

export function ResultadoFinalScreen({
  jogador,
  onNovaCarreira,
  epilogo,
}: {
  jogador: Jogador;
  onNovaCarreira: () => void;
  epilogo?: string | null;
}) {
  const [mostrarHallFama, setMostrarHallFama] = useState(false);
  
  if (mostrarHallFama) {
    return <HallFamaScreen onVoltar={() => setMostrarHallFama(false)} />;
  }

  const { tier, score } = calcularTierFinal(jogador);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const totalGols = jogador.historicoTemporadas.reduce((acc, t) => acc + t.gols, 0);
  const totalAssist = jogador.historicoTemporadas.reduce((acc, t) => acc + t.assistencias, 0);
  const totalJogos = jogador.historicoTemporadas.reduce((acc, t) => acc + t.jogos, 0);
  const titulos = jogador.historicoTemporadas.filter((t) => t.objetivoCumprido).length;
  
  const melhorTemporada = jogador.historicoTemporadas.reduce<
    (typeof jogador.historicoTemporadas)[number] | null
  >((melhor, atual) => (!melhor || atual.notaMedia > melhor.notaMedia ? atual : melhor), null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16"
    >
      {/* Header Profile Section */}
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Aposentadoria Oficial • {NOME_POSICAO[jogador.posicao]}
        </p>
        <h1 className="font-display text-6xl uppercase tracking-wide text-foreground mb-2">
          {jogador.nome}
        </h1>
        <div className="inline-block mt-4 rounded-none border border-accent bg-accent/10 px-8 py-3 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Status na História</p>
          <p className="font-display text-4xl text-accent">{tier.nome}</p>
        </div>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed italic">
          "{tier.descricao}"
        </p>
      </div>

      {/* Main Score & Core Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy />} label="Score Final" value={score} highlight />
        <StatCard icon={<Activity />} label="Overall Máximo" value={overall} />
        <StatCard icon={<Goal />} label="Gols na Carreira" value={totalGols} />
        <StatCard icon={<Users />} label="Jogos Disputados" value={totalJogos} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Story Section */}
        <div className="flex flex-col gap-4">
          {epilogo && (
            <div className="flex-1 rounded-none border border-white/10 bg-card p-8">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Bookmark size={16} /> O Dia Seguinte
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {epilogo}
              </p>
            </div>
          )}

          {melhorTemporada && (
            <div className="rounded-none border border-secondary/30 bg-secondary/5 p-8">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                <Shield size={16} /> Temporada de Ouro
              </h3>
              <p className="font-display text-2xl uppercase mb-1">
                {melhorTemporada.clube} <span className="text-muted-foreground text-xl">({melhorTemporada.idade} anos)</span>
              </p>
              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nota</span>
                  <span className="font-sports text-2xl">{melhorTemporada.notaMedia.toFixed(1)}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gols</span>
                  <span className="font-sports text-2xl">{melhorTemporada.gols}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assist.</span>
                  <span className="font-sports text-2xl">{melhorTemporada.assistencias}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Stats */}
        <div className="rounded-none border border-white/10 bg-black/40 p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Raio-X da Carreira</h3>
          <div className="space-y-4">
            <DetailRow label="Temporadas Jogadas" value={jogador.historicoTemporadas.length} />
            <DetailRow label="Títulos Conquistados" value={titulos} />
            <DetailRow label="Assistências Totais" value={totalAssist} />
            <DetailRow label="Prêmios Individuais" value={jogador.premios.length} />
            <DetailRow label="Convocações Nacionais" value={jogador.convocacoesSelecao} />
            <DetailRow label="Títulos pela Seleção" value={jogador.titulosSelecao.length} />
            <DetailRow label="Patrocínios Assinados" value={jogador.patrocinios.length} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={onNovaCarreira}
          className="flex items-center justify-center gap-2 rounded-none clip-diagonal bg-primary px-8 py-5 font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
        >
          <RefreshCw size={18} /> Nova Jornada
        </button>
        <button
          onClick={() => setMostrarHallFama(true)}
          className="flex items-center justify-center gap-2 rounded-none clip-diagonal border border-white/20 bg-card px-8 py-5 font-bold uppercase tracking-widest text-foreground transition-all hover:bg-white/10"
        >
          <Trophy size={18} /> Hall da Fama
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center border p-6 text-center ${highlight ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 bg-card text-foreground'}`}>
      <div className="mb-3 opacity-50">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className="font-sports text-5xl leading-none">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="font-sports text-2xl leading-none">{value}</span>
    </div>
  );
}
