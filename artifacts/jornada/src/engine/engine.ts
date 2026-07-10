import { Rng } from "./rng";
import {
  LENDAS,
  CLUBES,
  CLUBES_INTERNACIONAIS,
  OBJETIVOS,
  MANCHETES_POSITIVAS,
  MANCHETES_NEGATIVAS,
  MANCHETES_NEUTRAS,
  DESCRICOES_LESAO,
  EVENTOS_VESTIARIO_HARMONIA,
  EVENTOS_VESTIARIO_CONFLITO,
  POSTS_REDES_SOCIAIS_POSITIVOS,
  POSTS_REDES_SOCIAIS_NEGATIVOS,
  MARCAS_PATROCINIO,
  MANCHETES_PATROCINIO,
  MANCHETES_SELECAO_CONVOCADO,
  MANCHETES_SELECAO_TITULO,
  MANCHETES_RIVAL_VITORIA,
  MANCHETES_RIVAL_DERROTA,
} from "./data";
import type {
  Atributos,
  AtributosBase,
  ClausulasContrato,
  Clube,
  ConversaTecnicoOpcaoId,
  Dificuldade,
  EventoVestiario,
  FocoTreino,
  Jogador,
  Lesao,
  Manchete,
  Modo,
  OpcaoDraft,
  OpcaoPosCarreira,
  Patrocinio,
  Posicao,
  PosCarreiraId,
  PropostaContrato,
  RegistroTemporada,
  ResultadoConversaTecnico,
  RivalPosicao,
} from "./types";

const SOBRENOMES_RIVAL = [
  "Aguiar",
  "Bittencourt",
  "Cordeiro",
  "Duarte",
  "Fontoura",
  "Guimarães",
  "Lacerda",
  "Monteiro",
  "Peixoto",
  "Siqueira",
];

function gerarNomeRival(rng: Rng): string {
  return rng.pick(SOBRENOMES_RIVAL);
}

const ATRIBUTOS_BASE: (keyof AtributosBase)[] = [
  "ritmo",
  "finalizacao",
  "passe",
  "drible",
  "defesa",
  "fisico",
  "reflexos",
];

export function gerarOpcoesDraft(rng: Rng, dificuldade: Dificuldade): OpcaoDraft[] {
  const params =
    dificuldade === "amador"
      ? { mu: 12, sigma: 3, min: 5, max: 20 }
      : { mu: 10, sigma: 6, min: 1, max: 25 };

  const opcoes: OpcaoDraft[] = [];
  const usados = new Set<string>();
  while (opcoes.length < 3) {
    const lenda = rng.pick(LENDAS);
    const chave = `${lenda.nome}-${lenda.atributo}`;
    if (usados.has(chave)) continue;
    usados.add(chave);
    const valor = Math.round(rng.clamp(rng.normal(params.mu, params.sigma), params.min, params.max));
    opcoes.push({ legenda: lenda.nome, atributo: lenda.atributo, valor });
  }
  return opcoes;
}

export function criarAtributosBase(): Atributos {
  const base: Partial<AtributosBase> = {};
  for (const attr of ATRIBUTOS_BASE) base[attr] = 20;
  return {
    ...(base as AtributosBase),
    temperamento: 45,
    carisma: 40,
    foco: 45,
    lideranca: 20,
  };
}

export function aplicarEscolhaDraft(atributos: Atributos, escolha: OpcaoDraft): Atributos {
  const atual = atributos[escolha.atributo];
  const novo = Math.min(99, atual + escolha.valor);
  return { ...atributos, [escolha.atributo]: novo };
}

const PESOS_POSICAO: Record<Posicao, Partial<Record<keyof AtributosBase, number>>> = {
  GOL: { reflexos: 0.7, fisico: 0.2, passe: 0.1 },
  ZAG: { defesa: 0.45, fisico: 0.3, passe: 0.15, ritmo: 0.1 },
  MEI: { passe: 0.35, drible: 0.25, ritmo: 0.15, defesa: 0.1, finalizacao: 0.15 },
  ATA: { finalizacao: 0.4, ritmo: 0.25, drible: 0.25, fisico: 0.1 },
};

