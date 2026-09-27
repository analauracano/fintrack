import { useEffect, useState, useCallback } from "react";
import { PeriodFilter } from "../components/PeriodFilter";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useLanguage } from "../context/LanguageContext";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getAccounts,
  getCategories,
} from "../api/resources";
import { Account, Category, Transaction, TransactionType } from "../types";

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function Transactions() {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTransactions = useCallback(async () => {
    const result = await getTransactions({
      startDate,
      endDate,
      type: typeFilter || undefined,
      page,
      pageSize: 10,
    });
    setTransactions(result.items);
    setTotalPages(result.totalPages || 1);
  }, [startDate, endDate, typeFilter, page]);

  useEffect(() => {
    getAccounts().then(setAccounts);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  async function handleCreate(data: Parameters<typeof createTransaction>[0]) {
    await createTransaction(data);
    setPage(1);
    await loadTransactions();
  }

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    await loadTransactions();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold">{t("transactions.title")}</h2>
        <div className="flex items-center gap-2">
          <PeriodFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
              setPage(1);
            }}
          />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TransactionType | "");
              setPage(1);
            }}
            className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm bg-white dark:bg-slate-900"
          >
            <option value="">{t("transactions.all")}</option>
            <option value="INCOME">{t("transactions.incomeFilter")}</option>
            <option value="EXPENSE">{t("transactions.expenseFilter")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm accounts={accounts} categories={categories} onSubmit={handleCreate} />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <TransactionList transactions={transactions} onDelete={handleDelete} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    p === page
                      ? "bg-brand-600 text-white"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
