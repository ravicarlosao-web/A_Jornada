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
  "{nome} assina acordo milionário com a {marca} fora dos gramados",
  "A {marca} aposta em {nome} para liderar nova campanha global",
];

export const MANCHETES_SELECAO_CONVOCADO = [
  "{nome} é convocado para defender a seleção nacional",
  "Técnico da seleção elogia {nome} e confirma convocação",
  "{nome} recebe a camisa da seleção pela primeira vez na temporada",
  "Convocação de {nome} é celebrada pela torcida do {clube}",
  "Seleção chama {nome} após temporada de destaque no {clube}",
  "{nome} volta à seleção depois de grande campanha no campeonato",
  "Técnico justifica chamada: '{nome} está entre os melhores do país'",
  "Convocação confirma: {nome} voltou ao seu melhor futebol",
];

export const MANCHETES_SELECAO_TITULO = [
  "{nome} é campeão pela seleção nacional! Glória eterna",
  "Seleção conquista o título com {nome} em campo",
  "Título histórico: {nome} ergue a taça pela seleção",
  "{nome} chora no gramado após conquistar o sonho dourado pela seleção",
  "A nação inteira celebra: {nome} é campeão com a seleção",
  "Imprensa internacional destaca {nome} como peça-chave do título",
];

export const MANCHETES_RIVAL_VITORIA = [
  "{nome} supera o rival direto {rival} na briga pela posição",
  "{nome} vence a disputa interna com {rival} e segue como referência",
  "{rival} fica no banco enquanto {nome} brilha em campo",
  "{nome} derrota {rival} no duelo de titulares e crava seu nome na equipe",
  "Técnico escolhe {nome} sobre {rival} — e o resultado diz tudo",
  "Disputa acirrada, mas {nome} sai vitorioso sobre {rival} mais uma vez",
  "{nome} cresce na sombra da rivalidade com {rival} e assume a liderança",
  "Temporada encerrada: {nome} venceu {rival} na batalha pela posição",
];