export function calcularOverall(atributos: Atributos, posicao: Posicao): number {
  const pesos = PESOS_POSICAO[posicao];
  let total = 0;
  let somaPesos = 0;
  for (const [attr, peso] of Object.entries(pesos)) {
    total += atributos[attr as keyof AtributosBase] * (peso as number);
    somaPesos += peso as number;
  }
  return Math.round(total / somaPesos);
}

export function sugerirPosicao(atributos: Atributos): Posicao {
  const posicoes: Posicao[] = ["GOL", "ZAG", "MEI", "ATA"];
  let melhor: Posicao = "MEI";
  let melhorOverall = -1;
  for (const pos of posicoes) {
    const overall = calcularOverall(atributos, pos);
    if (overall > melhorOverall) {
      melhorOverall = overall;
      melhor = pos;
    }
  }
  return melhor;
}

export function sortearClube(rng: Rng, dificuldade: Dificuldade): Clube {
  const pool = dificuldade === "amador" ? CLUBES.filter((c) => c.forca <= 3) : CLUBES;
  return rng.pick(pool);
}

function gerarClausulas(rng: Rng, salarioAnual: number, forcaClube: number): ClausulasContrato {
  return {
    multaRescisoria: Math.round(salarioAnual * (3 + forcaClube) * rng.range(0.8, 1.3)),
    bonusPorGol: Math.round(500 + forcaClube * 400 * rng.range(0.8, 1.3)),
    luvas: Math.round(salarioAnual * 0.15 * rng.range(0.5, 1.4)),
  };
}

export function definirObjetivo(rng: Rng, clube: Clube): string {
  return rng.pick(OBJETIVOS[clube.tier]);
}

function fatorIdade(idade: number): number {
  if (idade <= 20) return 1.15;
  if (idade <= 27) return 1.05;
  if (idade <= 30) return 0.95;
  if (idade <= 33) return 0.8;
  return 0.6;
}

export function criarJogador(params: {
  seedCarreira: string;
  modo: Modo;
  dificuldade: Dificuldade;
  nome: string;
  atributos: Atributos;
  posicao: Posicao;
  rng: Rng;
}): Jogador {
  const clube = sortearClube(params.rng, params.dificuldade);
  const salarioAnual = 30000 + clube.forca * 20000;
  return {
    seedCarreira: params.seedCarreira,
    modo: params.modo,
    dificuldade: params.dificuldade,
    nome: params.nome,
    atributos: params.atributos,
    posicao: params.posicao,
    idade: 16,
    fama: 5,
    fadiga: 0,
    confiancaTecnico: 55,
    clubeAtual: clube,
    contrato: {
      salarioAnual,
      duracaoAnos: 2,
      anosRestantes: 2,
      clausulas: gerarClausulas(params.rng, salarioAnual, clube.forca),
    },
    historicoTemporadas: [],
    premios: [],
    jovensMentorados: 0,
    aposentado: false,
    relacaoElenco: 50,
    rival: { nome: gerarNomeRival(params.rng), overall: calcularOverall(params.atributos, params.posicao), vitorias: 0, derrotas: 0 },
    convocacoesSelecao: 0,
    titulosSelecao: [],
    patrocinios: [],
  };
}

export function aplicarTreino(atributos: Atributos, foco: FocoTreino, idade: number): Atributos {
  const novos = { ...atributos };
  const fIdade = fatorIdade(idade);
  const pontosPorAtributo = foco.tecnico / ATRIBUTOS_BASE.length;
  for (const attr of ATRIBUTOS_BASE) {
    const atual = novos[attr];
    const diminishing = 1 - Math.pow(atual / 99, 2);
    const ganho = pontosPorAtributo * fIdade * (novos.foco / 99) * diminishing;
    novos[attr] = Math.min(99, Math.round((atual + ganho) * 10) / 10);
  }
  if (foco.tatica > 0) {
    novos.foco = Math.min(99, novos.foco + foco.tatica * 0.15);
  }
  return novos;
}

export interface ResultadoTemporada {
  registro: RegistroTemporada;
  atributosAtualizados: Atributos;
  famaAtualizada: number;
  confiancaTecnicoAtualizada: number;
  fadigaAtualizada: number;
  relacaoElencoAtualizada: number;
  rivalAtualizado: RivalPosicao;
  convocacoesSelecaoIncremento: number;
  tituloSelecaoConquistado: string | null;
  propostaPatrocinio: Patrocinio | null;
}

