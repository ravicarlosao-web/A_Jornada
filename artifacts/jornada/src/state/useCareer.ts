import { useCallback, useEffect, useState } from "react";
import { Rng } from "@/engine/rng";
import {
  aplicarEscolhaDraft,
  aplicarTreino,
  calcularOverall,
  calcularTierFinal,
  criarAtributosBase,
  criarJogador,
  definirStatusElenco,
  gerarEpilogo,
  gerarOpcoesDraft,
  gerarOpcoesPosCarreira,
  gerarPropostasContrato,
  mentorarJovem,
  negociarProposta,
  resolverConversaTecnico,
  simularTemporada,
} from "@/engine/engine";
import { salvarNoHallDaFama } from "@/state/hallDaFama";
import type {
  Atributos,
  ConversaTecnicoOpcaoId,
  Dificuldade,
  FocoTreino,
  Jogador,
  Modo,
  OpcaoDraft,
  Patrocinio,
  PosCarreiraId,
  Posicao,
  PropostaContrato,
  RegistroTemporada,
} from "@/engine/types";

export type Fase =
  | "inicio"
  | "modo"
  | "dificuldade"
  | "draft"
  | "posicao"
  | "pre-temporada"
  | "treino"
  | "resumo-temporada"
  | "conversa-tecnico"
  | "patrocinio"
  | "contrato"
  | "decisao-continuar"
  | "pos-carreira"
  | "resultado-final";

const STORAGE_KEY = "jornada-carreira-v1";

/** Preenche campos novos ausentes em saves antigos (localStorage) com valores padrão seguros. */
function normalizarJogador(jogador: Jogador): Jogador {
  const overallAprox = calcularOverall(jogador.atributos, jogador.posicao);
  return {
    ...jogador,
    contrato: {
      ...jogador.contrato,
      clausulas: jogador.contrato.clausulas ?? {
        multaRescisoria: Math.round(jogador.contrato.salarioAnual * 4),
        bonusPorGol: 1000,
        luvas: Math.round(jogador.contrato.salarioAnual * 0.15),
      },
    },
    rival: jogador.rival ?? { nome: "Rival Desconhecido", overall: overallAprox, vitorias: 0, derrotas: 0 },
    convocacoesSelecao: jogador.convocacoesSelecao ?? 0,
    titulosSelecao: jogador.titulosSelecao ?? [],
    patrocinios: jogador.patrocinios ?? [],
  };
}

interface EstadoJogo {
  fase: Fase;
  modo: Modo | null;
  dificuldade: Dificuldade | null;
  atributosDraft: Atributos;
  rodadaDraft: number;
  opcoesDraftAtuais: OpcaoDraft[];
  jogador: Jogador | null;
  ultimoRegistro: RegistroTemporada | null;
  numeroTemporada: number;
  seed: string;
  propostasContrato: PropostaContrato[];
  mensagensNegociacao: Record<string, string>;
  epilogoPosCarreira: string | null;
  mensagemConversaTecnico: string | null;
  propostaPatrocinioPendente: Patrocinio | null;
  ultimoFocoTreino: FocoTreino | null;
}

const MAX_RODADAS_DRAFT = 8;

function estadoInicial(): EstadoJogo {
  const seed = `${Date.now()}-${Math.random()}`;
  return {
    fase: "inicio",
    modo: null,
    dificuldade: null,
    atributosDraft: criarAtributosBase(),
    rodadaDraft: 0,
    opcoesDraftAtuais: [],
    jogador: null,
    ultimoRegistro: null,
    numeroTemporada: 0,
    seed,
    propostasContrato: [],
    mensagensNegociacao: {},
    epilogoPosCarreira: null,
    mensagemConversaTecnico: null,
    propostaPatrocinioPendente: null,
    ultimoFocoTreino: null,
  };
}

