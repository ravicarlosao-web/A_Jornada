import { useState, useMemo } from "react";
import type { FocoTreino, Jogador, Posicao } from "@/engine/types";
import { motion } from "framer-motion";
import { Activity, Dumbbell, Route, Minus, Plus, RotateCcw, Zap, TrendingUp } from "lucide-react";

const TOTAL_PONTOS = 10;

const ATRIBUTOS_BASE = ["ritmo", "finalizacao", "passe", "drible", "defesa", "fisico", "reflexos"] as const;
type AtribBase = (typeof ATRIBUTOS_BASE)[number];

const NOME_ATRIBUTO: Record<AtribBase | "foco", string> = {
  ritmo: "Ritmo",
  finalizacao: "Finalização",
  passe: "Passe",
  drible: "Drible",
  defesa: "Defesa",
  fisico: "Físico",
  reflexos: "Reflexos",
  foco: "Foco Mental",
};

const ATRIBUTOS_CHAVE: Record<Posicao, AtribBase[]> = {
  GOL: ["reflexos", "defesa", "fisico"],
  ZAG: ["defesa", "fisico", "ritmo"],
  MEI: ["passe", "drible", "ritmo"],
  ATA: ["finalizacao", "ritmo", "drible"],
};

function fatorIdade(idade: number): number {
  if (idade <= 20) return 1.15;
  if (idade <= 27) return 1.05;
  if (idade <= 30) return 0.95;
  if (idade <= 33) return 0.8;
  return 0.6;
}

type Preset = { label: string; foco: FocoTreino; icon: React.ReactNode };

const PRESETS: Preset[] = [
  { label: "Técnico Puro", foco: { tecnico: 8, recuperacao: 1, tatica: 1 }, icon: <Dumbbell size={14} /> },
  { label: "Equilibrado", foco: { tecnico: 5, recuperacao: 3, tatica: 2 }, icon: <Zap size={14} /> },
  { label: "Recuperação", foco: { tecnico: 3, recuperacao: 6, tatica: 1 }, icon: <Activity size={14} /> },
  { label: "Tático", foco: { tecnico: 4, recuperacao: 2, tatica: 4 }, icon: <Route size={14} /> },
];

function calcularGanhosPrevistos(
  atributos: Jogador["atributos"],
  foco: FocoTreino,
  idade: number
): Record<AtribBase | "foco", number> {
  const fIdade = fatorIdade(idade);
  const pontosPorAtributo = foco.tecnico / ATRIBUTOS_BASE.length;
  const result: Partial<Record<AtribBase | "foco", number>> = {};
  for (const attr of ATRIBUTOS_BASE) {
    const atual = atributos[attr];
    const disponivel = 99 - atual;
    if (disponivel <= 0) { result[attr] = 0; continue; }
    const diminishing = 1 - Math.pow(atual / 99, 2);
    const ganho = pontosPorAtributo * fIdade * (atributos.foco / 99) * diminishing;
    result[attr] = Math.min(disponivel, Math.round(ganho * 10) / 10);
  }
  result["foco"] = Math.round(foco.tatica * 0.15 * 10) / 10;
  return result as Record<AtribBase | "foco", number>;
}