export function simularTemporada(params: {
  rng: Rng;
  jogador: Jogador;
  numeroTemporada: number;
  statusElenco: "titular" | "rotacao" | "reserva";
}): ResultadoTemporada {
  const { rng, jogador, numeroTemporada, statusElenco } = params;
  const overall = calcularOverall(jogador.atributos, jogador.posicao);

  const modificadorForma = rng.clamp(rng.normal(1, 0.08), 0.75, 1.25);
  const modificadorIdade = fatorIdade(jogador.idade);
  const modificadorFisico = rng.clamp(1 - jogador.fadiga / 200, 0.6, 1);
  const modificadorElenco =
    statusElenco === "titular" ? 1.05 : statusElenco === "rotacao" ? 0.95 : 0.8;
  const modificadorTecnico = rng.clamp(jogador.confiancaTecnico / 70, 0.7, 1.2);

  const nivelEfetivo =
    overall *
    modificadorForma *
    Math.min(1.15, modificadorIdade) *
    modificadorFisico *
    modificadorElenco *
    modificadorTecnico;

  const jogosBase = statusElenco === "titular" ? 32 : statusElenco === "rotacao" ? 20 : 8;
  let jogos = Math.max(1, Math.round(jogosBase + rng.range(-3, 3)));

  const chanceLesao = rng.clamp(0.1 + jogador.fadiga / 300 + Math.max(0, jogador.idade - 30) * 0.01, 0.05, 0.4);
  let lesao: Lesao | null = null;
  if (rng.random() < chanceLesao) {
    const roll = rng.random();
    const gravidade: Lesao["gravidade"] = roll < 0.55 ? "leve" : roll < 0.88 ? "moderada" : "grave";
    const jogosPerdidos =
      gravidade === "leve"
        ? Math.round(rng.range(1, 4))
        : gravidade === "moderada"
          ? Math.round(rng.range(4, 10))
          : Math.round(rng.range(10, 20));
    lesao = {
      gravidade,
      jogosPerdidos,
      descricao: rng.pick(DESCRICOES_LESAO[gravidade]),
    };
    jogos = Math.max(1, jogos - jogosPerdidos);
  }

  const isAtaqueOuMeio = jogador.posicao === "ATA" || jogador.posicao === "MEI";
  const lambdaGols = isAtaqueOuMeio ? (nivelEfetivo / 99) * 0.55 : (nivelEfetivo / 99) * 0.12;
  const lambdaAssist = (nivelEfetivo / 99) * (isAtaqueOuMeio ? 0.35 : 0.15);

  let gols = 0;
  let assistencias = 0;
  let somaNotas = 0;
  for (let i = 0; i < jogos; i++) {
    gols += rng.poisson(lambdaGols);
    assistencias += rng.poisson(lambdaAssist);
    const notaJogo = rng.clamp(rng.normal(5.5 + (nivelEfetivo / 99) * 3.5, 0.9), 2, 10);
    somaNotas += notaJogo;
  }
  const notaMedia = Math.round((somaNotas / jogos) * 10) / 10;

  const clube = jogador.clubeAtual;
  const objetivo = definirObjetivo(rng, clube);
  const forcaTimeAjustada = clube.forca / 5 + (overall - 60) / 200;
  const chanceCumprir = rng.clamp(0.35 + forcaTimeAjustada + (notaMedia - 6) * 0.08, 0.05, 0.92);
  const objetivoCumprido = rng.random() < chanceCumprir;

  let fama = jogador.fama;
  let confiancaTecnico = jogador.confiancaTecnico;
  const manchetes: Manchete[] = [];

  if (notaMedia >= 7.5) {
    fama += 6;
    confiancaTecnico += 8;
    manchetes.push({
      id: `${numeroTemporada}-1`,
      temporada: numeroTemporada,
      texto: rng.pick(MANCHETES_POSITIVAS).replace("{nome}", jogador.nome),
      tom: "positiva",
    });
  } else if (notaMedia <= 5.5) {
    fama = Math.max(0, fama - 3);
    confiancaTecnico -= 6;
    manchetes.push({
      id: `${numeroTemporada}-1`,
      temporada: numeroTemporada,
      texto: rng.pick(MANCHETES_NEGATIVAS).replace("{nome}", jogador.nome),
      tom: "negativa",
    });
  } else {
    manchetes.push({
      id: `${numeroTemporada}-1`,
      temporada: numeroTemporada,
      texto: rng.pick(MANCHETES_NEUTRAS).replace("{nome}", jogador.nome),
      tom: "neutra",
    });
  }

  if (objetivoCumprido) {
    fama += 5;
    confiancaTecnico += 5;
  } else {
    confiancaTecnico -= 4;
  }

  confiancaTecnico = rng.clamp(confiancaTecnico, 0, 100);
  fama = rng.clamp(fama, 0, 100);

  let premio: string | null = null;
  if (notaMedia >= 8.3 && rng.random() < 0.4) {
    premio = "Craque da Temporada";
    fama += 8;
  }

  const fadigaAtualizada = rng.clamp(
    jogador.fadiga * 0.4 + (statusElenco === "titular" ? 15 : 6),
    0,
    100,
  );

  if (lesao) {
    manchetes.push({
      id: `${numeroTemporada}-lesao`,
      temporada: numeroTemporada,
      texto: `${jogador.nome} sofre lesão: ${lesao.descricao} e desfalca o time por semanas`,
      tom: "negativa",
      fonte: "imprensa",
    });
  }

  let relacaoElenco = jogador.relacaoElenco;
  let eventoVestiario: EventoVestiario | null = null;
  const chanceHarmonia = rng.clamp(0.15 + jogador.atributos.lideranca / 300 + jogador.atributos.carisma / 400, 0.1, 0.5);
  const chanceConflito = rng.clamp(0.1 + (100 - jogador.atributos.temperamento) / 300 + (statusElenco === "reserva" ? 0.08 : 0), 0.05, 0.4);
  const rolVestiario = rng.random();
  if (rolVestiario < chanceConflito) {
    const impacto = -Math.round(rng.range(5, 15));
    eventoVestiario = {
      tipo: "conflito",
      texto: rng.pick(EVENTOS_VESTIARIO_CONFLITO).replace("{nome}", jogador.nome),
      impactoRelacao: impacto,
    };
    relacaoElenco = rng.clamp(relacaoElenco + impacto, 0, 100);
    confiancaTecnico = rng.clamp(confiancaTecnico - 4, 0, 100);
  } else if (rolVestiario > 1 - chanceHarmonia) {
    const impacto = Math.round(rng.range(4, 12));
    eventoVestiario = {
      tipo: "harmonia",
      texto: rng.pick(EVENTOS_VESTIARIO_HARMONIA).replace("{nome}", jogador.nome),
      impactoRelacao: impacto,
    };
    relacaoElenco = rng.clamp(relacaoElenco + impacto, 0, 100);
  } else {
    relacaoElenco = rng.clamp(relacaoElenco + rng.range(-2, 2), 0, 100);
  }

  const chanceViral = rng.clamp((fama / 200) + (notaMedia >= 7.5 ? 0.25 : notaMedia <= 5.5 ? 0.2 : 0.05), 0.05, 0.6);
  if (rng.random() < chanceViral) {
    const positivo = notaMedia >= 6.5;
    manchetes.push({
      id: `${numeroTemporada}-redes`,
      temporada: numeroTemporada,
      texto: rng
        .pick(positivo ? POSTS_REDES_SOCIAIS_POSITIVOS : POSTS_REDES_SOCIAIS_NEGATIVOS)
        .replace("{nome}", jogador.nome),
      tom: positivo ? "positiva" : "negativa",
      fonte: "redes-sociais",
    });
    fama = rng.clamp(fama + (positivo ? 3 : -2), 0, 100);
  }

  // Disputa pela posição com o rival direto no elenco
  const chanceVencerRival = rng.clamp(0.5 + (overall - jogador.rival.overall) / 100 + (notaMedia - 6.5) * 0.05, 0.1, 0.9);
  const venceuRival = rng.random() < chanceVencerRival;
  const disputaRival: "venceu" | "perdeu" = venceuRival ? "venceu" : "perdeu";
  const rivalAtualizado: RivalPosicao = {
    ...jogador.rival,
    overall: rng.clamp(Math.round(jogador.rival.overall + rng.range(-2, 3)), 40, 99),
    vitorias: jogador.rival.vitorias + (venceuRival ? 1 : 0),
    derrotas: jogador.rival.derrotas + (venceuRival ? 0 : 1),
  };
  manchetes.push({
    id: `${numeroTemporada}-rival`,
    temporada: numeroTemporada,
    texto: rng
      .pick(venceuRival ? MANCHETES_RIVAL_VITORIA : MANCHETES_RIVAL_DERROTA)
      .replace("{nome}", jogador.nome)
      .replace("{rival}", jogador.rival.nome),
    tom: venceuRival ? "positiva" : "negativa",
  });

  // Convocação para a seleção nacional
  const chanceConvocacao = rng.clamp((fama - 40) / 150 + (overall - 65) / 150, 0, 0.55);
  const convocadoSelecao = rng.random() < chanceConvocacao;
  let tituloSelecao: string | null = null;
  if (convocadoSelecao) {
    fama = rng.clamp(fama + 4, 0, 100);
    manchetes.push({
      id: `${numeroTemporada}-selecao`,
      temporada: numeroTemporada,
      texto: rng.pick(MANCHETES_SELECAO_CONVOCADO).replace("{nome}", jogador.nome),
      tom: "positiva",
    });
    if (rng.random() < 0.12) {
      tituloSelecao = "Campeão pela Seleção Nacional";
      fama = rng.clamp(fama + 10, 0, 100);
      manchetes.push({
        id: `${numeroTemporada}-selecao-titulo`,
        temporada: numeroTemporada,
        texto: rng.pick(MANCHETES_SELECAO_TITULO).replace("{nome}", jogador.nome),
        tom: "positiva",
      });
    }
  }

  // Proposta de patrocínio / marca pessoal — apenas gera a oferta; a decisão de
  // aceitar ou recusar é feita pelo jogador na tela dedicada de patrocínio.
  const propostaPatrocinio = gerarPropostaPatrocinio(rng, jogador, fama, numeroTemporada);

  const registro: RegistroTemporada = {
    temporada: numeroTemporada,
    idade: jogador.idade,
    clube: clube.nome,
    jogos,
    gols,
    assistencias,
    notaMedia,
    fama,
    objetivo,
    objetivoCumprido,
    premio,
    manchetes,
    statusElenco,
    lesao,
    eventoVestiario,
    relacaoElenco,
    disputaRival,
    convocadoSelecao,
    tituloSelecao,
    novoPatrocinio: null,
  };

  return {
    registro,
    atributosAtualizados: jogador.atributos,
    famaAtualizada: fama,
    confiancaTecnicoAtualizada: confiancaTecnico,
    fadigaAtualizada,
    relacaoElencoAtualizada: relacaoElenco,
    rivalAtualizado,
    convocacoesSelecaoIncremento: convocadoSelecao ? 1 : 0,
    tituloSelecaoConquistado: tituloSelecao,
    propostaPatrocinio,
  };
}

