import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CategoryExpense } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export function CategoryChart({ data }: { data: CategoryExpense[] }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const tickColor = theme === "dark" ? "#cbd5e1" : "#475569";

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">{t("dashboard.noExpenses")}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
}
