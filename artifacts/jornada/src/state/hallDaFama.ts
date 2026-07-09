import { calcularOverall, calcularTierFinal } from "@/engine/engine";
import type { Jogador } from "@/engine/types";

const HALL_FAMA_KEY = "jornada-hall-fama-v1";
const MAX_ENTRADAS = 20;

export interface EntradaHallFama {
  id: string;
  nome: string;
  posicao: string;
  tier: string;
  score: number;
  overallFinal: number;
  temporadas: number;
  gols: number;
  assistencias: number;
  premios: number;
  clubeFinal: string;
  data: string;
}

export function salvarNoHallDaFama(jogador: Jogador): EntradaHallFama {
  const { tier, score } = calcularTierFinal(jogador);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const gols = jogador.historicoTemporadas.reduce((acc, t) => acc + t.gols, 0);
  const assistencias = jogador.historicoTemporadas.reduce((acc, t) => acc + t.assistencias, 0);

  const entrada: EntradaHallFama = {
    id: `${jogador.seedCarreira}-${Date.now()}`,
    nome: jogador.nome,
    posicao: jogador.posicao,
    tier: tier.nome,
    score,
    overallFinal: overall,
    temporadas: jogador.historicoTemporadas.length,
    gols,
    assistencias,
    premios: jogador.premios.length,
    clubeFinal: jogador.clubeAtual.nome,
    data: new Date().toISOString(),
  };

  const atuais = lerHallDaFama();
  const atualizado = [...atuais, entrada].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRADAS);
  localStorage.setItem(HALL_FAMA_KEY, JSON.stringify(atualizado));
  return entrada;
}

export function lerHallDaFama(): EntradaHallFama[] {
  try {
    const salvo = localStorage.getItem(HALL_FAMA_KEY);
    if (!salvo) return [];
    return JSON.parse(salvo) as EntradaHallFama[];
  } catch {
    return [];
  }
}
