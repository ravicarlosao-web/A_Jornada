import { useState } from "react";
import { calcularOverall, calcularTierFinal } from "@/engine/engine";
import type { Jogador, RegistroTemporada } from "@/engine/types";
import { HallFamaScreen } from "@/components/screens/HallFamaScreen";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, Bookmark, Goal, Users, Star, TrendingUp } from "lucide-react";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro", ZAG: "Zagueiro", MEI: "Meio-campista", ATA: "Atacante",
};

// ── Personality-driven legacy narrative ───────────────────────────────────
function gerarLegado(jogador: Jogador, totalGols: number, titulos: number): string[] {
  const { temperamento, lideranca, carisma, foco } = jogador.atributos;
  const pos = jogador.posicao;
  const nome = jogador.nome;
  const [pNome] = nome.split(" ");
  const linhas: string[] = [];

  // Line 1 — playing style (position + dominant attribute)
  if (pos === "ATA") {
    if (totalGols > 80) linhas.push(`${nome} foi um predador de área — seus ${totalGols} gols na carreira não deixam dúvida sobre o que ele veio fazer.`);
    else if (foco > 65) linhas.push(`${nome} era o tipo de atacante que estudava cada zagueiro antes de entrar em campo. Inteligência antes da força.`);
    else linhas.push(`${nome} tinha o instinto que não se ensina: sempre no lugar certo, na hora certa.`);
  } else if (pos === "MEI") {
    if (carisma > 65) linhas.push(`${nome} era o pulmão e o coração do meio-campo — o tipo de jogador que transforma o jogo com uma simples troca de passes.`);
    else if (foco > 65) linhas.push(`${nome} foi um meio-campista cerebral, que lia o jogo como poucos. Cada passe era uma decisão calculada.`);
    else linhas.push(`${nome} dominou o setor central com presença e qualidade técnica durante toda a trajetória.`);
  } else if (pos === "ZAG") {
    if (temperamento > 65) linhas.push(`${nome} foi um zagueiro de ferro — calculado, imperturbável, raramente ultrapassado.`);
    else if (lideranca > 65) linhas.push(`${nome} era mais do que um defensor: um líder que organizava o setor defensivo com voz e exemplo.`);
    else linhas.push(`${nome} construiu uma carreira sólida nas defesas do futebol, respeitado pela consistência e posicionamento.`);
  } else {
    if (temperamento > 65) linhas.push(`${nome} era um goleiro de aço. Crises e pressão passavam por ele como água — sua tranquilidade era o último recurso do time.`);
    else linhas.push(`${nome} foi um guardião confiável durante toda a jornada, comandando a última linha com presença e reflexo.`);
  }

  // Line 2 — locker room personality
  if (lideranca > 70 && carisma > 60) linhas.push(`No vestiário, ${pNome} era uma figura magnética — capitão de nascença, que as pessoas seguiam sem precisar perguntar por quê.`);
  else if (lideranca > 70) linhas.push(`${pNome} não era o mais falante, mas quando falava o grupo ouvia. Sua liderança era de atitude, não de discurso.`);
  else if (carisma > 70) linhas.push(`A presença de ${pNome} nas arquibancadas era inegável — um ídolo espontâneo que conquistava torcidas antes mesmo de jogar.`);
  else if (temperamento < 35) linhas.push(`${pNome} nunca foi fácil de lidar — intenso, impulsivo, às vezes polêmico. Mas ninguém duvidava do seu comprometimento.`);
  else if (foco > 70) linhas.push(`${pNome} era o profissional que chegava cedo e saía por último. Uma disciplina silenciosa que contagiava os mais jovens.`);
  else linhas.push(`${pNome} navegou pela carreira com equilíbrio — sem grandes holofotes fora de campo, mas sempre respeitado pelos companheiros.`);

  // Line 3 — how they'll be remembered
  if (titulos >= 3 && jogador.convocacoesSelecao >= 5) linhas.push(`Multicampeão e convocado pela seleção nacional, ${pNome} encerra uma jornada que poucos ousam sonhar.`);
  else if (titulos >= 3) linhas.push(`${pNome} deixa o futebol com a prateleira cheia de troféus — e com o respeito eterno de quem viu de perto.`);
  else if (titulos >= 1) linhas.push(`O título conquistado por ${pNome} fica para sempre. Nem toda carreira precisa de muitos — um, do jeito certo, é suficiente.`);
  else if (jogador.convocacoesSelecao >= 3) linhas.push(`Sem troféus coletivos, mas reconhecido pela seleção nacional — um selo que poucos alcançam em uma carreira inteira.`);
  else linhas.push(`${pNome} talvez não tenha enchido a prateleira de taças, mas escreveu uma história honesta — e isso tem seu próprio valor.`);

  return linhas;
}

