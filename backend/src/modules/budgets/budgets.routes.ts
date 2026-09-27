import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { index, store, destroy, progress } from "./budgets.controller";

export const budgetsRouter = Router();
budgetsRouter.use(authMiddleware);

budgetsRouter.get("/", index);
budgetsRouter.get("/progress", progress);

budgetsRouter.post(
  "/",
  [
    body("month").isInt({ min: 1, max: 12 }),
    body("year").isInt({ min: 2000 }),
    body("amount").isFloat({ gt: 0 }),
  ],
  validate,
  store
);

budgetsRouter.delete("/:id", destroy);
