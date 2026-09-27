import { Transaction } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: Props) {
  const { t, lang } = useLanguage();

  if (transactions.length === 0) {
    return <p className="text-sm text-slate-400">{t("transactions.empty")}</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-soft divide-y divide-slate-100 dark:divide-slate-800">
      {transactions.map((tItem) => (
        <div key={tItem.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{tItem.description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(tItem.date).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US")} ·{" "}
              {tItem.category.name} · {tItem.account.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`font-semibold ${
                tItem.type === "INCOME"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {tItem.type === "INCOME" ? "+" : "-"}{" "}
              {Number(tItem.amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <button
              onClick={() => onDelete(tItem.id)}
              className="text-slate-400 hover:text-rose-500 text-sm"
            >
              {t("transactions.delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