export function useCareer() {
  const [estado, setEstado] = useState<EstadoJogo>(() => estadoInicial());
  const [rng, setRng] = useState<Rng>(() => new Rng(estadoInicial().seed));

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo) as { jogador: Jogador };
        if (parsed.jogador && !parsed.jogador.aposentado) {
          const jogadorNormalizado = normalizarJogador(parsed.jogador);
          setEstado((prev) => ({
            ...prev,
            fase: "resumo-temporada",
            jogador: jogadorNormalizado,
            modo: jogadorNormalizado.modo,
            dificuldade: jogadorNormalizado.dificuldade,
            numeroTemporada: jogadorNormalizado.historicoTemporadas.length,
            ultimoRegistro:
              jogadorNormalizado.historicoTemporadas[jogadorNormalizado.historicoTemporadas.length - 1] ?? null,
          }));
          if (jogadorNormalizado.historicoTemporadas.length === 0) {
            setEstado((prev) => ({ ...prev, fase: "pre-temporada" }));
          }
        }
      } catch {
        // ignore corrupt save
      }
    }
  }, []);

  useEffect(() => {
    if (estado.jogador) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ jogador: estado.jogador }));
    }
  }, [estado.jogador]);

  const iniciarNovaCarreira = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const novoEstado = estadoInicial();
    setEstado(novoEstado);
    setRng(new Rng(novoEstado.seed));
  }, []);

  const escolherModo = useCallback((modo: Modo) => {
    setEstado((prev) => ({ ...prev, modo, fase: "dificuldade" }));
  }, []);

  const escolherDificuldade = useCallback(
    (dificuldade: Dificuldade) => {
      setEstado((prev) => {
        const opcoes = gerarOpcoesDraft(rng, dificuldade);
        return { ...prev, dificuldade, rodadaDraft: 1, opcoesDraftAtuais: opcoes, fase: "draft" };
      });
    },
    [rng],
  );

  const escolherOpcaoDraft = useCallback(
    (opcao: OpcaoDraft) => {
      setEstado((prev) => {
        const novosAtributos = aplicarEscolhaDraft(prev.atributosDraft, opcao);
        const proximaRodada = prev.rodadaDraft + 1;
        if (proximaRodada > MAX_RODADAS_DRAFT) {
          return { ...prev, atributosDraft: novosAtributos, fase: "posicao" };
        }
        const opcoes = gerarOpcoesDraft(rng, prev.dificuldade ?? "amador");
        return {
          ...prev,
          atributosDraft: novosAtributos,
          rodadaDraft: proximaRodada,
          opcoesDraftAtuais: opcoes,
        };
      });
    },
    [rng],
  );

  const escolherPosicao = useCallback(
    (posicao: Posicao, nome: string) => {
      setEstado((prev) => {
        if (!prev.modo || !prev.dificuldade) return prev;
        const jogador = criarJogador({
          seedCarreira: prev.seed,
          modo: prev.modo,
          dificuldade: prev.dificuldade,
          nome,
          atributos: prev.atributosDraft,
          posicao,
          rng,
        });
        return { ...prev, jogador, fase: "pre-temporada" };
      });
    },
    [rng],
  );

  const avancarDaPreTemporada = useCallback(
    (mentorarJovemDaBase?: boolean) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const jogadorAtualizado = mentorarJovemDaBase ? mentorarJovem(prev.jogador) : prev.jogador;
        if (jogadorAtualizado.modo === "completo") {
          return { ...prev, jogador: jogadorAtualizado, fase: "treino" };
        }
        return simularEAtualizar({ ...prev, jogador: jogadorAtualizado }, rng);
      });
    },
    [rng],
  );

  const confirmarTreino = useCallback(
    (foco: FocoTreino) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const atributosTreinados = aplicarTreino(prev.jogador.atributos, foco, prev.jogador.idade);
        const jogadorAtualizado = { ...prev.jogador, atributos: atributosTreinados };
        return simularEAtualizar({ ...prev, jogador: jogadorAtualizado, ultimoFocoTreino: foco }, rng);
      });
    },
    [rng],
  );

  const continuarCarreira = useCallback(() => {
    setEstado((prev) => {
      if (!prev.jogador) return prev;
      if (prev.propostaPatrocinioPendente) {
        return { ...prev, fase: "patrocinio" };
      }
      if (prev.jogador.modo === "completo" && prev.jogador.confiancaTecnico < 40) {
        return { ...prev, fase: "conversa-tecnico" };
      }
      return avancarTemporadaOuContrato(prev, rng);
    });
  }, [rng]);

  const escolherPatrocinio = useCallback(
    (aceitar: boolean) => {
      setEstado((prev) => {
        if (!prev.jogador || !prev.propostaPatrocinioPendente) return prev;
        const proposta = prev.propostaPatrocinioPendente;
        const jogadorAtualizado = aceitar
          ? { ...prev.jogador, patrocinios: [...prev.jogador.patrocinios, proposta] }
          : prev.jogador;
        const historicoAtualizado = aceitar
          ? jogadorAtualizado.historicoTemporadas.map((registro, i) =>
              i === jogadorAtualizado.historicoTemporadas.length - 1
                ? { ...registro, novoPatrocinio: proposta }
                : registro,
            )
          : jogadorAtualizado.historicoTemporadas;
        const proximo: EstadoJogo = {
          ...prev,
          jogador: { ...jogadorAtualizado, historicoTemporadas: historicoAtualizado },
          propostaPatrocinioPendente: null,
        };
        if (proximo.jogador!.modo === "completo" && proximo.jogador!.confiancaTecnico < 40) {
          return { ...proximo, fase: "conversa-tecnico" };
        }
        return avancarTemporadaOuContrato(proximo, rng);
      });
    },
    [rng],
  );

  const escolherConversaTecnico = useCallback(
    (opcao: ConversaTecnicoOpcaoId) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const resultado = resolverConversaTecnico(prev.jogador, opcao, rng);
        return avancarTemporadaOuContrato({ ...prev, jogador: resultado.jogador }, rng);
      });
    },
    [rng],
  );

  const escolherProposta = useCallback((proposta: PropostaContrato) => {
    setEstado((prev) => {
      if (!prev.jogador) return prev;
      const jogadorAtualizado: Jogador = {
        ...prev.jogador,
        clubeAtual: proposta.clube,
        contrato: {
          salarioAnual: proposta.salarioAnual,
          duracaoAnos: proposta.duracaoAnos,
          anosRestantes: proposta.duracaoAnos,
          clausulas: proposta.clausulas,
        },
        confiancaTecnico: proposta.ehClubeAtual ? prev.jogador.confiancaTecnico : 50,
      };
      return {
        ...prev,
        jogador: jogadorAtualizado,
        propostasContrato: [],
        mensagensNegociacao: {},
        fase: "pre-temporada",
      };
    });
  }, []);

  const negociarPropostaContrato = useCallback(
    (propostaId: string) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const proposta = prev.propostasContrato.find((p) => p.id === propostaId);
        if (!proposta) return prev;
        const resultado = negociarProposta(rng, prev.jogador, proposta);

        // Nunca deixe a negociação zerar a lista de propostas — o clube atual
        // sempre mantém ao menos uma oferta de segurança na mesa.
        const seriaUltimaProposta = prev.propostasContrato.length === 1;
        if (resultado.proposta === null && seriaUltimaProposta) {
          return {
            ...prev,
            mensagensNegociacao: {
              ...prev.mensagensNegociacao,
              [propostaId]: `${proposta.clube.nome} ameaçou sair, mas topou manter a proposta original — é a única opção na mesa.`,
            },
          };
        }

        const propostasAtualizadas =
          resultado.proposta === null
            ? prev.propostasContrato.filter((p) => p.id !== propostaId)
            : prev.propostasContrato.map((p) => (p.id === propostaId ? resultado.proposta! : p));
        return {
          ...prev,
          propostasContrato: propostasAtualizadas,
          mensagensNegociacao: { ...prev.mensagensNegociacao, [propostaId]: resultado.mensagem },
        };
      });
    },
    [rng],
  );

  const aposentar = useCallback(() => {
    setEstado((prev) => finalizarCarreira(prev));
  }, []);

  const escolherPosCarreira = useCallback(
    (escolha: PosCarreiraId) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const epilogo = gerarEpilogo(prev.jogador, escolha, rng);
        return { ...prev, epilogoPosCarreira: epilogo, fase: "resultado-final" };
      });
    },
    [rng],
  );

  return {
    estado,
    iniciarNovaCarreira,
    escolherModo,
    escolherDificuldade,
    escolherOpcaoDraft,
    escolherPosicao,
    avancarDaPreTemporada,
    confirmarTreino,
    continuarCarreira,
    escolherProposta,
    negociarPropostaContrato,
    aposentar,
    escolherPosCarreira,
    gerarOpcoesPosCarreira,
    escolherConversaTecnico,
    escolherPatrocinio,
  };
}

