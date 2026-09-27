import { FormEvent, useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "../api/resources";
import { Category, TransactionType } from "../types";
import { useLanguage } from "../context/LanguageContext";

const palette = ["#8b5cf6", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#ec4899", "#84cc16"];

export function Categories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [color, setColor] = useState(palette[0]);

  async function load() {
    setCategories(await getCategories());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createCategory({ name, type, color });
    setName("");
    await load();
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
    await load();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">{t("categories.title")}</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-3"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              type === "EXPENSE"
                ? "bg-rose-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {t("categories.expense")}
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              type === "INCOME"
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {t("categories.income")}
          </button>
        </div>

        <input
          placeholder={t("categories.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
          required
        />

        <div className="flex gap-2">
          {palette.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${
                color === c ? "border-slate-800 dark:border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg text-sm font-medium transition">
          {t("categories.add")}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-soft divide-y divide-slate-100 dark:divide-slate-800">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: c.color ?? "#999" }}
              />
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {c.type === "INCOME" ? t("categories.income") : t("categories.expense")}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-slate-400 hover:text-rose-500 text-sm"
            >
              {t("transactions.delete")}
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="p-4 text-sm text-slate-400">{t("categories.empty")}</p>
        )}
      </div>
    </div>
  );
}
