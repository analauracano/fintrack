import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { BalancePoint } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export function BalanceChart({ data }: { data: BalancePoint[] }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const tickColor = theme === "dark" ? "#cbd5e1" : "#475569";
  const gridColor = theme === "dark" ? "#1e293b" : "#e2e8f0";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="label" fontSize={12} stroke={tickColor} />
        <YAxis fontSize={12} stroke={tickColor} />
        <Tooltip
          formatter={(value: number) =>
            value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          }
          contentStyle={{
            backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
            border: "none",
            borderRadius: 8,
            color: tickColor,
          }}
        />
        <Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} />
        <Bar dataKey="income" name={t("dashboard.income")} fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name={t("dashboard.expense")} fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
