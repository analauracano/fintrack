import { useLanguage } from "../context/LanguageContext";

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export function PeriodFilter({ startDate, endDate, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-soft">
      <div>
        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
          {t("dashboard.from")}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
          {t("dashboard.to")}
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
}
