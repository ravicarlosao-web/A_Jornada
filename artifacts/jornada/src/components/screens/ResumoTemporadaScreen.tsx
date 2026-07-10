import type { Jogador, RegistroTemporada } from "@/engine/types";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, MessageSquare, Shield, Landmark, Newspaper, ChevronRight } from "lucide-react";

// ── Season narrative generator ─────────────────────────────────────────────
function gerarNarrativaTemporada(registro: RegistroTemporada, jogador: Jogador): { arco: string; arcoCor: string; paragrafo: string } {
  const { temperamento, lideranca, carisma, foco } = jogador.atributos;
  const { notaMedia, gols, clube, objetivoCumprido, lesao, eventoVestiario, statusElenco, disputaRival } = registro;
  const [pNome] = jogador.nome.split(" ");

  // Season arc label
  let arco = "Temporada Regular";
  let arcoCor = "text-muted-foreground border-white/20";
  if (notaMedia >= 8.5) { arco = "Temporada Histórica"; arcoCor = "text-yellow-400 border-yellow-400/40"; }
  else if (notaMedia >= 7.5 && objetivoCumprido) { arco = "Ano de Consagração"; arcoCor = "text-emerald-400 border-emerald-400/40"; }
  else if (notaMedia >= 7.5) { arco = "Grande Temporada"; arcoCor = "text-green-400 border-green-400/40"; }
  else if (lesao && notaMedia < 6.5) { arco = "Ano de Luta"; arcoCor = "text-orange-400 border-orange-400/40"; }
  else if (!objetivoCumprido && notaMedia < 6) { arco = "Temporada para Esquecer"; arcoCor = "text-red-400 border-red-400/40"; }
  else if (!objetivoCumprido && statusElenco === "reserva") { arco = "Ano de Sombra"; arcoCor = "text-red-400 border-red-400/40"; }
  else if (objetivoCumprido && notaMedia < 6.5) { arco = "Vitória Coletiva"; arcoCor = "text-blue-400 border-blue-400/40"; }
  else if (notaMedia >= 6.5 && !objetivoCumprido) { arco = "Estrela Numa Equipa Modesta"; arcoCor = "text-blue-300 border-blue-300/40"; }

  // Build narrative paragraph (personality-aware)
  const frases: string[] = [];

  // Opening sentence — performance + personality flavor
  if (notaMedia >= 8.5) {
    if (carisma > 65) frases.push(`${pNome} transformou ${clube} no seu palco. A multidão entendia que estava diante de algo raro.`);
    else if (foco > 65) frases.push(`${pNome} entrou em uma das temporadas mais consistentes que aquela camisa já viu. Cada jogo, uma aula de foco e execução.`);
    else frases.push(`A temporada de ${pNome} em ${clube} entrou para os registros — notaMedia ${notaMedia.toFixed(1)} que poucos alcançam.`);
  } else if (notaMedia >= 7.5) {
    frases.push(`${pNome} viveu uma temporada sólida no ${clube}. Do início ao fim, entregou o que prometeu — e às vezes mais.`);
  } else if (notaMedia >= 6.5) {
    frases.push(`Foi uma temporada dentro do esperado para ${pNome}. Nada extraordinário, mas trabalho honesto e entregas consistentes.`);
  } else if (notaMedia >= 5.5) {
    if (temperamento < 40) frases.push(`${pNome} passou por uma temporada tensa no ${clube}. A cabeça não ajudou e os resultados mostraram isso.`);
    else frases.push(`A temporada foi difícil para ${pNome}. O contexto no ${clube} pesou, e os números refletem uma fase de turbulência.`);
  } else {
    frases.push(`Para esquecer. ${pNome} teve a temporada mais difícil da sua carreira até aqui — poucos momentos para guardar.`);
  }

  // Gols sentence (for ATA/MEI)
  if (gols >= 15 && (jogador.posicao === "ATA" || jogador.posicao === "MEI")) {
    frases.push(`${gols} gols marcados na temporada — um número que fala mais alto do que qualquer análise.`);
  } else if (gols > 0 && gols < 5 && jogador.posicao === "ATA") {
    if (temperamento < 40) frases.push(`${gols} gol${gols > 1 ? "s" : ""} apenas — uma seca que deixou ${pNome} visivelmente irritado.`);
    else frases.push(`Apenas ${gols} gol${gols > 1 ? "s" : ""}, abaixo do esperado. Uma temporada para usar como combustível.`);
  }

  // Lesão sentence
  if (lesao) {
    if (temperamento > 65) frases.push(`A lesão — ${lesao.descricao} — tirou ${pNome} de campo por semanas, mas ele voltou sem perder a calma.`);
    else if (temperamento < 40) frases.push(`A lesão (${lesao.descricao}) testou a paciência de ${pNome}. Foram semanas longas e difíceis.`);
    else frases.push(`A lesão de ${lesao.descricao} interrompeu a sequência e prejudicou o ritmo da temporada.`);
  }

  // Vestiário sentence
  if (eventoVestiario) {
    if (eventoVestiario.tipo === "harmonia") {
      if (lideranca > 65) frases.push(`Fora de campo, ${pNome} ajudou a consolidar o grupo. A harmonia no vestiário não acontece por acaso.`);
      else frases.push(`A relação com os companheiros foi um ponto alto — o grupo caminhou junto.`);
    } else {
      if (temperamento < 40) frases.push(`Houve turbulência nos bastidores. ${pNome} não conseguiu controlar o atrito desta vez.`);
      else frases.push(`Um episódio no vestiário trouxe tensão — algo a resolver antes da próxima temporada.`);
    }
  }

  // Rival sentence
  if (disputaRival === "venceu") {
    frases.push(`Na briga pela posição interna, ${pNome} saiu na frente do seu rival direto — e consolidou seu espaço.`);
  } else if (disputaRival === "perdeu" && statusElenco === "reserva") {
    if (temperamento < 40) frases.push(`Perder a vaga para o rival foi um golpe difícil de engolir.`);
    else frases.push(`A concorrência venceu a disputa por agora — mas ${pNome} não perde o foco.`);
  }

  // Closing — objective + personality tone
  if (objetivoCumprido) {
    if (lideranca > 65) frases.push(`O objetivo foi cumprido — e ${pNome} teve papel central nessa conquista coletiva.`);
    else frases.push(`Missão cumprida: o clube entregou o que a diretoria exigiu.`);
  } else {
    if (temperamento > 65) frases.push(`O objetivo escapou, mas ${pNome} guarda a calma para a próxima tentativa.`);
    else if (temperamento < 35) frases.push(`Não cumprir o objetivo deixa ${pNome} com uma raiva que precisa ser canalizada.`);
    else frases.push(`A diretoria queria mais — e ${pNome} sabe disso.`);
  }

  return { arco, arcoCor, paragrafo: frases.slice(0, 4).join(" ") };
}

