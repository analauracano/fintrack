import { api } from "./client";
import {
  Account,
  Category,
  PaginatedTransactions,
  DashboardSummary,
  CategoryExpense,
  BalancePoint,
  BudgetProgress,
  Transaction,
  TransactionType,
} from "../types";

// Accounts
export const getAccounts = () => api.get<Account[]>("/accounts").then((r) => r.data);
export const createAccount = (payload: { name: string; type: string; color?: string }) =>
  api.post<Account>("/accounts", payload).then((r) => r.data);
export const deleteAccount = (id: string) => api.delete(`/accounts/${id}`);

// Categories
export const getCategories = () => api.get<Category[]>("/categories").then((r) => r.data);
export const createCategory = (payload: {
  name: string;
  type: TransactionType;
  color?: string;
}) => api.post<Category>("/categories", payload).then((r) => r.data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Transactions
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  page?: number;
  pageSize?: number;
}

export const getTransactions = (filters: TransactionFilters) =>
  api
    .get<PaginatedTransactions>("/transactions", { params: filters })
    .then((r) => r.data);

export const createTransaction = (payload: {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId: string;
  notes?: string;
}) => api.post<Transaction>("/transactions", payload).then((r) => r.data);

export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);

// Budgets
export const getBudgetProgress = (month: number, year: number) =>
  api
    .get<BudgetProgress[]>("/budgets/progress", { params: { month, year } })
    .then((r) => r.data);

export const createBudget = (payload: {
  month: number;
  year: number;
  amount: number;
  categoryId?: string | null;
}) => api.post("/budgets", payload).then((r) => r.data);

// Dashboard
export const getSummary = (startDate?: string, endDate?: string) =>
  api
    .get<DashboardSummary>("/dashboard/summary", { params: { startDate, endDate } })
    .then((r) => r.data);

export const getExpensesByCategory = (startDate?: string, endDate?: string) =>
  api
    .get<CategoryExpense[]>("/dashboard/expenses-by-category", {
      params: { startDate, endDate },
    })
    .then((r) => r.data);

export const getBalanceEvolution = (months = 6) =>
  api
    .get<BalancePoint[]>("/dashboard/balance-evolution", { params: { months } })
    .then((r) => r.data);

// Export (usa o client autenticado e baixa o arquivo como blob)
async function downloadFile(path: string, filename: string, params: Record<string, string | undefined>) {
  const response = await api.get(path, { params, responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportCsv = (startDate?: string, endDate?: string) =>
  downloadFile("/export/csv", "transacoes.csv", { startDate, endDate });

export const exportPdf = (startDate?: string, endDate?: string) =>
  downloadFile("/export/pdf", "transacoes.pdf", { startDate, endDate });
