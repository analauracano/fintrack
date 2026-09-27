import { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { CategoryChart } from "../components/CategoryChart";
import { BalanceChart } from "../components/BalanceChart";
import { PeriodFilter } from "../components/PeriodFilter";
import { useLanguage } from "../context/LanguageContext";
import {
  getSummary,
  getExpensesByCategory,
  getBalanceEvolution,
  exportCsv,
  exportPdf,
} from "../api/resources";
import { DashboardSummary, CategoryExpense, BalancePoint } from "../types";

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function Dashboard() {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [byCategory, setByCategory] = useState<CategoryExpense[]>([]);
  const [evolution, setEvolution] = useState<BalancePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSummary(startDate, endDate),
      getExpensesByCategory(startDate, endDate),
      getBalanceEvolution(6),
    ])
      .then(([s, c, e]) => {
        setSummary(s);
        setByCategory(c);
        setEvolution(e);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
        <div className="flex items-center gap-2">
          <PeriodFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />
          <button
            onClick={() => exportCsv(startDate, endDate)}
            className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t("dashboard.exportCsv")}
          </button>
          <button
            onClick={() => exportPdf(startDate, endDate)}
            className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t("dashboard.exportPdf")}
          </button>
        </div>
      </div>

      {loading || !summary ? (
        <p className="text-slate-400">{t("dashboard.loading")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label={t("dashboard.income")} value={summary.totalIncome} tone="income" />
            <StatCard label={t("dashboard.expense")} value={summary.totalExpense} tone="expense" />
            <StatCard label={t("dashboard.balance")} value={summary.balance} tone="balance" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
              <h3 className="font-semibold mb-2">{t("dashboard.expensesByCategory")}</h3>
              <CategoryChart data={byCategory} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
              <h3 className="font-semibold mb-2">{t("dashboard.evolution")}</h3>
              <BalanceChart data={evolution} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