// ── Component ─────────────────────────────────────────────────────────────
export function ResumoTemporadaScreen({
  registro,
  jogador,
  onContinuar,
  onAposentar,
  podeAposentar,
}: {
  registro: RegistroTemporada;
  jogador: Jogador;
  onContinuar: () => void;
  onAposentar: () => void;
  podeAposentar: boolean;
}) {
  const { arco, arcoCor, paragrafo } = gerarNarrativaTemporada(registro, jogador);

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-4xl flex-col gap-7 px-4 py-14"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          Temporada {registro.temporada} · {registro.idade} Anos
        </p>
        <h1 className="font-display text-5xl uppercase tracking-wide mb-3">{registro.clube}</h1>
        <span className={`inline-block border rounded-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest ${arcoCor}`}>
          {arco}
        </span>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Jogos" value={registro.jogos} />
        <Stat label="Gols" value={registro.gols} highlight />
        <Stat label="Assistências" value={registro.assistencias} />
        <Stat label="Nota Média" value={registro.notaMedia.toFixed(1)} />
      </motion.div>

      {/* Narrative paragraph */}
      {paragrafo && (
        <motion.div variants={fadeUp} className="rounded-none border border-white/10 bg-card/50 px-6 py-5">
          <p className="text-sm leading-relaxed text-foreground/80 italic">{paragrafo}</p>
        </motion.div>
      )}

      {/* Objective + Events */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Objective */}
        <motion.div
          variants={fadeUp}
          className={`relative overflow-hidden rounded-none clip-diagonal border p-6 ${registro.objetivoCumprido ? "border-primary bg-primary/5" : "border-destructive bg-destructive/5"}`}
        >
          <div className="absolute -right-4 -top-4 opacity-5">
            <TrendingUp size={100} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Meta da Diretoria</p>
          <p className="font-display text-2xl uppercase tracking-wide mb-3">{registro.objetivo}</p>
          <div className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 ${registro.objetivoCumprido ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>
            {registro.objetivoCumprido ? "Objetivo Alcançado" : "Falha na Missão"}
          </div>
        </motion.div>

        {/* Dynamic events */}
        <div className="flex flex-col gap-3">
          {registro.premio && (
            <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-none border border-accent bg-accent/10 p-4">
              <div className="bg-accent text-accent-foreground p-2 rounded-full shrink-0">
                <Landmark size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-accent mb-0.5">Premiação Individual</p>
                <p className="font-display text-lg uppercase tracking-wide">{registro.premio}</p>
              </div>
            </motion.div>
          )}

          {registro.lesao && (
            <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-none border border-destructive bg-destructive/10 p-4">
              <div className="bg-destructive text-destructive-foreground p-2 rounded-full shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-destructive mb-0.5">Lesão · {registro.lesao.gravidade}</p>
                <p className="font-semibold text-sm">{registro.lesao.descricao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{registro.lesao.jogosPerdidos} jogos perdidos</p>
              </div>
            </motion.div>
          )}

          {registro.eventoVestiario && (
            <motion.div
              variants={fadeUp}
              className={`flex items-start gap-4 rounded-none border p-4 ${registro.eventoVestiario.tipo === "harmonia" ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"}`}
            >
              <div className={`p-2 rounded-full shrink-0 ${registro.eventoVestiario.tipo === "harmonia" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>
                <MessageSquare size={18} />
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${registro.eventoVestiario.tipo === "harmonia" ? "text-primary" : "text-destructive"}`}>Bastidores</p>
                <p className="text-sm leading-relaxed">{registro.eventoVestiario.texto}</p>
                {registro.eventoVestiario.impactoRelacao !== 0 && (
                  <p className={`text-[10px] font-mono mt-1 ${registro.eventoVestiario.impactoRelacao > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    Rel. Elenco {registro.eventoVestiario.impactoRelacao > 0 ? "+" : ""}{registro.eventoVestiario.impactoRelacao}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {registro.convocadoSelecao && (
            <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-none border border-secondary bg-secondary/10 p-4">
              <div className="bg-secondary text-secondary-foreground p-2 rounded-full shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-0.5">Seleção Nacional</p>
                <p className="font-semibold text-sm">Convocado nesta temporada</p>
                {registro.tituloSelecao && <p className="text-accent text-xs font-bold mt-0.5">🏆 {registro.tituloSelecao}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Headlines */}
      {registro.manchetes.length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-2">
            <Newspaper size={14} /> Manchetes da Temporada
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {registro.manchetes.map((m) => (
              <div key={m.id} className={`relative pl-4 py-2 border-l-2 ${m.tom === "positiva" ? "border-emerald-500/40" : m.tom === "negativa" ? "border-red-500/40" : "border-white/20"}`}>
                <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  {m.fonte === "redes-sociais" ? "Trending" : "Imprensa"}
                  {m.tom === "positiva" && <span className="ml-2 text-emerald-500">▲</span>}
                  {m.tom === "negativa" && <span className="ml-2 text-red-500">▼</span>}
                </span>
                <p className="font-display text-lg uppercase tracking-wide leading-tight text-foreground/90">"{m.texto}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={onContinuar}
          className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-none clip-diagonal bg-primary px-10 py-4 font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Avançar Carreira <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
        {podeAposentar && (
          <button
            onClick={onAposentar}
            className="w-full sm:w-auto rounded-none border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
          >
            Anunciar Aposentadoria
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-none clip-diagonal border p-6 text-center ${highlight ? "border-primary/50 bg-primary/10" : "border-white/10 bg-card"}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 font-sports text-5xl leading-none ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