/** Gera uma oferta de patrocínio candidata para a temporada, sem aplicá-la. */
function gerarPropostaPatrocinio(
  rng: Rng,
  jogador: Jogador,
  fama: number,
  numeroTemporada: number,
): Patrocinio | null {
  const temPatrocinioAtivo = jogador.patrocinios.length > 0;
  const chancePatrocinio = rng.clamp((fama - 25) / 130, 0, 0.4) * (temPatrocinioAtivo ? 0.3 : 1);
  if (fama < 30 || rng.random() >= chancePatrocinio) return null;
  const marca = rng.pick(MARCAS_PATROCINIO);
  return {
    marca,
    valorAnual: Math.round((5000 + fama * 800) * rng.range(0.8, 1.3)),
    temporadaInicio: numeroTemporada,
  };
}

export interface ResultadoNegociacao {
  proposta: PropostaContrato | null;
  mensagem: string;
}

/**
 * Tenta melhorar os termos de uma proposta de contrato. O clube pode aceitar
 * uma contraproposta melhor, manter os termos originais, ou (com chance menor)
 * sair da negociação — removendo a proposta da lista.
 */
export function negociarProposta(rng: Rng, jogador: Jogador, proposta: PropostaContrato): ResultadoNegociacao {
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const forcaNegociacao = rng.clamp((jogador.fama - 30) / 100 + (overall - 65) / 150, -0.2, 0.5);
  const chanceSucesso = rng.clamp(0.45 + forcaNegociacao, 0.15, 0.85);
  const chanceRompimento = proposta.ehClubeAtual ? 0.05 : 0.18;

  if (rng.random() < chanceRompimento) {
    return {
      proposta: null,
      mensagem: `${proposta.clube.nome} não aceitou a contraproposta e saiu da mesa de negociação.`,
    };
  }

  if (rng.random() < chanceSucesso) {
    const ganho = rng.range(0.08, 0.22);
    const salarioAnual = Math.round(proposta.salarioAnual * (1 + ganho));
    return {
      proposta: {
        ...proposta,
        salarioAnual,
        clausulas: {
          ...proposta.clausulas,
          luvas: Math.round(proposta.clausulas.luvas * (1 + ganho * 0.6)),
        },
      },
      mensagem: `Negociação bem-sucedida! Salário melhorado em ${Math.round(ganho * 100)}%.`,
    };
  }

  return {
    proposta,
    mensagem: `${proposta.clube.nome} manteve a proposta original.`,
  };
}

