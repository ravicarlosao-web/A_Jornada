import type { AtributosBase, Clube } from "./types";
import narrativas from "./narrativas.json";

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

// ─── Manchetes/eventos carregados de narrativas.json (templates editáveis) ──
export const MANCHETES_PATROCINIO = narrativas.manchetesPatrocinio;
export const MANCHETES_SELECAO_CONVOCADO = narrativas.manchetesSelecaoConvocado;
export const MANCHETES_SELECAO_TITULO = narrativas.manchetesSelecaoTitulo;
export const MANCHETES_RIVAL_VITORIA = narrativas.manchetesRivalVitoria;
export const MANCHETES_RIVAL_DERROTA = narrativas.manchetesRivalDerrota;

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

// ─── MANCHETES PRINCIPAIS (carregadas de narrativas.json) ───────────────────

/** Temporada absolutamente excepcional — nota >= 8.5 */
export const MANCHETES_EXCEPCIONAL = narrativas.manchetesExcepcional;
/** Boa temporada — nota >= 7.5 */
export const MANCHETES_POSITIVAS = narrativas.manchetesPositivas;
/** Temporada ruim — nota <= 5.5 */
export const MANCHETES_NEGATIVAS = narrativas.manchetesNegativas;
/** Temporada mediana — nota entre 5.5 e 7.5 */
export const MANCHETES_NEUTRAS = narrativas.manchetesNeutras;
/** Goleador excepcional — gols >= 15 */
export const MANCHETES_GOLEADOR = narrativas.manchetesGoleador;
/** Objetivo cumprido — extra headline */
export const MANCHETES_TITULO_CUMPRIDO = narrativas.manchetesTituloCumprido;
/** Objetivo não cumprido — extra headline */
export const MANCHETES_OBJETIVO_FALHOU = narrativas.manchetesObjetivoFalhou;
/** Veterano — idade >= 33 */
export const MANCHETES_VETERANO = narrativas.manchetesVeterano;
/** Jovem promessa — idade <= 20 */
export const MANCHETES_JOVEM = narrativas.manchetesJovem;

// ─── LESÕES ───────────────────────────────────────────────────────────────────

export const DESCRICOES_LESAO: Record<"leve" | "moderada" | "grave", string[]> = narrativas.descricoesLesao;
export const MANCHETES_LESAO: Record<"leve" | "moderada" | "grave", string[]> = narrativas.manchetesLesao;

// ─── VESTIÁRIO ────────────────────────────────────────────────────────────────

export const EVENTOS_VESTIARIO_HARMONIA = narrativas.eventosVestiarioHarmonia;
export const EVENTOS_VESTIARIO_CONFLITO = narrativas.eventosVestiarioConflito;

// ─── REDES SOCIAIS ────────────────────────────────────────────────────────────

export const POSTS_REDES_SOCIAIS_POSITIVOS = narrativas.postsRedesSociaisPositivos;
export const POSTS_REDES_SOCIAIS_NEGATIVOS = narrativas.postsRedesSociaisNegativos;
