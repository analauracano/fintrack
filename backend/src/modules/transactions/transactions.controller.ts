import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions.service";

export async function index(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate, type, categoryId, accountId, page, pageSize } = req.query;
    const result = await listTransactions(req.userId!, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      type: type as any,
      categoryId: categoryId as string | undefined,
      accountId: accountId as string | undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function store(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const transaction = await createTransaction(req.userId!, req.body);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const transaction = await updateTransaction(req.userId!, req.params.id, req.body);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteTransaction(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
