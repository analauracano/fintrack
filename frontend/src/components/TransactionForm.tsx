import { FormEvent, useState } from "react";
import { Account, Category, TransactionType } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: {
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    accountId: string;
    categoryId: string;
  }) => Promise<void>;
}

export function TransactionForm({ accounts, categories, onSubmit }: Props) {
  const { t } = useLanguage();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);
  const inputClass =
    "w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accountId || !categoryId) return;
    setSubmitting(true);
    try {
      await onSubmit({ description, amount: Number(amount), type, date, accountId, categoryId });
      setDescription("");
      setAmount("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-3"
    >
      <h3 className="font-semibold">{t("transactions.newTitle")}</h3>

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
          {t("transactions.expense")}
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
          {t("transactions.income")}
        </button>
      </div>

      <input
        placeholder={t("transactions.description")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
        required
      />

      <input
        placeholder={t("transactions.amount")}
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={inputClass}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={inputClass}
        required
      />

      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        className={inputClass}
        required
      >
        <option value="" disabled>
          {t("transactions.selectAccount")}
        </option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className={inputClass}
        required
      >
        <option value="" disabled>
          {t("transactions.selectCategory")}
        </option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition"
      >
        {submitting ? t("transactions.saving") : t("transactions.add")}
      </button>
    </form>
  );
}
