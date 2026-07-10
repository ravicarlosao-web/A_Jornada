import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, hallDaFamaTable } from "@workspace/db";
import { SalvarHallDaFamaBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/jornada/hall-da-fama", async (_req, res) => {
  try {
    const registros = await db
      .select()
      .from(hallDaFamaTable)
      .orderBy(desc(hallDaFamaTable.score))
      .limit(20);
    res.json(registros);
  } catch (err) {
    logger.error({ err }, "Falha ao listar Hall da Fama");
    res.status(500).json({ error: "Não foi possível carregar o Hall da Fama." });
  }
});

router.post("/jornada/hall-da-fama", async (req, res) => {
  const parsed = SalvarHallDaFamaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos.", detalhes: parsed.error.issues });
    return;
  }
  const body = parsed.data;

  try {
    const [criado] = await db.insert(hallDaFamaTable).values(body).returning();
    res.status(201).json(criado);
  } catch (err: unknown) {
    logger.error({ err }, "Falha ao salvar no Hall da Fama");
    res.status(500).json({ error: "Não foi possível salvar no Hall da Fama." });
  }
});

export default router;
