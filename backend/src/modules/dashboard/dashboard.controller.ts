import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getSummary, getExpensesByCategory, getBalanceEvolution } from "./dashboard.service";

export async function summary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    res.json(
      await getSummary(req.userId!, startDate as string | undefined, endDate as string | undefined)
    );
  } catch (err) {
    next(err);
  }
}

export async function expensesByCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    res.json(
      await getExpensesByCategory(
        req.userId!,
        startDate as string | undefined,
        endDate as string | undefined
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function balanceEvolution(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const months = req.query.months ? Number(req.query.months) : 6;
    res.json(await getBalanceEvolution(req.userId!, months));
  } catch (err) {
    next(err);
  }
}