function avancarTemporadaOuContrato(prev: EstadoJogo, rng: Rng): EstadoJogo {
  if (!prev.jogador) return prev;
  const novaIdade = prev.jogador.idade + 1;
  if (novaIdade >= 38) {
    return finalizarCarreira(prev);
  }
  const anosRestantes = prev.jogador.contrato.anosRestantes - 1;
  const jogadorAtualizado: Jogador = {
    ...prev.jogador,
    idade: novaIdade,
    contrato: { ...prev.jogador.contrato, anosRestantes },
  };
  if (anosRestantes <= 0) {
    const propostas = gerarPropostasContrato({ rng, jogador: jogadorAtualizado });
    return {
      ...prev,
      jogador: jogadorAtualizado,
      propostasContrato: propostas,
      mensagensNegociacao: {},
      fase: "contrato",
    };
  }
  return { ...prev, jogador: jogadorAtualizado, fase: "pre-temporada" };
}

function simularEAtualizar(prev: EstadoJogo, rng: Rng): EstadoJogo {
  if (!prev.jogador) return prev;
  const numeroTemporada = prev.jogador.historicoTemporadas.length + 1;
  const statusElenco = definirStatusElenco(rng, prev.jogador.confiancaTecnico);
  const resultado = simularTemporada({
    rng,
    jogador: prev.jogador,
    numeroTemporada,
    statusElenco,
  });

  const premios = resultado.registro.premio
    ? [...prev.jogador.premios, resultado.registro.premio]
    : prev.jogador.premios;

  const titulosSelecao = resultado.tituloSelecaoConquistado
    ? [...prev.jogador.titulosSelecao, resultado.tituloSelecaoConquistado]
    : prev.jogador.titulosSelecao;

  const jogadorAtualizado: Jogador = {
    ...prev.jogador,
    fama: resultado.famaAtualizada,
    confiancaTecnico: resultado.confiancaTecnicoAtualizada,
    fadiga: resultado.fadigaAtualizada,
    relacaoElenco: resultado.relacaoElencoAtualizada,
    historicoTemporadas: [...prev.jogador.historicoTemporadas, resultado.registro],
    premios,
    rival: resultado.rivalAtualizado,
    convocacoesSelecao: prev.jogador.convocacoesSelecao + resultado.convocacoesSelecaoIncremento,
    titulosSelecao,
  };

  return {
    ...prev,
    jogador: jogadorAtualizado,
    ultimoRegistro: resultado.registro,
    numeroTemporada,
    propostaPatrocinioPendente: resultado.propostaPatrocinio,
    fase: "resumo-temporada",
  };
}

function finalizarCarreira(prev: EstadoJogo): EstadoJogo {
  if (!prev.jogador) return prev;
  const jogadorAposentado = { ...prev.jogador, aposentado: true };
  localStorage.removeItem(STORAGE_KEY);
  salvarNoHallDaFama(jogadorAposentado);
  const fase = jogadorAposentado.modo === "completo" ? "pos-carreira" : "resultado-final";
  return { ...prev, jogador: jogadorAposentado, fase };
}

export { calcularOverall, calcularTierFinal };
