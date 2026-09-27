interface Props {
  label: string;
  value: number;
  tone: "income" | "expense" | "balance";
}

const toneStyles: Record<Props["tone"], string> = {
  income: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
  expense: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
  balance: "text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40",
};

export function StatCard({ label, value, tone }: Props) {
  const formatted = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <div className={`rounded-2xl p-5 ${toneStyles[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{formatted}</p>
    </div>
  );
}