export function gerarPropostasContrato(params: {
  rng: Rng;
  jogador: Jogador;
}): PropostaContrato[] {
  const { rng, jogador } = params;
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const nivel = overall + jogador.fama * 0.2;

  let contadorProposta = 0;
  const proximoId = () => `proposta-${Date.now()}-${contadorProposta++}`;

  const salarioAtualNovo = Math.round(jogador.contrato.salarioAnual * (1 + rng.range(0.05, 0.25)));
  const propostaAtual: PropostaContrato = {
    id: proximoId(),
    clube: jogador.clubeAtual,
    salarioAnual: salarioAtualNovo,
    duracaoAnos: rng.int(2, 4),
    ehClubeAtual: true,
    clausulas: gerarClausulas(rng, salarioAtualNovo, jogador.clubeAtual.forca),
  };

  const propostas: PropostaContrato[] = [propostaAtual];

  const candidatos = CLUBES.filter((c) => c.nome !== jogador.clubeAtual.nome).sort(
    (a, b) => Math.abs(a.forca * 20 - nivel) - Math.abs(b.forca * 20 - nivel),
  );

  const numOfertas = rng.random() < 0.7 ? (rng.random() < 0.5 ? 1 : 2) : 0;
  for (let i = 0; i < numOfertas && i < candidatos.length; i++) {
    const clube = candidatos[i];
    const salarioAnual = Math.round((30000 + clube.forca * 25000) * rng.range(0.9, 1.2));
    propostas.push({
      id: proximoId(),
      clube,
      salarioAnual,
      duracaoAnos: rng.int(2, 4),
      ehClubeAtual: false,
      clausulas: gerarClausulas(rng, salarioAnual, clube.forca),
    });
  }

  // Propostas do exterior: só surgem para jogadores com fama e overall consolidados
  const elegivelExterior = nivel >= 68 && jogador.fama >= 45;
  if (elegivelExterior && rng.random() < 0.55) {
    const numOfertasExterior = rng.random() < 0.5 ? 1 : 2;
    const candidatosExterior = [...CLUBES_INTERNACIONAIS].sort(
      (a, b) => Math.abs(a.forca * 20 - nivel) - Math.abs(b.forca * 20 - nivel),
    );
    for (let i = 0; i < numOfertasExterior && i < candidatosExterior.length; i++) {
      const clube = candidatosExterior[i];
      const salarioAnual = Math.round((60000 + clube.forca * 45000) * rng.range(0.9, 1.3));
      propostas.push({
        id: proximoId(),
        clube,
        salarioAnual,
        duracaoAnos: rng.int(2, 4),
        ehClubeAtual: false,
        clausulas: gerarClausulas(rng, salarioAnual, clube.forca),
      });
    }
  }

  return propostas;
}

