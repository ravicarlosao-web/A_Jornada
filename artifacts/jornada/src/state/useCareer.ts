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
  gerarOpcoesDraft,
  gerarPropostasContrato,
  simularTemporada,
} from "@/engine/engine";
import type {
  Atributos,
  Dificuldade,
  FocoTreino,
  Jogador,
  Modo,
  OpcaoDraft,
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
  | "contrato"
  | "decisao-continuar"
  | "resultado-final";

const STORAGE_KEY = "jornada-carreira-v1";

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
          setEstado((prev) => ({
            ...prev,
            fase: "resumo-temporada",
            jogador: parsed.jogador,
            modo: parsed.jogador.modo,
            dificuldade: parsed.jogador.dificuldade,
            numeroTemporada: parsed.jogador.historicoTemporadas.length,
            ultimoRegistro:
              parsed.jogador.historicoTemporadas[parsed.jogador.historicoTemporadas.length - 1] ?? null,
          }));
          if (parsed.jogador.historicoTemporadas.length === 0) {
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

  const avancarDaPreTemporada = useCallback(() => {
    setEstado((prev) => {
      if (!prev.jogador) return prev;
      if (prev.jogador.modo === "completo") {
        return { ...prev, fase: "treino" };
      }
      return simularEAtualizar(prev, rng);
    });
  }, [rng]);

  const confirmarTreino = useCallback(
    (foco: FocoTreino) => {
      setEstado((prev) => {
        if (!prev.jogador) return prev;
        const atributosTreinados = aplicarTreino(prev.jogador.atributos, foco, prev.jogador.idade);
        const jogadorAtualizado = { ...prev.jogador, atributos: atributosTreinados };
        return simularEAtualizar({ ...prev, jogador: jogadorAtualizado }, rng);
      });
    },
    [rng],
  );

  const continuarCarreira = useCallback(() => {
    setEstado((prev) => {
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
        return { ...prev, jogador: jogadorAtualizado, propostasContrato: propostas, fase: "contrato" };
      }
      return { ...prev, jogador: jogadorAtualizado, fase: "pre-temporada" };
    });
  }, [rng]);

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
        },
        confiancaTecnico: proposta.ehClubeAtual ? prev.jogador.confiancaTecnico : 50,
      };
      return { ...prev, jogador: jogadorAtualizado, propostasContrato: [], fase: "pre-temporada" };
    });
  }, []);

  const aposentar = useCallback(() => {
    setEstado((prev) => finalizarCarreira(prev));
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
    aposentar,
  };
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

  const jogadorAtualizado: Jogador = {
    ...prev.jogador,
    fama: resultado.famaAtualizada,
    confiancaTecnico: resultado.confiancaTecnicoAtualizada,
    fadiga: resultado.fadigaAtualizada,
    historicoTemporadas: [...prev.jogador.historicoTemporadas, resultado.registro],
    premios,
  };

  return {
    ...prev,
    jogador: jogadorAtualizado,
    ultimoRegistro: resultado.registro,
    numeroTemporada,
    fase: "resumo-temporada",
  };
}

function finalizarCarreira(prev: EstadoJogo): EstadoJogo {
  if (!prev.jogador) return prev;
  const jogadorAposentado = { ...prev.jogador, aposentado: true };
  localStorage.removeItem(STORAGE_KEY);
  return { ...prev, jogador: jogadorAposentado, fase: "resultado-final" };
}

export { calcularOverall, calcularTierFinal };
