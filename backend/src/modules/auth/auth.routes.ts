import { Router } from "express";
import { body } from "express-validator";
import { register, login, refresh } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";

export const authRouter = Router();

authRouter.post(
  "/register",
  [
    body("name").isString().trim().notEmpty().withMessage("Nome é obrigatório."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("password").isLength({ min: 6 }).withMessage("Senha deve ter ao menos 6 caracteres."),
  ],
  validate,
  register
);

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("E-mail inválido."),
    body("password").notEmpty().withMessage("Senha é obrigatória."),
  ],
  validate,
  login
);

authRouter.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("refreshToken é obrigatório.")],
  validate,
  refresh
);