export function definirStatusElenco(rng: Rng, confiancaTecnico: number): "titular" | "rotacao" | "reserva" {
  if (confiancaTecnico >= 60) return "titular";
  if (confiancaTecnico >= 35) return rng.random() < 0.7 ? "rotacao" : "titular";
  return rng.random() < 0.6 ? "reserva" : "rotacao";
}

export const OPCOES_CONVERSA_TECNICO: { id: ConversaTecnicoOpcaoId; titulo: string; descricao: string }[] = [
  {
    id: "respeitoso",
    titulo: "Pedir explicações com respeito",
    descricao: "Aborda o técnico em particular, sem drama. Ganho leve de relação, sem risco.",
  },
  {
    id: "cobrar-imprensa",
    titulo: "Cobrar publicamente (vaza pra imprensa)",
    descricao: "Risco de irritar o técnico, mas pode render apoio da torcida se você tiver razão.",
  },
  {
    id: "silencio",
    titulo: "Aceitar a decisão em silêncio",
    descricao: "Neutro para a relação, mas a frustração acumulada pode abalar seu Temperamento.",
  },
  {
    id: "pedir-transferencia",
    titulo: "Pedir para ser negociado",
    descricao: "Sinaliza à diretoria que você quer sair — pode acelerar uma saída de clube.",
  },
];

