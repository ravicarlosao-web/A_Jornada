import { listarHallDaFama as listarHallDaFamaApi, salvarHallDaFama as salvarHallDaFamaApi } from "@workspace/api-client-react";
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

  // Também tenta persistir no servidor para um Hall da Fama compartilhado.
  // Falha silenciosamente (mantém o localStorage como fonte confiável local).
  salvarHallDaFamaApi({
    seedCarreira: jogador.seedCarreira,
    nome: jogador.nome,
    posicao: jogador.posicao,
    tier: tier.nome,
    score,
    overallFinal: overall,
    temporadas: jogador.historicoTemporadas.length,
    gols,
    assistencias,
    premios: jogador.premios.length,
    convocacoesSelecao: jogador.convocacoesSelecao,
    titulosSelecao: jogador.titulosSelecao.length,
    patrocinios: jogador.patrocinios.length,
    clubeFinal: jogador.clubeAtual.nome,
  }).catch(() => {
    // sem conexão com o servidor — ok, a carreira já está salva localmente
  });

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

function converterEntradaApi(item: Awaited<ReturnType<typeof listarHallDaFamaApi>>[number]): EntradaHallFama {
  return {
    id: `servidor-${item.id}`,
    nome: item.nome,
    posicao: item.posicao,
    tier: item.tier,
    score: item.score,
    overallFinal: item.overallFinal,
    temporadas: item.temporadas,
    gols: item.gols,
    assistencias: item.assistencias,
    premios: item.premios,
    clubeFinal: item.clubeFinal,
    data: new Date(item.criadoEm).toISOString(),
  };
}

/**
 * Busca o Hall da Fama global no servidor e mescla com as entradas locais,
 * removendo duplicatas e mantendo as melhores pontuações.
 */
export async function buscarHallDaFamaGlobal(): Promise<EntradaHallFama[]> {
  const locais = lerHallDaFama();
  try {
    const remotos = (await listarHallDaFamaApi()).map(converterEntradaApi);
    const combinados = [...locais, ...remotos];
    const vistos = new Set<string>();
    const unicos = combinados.filter((e) => {
      const chave = `${e.nome}-${e.score}-${e.temporadas}-${e.clubeFinal}`;
      if (vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    });
    return unicos.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRADAS);
  } catch {
    return locais;
  }
}
