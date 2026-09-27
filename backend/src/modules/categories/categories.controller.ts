import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.service";

export async function index(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await listCategories(req.userId!));
  } catch (err) {
    next(err);
  }
}

export async function store(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, type, color, icon } = req.body;
    const category = await createCategory(req.userId!, name, type, color, icon);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await updateCategory(req.userId!, req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteCategory(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
