import { useCallback, useEffect, useState } from "react";
import { Rng } from "@/engine/rng";
import {
  aplicarEscolhaDraft,
  aplicarTreino,
  calcularOverall,
  calcularTierFinal,
  comprarItemLoja,
  criarAtributosBase,
  criarJogador,
  definirStatusElenco,
  fmt,
  gerarEpilogo,
  gerarOpcoesDraft,
  gerarOpcoesPosCarreira,
  gerarPropostasContrato,
  mentorarJovem,
  negociarProposta,
  resolverConversaTecnico,
  simularTemporada,
} from "@/engine/engine";
import { MANCHETES_PATROCINIO } from "@/engine/data";
import { salvarNoHallDaFama } from "@/state/hallDaFama";
import type {
  Atributos,
  ConversaTecnicoOpcaoId,
  Dificuldade,
  FocoTreino,
  Jogador,
  Manchete,
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
  | "loja"
  | "partida-ao-vivo"
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
    crisesComTecnico: jogador.crisesComTecnico ?? 0,
    dinheiro: jogador.dinheiro ?? 0,
    itensComprados: jogador.itensComprados ?? [],
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
  faseAnteriorLoja: Fase | null;
  mensagemLoja: string | null;
  conversaVoluntaria: boolean;
  transferenciaSolicitadaNestaTemporada: boolean;
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
    faseAnteriorLoja: null,
    mensagemLoja: null,
    conversaVoluntaria: false,
    transferenciaSolicitadaNestaTemporada: false,
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
          ? jogadorAtualizado.historicoTemporadas.map((registro, i) => {
              if (i !== jogadorAtualizado.historicoTemporadas.length - 1) return registro;
              const texto = fmt(rng.pick(MANCHETES_PATROCINIO), {
                nome: jogadorAtualizado.nome,
                clube: jogadorAtualizado.clubeAtual.nome,
                gols: registro.gols,
                assist: registro.assistencias,
                nota: registro.notaMedia.toFixed(1),
                idade: registro.idade,
                temporada: registro.temporada,
                rival: jogadorAtualizado.rival.nome,
                marca: proposta.marca,
              });
              const manchete: Manchete = {
                id: `${registro.temporada}-patrocinio`,
                temporada: registro.temporada,
                texto,
                tom: "positiva",
                fonte: "imprensa",
              };
              return { ...registro, novoPatrocinio: proposta, manchetes: [...registro.manchetes, manchete] };
            })
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
        const jogadorAtualizado = resultado.jogador;
        const eraVoluntaria = prev.conversaVoluntaria;

        // Pedir transferência força negociação imediata, mesmo com contrato em vigor.
        // Só é permitido uma vez por temporada — evita loop de solicitar transferência
        // repetidamente para acumular bônus de assinatura sem nunca jogar a temporada.
        if (
          opcao === "pedir-transferencia" &&
          jogadorAtualizado.contrato.anosRestantes > 0 &&
          !prev.transferenciaSolicitadaNestaTemporada
        ) {
          const propostas = gerarPropostasContrato({ rng, jogador: jogadorAtualizado });
          return {
            ...prev,
            jogador: jogadorAtualizado,
            propostasContrato: propostas,
            mensagensNegociacao: {},
            fase: "contrato",
            conversaVoluntaria: false,
            transferenciaSolicitadaNestaTemporada: true,
          };
        }

        // Conversa iniciada por escolha do jogador (não por crise pós-temporada):
        // não avança a temporada, apenas volta para a pré-temporada.
        if (eraVoluntaria) {
          return { ...prev, jogador: jogadorAtualizado, fase: "pre-temporada", conversaVoluntaria: false };
        }

        return avancarTemporadaOuContrato({ ...prev, jogador: jogadorAtualizado }, rng);
      });
    },
    [rng],
  );

  const escolherProposta = useCallback((proposta: PropostaContrato) => {
    setEstado((prev) => {
      if (!prev.jogador) return prev;
      // Transferência antecipada (contrato anterior ainda em vigor) para outro clube:
      // o novo clube paga a multa rescisória à luvas do jogador como incentivo de assinatura.
      const transferenciaAntecipada = prev.jogador.contrato.anosRestantes > 0 && !proposta.ehClubeAtual;
      const luvasTransferencia = transferenciaAntecipada
        ? Math.round(prev.jogador.contrato.clausulas.multaRescisoria * 0.12)
        : 0;

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
        dinheiro: prev.jogador.dinheiro + luvasTransferencia,
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

  const verResumoTemporada = useCallback(() => {
    setEstado((prev) => (prev.fase === "partida-ao-vivo" ? { ...prev, fase: "resumo-temporada" } : prev));
  }, []);

  const abrirConversaTecnico = useCallback(() => {
    setEstado((prev) => {
      if (!prev.jogador || prev.fase !== "pre-temporada") return prev;
      return { ...prev, fase: "conversa-tecnico", conversaVoluntaria: true };
    });
  }, []);

  const abrirLoja = useCallback(() => {
    setEstado((prev) => {
      if (!prev.jogador || prev.fase === "loja") return prev;
      return { ...prev, fase: "loja", faseAnteriorLoja: prev.fase, mensagemLoja: null };
    });
  }, []);

  const fecharLoja = useCallback(() => {
    setEstado((prev) => {
      if (prev.fase !== "loja") return prev;
      return { ...prev, fase: prev.faseAnteriorLoja ?? "pre-temporada", faseAnteriorLoja: null, mensagemLoja: null };
    });
  }, []);

  const comprarNaLoja = useCallback((itemId: string) => {
    setEstado((prev) => {
      if (!prev.jogador) return prev;
      const { jogador, mensagem } = comprarItemLoja(prev.jogador, itemId);
      return { ...prev, jogador, mensagemLoja: mensagem };
    });
  }, []);

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
    verResumoTemporada,
    abrirLoja,
    fecharLoja,
    comprarNaLoja,
    abrirConversaTecnico,
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
  prev = { ...prev, transferenciaSolicitadaNestaTemporada: false };
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
    dinheiro:
      prev.jogador.dinheiro +
      prev.jogador.contrato.salarioAnual +
      prev.jogador.patrocinios.reduce((acc, p) => acc + p.valorAnual, 0),
  };

  return {
    ...prev,
    jogador: jogadorAtualizado,
    ultimoRegistro: resultado.registro,
    numeroTemporada,
    propostaPatrocinioPendente: resultado.propostaPatrocinio,
    fase: "partida-ao-vivo",
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
