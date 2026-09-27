import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { index, store, update, destroy } from "./categories.controller";

export const categoriesRouter = Router();
categoriesRouter.use(authMiddleware);

categoriesRouter.get("/", index);

categoriesRouter.post(
  "/",
  [
    body("name").notEmpty(),
    body("type").isIn(["INCOME", "EXPENSE"]).withMessage("type deve ser INCOME ou EXPENSE"),
  ],
  validate,
  store
);

categoriesRouter.put("/:id", update);
categoriesRouter.delete("/:id", destroy);