// ── Career sparkline SVG ──────────────────────────────────────────────────
function CareerChart({ temporadas }: { temporadas: RegistroTemporada[] }) {
  if (temporadas.length === 0) return null;
  const W = 560; const H = 90; const PX = 24; const PY = 12;
  const n = temporadas.length;
  const xOf = (i: number) => (n === 1 ? W / 2 : PX + (i / (n - 1)) * (W - PX * 2));
  const yOf = (nota: number) => PY + ((10 - Math.max(4, nota)) / 6) * (H - PY * 2);
  const pts = temporadas.map((t, i) => `${xOf(i)},${yOf(t.notaMedia)}`).join(" ");
  const dotCol = (nota: number) =>
    nota >= 8 ? "#22c55e" : nota >= 7 ? "#86efac" : nota >= 6 ? "#facc15" : nota >= 5 ? "#fb923c" : "#ef4444";

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${W + 44} ${H + 32}`} className="w-full min-w-[300px]">
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[5, 6, 7, 8, 9].map(v => (
            <g key={v}>
              <line x1={PX} y1={yOf(v)} x2={W - PX + 44} y2={yOf(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="3" y={yOf(v) + 3.5} fontSize="8" fill="rgba(255,255,255,0.22)">{v}</text>
            </g>
          ))}

          <polygon
            points={`${xOf(0)},${H - PY + 8} ${pts} ${xOf(n - 1)},${H - PY + 8}`}
            fill="url(#fill)"
          />
          <polyline points={pts} fill="none" stroke="rgba(250,204,21,0.35)" strokeWidth="2" strokeLinejoin="round" />

          {temporadas.map((t, i) => {
            const cx = xOf(i); const cy = yOf(t.notaMedia);
            return (
              <g key={i}>
                {t.objetivoCumprido && (
                  <text x={cx} y={cy - 9} textAnchor="middle" fontSize="11" fill="#facc15">★</text>
                )}
                {t.lesao && (
                  <text x={cx} y={cy + 15} textAnchor="middle" fontSize="8" fill="#ef4444">✕</text>
                )}
                <circle cx={cx} cy={cy} r="4.5" fill={dotCol(t.notaMedia)} stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" />
                {(i === 0 || i === n - 1 || n <= 8 || i % Math.ceil(n / 6) === 0) && (
                  <text x={cx} y={H + 26} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{t.idade}a</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 px-1 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> nota ≥ 8</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-300 inline-block" /> 7–7.9</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> 6–6.9</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> 5–5.9</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 5</span>
        <span className="ml-auto flex items-center gap-2"><span className="text-yellow-400">★</span> título <span className="text-red-400">✕</span> lesão</span>
      </div>
    </div>
  );
}

// ── Momentos Marcantes ────────────────────────────────────────────────────
interface Momento {
  tag: string;
  tagCls: string;
  title: string;
  body: string;
  extra?: string;
}

function gerarMomentos(temporadas: RegistroTemporada[], jogador: Jogador): Momento[] {
  if (temporadas.length === 0) return [];
  const [pNome] = jogador.nome.split(" ");
  const momentos: Momento[] = [];
  const seen = new Set<number>();

  const push = (idx: number, m: Momento) => { seen.add(idx); momentos.push(m); };

  // Estreia
  const e = temporadas[0];
  push(0, {
    tag: "Estreia", tagCls: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    title: `${e.clube} — ${e.idade} anos`,
    body: `Nota ${e.notaMedia.toFixed(1)} em ${e.jogos} jogo${e.jogos !== 1 ? "s" : ""}. ${e.notaMedia >= 7.5 ? "Uma estreia para lembrar." : e.notaMedia >= 6 ? "Início promissor." : "Um começo difícil — mas necessário."}`,
    extra: e.objetivoCumprido ? "🏆 Título no primeiro ano" : undefined,
  });

  // Temporada de Ouro
  const bestIdx = temporadas.reduce((b, t, i) => t.notaMedia > temporadas[b].notaMedia ? i : b, 0);
  if (!seen.has(bestIdx)) {
    const b = temporadas[bestIdx];
    push(bestIdx, {
      tag: "Temporada de Ouro", tagCls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
      title: `${b.clube} — ${b.idade} anos`,
      body: `Nota ${b.notaMedia.toFixed(1)} em ${b.jogos} jogos — o melhor de ${pNome}.${b.gols > 0 ? ` ${b.gols} gol${b.gols !== 1 ? "s" : ""} marcados.` : ""}`,
      extra: b.premio ? `🏅 ${b.premio}` : undefined,
    });
  }

  // Pior momento (só se nota < 6)
  const worstIdx = temporadas.reduce((w, t, i) => t.notaMedia < temporadas[w].notaMedia ? i : w, 0);
  if (!seen.has(worstIdx) && temporadas[worstIdx].notaMedia < 6) {
    const w = temporadas[worstIdx];
    push(worstIdx, {
      tag: "Momento Difícil", tagCls: "text-red-400 bg-red-400/10 border-red-400/30",
      title: `${w.clube} — ${w.idade} anos`,
      body: `Nota ${w.notaMedia.toFixed(1)} — uma temporada para esquecer. ${w.lesao ? "A lesão foi determinante." : "O contexto do clube pesou muito."}`,
      extra: w.statusElenco === "reserva" ? "Ficou na reserva" : undefined,
    });
  }

  // Primeiro título
  const tIdx = temporadas.findIndex(t => t.objetivoCumprido);
  if (tIdx >= 0 && !seen.has(tIdx)) {
    const t = temporadas[tIdx];
    push(tIdx, {
      tag: "Campeão", tagCls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
      title: `${t.clube} — ${t.idade} anos`,
      body: `${pNome} levantou o troféu pela primeira vez. Nota ${t.notaMedia.toFixed(1)}. Um dia guardado para sempre.`,
    });
  }

  // Despedida (última temporada)
  const lastIdx = temporadas.length - 1;
  if (!seen.has(lastIdx)) {
    const l = temporadas[lastIdx];
    const msg = l.notaMedia >= 7 ? "Uma despedida digna de quem entregou tudo." : l.notaMedia >= 5.5 ? "Os sinais de que era hora de parar já apareciam." : "O corpo não respondia mais — era hora.";
    push(lastIdx, {
      tag: "Despedida", tagCls: "text-purple-400 bg-purple-400/10 border-purple-400/30",
      title: `${l.clube} — ${l.idade} anos`,
      body: `Última temporada: nota ${l.notaMedia.toFixed(1)}. ${msg}`,
    });
  }

  return momentos;
}

// ── Score breakdown bar ───────────────────────────────────────────────────
function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-xs font-mono text-foreground/70">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────
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
  if (mostrarHallFama) return <HallFamaScreen onVoltar={() => setMostrarHallFama(false)} />;

  const { tier, score } = calcularTierFinal(jogador);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const h = jogador.historicoTemporadas;
  const totalGols = h.reduce((a, t) => a + t.gols, 0);
  const totalAssist = h.reduce((a, t) => a + t.assistencias, 0);
  const totalJogos = h.reduce((a, t) => a + t.jogos, 0);
  const titulos = h.filter(t => t.objetivoCumprido).length;
  const lesoes = h.filter(t => t.lesao).length;

  const legadoTexto = gerarLegado(jogador, totalGols, titulos);
  const momentos = gerarMomentos(h, jogador);

  // Score component breakdown (mirrors calcularTierFinal formula)
  const picoOverall = Math.max(60, overall);
  const titulosPts = titulos * 10;
  const premiosPts = jogador.premios.length * 15;
  const longevPts = h.length * 4;
  const famaPts = h.length > 0 ? h.reduce((a, t) => a + t.fama, 0) / h.length : jogador.fama;
  const maxBar = Math.max(picoOverall * 0.22, titulosPts * 0.22, premiosPts * 0.18) * 1.4;

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12"
    >
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-4"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Aposentadoria Oficial · {NOME_POSICAO[jogador.posicao]} · {h.length} Temporadas
        </p>
        <h1 className="font-display text-6xl md:text-7xl uppercase tracking-wide">{jogador.nome}</h1>

        <div className="mt-2 inline-block rounded-none border border-accent bg-accent/10 px-10 py-4 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent/70 mb-1">Status na História</p>
          <p className="font-display text-4xl text-accent">{tier.nome}</p>
        </div>

        <p className="max-w-xl text-base text-muted-foreground leading-relaxed italic mt-1">
          "{tier.descricao}"
        </p>

        {/* Core numbers */}
        <div className="grid grid-cols-4 gap-3 mt-4 w-full max-w-md">
          {[
            { label: "Score", value: Math.round(score), highlight: true },
            { label: "Overall", value: overall },
            { label: "Gols", value: totalGols },
            { label: "Jogos", value: totalJogos },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`flex flex-col items-center border py-4 ${highlight ? "border-accent bg-accent/10 text-accent" : "border-white/10 bg-card"}`}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
              <span className={`font-sports text-4xl leading-none ${highlight ? "text-accent" : ""}`}>{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Career Chart ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
        <div className="rounded-none border border-white/10 bg-card p-6">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
            <TrendingUp size={14} /> Evolução da Carreira — Nota por Temporada
          </h2>
          <CareerChart temporadas={h} />
        </div>
      </motion.div>

      {/* ── Two columns: Momentos + Score breakdown ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Momentos Marcantes */}
        <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Star size={14} /> Momentos Marcantes
          </h2>
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-3">
            {momentos.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-none border border-white/10 bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${m.tagCls}`}>
                    {m.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.title}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{m.body}</p>
                {m.extra && <p className="mt-1.5 text-xs text-accent/80">{m.extra}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Stats + Score breakdown */}
        <div className="flex flex-col gap-4">
          {/* Stats grid */}
          <div className="rounded-none border border-white/10 bg-black/40 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Raio-X da Carreira</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "Temporadas", value: h.length },
                { label: "Títulos", value: titulos },
                { label: "Assistências", value: totalAssist },
                { label: "Prêmios Indiv.", value: jogador.premios.length },
                { label: "Conv. Seleção", value: jogador.convocacoesSelecao },
                { label: "Títulos Seleção", value: jogador.titulosSelecao.length },
                { label: "Patrocínios", value: jogador.patrocinios.length },
                { label: "Lesões", value: lesoes },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="font-sports text-xl leading-none">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score breakdown */}
          <div className="rounded-none border border-white/10 bg-black/40 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Score Final — Composição</h2>
            <div className="flex flex-col gap-3">
              <ScoreBar label={`Overall (×0.22)`} value={picoOverall * 0.22} max={maxBar} color="bg-blue-400" />
              <ScoreBar label={`Títulos ×10 (×0.22)`} value={titulosPts * 0.22} max={maxBar} color="bg-emerald-400" />
              <ScoreBar label={`Prêmios ×15 (×0.18)`} value={premiosPts * 0.18} max={maxBar} color="bg-yellow-400" />
              <ScoreBar label={`Longevidade (×0.13)`} value={longevPts * 0.13} max={maxBar} color="bg-purple-400" />
              <ScoreBar label={`Fama Média (×0.25)`} value={famaPts * 0.25} max={maxBar} color="bg-orange-400" />
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-sports text-3xl text-foreground">{Math.round(score)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Legado Pessoal ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}>
        <div className="rounded-none border border-white/10 bg-card p-8">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            <Goal size={14} /> Legado Pessoal
          </h2>
          <div className="space-y-4">
            {legadoTexto.map((linha, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? "text-base text-foreground" : "text-sm text-muted-foreground"}`}>
                {i === 0 ? <strong>{linha}</strong> : linha}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Epilogo ── */}
      {epilogo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.45 } }}>
          <div className="rounded-none border border-secondary/30 bg-secondary/5 p-8">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-4">
              <Bookmark size={14} /> O Dia Seguinte
            </h2>
            <p className="text-muted-foreground leading-relaxed">{epilogo}</p>
          </div>
        </motion.div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
        <button
          onClick={onNovaCarreira}
          className="flex items-center justify-center gap-2 rounded-none clip-diagonal bg-primary px-8 py-5 font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all"
        >
          <RefreshCw size={18} /> Nova Jornada
        </button>
        <button
          onClick={() => setMostrarHallFama(true)}
          className="flex items-center justify-center gap-2 rounded-none clip-diagonal border border-white/20 bg-card px-8 py-5 font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <Trophy size={18} /> Hall da Fama
        </button>
      </div>
    </motion.div>
  );
}