export function TreinoScreen({
  jogador,
  ultimoFocoTreino,
  onConfirmar,
}: {
  jogador: Jogador;
  ultimoFocoTreino: FocoTreino | null;
  onConfirmar: (foco: FocoTreino) => void;
}) {
  const focoInicial = ultimoFocoTreino ?? { tecnico: 6, recuperacao: 2, tatica: 2 };
  const [tecnico, setTecnico] = useState(focoInicial.tecnico);
  const [recuperacao, setRecuperacao] = useState(focoInicial.recuperacao);
  const [tatica, setTatica] = useState(focoInicial.tatica);

  const usado = tecnico + recuperacao + tatica;
  const restante = TOTAL_PONTOS - usado;
  const progresso = (usado / TOTAL_PONTOS) * 100;

  const focoAtual: FocoTreino = { tecnico, recuperacao, tatica };
  const ganhos = useMemo(
    () => calcularGanhosPrevistos(jogador.atributos, focoAtual, jogador.idade),
    [tecnico, recuperacao, tatica, jogador.atributos, jogador.idade]
  );

  const chavePos = ATRIBUTOS_CHAVE[jogador.posicao];

  function ajustar(campo: "tecnico" | "recuperacao" | "tatica", delta: number) {
    const vals = { tecnico, recuperacao, tatica };
    const novo = vals[campo] + delta;
    if (novo < 0) return;
    if (delta > 0 && restante <= 0) return;
    if (campo === "tecnico") setTecnico(novo);
    if (campo === "recuperacao") setRecuperacao(novo);
    if (campo === "tatica") setTatica(novo);
  }

  function aplicarPreset(p: FocoTreino) {
    setTecnico(p.tecnico);
    setRecuperacao(p.recuperacao);
    setTatica(p.tatica);
  }

  const temporada = jogador.historicoTemporadas.length + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12"
    >
      {/* Header */}
      <div className="text-center">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
          Temporada {temporada} • {jogador.idade} Anos • {jogador.clubeAtual.nome}
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide">Foco da Pré-Temporada</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Distribua sua energia antes da temporada começar. Cada escolha molda sua evolução.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">Rotina Rápida:</span>
        {PRESETS.map((p) => {
          const ativo =
            tecnico === p.foco.tecnico && recuperacao === p.foco.recuperacao && tatica === p.foco.tatica;
          return (
            <button
              key={p.label}
              onClick={() => aplicarPreset(p.foco)}
              className={`flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all border ${
                ativo
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/20 bg-card text-muted-foreground hover:border-white/40 hover:text-foreground"
              }`}
            >
              {p.icon}
              {p.label}
            </button>
          );
        })}
        {ultimoFocoTreino && (
          <button
            onClick={() => aplicarPreset(ultimoFocoTreino)}
            className={`flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all border ${
              tecnico === ultimoFocoTreino.tecnico &&
              recuperacao === ultimoFocoTreino.recuperacao &&
              tatica === ultimoFocoTreino.tatica
                ? "border-accent bg-accent text-accent-foreground"
                : "border-accent/40 bg-accent/10 text-accent hover:border-accent hover:bg-accent/20"
            }`}
          >
            <RotateCcw size={14} />
            Repetir Último
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribution Panel */}
        <div className="flex flex-col gap-5">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
              <span className="text-muted-foreground">Pontos Usados</span>
              <span className={restante === 0 ? "text-primary" : "text-accent"}>
                {usado} / {TOTAL_PONTOS}
              </span>
            </div>
            <div className="h-2 w-full bg-card overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${restante === 0 ? "bg-primary" : "bg-accent"}`}
                style={{ width: `${progresso}%` }}
              />
            </div>
            {restante > 0 && (
              <p className="text-center text-xs font-bold uppercase tracking-widest text-accent mt-2">
                {restante} {restante === 1 ? "ponto restante" : "pontos restantes"}
              </p>
            )}
          </div>

          <Linha
            icon={<Dumbbell className="text-primary" />}
            titulo="Técnico & Físico"
            descricao="Desenvolve finalização, passe, drible, defesa, ritmo e reflexos."
            valor={tecnico}
            onMenos={() => ajustar("tecnico", -1)}
            onMais={() => ajustar("tecnico", 1)}
            maxReached={restante === 0}
            cor="primary"
          />
          <Linha
            icon={<Activity className="text-secondary" />}
            titulo="Recuperação"
            descricao="Reduz a fadiga acumulada e o risco de lesão muscular."
            valor={recuperacao}
            onMenos={() => ajustar("recuperacao", -1)}
            onMais={() => ajustar("recuperacao", 1)}
            maxReached={restante === 0}
            cor="secondary"
          />
          <Linha
            icon={<Route className="text-accent" />}
            titulo="Tática Coletiva"
            descricao="Melhora sua adequação ao esquema e confiança do técnico."
            valor={tatica}
            onMenos={() => ajustar("tatica", -1)}
            onMais={() => ajustar("tatica", 1)}
            maxReached={restante === 0}
            cor="accent"
          />

          <button
            disabled={restante !== 0}
            onClick={() => onConfirmar(focoAtual)}
            className="mt-2 w-full rounded-none clip-diagonal bg-primary px-12 py-5 font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar Rotina
          </button>
        </div>

        {/* Attribute Preview Panel */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Projeção de Ganhos — {jogador.posicao}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {ATRIBUTOS_BASE.map((attr) => {
              const atual = jogador.atributos[attr];
              const ganho = ganhos[attr] ?? 0;
              const isChave = chavePos.includes(attr as any);
              return (
                <AtributoLinha
                  key={attr}
                  nome={NOME_ATRIBUTO[attr]}
                  atual={atual}
                  ganho={tecnico > 0 ? ganho : 0}
                  isChave={isChave}
                />
              );
            })}
            {/* Foco Mental (tática) */}
            <AtributoLinha
              nome={NOME_ATRIBUTO["foco"]}
              atual={jogador.atributos.foco}
              ganho={tatica > 0 ? (ganhos["foco"] ?? 0) : 0}
              isChave={false}
              dimmed
            />
          </div>

          {/* Age factor note */}
          <div className="mt-2 rounded-none border border-white/5 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground/70">Fator etário ({jogador.idade} anos): </span>
              {fatorIdade(jogador.idade) >= 1.05
                ? "Pico de aprendizado — ganhos máximos."
                : fatorIdade(jogador.idade) >= 0.95
                  ? "Pleno rendimento — evolução consistente."
                  : fatorIdade(jogador.idade) >= 0.8
                    ? "Maturidade — evolução mais lenta, experiência compensa."
                    : "Veterano — focar em recuperação reduz desgaste."}
              {" "}Recuperação reduz fadiga ({Math.round(jogador.fadiga)}%) e risco de lesão.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Linha({
  icon,
  titulo,
  descricao,
  valor,
  onMenos,
  onMais,
  maxReached,
  cor,
}: {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  valor: number;
  onMenos: () => void;
  onMais: () => void;
  maxReached: boolean;
  cor: "primary" | "secondary" | "accent";
}) {
  const barColor = cor === "primary" ? "bg-primary" : cor === "secondary" ? "bg-secondary" : "bg-accent";
  return (
    <div className="flex flex-col gap-3 rounded-none border border-white/10 bg-card p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border border-white/5">
            {icon}
          </div>
          <div>
            <p className="font-display text-xl uppercase tracking-wide">{titulo}</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{descricao}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 bg-background p-1.5 border border-white/5">
          <button
            onClick={onMenos}
            disabled={valor === 0}
            className="flex h-8 w-8 items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="font-sports text-2xl w-6 text-center">{valor}</span>
          <button
            onClick={onMais}
            disabled={maxReached}
            className="flex h-8 w-8 items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-30"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      {/* Mini bar */}
      <div className="h-1 w-full bg-background overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${(valor / TOTAL_PONTOS) * 100}%` }}
        />
      </div>
    </div>
  );
}

function AtributoLinha({
  nome,
  atual,
  ganho,
  isChave,
  dimmed,
}: {
  nome: string;
  atual: number;
  ganho: number;
  isChave: boolean;
  dimmed?: boolean;
}) {
  const barPct = (atual / 99) * 100;
  const ganhoPct = (Math.min(ganho, 99 - atual) / 99) * 100;

  return (
    <div className={`flex flex-col gap-1 ${dimmed ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-bold uppercase tracking-wide ${isChave ? "text-accent" : "text-muted-foreground"}`}>
          {nome}
          {isChave && <span className="ml-1 text-accent/60">★</span>}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-sports text-base text-foreground">{atual}</span>
          {ganho > 0 && (
            <span className="text-primary font-bold">+{ganho}</span>
          )}
          {ganho === 0 && atual >= 99 && (
            <span className="text-muted-foreground/50 text-[10px]">MAX</span>
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-card overflow-hidden rounded-none">
        <div className="h-full flex">
          <div className="h-full bg-white/20 transition-all duration-300" style={{ width: `${barPct}%` }} />
          {ganho > 0 && (
            <div className="h-full bg-primary/70 transition-all duration-300" style={{ width: `${ganhoPct}%` }} />
          )}
        </div>
      </div>
    </div>
  );
}
