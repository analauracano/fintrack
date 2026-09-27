import { prisma } from "../../lib/prisma";

export async function getSummary(userId: string, startDate?: string, endDate?: string) {
  const dateFilter =
    startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {};

  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME", ...dateFilter },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", ...dateFilter },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpense = Number(expenseAgg._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export async function getExpensesByCategory(userId: string, startDate?: string, endDate?: string) {
  const dateFilter =
    startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {};

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: "EXPENSE", ...dateFilter },
    include: { category: true },
  });

  const grouped = new Map<string, { name: string; color: string; total: number }>();

  for (const t of transactions) {
    const key = t.categoryId;
    const current = grouped.get(key) ?? {
      name: t.category.name,
      color: t.category.color ?? "#999999",
      total: 0,
    };
    current.total += Number(t.amount);
    grouped.set(key, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.total - a.total);
}

export async function getBalanceEvolution(userId: string, months = 6) {
  const now = new Date();
  const results: { label: string; income: number; expense: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: "INCOME", date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
    ]);

    results.push({
      label: start.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      income: Number(incomeAgg._sum.amount ?? 0),
      expense: Number(expenseAgg._sum.amount ?? 0),
    });
  }

  return results;
}