export const MANCHETES_RIVAL_DERROTA = [
  "{rival} supera {nome} na disputa pela posição nesta temporada",
  "{nome} perde espaço para {rival} na briga pela titularidade",
  "Técnico prefere {rival}; {nome} vive segunda parte do ano no banco",
  "{rival} se destaca e deixa {nome} em situação delicada no clube",
  "{nome} não consegue superar {rival} e o futuro no {clube} se complica",
  "Imprensa questiona: {rival} é melhor opção que {nome} atualmente?",
  "Frustração para {nome}: {rival} rouba a cena e a titularidade",
  "{nome} tem semanas para reverter vantagem de {rival} ou perde a vaga",
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

// ─── MANCHETES PRINCIPAIS ────────────────────────────────────────────────────

/** Temporada absolutamente excepcional — nota >= 8.5 */
export const MANCHETES_EXCEPCIONAL = [
  "{nome} entrega a melhor temporada da sua carreira no {clube}",
  "Números históricos: {nome} termina com {gols} gols e {assist} assistências",
  "Imprensa internacional coloca {nome} entre os melhores do mundo",
  "{nome} é unanimidade: 'ninguém jogou melhor do que ele essa temporada'",
  "Temporada lendária de {nome} deixa o {clube} de joelhos de gratidão",
  "Comparações com os grandes: {nome} está em outro nível neste ano",
  "{nome} encerra a temporada como o jogador mais dominante do campeonato",
  "Estatísticas de {nome} fazem a imprensa parar: {gols} gols, {assist} assistências — impressionante",
];

/** Boa temporada — nota >= 7.5 */
export const MANCHETES_POSITIVAS = [
  "{nome} brilha e decide o jogo com atuação de gala",
  "Imprensa exalta {nome}: 'um dos melhores da temporada'",
  "Torcida canta o nome de {nome} após vitória sofrida",
  "{nome} é comparado a lendas do passado após grande fase",
  "Diretoria elogia publicamente a evolução de {nome}",
  "{nome} encerra rodada decisiva com nota acima de {nota} — referência no {clube}",
  "Com {gols} gols na temporada, {nome} se consolida como titular indiscutível",
  "Técnico enaltece entrega de {nome}: 'ele foi fundamental pra nossa campanha'",
  "{nome} vira assunto na bolsa de apostas de transferências após sequência brilhante",
  "Maior nota do elenco: {nome} lidera o rendimento do {clube} na temporada",
  "Torcida elege {nome} craque da temporada em enquete nas redes sociais",
  "{nome} bate recorde pessoal com {gols} gols — melhor marca desde que chegou ao {clube}",
  "Clubes grandes do país colocam {nome} na lista de desejos após grande fase",
  "'{nome} está no auge da carreira', afirma colunista de renome",
  "Parceria vitoriosa: {nome} e seus companheiros elevam nível do {clube} na competição",
  "Análise tática: como {nome} se tornou o pivô de tudo que o {clube} faz de bom",
  "{nome} fecha temporada como o jogador mais participativo do campeonato",
  "Números não mentem: {nome} termina entre os três melhores do elenco em todos os critérios",
];

/** Temporada ruim — nota <= 5.5 */
export const MANCHETES_NEGATIVAS = [
  "{nome} vive fase de instabilidade e recebe críticas da imprensa",
  "Torcida cobra postura de {nome} após sequência ruim",
  "Comentaristas questionam a titularidade de {nome}",
  "{nome} é vaiado no estádio após atuação apagada",
  "Jornais especulam sobre futuro de {nome} no {clube}",
  "{nome} some do jogo nos momentos cruciais — análise preocupante",
  "Nota {nota}: {nome} vive a pior temporada desde que chegou ao {clube}",
  "Comissão técnica admite insatisfação com rendimento de {nome}",
  "Companheiros protegem {nome} publicamente, mas bastidores revelam tensão",
  "Especulação cresce: {nome} pode ser negociado ao fim desta temporada",
  "{nome} erra o imperdoável — erro raro que marca a memória da torcida",
  "Diretoria reúne {nome} para cobrar explicações sobre queda de rendimento",
  "Com apenas {gols} gols, {nome} frustra expectativas criadas na pré-temporada",
  "Imprensa pede resposta de {nome} dentro de campo: 'as críticas são justas'",
  "Temporada para esquecer: {nome} termina com média {nota} — bem abaixo do esperado",
  "{nome} perde espaço no {clube} e futuro na equipe é incerto",
  "Análise: onde errou {nome} nesta temporada e o que precisa mudar",
  "Frustração generalizada: {nome} prometeu muito e entregou pouco ao {clube}",
];

/** Temporada mediana — nota entre 5.5 e 7.5 */
export const MANCHETES_NEUTRAS = [
  "{nome} concede entrevista sobre expectativas para a temporada",
  "{nome} fala sobre rotina de treinos em nova reportagem",
  "Perfil de {nome} é destaque em programa esportivo",
  "{nome} cumpre tabela no {clube}: nem herói, nem vilão nesta temporada",
  "Temporada regular de {nome}: contribuições pontuais mas nada definitivo",
  "{nome} mantém nível estável — o {clube} sabe que pode contar com ele",
  "Colunista avalia {nome}: 'consistente, mas ainda longe do seu teto'",
  "{nome} fecha campeonato com números razoáveis e sem grandes polêmicas",
  "Temporada de transição para {nome}: mudanças táticas afetaram seu rendimento",
  "{nome} soma {gols} gols e passa discretamente pela temporada no {clube}",
  "Análise de meio de temporada: {nome} está bem, mas pode dar mais",
  "Sem holofotes desta vez: {nome} trabalha nos bastidores enquanto outros brilham",
];

/** Goleador excepcional — gols >= 15 */
export const MANCHETES_GOLEADOR = [
  "{gols} gols em uma temporada: {nome} entra no seleto clube dos artilheiros do {clube}",
  "Artilheiro {nome} fecha temporada com {gols} gols — melhor da posição no país",
  "{nome} marca, marca e marca: {gols} gols que valem ouro para o {clube}",
  "Com {gols} gols, {nome} domina as estatísticas ofensivas da temporada",
  "Mira calibrada: {nome} converte {gols} vezes e assombra defensores do campeonato",
];

/** Objetivo cumprido — extra headline */
export const MANCHETES_TITULO_CUMPRIDO = [
  "{clube} cumpre a meta e {nome} é peça central na conquista",
  "Objetivo alcançado! {nome} celebra mais uma entrega bem-sucedida ao {clube}",
  "Temporada perfeita para {nome}: desempenho individual + meta coletiva batida",
  "Diretoria e elenco comemoram: missão cumprida, com {nome} como protagonista",
  "{clube} bate a meta e {nome} colhe os frutos de uma grande campanha",
  "Final feliz: {nome} e o {clube} entregam o que foi prometido à torcida",
];

/** Objetivo não cumprido — extra headline */
export const MANCHETES_OBJETIVO_FALHOU = [
  "{clube} fica abaixo do esperado e {nome} divide responsabilidade pela frustração",
  "Meta não cumprida: {clube} decepciona e {nome} reconhece que poderia ter dado mais",
  "Torcida do {clube} cobra resposta após temporada abaixo do prometido",
  "Fracasso coletivo no {clube}: {nome} entre os questionados pela imprensa",
  "Promessa quebrada: {clube} não entrega e {nome} enfrenta pressão crescente",
  "Diretoria convoca reunião pós-temporada — {nome} ouve críticas em primeira mão",
];

/** Veterano — idade >= 33 */
export const MANCHETES_VETERANO = [
  "Com {idade} anos, {nome} prova que a idade é só um número",
  "Veterano imortal: {nome} desafia as leis da biologia e mantém alto nível",
  "{nome} aos {idade} anos: experiência que nenhum jovem tem, qualidade que poucos alcançam",
  "Imprensa reverencia longevidade de {nome}: 'isso vai para os livros de história'",
  "Nem o tempo para {nome}: com {idade} anos, ainda é figura essencial no {clube}",
];

/** Jovem promessa — idade <= 20 */
export const MANCHETES_JOVEM = [
  "Joia de {idade} anos: {nome} explode no {clube} e vira assunto nacional",
  "{nome} mal saiu da base e já manda nas decisões do {clube}",
  "Precoce e talentoso: {nome}, com {idade} anos, já faz veteranos tremerem",
  "A próxima geração chegou: {nome} mostra que o futuro do futebol é agora",
  "Com apenas {idade} anos, {nome} tem maturidade que envergonha jogadores mais velhos",
];

// ─── LESÕES ───────────────────────────────────────────────────────────────────

export const DESCRICOES_LESAO: Record<"leve" | "moderada" | "grave", string[]> = {
  leve: [
    "Sofreu um estiramento muscular leve",
    "Torceu o tornozelo em treino",
    "Sentiu desconforto muscular e virou baixa preventiva",
    "Pancada no joelho o tirou de uma partida",
    "Câimbras recorrentes fizeram a comissão poupar o atleta",
  ],
  moderada: [
    "Lesionou o joelho em disputa de bola",
    "Sofreu uma lesão muscular na coxa",
    "Ruptura de fibras o afastou dos gramados por semanas",
    "Pancada no tornozelo exige tratamento intensivo",
    "Inflamação no tendão o coloca no departamento médico",
  ],
  grave: [
    "Rompeu o ligamento e passou por cirurgia",
    "Sofreu fratura e ficou meses fora dos gramados",
    "Lesão grave no joelho exige longa recuperação cirúrgica",
    "Ruptura total do tendão coloca temporada em risco",
    "Fratura por estresse encerra sua participação na campanha",
  ],
};

export const MANCHETES_LESAO: Record<"leve" | "moderada" | "grave", string[]> = {
  leve: [
    "{nome} sente desconforto e é preservado preventivamente",
    "Departamento médico do {clube} monitora condição de {nome}",
    "{nome} tem participação reduzida após problema físico passageiro",
  ],
  moderada: [
    "{nome} se lesiona e preocupa comissão técnica do {clube}",
    "Revés para o {clube}: {nome} se machuca e fica fora por semanas",
    "{nome} passa por tratamento intensivo após lesão em partida",
  ],
  grave: [
    "Tragédia para o {clube}: {nome} sofre lesão grave e temporada pode ter acabado",
    "{nome} passa por cirurgia após lesão séria — previsão de retorno incerta",
    "Golpe duro: {nome} rompe ligamento e enfrenta longa recuperação",
  ],
};

// ─── VESTIÁRIO ────────────────────────────────────────────────────────────────

export const EVENTOS_VESTIARIO_HARMONIA = [
  "{nome} organiza uma confraternização e aproxima o grupo",
  "{nome} vira referência para os mais jovens no vestiário",
  "Elenco elogia a liderança e o espírito de equipe de {nome}",
  "{nome} media um desentendimento entre companheiros e fortalece o grupo",
  "{nome} discursa no vestiário antes de partida decisiva e eleva o time",
  "Companheiros elegem {nome} o jogador mais influente do grupo nesta temporada",
  "{nome} dedica horas extras a ajudar reforços a se adaptarem ao {clube}",
  "{nome} lidera ritual pré-jogo que virou tradição do elenco",
  "Bastidores positivos: {nome} é o elo que mantém o vestiário unido",
  "Capitão de fato: {nome} assume papel de liderança sem precisar de braçadeira",
];

export const EVENTOS_VESTIARIO_CONFLITO = [
  "{nome} discute com um companheiro após derrota e o clima esquenta",
  "Vazamento na imprensa expõe atrito entre {nome} e o elenco",
  "{nome} é acusado de individualismo por colegas de time",
  "Bastidores revelam tensão entre {nome} e a comissão técnica",
  "{nome} e reservas entram em rota de colisão após declaração polêmica",
  "Clima pesado no {clube}: {nome} teria ignorado instruções do técnico",
  "Fontes internas relatam impaciência de {nome} com colegas em treinamento",
  "{nome} chegou atrasado e o incidente gerou discussão no vestiário",
  "Rumores de desgaste: {nome} teria pedido para ser afastado dos treinos coletivos",
  "Desentendimento com capitão coloca {nome} em posição delicada no {clube}",
];

// ─── REDES SOCIAIS ────────────────────────────────────────────────────────────

export const POSTS_REDES_SOCIAIS_POSITIVOS = [
  "Vídeo do gol de {nome} viraliza e ultrapassa milhões de visualizações",
  "#{nome}ÉCraque bomba nas redes após atuação decisiva",
  "Torcedores enchem {nome} de elogios nas redes sociais após a partida",
  "{nome} ganha milhares de seguidores após semana de destaque",
  "Clipe de {nome} no treino viraliza: 'isso não é humano', diz internauta",
  "Meme positivo: fã cria vídeo comparando {nome} a lendas do futebol e engaja milhões",
  "Trending nos esportes: {nome} domina as redes após lance genial",
  "Story de {nome} celebrando vitória gera onda de afeto da torcida",
  "Influenciadores esportivos elegem jogada de {nome} a melhor da rodada",
  "A internet parou: golaço de {nome} está em todo feed hoje",
  "{nome} responde crítica nas redes com humildade e torcida vai à loucura",
  "Post do {clube} exaltando {nome} bate recorde de curtidas na história do perfil",
];

export const POSTS_REDES_SOCIAIS_NEGATIVOS = [
  "{nome} vira meme nas redes sociais após falha na partida",
  "Hashtag pedindo saída de {nome} viraliza entre torcedores",
  "Comentário polêmico de {nome} nas redes gera repercussão negativa",
  "{nome} é criticado em massa por torcedores após resultado ruim",
  "Vídeo de {nome} errando gol feito vira compilation nas redes — constrangedor",
  "Thread viral elenca os erros de {nome} na temporada: repercussão negativa",
  "Perfil satírico sobre {nome} chega a 100 mil seguidores em uma semana",
  "Internauta flagra {nome} em situação que virou debate nas redes",
  "{nome} silencia nas redes após polêmica — ausência notada pelos fãs",
  "Resposta de {nome} a crítica online piora a situação: fãs não gostaram",
  "Repost de {nome} gera controvérsia — clube pede explicações",
  "Análise viral: perfil detalha queda de rendimento de {nome} com dados e engaja negativamente",
];
