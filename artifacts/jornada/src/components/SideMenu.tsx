import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Smartphone, ShoppingBag, Star, Globe, ArrowLeftRight } from "lucide-react";
import type { Jogador } from "@/engine/types";
import { calcularOverall, overallLabel } from "@/engine/engine";

interface SideMenuProps {
  jogador: Jogador;
  onAbrirTelefone: () => void;
  onAbrirLoja: () => void;
  onAbrirPatrocinios: () => void;
  onAbrirOutrasLigas: () => void;
  onAbrirMercado: () => void;
}

export function SideMenu({ jogador, onAbrirTelefone, onAbrirLoja, onAbrirPatrocinios, onAbrirOutrasLigas, onAbrirMercado }: SideMenuProps) {
  const [aberto, setAberto] = useState(false);

  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const label = overallLabel(overall);

  const itens = [
    {
      icon: <Smartphone size={20} />,
      label: "Telefone",
      desc: "Mensagens e notificações",
      acao: () => { setAberto(false); onAbrirTelefone(); },
      cor: "#22c55e",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: "Loja",
      desc: "Itens e melhorias",
      acao: () => { setAberto(false); onAbrirLoja(); },
      cor: "#f59e0b",
    },
    {
      icon: <Star size={20} />,
      label: "Patrocínios",
      desc: `${jogador.patrocinios.length} ativo${jogador.patrocinios.length !== 1 ? "s" : ""}`,
      acao: () => { setAberto(false); onAbrirPatrocinios(); },
      cor: "#a855f7",
    },
    {
      icon: <Globe size={20} />,
      label: "Outras Ligas",
      desc: "Explorar mercados externos",
      acao: () => { setAberto(false); onAbrirOutrasLigas(); },
      cor: "#0ea5e9",
    },
    {
      icon: <ArrowLeftRight size={20} />,
      label: "Mercado de Transferências",
      desc: "Propostas e rumores",
      acao: () => { setAberto(false); onAbrirMercado(); },
      cor: "#ef4444",
    },
  ];

  return (
    <>
      {/* Botão hamburguer flutuante */}
      <button
        onClick={() => setAberto(true)}
        className="fixed left-4 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-card border border-white/10 shadow-xl transition-transform hover:scale-105 active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu size={20} className="text-foreground" />
      </button>

      <AnimatePresence>
        {aberto && (
          <>
            {/* Overlay escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAberto(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Painel lateral */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-[#0a1a0f] border-r border-white/10 shadow-2xl"
            >
              {/* Header do menu */}
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p className="font-display text-lg uppercase leading-none">{jogador.nome}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-sports text-2xl text-primary leading-none">{overall}</span>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: label.cor }}>
                      {label.texto}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{jogador.clubeAtual.nome} · {jogador.posicao}</p>
                </div>
                <button
                  onClick={() => setAberto(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Dinheiro */}
              <div className="px-5 py-3 border-b border-white/5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Patrimônio</p>
                <p className="font-sports text-xl text-accent mt-0.5">
                  R$ {jogador.dinheiro.toLocaleString("pt-BR")}
                </p>
              </div>

              {/* Itens do menu */}
              <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
                {itens.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    onClick={item.acao}
                    className="group flex items-center gap-4 rounded-none border border-transparent px-4 py-3 text-left transition-all hover:border-white/10 hover:bg-white/5"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${item.cor}20`, color: item.cor }}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm uppercase tracking-wide text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* Temporada info */}
              <div className="border-t border-white/10 p-5">
                <p className="text-xs text-muted-foreground">
                  Temporada <strong className="text-foreground">{jogador.historicoTemporadas.length + 1}</strong> · {jogador.idade} anos
                </p>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  {jogador.patrocinios.length > 0 && (
                    <span>🤝 {jogador.patrocinios.length} patrocínio{jogador.patrocinios.length !== 1 ? "s" : ""}</span>
                  )}
                  {jogador.convocacoesSelecao > 0 && (
                    <span>🏆 {jogador.convocacoesSelecao} conv.</span>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
