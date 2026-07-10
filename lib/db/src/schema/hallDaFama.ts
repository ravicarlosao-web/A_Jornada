import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hallDaFamaTable = pgTable("hall_da_fama", {
  id: serial("id").primaryKey(),
  seedCarreira: text("seed_carreira").notNull(),
  nome: text("nome").notNull(),
  posicao: text("posicao").notNull(),
  tier: text("tier").notNull(),
  score: integer("score").notNull(),
  overallFinal: integer("overall_final").notNull(),
  temporadas: integer("temporadas").notNull(),
  gols: integer("gols").notNull(),
  assistencias: integer("assistencias").notNull(),
  premios: integer("premios").notNull(),
  convocacoesSelecao: integer("convocacoes_selecao").notNull().default(0),
  titulosSelecao: integer("titulos_selecao").notNull().default(0),
  patrocinios: integer("patrocinios").notNull().default(0),
  clubeFinal: text("clube_final").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const insertHallDaFamaSchema = createInsertSchema(hallDaFamaTable).omit({
  id: true,
  criadoEm: true,
});
export type InsertHallDaFama = z.infer<typeof insertHallDaFamaSchema>;
export type HallDaFamaEntry = typeof hallDaFamaTable.$inferSelect;
