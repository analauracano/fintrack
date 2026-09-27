import { FormEvent, useEffect, useState } from "react";
import { getBudgetProgress, createBudget, getCategories } from "../api/resources";
import { BudgetProgress, Category } from "../types";
import { useLanguage } from "../context/LanguageContext";

export function Budgets() {
  const { t, lang } = useLanguage();
  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [progress, setProgress] = useState<BudgetProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  async function load() {
    setProgress(await getBudgetProgress(month, year));
  }

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats.filter((c) => c.type === "EXPENSE")));
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createBudget({ month, year, amount: Number(amount), categoryId: categoryId || null });
    setAmount("");
    setCategoryId("");
    await load();
  }

  const monthLabel = new Date(year, month - 1).toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold">
        {t("budgets.title")} — {monthLabel}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex gap-3"
      >
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t("budgets.general")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder={t("budgets.amountPlaceholder")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-48 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
          required
        />
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-lg text-sm font-medium transition">
          {t("budgets.set")}
        </button>
      </form>

      <div className="space-y-3">
        {progress.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft"
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">{p.categoryName}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {p.spentAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /{" "}
                {p.budgetAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  p.percentage >= 100 ? "bg-rose-500" : "bg-brand-500"
                }`}
                style={{ width: `${Math.min(100, p.percentage)}%` }}
              />
            </div>
            {p.remaining < 0 && (
              <p className="text-xs text-rose-500 mt-1">
                {t("budgets.exceeded")}{" "}
                {Math.abs(p.remaining).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            )}
          </div>
        ))}
        {progress.length === 0 && (
          <p className="text-sm text-slate-400">{t("budgets.empty")}</p>
        )}
      </div>
    </div>
  );
}