export function resolverConversaTecnico(
  jogador: Jogador,
  opcao: ConversaTecnicoOpcaoId,
  rng: Rng,
): ResultadoConversaTecnico {
  if (opcao === "respeitoso") {
    return {
      jogador: { ...jogador, confiancaTecnico: rng.clamp(jogador.confiancaTecnico + 4, 0, 100) },
      mensagem: `${jogador.nome} conversou com o técnico com maturidade. A relação melhorou um pouco.`,
    };
  }
  if (opcao === "cobrar-imprensa") {
    const notaBoa = jogador.fama > 55;
    const confiancaTecnico = rng.clamp(jogador.confiancaTecnico - (notaBoa ? 6 : 14), 0, 100);
    const fama = notaBoa ? rng.clamp(jogador.fama + 5, 0, 100) : jogador.fama;
    return {
      jogador: { ...jogador, confiancaTecnico, fama },
      mensagem: notaBoa
        ? `A cobrança pública de ${jogador.nome} caiu bem na torcida, mas azedou a relação com o técnico.`
        : `A cobrança pública de ${jogador.nome} irritou bastante o técnico, sem gerar apoio relevante da torcida.`,
    };
  }
  if (opcao === "silencio") {
    return {
      jogador: {
        ...jogador,
        atributos: {
          ...jogador.atributos,
          temperamento: rng.clamp(jogador.atributos.temperamento - 3, 1, 99),
        },
      },
      mensagem: `${jogador.nome} engoliu a frustração em silêncio. O desgaste emocional pesa aos poucos.`,
    };
  }
  return {
    jogador: { ...jogador, confiancaTecnico: rng.clamp(jogador.confiancaTecnico - 5, 0, 100) },
    mensagem: `${jogador.nome} pediu para ser negociado. A diretoria já avalia propostas de saída.`,
  };
}

export function mentorarJovem(jogador: Jogador): Jogador {
  return {
    ...jogador,
    jovensMentorados: jogador.jovensMentorados + 1,
    atributos: {
      ...jogador.atributos,
      lideranca: Math.min(99, jogador.atributos.lideranca + 4),
    },
  };
}

export function gerarOpcoesPosCarreira(jogador: Jogador): OpcaoPosCarreira[] {
  const titulosConquistados = jogador.historicoTemporadas.filter((h) => h.objetivoCumprido).length;
  const embaixadorDisponivel = jogador.confiancaTecnico >= 65 && titulosConquistados >= 2;

  return [
    {
      id: "tecnico",
      titulo: "Técnico",
      descricao: `Usar sua Liderança (${jogador.atributos.lideranca}) para iniciar carreira como treinador.`,
      disponivel: true,
    },
    {
      id: "comentarista",
      titulo: "Comentarista / Jornalista",
      descricao: `Usar seu Carisma (${jogador.atributos.carisma}) e Fama para narrar o próprio legado na mídia.`,
      disponivel: true,
    },
    {
      id: "empresario",
      titulo: "Empresário / Investidor",
      descricao: "Transformar a fama acumulada em um novo capítulo fora dos gramados.",
      disponivel: true,
    },
    {
      id: "embaixador",
      titulo: "Embaixador do Clube",
      descricao: embaixadorDisponivel
        ? `O ${jogador.clubeAtual.nome} quer usar seu nome institucionalmente.`
        : "Requer alta confiança do técnico e pelo menos 2 objetivos cumpridos na carreira.",
      disponivel: embaixadorDisponivel,
      motivoIndisponivel: embaixadorDisponivel
        ? undefined
        : "Você precisava de mais confiança do técnico e títulos para desbloquear este caminho.",
    },
  ];
}

