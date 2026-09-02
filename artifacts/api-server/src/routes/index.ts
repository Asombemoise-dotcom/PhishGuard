import { Router, type IRouter } from "express";
import healthRouter from "./health";
import phishguardRouter from "./phishguard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(phishguardRouter);

export default router;
