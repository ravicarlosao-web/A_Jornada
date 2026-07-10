import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, MessageCircle, Twitter, Bell } from "lucide-react";
import type { Jogador } from "@/engine/types";
import { calcularOverall } from "@/engine/engine";

interface Mensagem {
  de: string;
  avatar: string;
  texto: string;
  hora: string;
  tipo: "mensagem" | "notificacao" | "rede-social";
  cor: string;
}

function gerarMensagens(jogador: Jogador): Mensagem[] {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const msgs: Mensagem[] = [];
  const temporada = jogador.historicoTemporadas.length + 1;
  const ultimo = jogador.historicoTemporadas[jogador.historicoTemporadas.length - 1];

  // Mensagem do técnico
  if (jogador.confiancaTecnico >= 70) {
    msgs.push({
      de: "Técnico",
      avatar: "👨‍💼",
      texto: `${jogador.nome}, sua dedicação nos treinos está impressionando toda a comissão. Continue assim.`,
      hora: "08:14",
      tipo: "mensagem",
      cor: "#22c55e",
    });
  } else if (jogador.confiancaTecnico < 40) {
    msgs.push({
      de: "Técnico",
      avatar: "👨‍💼",
      texto: `Precisamos conversar. Sua posição no elenco está em risco. Venha ao meu escritório.`,
      hora: "09:02",
      tipo: "mensagem",
      cor: "#ef4444",
    });
  } else {
    msgs.push({
      de: "Técnico",
      avatar: "👨‍💼",
      texto: `Boa semana de treinos. Vamos manter o foco para o próximo jogo.`,
      hora: "10:30",
      tipo: "mensagem",
      cor: "#94a3b8",
    });
  }

  // Mensagem de companheiro de equipe
  if (jogador.relacaoElenco >= 65) {
    msgs.push({
      de: "Vestiário",
      avatar: "⚽",
      texto: `Todo mundo aqui confia em você, mano. Somos um time!`,
      hora: "11:45",
      tipo: "mensagem",
      cor: "#3b82f6",
    });
  } else if (jogador.relacaoElenco < 35) {
    msgs.push({
      de: "Capitão do Time",
      avatar: "🦁",
      texto: `Você precisa se integrar mais com o grupo. Isso está afetando o clima do vestiário.`,
      hora: "13:20",
      tipo: "mensagem",
      cor: "#f97316",
    });
  }

  // Notificação de patrocínio
  if (jogador.patrocinios.length > 0) {
    const p = jogador.patrocinios[jogador.patrocinios.length - 1];
    msgs.push({
      de: p.marca,
      avatar: "🤝",
      texto: `Olá ${jogador.nome}! O pagamento de R$ ${p.valorAnual.toLocaleString("pt-BR")} foi processado. Obrigado pela parceria!`,
      hora: "14:00",
      tipo: "notificacao",
      cor: "#a855f7",
    });
  }

  // Rumores de transferência baseado na fama
  if (jogador.fama >= 40 && overall >= 65) {
    msgs.push({
      de: "Jornalista Esportivo",
      avatar: "📰",
      texto: `Fontes confirmam interesse de clubes europeus em ${jogador.nome}. A jornada continua em alta!`,
      hora: "15:30",
      tipo: "rede-social",
      cor: "#0ea5e9",
    });
  }

  // Post nas redes sociais
  if (ultimo?.gols && ultimo.gols >= 10) {
    msgs.push({
      de: "Redes Sociais",
      avatar: "📱",
      texto: `@${jogador.nome.replace(" ", "_")} está em CHAMAS! ${ultimo.gols} gols na temporada. Fenômeno! 🔥🔥`,
      hora: "16:15",
      tipo: "rede-social",
      cor: "#f59e0b",
    });
  }

  // Agente
  if (overall >= 70 && temporada >= 3) {
    msgs.push({
      de: "Seu Agente",
      avatar: "💼",
      texto: `Tenho 3 propostas interessantes na mesa. Quando puder, passe no escritório. Boas notícias te esperam.`,
      hora: "17:50",
      tipo: "mensagem",
      cor: "#22c55e",
    });
  }

  // Mensagem motivacional se carreira nova
  if (temporada === 1) {
    msgs.push({
      de: "Sistema Jornada",
      avatar: "🏆",
      texto: `Bem-vindo à sua jornada, ${jogador.nome}! Cada temporada é uma chance de escrever história. Boa sorte!`,
      hora: "00:01",
      tipo: "notificacao",
      cor: "#22c55e",
    });
  }

  return msgs.sort((a, b) => b.hora.localeCompare(a.hora));
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVar = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } };

export function TelefoneScreen({ jogador, onFechar }: { jogador: Jogador; onFechar: () => void }) {
  const mensagens = gerarMensagens(jogador);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onFechar} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
            <Smartphone size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase leading-none">Telefone</h1>
            <p className="text-xs text-muted-foreground">{mensagens.length} mensagens</p>
          </div>
        </div>
      </div>

      {/* Lista de mensagens */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
        {mensagens.map((msg, i) => (
          <motion.div
            key={i}
            variants={itemVar}
            className="flex gap-4 rounded-none border border-white/10 bg-card p-4 transition-colors hover:bg-card/80"
          >
            {/* Avatar */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: `${msg.cor}20`, border: `1px solid ${msg.cor}40` }}
            >
              {msg.avatar}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{msg.de}</span>
                  {msg.tipo === "rede-social" && <Twitter size={12} className="text-muted-foreground" />}
                  {msg.tipo === "notificacao" && <Bell size={12} className="text-muted-foreground" />}
                  {msg.tipo === "mensagem" && <MessageCircle size={12} className="text-muted-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{msg.hora}</span>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed">{msg.texto}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Vazio */}
      {mensagens.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Smartphone size={40} className="mx-auto mb-4 opacity-30" />
          <p>Nenhuma mensagem ainda.</p>
        </div>
      )}
    </motion.div>
  );
}
