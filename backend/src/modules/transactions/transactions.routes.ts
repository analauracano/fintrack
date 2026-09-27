import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { index, store, update, destroy } from "./transactions.controller";

export const transactionsRouter = Router();
transactionsRouter.use(authMiddleware);

transactionsRouter.get("/", index);

transactionsRouter.post(
  "/",
  [
    body("description").notEmpty(),
    body("amount").isFloat({ gt: 0 }).withMessage("amount deve ser maior que 0"),
    body("type").isIn(["INCOME", "EXPENSE"]),
    body("date").isISO8601(),
    body("accountId").notEmpty(),
    body("categoryId").notEmpty(),
  ],
  validate,
  store
);

transactionsRouter.put("/:id", update);
transactionsRouter.delete("/:id", destroy);
