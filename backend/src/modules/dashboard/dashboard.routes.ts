import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { summary, expensesByCategory, balanceEvolution } from "./dashboard.controller";

export const dashboardRouter = Router();
dashboardRouter.use(authMiddleware);

dashboardRouter.get("/summary", summary);
dashboardRouter.get("/expenses-by-category", expensesByCategory);
dashboardRouter.get("/balance-evolution", balanceEvolution);