export function gerarEpilogo(jogador: Jogador, escolha: PosCarreiraId, rng: Rng): string {
  const nome = jogador.nome;
  const clube = jogador.clubeAtual.nome;
  const temporadas = jogador.historicoTemporadas.length;

  if (escolha === "tecnico") {
    const estilo = rng.pick(["posse de bola", "contra-ataque", "pressão alta", "linha defensiva sólida"]);
    return `${nome} pendurou as chuteiras e foi direto para o banco de reservas. Com um overall de treinador construído sobre ${temporadas} temporadas de experiência e Liderança de ${jogador.atributos.lideranca}, adotou um estilo de ${estilo} e já é cotado como o próximo grande nome nos bastidores do futebol.`;
  }
  if (escolha === "comentarista") {
    return `${nome} trocou o gramado pelo microfone. Com Carisma de ${jogador.atributos.carisma} e uma Fama construída ao longo da carreira, virou comentarista requisitado — e não é raro ver manchetes citando "como ${nome} bem lembrou em seu comentário pós-jogo".`;
  }
  if (escolha === "empresario") {
    const valor = Math.round(jogador.fama * rng.range(0.8, 1.6) * 100000);
    return `${nome} investiu o nome e a fama construídos na carreira em negócios próprios. Hoje comanda um pequeno império avaliado em torno de R$ ${valor.toLocaleString("pt-BR")}, citado como exemplo de atleta que soube planejar o pós-carreira.`;
  }
  return `${nome} se tornou embaixador institucional do ${clube}, representando o clube em eventos, viagens e negociações. Um fechamento à altura de uma carreira marcada por confiança e conquistas.`;
}

export interface Tier {
  nome: string;
  descricao: string;
}

const TIERS: Tier[] = [
  { nome: "Lenda Eterna", descricao: "Seu nome entrou para a história do futebol mundial." },
  { nome: "Ícone Global", descricao: "Reconhecido em qualquer lugar do planeta." },
  { nome: "Craque Mundial", descricao: "Um dos melhores da sua geração." },
  { nome: "Estrela Internacional", descricao: "Brilhou em ligas de ponta e seleção." },
  { nome: "Referência Nacional", descricao: "Um nome respeitado no futebol nacional." },
  { nome: "Titular Consolidado", descricao: "Peça importante em todos os clubes por onde passou." },
  { nome: "Jogador Sólido", descricao: "Carreira estável, sem grandes turbulências." },
  { nome: "Coadjuvante de Elenco", descricao: "Contribuiu, mas nunca foi protagonista." },
  { nome: "Promessa Não Realizada", descricao: "O talento existia, mas faltou consistência." },
  { nome: "Jogador Regular", descricao: "Uma carreira comum, sem grandes destaques." },
  { nome: "Carreira Modesta", descricao: "Ficou longe dos holofotes a maior parte do tempo." },
];

export function calcularTierFinal(jogador: Jogador): { tier: Tier; score: number } {
  const historico = jogador.historicoTemporadas;
  const picoOverall = Math.max(60, calcularOverall(jogador.atributos, jogador.posicao));
  const titulosPonderados = historico.filter((h) => h.objetivoCumprido).length * 10;
  const premiosIndividuais = jogador.premios.length * 15;
  const longevidade = historico.length * 4;
  const famaMediaCarreira =
    historico.length > 0
      ? historico.reduce((acc, h) => acc + h.fama, 0) / historico.length
      : jogador.fama;
  const legado = jogador.modo === "completo" ? jogador.jovensMentorados * 8 + famaMediaCarreira * 0.4 : famaMediaCarreira * 0.5;

  const score =
    0.22 * picoOverall +
    0.22 * titulosPonderados +
    0.18 * premiosIndividuais +
    0.13 * longevidade +
    0.13 * famaMediaCarreira +
    0.12 * legado;

  const index = Math.max(0, Math.min(TIERS.length - 1, Math.floor((100 - score) / (100 / TIERS.length))));
  return { tier: TIERS[index], score: Math.round(score) };
}
