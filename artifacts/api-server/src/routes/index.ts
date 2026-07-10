import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hallDaFamaRouter from "./hallDaFama";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hallDaFamaRouter);

export default router;
