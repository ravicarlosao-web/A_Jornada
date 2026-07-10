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
  { nome: "Vila Operária FC", forca: 1, tier: "pequeno", pais: "Brasil" },
  { nome: "União Serrana", forca: 1, tier: "pequeno", pais: "Brasil" },
  { nome: "Atlético do Porto Velho", forca: 2, tier: "pequeno", pais: "Brasil" },
  { nome: "Ferroviário EC", forca: 2, tier: "medio", pais: "Brasil" },
  { nome: "Recreativo Nacional", forca: 3, tier: "medio", pais: "Brasil" },
  { nome: "Estrela do Sul", forca: 3, tier: "medio", pais: "Brasil" },
  { nome: "Grêmio Continental", forca: 4, tier: "grande", pais: "Brasil" },
  { nome: "Real Capital", forca: 4, tier: "grande", pais: "Brasil" },
  { nome: "Internacional Metropolitano", forca: 5, tier: "grande", pais: "Brasil" },
  { nome: "Clube Atlético Imperial", forca: 5, tier: "grande", pais: "Brasil" },
];

export const CLUBES_INTERNACIONAIS: Clube[] = [
  { nome: "Royale Sporting Club", forca: 4, tier: "internacional", pais: "Bélgica" },
  { nome: "Estrella Andina FC", forca: 4, tier: "internacional", pais: "Argentina" },
  { nome: "Athletic de Lisboa", forca: 4, tier: "internacional", pais: "Portugal" },
  { nome: "FC Alpenstadt", forca: 5, tier: "internacional", pais: "Suíça" },
  { nome: "Unión Deportiva Iberia", forca: 5, tier: "internacional", pais: "Espanha" },
  { nome: "Britannia United", forca: 5, tier: "internacional", pais: "Inglaterra" },
  { nome: "Milano Calcio Club", forca: 5, tier: "internacional", pais: "Itália" },
  { nome: "Rheinstadt SV", forca: 5, tier: "internacional", pais: "Alemanha" },
];

export const OBJETIVOS_INTERNACIONAL = [
  "Vencer a liga local",
  "Chegar às oitavas da competição continental",
  "Conquistar a copa nacional",
];

export const MARCAS_PATROCINIO = [
  "Rinha Sports",
  "Voltz Energéticos",
  "Bandeira Esportes",
  "NúcleoBet",
  "Trilha Automóveis",
  "Zênite Telecom",
  "Costa Dourada Turismo",
  "Impacto Suplementos",
];

export const MANCHETES_PATROCINIO = [
  "{nome} fecha contrato de imagem com a {marca}",
  "{marca} anuncia {nome} como novo garoto-propaganda",
  "Mercado publicitário disputa a imagem de {nome}; {marca} leva a melhor",
];

export const MANCHETES_SELECAO_CONVOCADO = [
  "{nome} é convocado para defender a seleção nacional",
  "Técnico da seleção elogia {nome} e confirma convocação",
  "{nome} recebe a camisa da seleção pela primeira vez na temporada",
];

export const MANCHETES_SELECAO_TITULO = [
  "{nome} é campeão pela seleção nacional! Glória eterna",
  "Seleção conquista o título com {nome} em campo",
];

export const MANCHETES_RIVAL_VITORIA = [
  "{nome} supera o rival direto {rival} na briga pela posição",
  "{nome} vence a disputa interna com {rival} e segue como referência",
];

export const MANCHETES_RIVAL_DERROTA = [
  "{rival} supera {nome} na disputa pela posição nesta temporada",
  "{nome} perde espaço para {rival} na briga pela titularidade",
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
  internacional: OBJETIVOS_INTERNACIONAL,
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

export const EVENTOS_VESTIARIO_HARMONIA = [
  "{nome} organiza uma confraternização e aproxima o grupo",
  "{nome} vira referência para os mais jovens no vestiário",
  "Elenco elogia a liderança e o espírito de equipe de {nome}",
  "{nome} media um desentendimento entre companheiros e fortalece o grupo",
];

export const EVENTOS_VESTIARIO_CONFLITO = [
  "{nome} discute com um companheiro após derrota e o clima esquenta",
  "Vazamento na imprensa expõe atrito entre {nome} e o elenco",
  "{nome} é acusado de individualismo por colegas de time",
  "Bastidores revelam tensão entre {nome} e a comissão técnica",
];

export const POSTS_REDES_SOCIAIS_POSITIVOS = [
  "Vídeo do gol de {nome} viraliza e ultrapassa milhões de visualizações",
  "#{nome}ÉCraque bomba nas redes após atuação decisiva",
  "Torcedores enchem {nome} de elogios nas redes sociais após a partida",
  "{nome} ganha milhares de seguidores após semana de destaque",
];

export const POSTS_REDES_SOCIAIS_NEGATIVOS = [
  "{nome} vira meme nas redes sociais após falha na partida",
  "Hashtag pedindo saída de {nome} viraliza entre torcedores",
  "Comentário polêmico de {nome} nas redes gera repercussão negativa",
  "{nome} é criticado em massa por torcedores após resultado ruim",
];
