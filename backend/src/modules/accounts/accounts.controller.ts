import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { listAccounts, createAccount, updateAccount, deleteAccount } from "./accounts.service";

export async function index(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const accounts = await listAccounts(req.userId!);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
}

export async function store(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, type, color } = req.body;
    const account = await createAccount(req.userId!, name, type, color);
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const account = await updateAccount(req.userId!, req.params.id, req.body);
    res.json(account);
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteAccount(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
