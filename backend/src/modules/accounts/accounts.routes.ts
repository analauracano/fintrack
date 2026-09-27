import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { index, store, update, destroy } from "./accounts.controller";

export const accountsRouter = Router();
accountsRouter.use(authMiddleware);

accountsRouter.get("/", index);

accountsRouter.post(
  "/",
  [body("name").notEmpty(), body("type").notEmpty()],
  validate,
  store
);

accountsRouter.put("/:id", update);
accountsRouter.delete("/:id", destroy);
