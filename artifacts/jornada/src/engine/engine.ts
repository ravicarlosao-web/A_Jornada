import { Rng } from "./rng";
import {
  LENDAS,
  CLUBES,
  OBJETIVOS,
  MANCHETES_POSITIVAS,
  MANCHETES_NEGATIVAS,
  MANCHETES_NEUTRAS,
  DESCRICOES_LESAO,
} from "./data";
import type {
  Atributos,
  AtributosBase,
  Clube,
  Dificuldade,
  FocoTreino,
  Jogador,
  Lesao,
  Manchete,
  Modo,
  OpcaoDraft,
  Posicao,
  PropostaContrato,
  RegistroTemporada,
} from "./types";

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
    contrato: { salarioAnual: 30000 + clube.forca * 20000, duracaoAnos: 2, anosRestantes: 2 },
    historicoTemporadas: [],
    premios: [],
    jovensMentorados: 0,
    aposentado: false,
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
    });
  }

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
  };

  return {
    registro,
    atributosAtualizados: jogador.atributos,
    famaAtualizada: fama,
    confiancaTecnicoAtualizada: confiancaTecnico,
    fadigaAtualizada,
  };
}

export function gerarPropostasContrato(params: {
  rng: Rng;
  jogador: Jogador;
}): PropostaContrato[] {
  const { rng, jogador } = params;
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const nivel = overall + jogador.fama * 0.2;

  const propostaAtual: PropostaContrato = {
    clube: jogador.clubeAtual,
    salarioAnual: Math.round(jogador.contrato.salarioAnual * (1 + rng.range(0.05, 0.25))),
    duracaoAnos: rng.int(2, 4),
    ehClubeAtual: true,
  };

  const propostas: PropostaContrato[] = [propostaAtual];

  const candidatos = CLUBES.filter((c) => c.nome !== jogador.clubeAtual.nome).sort(
    (a, b) => Math.abs(a.forca * 20 - nivel) - Math.abs(b.forca * 20 - nivel),
  );

  const numOfertas = rng.random() < 0.7 ? (rng.random() < 0.5 ? 1 : 2) : 0;
  for (let i = 0; i < numOfertas && i < candidatos.length; i++) {
    const clube = candidatos[i];
    propostas.push({
      clube,
      salarioAnual: Math.round((30000 + clube.forca * 25000) * rng.range(0.9, 1.2)),
      duracaoAnos: rng.int(2, 4),
      ehClubeAtual: false,
    });
  }

  return propostas;
}

export function definirStatusElenco(rng: Rng, confiancaTecnico: number): "titular" | "rotacao" | "reserva" {
  if (confiancaTecnico >= 60) return "titular";
  if (confiancaTecnico >= 35) return rng.random() < 0.7 ? "rotacao" : "titular";
  return rng.random() < 0.6 ? "reserva" : "rotacao";
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
