import type { AtributosBase, Clube } from "./types";

export const LENDAS: { nome: string; atributo: keyof AtributosBase }[] = [
  { nome: "Pelé", atributo: "finalizacao" },
  { nome: "Maradona", atributo: "drible" },
  { nome: "Zidane", atributo: "passe" },
  { nome: "Ronaldo Fenômeno", atributo: "ritmo" },
  { nome: "Cafu", atributo: "ritmo" },
  { nome: "Cannavaro", atributo: "defesa" },
  { nome: "Cristiano Ronaldo", atributo: "finalizacao" },
  { nome: "Messi", atributo: "drible" },
  { nome: "Xavi", atributo: "passe" },
  { nome: "Buffon", atributo: "reflexos" },
  { nome: "Casillas", atributo: "reflexos" },
  { nome: "Van Dijk", atributo: "defesa" },
  { nome: "Ibrahimović", atributo: "fisico" },
  { nome: "Kaká", atributo: "passe" },
  { nome: "Ronaldinho", atributo: "drible" },
  { nome: "Beckenbauer", atributo: "defesa" },
  { nome: "Neymar", atributo: "drible" },
  { nome: "Mbappé", atributo: "ritmo" },
  { nome: "Iniesta", atributo: "passe" },
  { nome: "Romário", atributo: "finalizacao" },
];

export const CLUBES: Clube[] = [
  { nome: "Vila Operária FC", forca: 1, tier: "pequeno" },
  { nome: "União Serrana", forca: 1, tier: "pequeno" },
  { nome: "Atlético do Porto Velho", forca: 2, tier: "pequeno" },
  { nome: "Ferroviário EC", forca: 2, tier: "medio" },
  { nome: "Recreativo Nacional", forca: 3, tier: "medio" },
  { nome: "Estrela do Sul", forca: 3, tier: "medio" },
  { nome: "Grêmio Continental", forca: 4, tier: "grande" },
  { nome: "Real Capital", forca: 4, tier: "grande" },
  { nome: "Internacional Metropolitano", forca: 5, tier: "grande" },
  { nome: "Clube Atlético Imperial", forca: 5, tier: "grande" },
];

export const OBJETIVOS: Record<Clube["tier"], string[]> = {
  pequeno: ["Evitar o rebaixamento", "Terminar no meio da tabela"],
  medio: [
    "Classificar para a copa continental secundária",
    "Chegar às quartas de final da copa nacional",
  ],
  grande: [
    "Vencer a liga nacional",
    "Chegar às semifinais da copa continental principal",
  ],
};

export const MANCHETES_POSITIVAS = [
  "{nome} brilha e decide o jogo com atuação de gala",
  "Imprensa exalta {nome}: 'um dos melhores da temporada'",
  "Torcida canta o nome de {nome} após vitória sofrida",
  "{nome} é comparado a lendas do passado após grande fase",
  "Diretoria elogia publicamente a evolução de {nome}",
];

export const MANCHETES_NEGATIVAS = [
  "{nome} vive fase de instabilidade e recebe críticas da imprensa",
  "Torcida cobra postura de {nome} após sequência ruim",
  "Comentaristas questionam a titularidade de {nome}",
  "{nome} é vaiado no estádio após atuação apagada",
  "Jornais especulam sobre futuro de {nome} no clube",
];

export const MANCHETES_NEUTRAS = [
  "{nome} concede entrevista sobre expectativas para a temporada",
  "{nome} fala sobre rotina de treinos em nova reportagem",
  "Perfil de {nome} é destaque em programa esportivo",
];

export const DESCRICOES_LESAO: Record<"leve" | "moderada" | "grave", string[]> = {
  leve: ["Sofreu um estiramento muscular leve", "Torceu o tornozelo em treino"],
  moderada: ["Lesionou o joelho em disputa de bola", "Sofreu uma lesão muscular na coxa"],
  grave: ["Rompeu o ligamento e passou por cirurgia", "Sofreu fratura e ficou meses fora dos gramados"],
};
