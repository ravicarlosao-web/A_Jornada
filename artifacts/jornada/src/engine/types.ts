export type Modo = "rapido" | "completo";
export type Dificuldade = "amador" | "pro";

export type Posicao = "GOL" | "ZAG" | "MEI" | "ATA";

export interface AtributosBase {
  ritmo: number;
  finalizacao: number;
  passe: number;
  drible: number;
  defesa: number;
  fisico: number;
  reflexos: number;
}

export interface AtributosOcultos {
  temperamento: number;
  carisma: number;
  foco: number;
  lideranca: number;
}

export type Atributos = AtributosBase & AtributosOcultos;

export interface OpcaoDraft {
  legenda: string;
  atributo: keyof AtributosBase;
  valor: number;
}

export interface Clube {
  nome: string;
  forca: number; // 1-5
  tier: "pequeno" | "medio" | "grande";
}

export interface Manchete {
  id: string;
  temporada: number;
  texto: string;
  tom: "positiva" | "negativa" | "neutra";
}

export interface RegistroTemporada {
  temporada: number;
  idade: number;
  clube: string;
  jogos: number;
  gols: number;
  assistencias: number;
  notaMedia: number;
  fama: number;
  objetivo: string;
  objetivoCumprido: boolean;
  premio: string | null;
  manchetes: Manchete[];
  statusElenco?: "titular" | "rotacao" | "reserva";
}

export interface Contrato {
  salarioAnual: number;
  duracaoAnos: number;
  anosRestantes: number;
}

export interface Jogador {
  seedCarreira: string;
  modo: Modo;
  dificuldade: Dificuldade;
  nome: string;
  atributos: Atributos;
  posicao: Posicao;
  idade: number;
  fama: number;
  fadiga: number;
  confiancaTecnico: number;
  clubeAtual: Clube;
  contrato: Contrato;
  historicoTemporadas: RegistroTemporada[];
  premios: string[];
  jovensMentorados: number;
  aposentado: boolean;
}

export interface FocoTreino {
  tecnico: number;
  recuperacao: number;
  tatica: number;
}
