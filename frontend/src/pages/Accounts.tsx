import { FormEvent, useEffect, useState } from "react";
import { getAccounts, createAccount, deleteAccount } from "../api/resources";
import { Account } from "../types";
import { useLanguage } from "../context/LanguageContext";

export function Accounts() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("corrente");

  async function load() {
    setAccounts(await getAccounts());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createAccount({ name, type });
    setName("");
    await load();
  }

  async function handleDelete(id: string) {
    await deleteAccount(id);
    await load();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">{t("accounts.title")}</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex gap-3"
      >
        <input
          placeholder={t("accounts.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
        >
          <option value="corrente">{t("accounts.type.corrente")}</option>
          <option value="poupanca">{t("accounts.type.poupanca")}</option>
          <option value="cartao">{t("accounts.type.cartao")}</option>
          <option value="carteira">{t("accounts.type.carteira")}</option>
          <option value="investimento">{t("accounts.type.investimento")}</option>
        </select>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-lg text-sm font-medium transition">
          {t("accounts.add")}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-soft divide-y divide-slate-100 dark:divide-slate-800">
        {accounts.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: a.color ?? "#8b5cf6" }}
              />
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{a.type}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="text-slate-400 hover:text-rose-500 text-sm"
            >
              {t("transactions.delete")}
            </button>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="p-4 text-sm text-slate-400">{t("accounts.empty")}</p>
        )}
      </div>
    </div>
  );
}
