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
  tier: "pequeno" | "medio" | "grande" | "internacional";
  pais: string;
}

export interface Manchete {
  id: string;
  temporada: number;
  texto: string;
  tom: "positiva" | "negativa" | "neutra";
  fonte?: "imprensa" | "redes-sociais";
}

export interface EventoVestiario {
  tipo: "conflito" | "harmonia";
  texto: string;
  impactoRelacao: number;
}

export interface Lesao {
  gravidade: "leve" | "moderada" | "grave";
  jogosPerdidos: number;
  descricao: string;
}

export type TipoMomentoPartida = "gol" | "assistencia" | "cartao" | "lesao" | "defesa" | "final";

export interface MomentoPartida {
  jogo: number;
  minuto: number;
  tipo: TipoMomentoPartida;
  texto: string;
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
  lesao?: Lesao | null;
  eventoVestiario?: EventoVestiario | null;
  relacaoElenco?: number;
  disputaRival?: "venceu" | "perdeu" | null;
  convocadoSelecao?: boolean;
  tituloSelecao?: string | null;
  novoPatrocinio?: Patrocinio | null;
  melhoresMomentos?: MomentoPartida[];
}

export interface ClausulasContrato {
  multaRescisoria: number;
  bonusPorGol: number;
  luvas: number;
}

export interface Contrato {
  salarioAnual: number;
  duracaoAnos: number;
  anosRestantes: number;
  clausulas: ClausulasContrato;
}

export interface PropostaContrato {
  id: string;
  clube: Clube;
  salarioAnual: number;
  duracaoAnos: number;
  ehClubeAtual: boolean;
  clausulas: ClausulasContrato;
}

export interface RivalPosicao {
  nome: string;
  overall: number;
  vitorias: number;
  derrotas: number;
}

export interface Patrocinio {
  marca: string;
  valorAnual: number;
  temporadaInicio: number;
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
  relacaoElenco: number;
  rival: RivalPosicao;
  convocacoesSelecao: number;
  titulosSelecao: string[];
  patrocinios: Patrocinio[];
  crisesComTecnico: number;
  dinheiro: number;
  itensComprados: string[];
}

export interface ItemLoja {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "personal-trainer" | "estilo-de-vida" | "mentalidade";
  custo: number;
  repetivel: boolean;
}

export interface FocoTreino {
  tecnico: number;
  recuperacao: number;
  tatica: number;
}

export type ConversaTecnicoOpcaoId = "respeitoso" | "cobrar-imprensa" | "silencio" | "pedir-transferencia";

export interface ConversaTecnicoOpcao {
  id: ConversaTecnicoOpcaoId;
  titulo: string;
  descricao: string;
}

export interface ResultadoConversaTecnico {
  jogador: Jogador;
  mensagem: string;
}

export type PosCarreiraId = "tecnico" | "comentarista" | "empresario" | "embaixador";

export interface OpcaoPosCarreira {
  id: PosCarreiraId;
  titulo: string;
  descricao: string;
  disponivel: boolean;
  motivoIndisponivel?: string;
}
