import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { listBudgets, upsertBudget, deleteBudget, budgetProgress } from "./budgets.service";

function currentPeriod(req: AuthRequest) {
  const now = new Date();
  const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
  const year = req.query.year ? Number(req.query.year) : now.getFullYear();
  return { month, year };
}

export async function index(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { month, year } = currentPeriod(req);
    res.json(await listBudgets(req.userId!, month, year));
  } catch (err) {
    next(err);
  }
}

export async function progress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { month, year } = currentPeriod(req);
    res.json(await budgetProgress(req.userId!, month, year));
  } catch (err) {
    next(err);
  }
}

export async function store(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const budget = await upsertBudget(req.userId!, req.body);
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteBudget(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
