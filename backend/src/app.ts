import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { accountsRouter } from "./modules/accounts/accounts.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { transactionsRouter } from "./modules/transactions/transactions.routes";
import { budgetsRouter } from "./modules/budgets/budgets.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { exportRouter } from "./modules/export/export.routes";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/export", exportRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
