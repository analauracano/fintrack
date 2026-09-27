export type TransactionType = "INCOME" | "EXPENSE";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  color?: string | null;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string | null;
  icon?: string | null;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number | string;
  type: TransactionType;
  date: string;
  notes?: string | null;
  account: Account;
  category: Category;
  accountId: string;
  categoryId: string;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryExpense {
  name: string;
  color: string;
  total: number;
}

export interface BalancePoint {
  label: string;
  income: number;
  expense: number;
}

export interface BudgetProgress {
  id: string;
  categoryId: string | null;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
  percentage: number;
}
