import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";

export function listBudgets(userId: string, month: number, year: number) {
  return prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });
}

export async function upsertBudget(
  userId: string,
  data: { month: number; year: number; amount: number; categoryId?: string | null }
) {
  return prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId: data.categoryId ?? null,
        month: data.month,
        year: data.year,
      },
    } as any,
    update: { amount: data.amount },
    create: {
      userId,
      month: data.month,
      year: data.year,
      amount: data.amount,
      categoryId: data.categoryId ?? null,
    },
  });
}

export async function deleteBudget(userId: string, id: string) {
  const budget = await prisma.budget.findFirst({ where: { id, userId } });
  if (!budget) throw new AppError("Orçamento não encontrado.", 404);
  await prisma.budget.delete({ where: { id } });
}

export async function budgetProgress(userId: string, month: number, year: number) {
  const budgets = await listBudgets(userId, month, year);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const progress = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          categoryId: budget.categoryId ?? undefined,
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      });

      const spentAmount = Number(spent._sum.amount ?? 0);
      const budgetAmount = Number(budget.amount);

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.category?.name ?? "Geral",
        budgetAmount,
        spentAmount,
        remaining: budgetAmount - spentAmount,
        percentage: budgetAmount > 0 ? Math.min(100, (spentAmount / budgetAmount) * 100) : 0,
      };
    })
  );

  return progress;
}
