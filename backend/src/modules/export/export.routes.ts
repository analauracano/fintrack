import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { exportCsv, exportPdf } from "./export.controller";

export const exportRouter = Router();
exportRouter.use(authMiddleware);

exportRouter.get("/csv", exportCsv);
exportRouter.get("/pdf", exportPdf);
