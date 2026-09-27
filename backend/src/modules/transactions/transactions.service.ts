import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { TransactionType, Prisma } from "@prisma/client";

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  page?: number;
  pageSize?: number;
}

export async function listTransactions(userId: string, filters: TransactionFilters) {
  const { startDate, endDate, type, categoryId, accountId } = filters;
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 20;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(accountId ? { accountId } : {}),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, account: true },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export function createTransaction(
  userId: string,
  data: {
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    accountId: string;
    categoryId: string;
    notes?: string;
  }
) {
  return prisma.transaction.create({
    data: {
      userId,
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date),
      accountId: data.accountId,
      categoryId: data.categoryId,
      notes: data.notes,
    },
    include: { category: true, account: true },
  });
}

export async function updateTransaction(
  userId: string,
  id: string,
  data: Partial<{
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    accountId: string;
    categoryId: string;
    notes?: string;
  }>
) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Transação não encontrada.", 404);

  return prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      ...(data.date ? { date: new Date(data.date) } : {}),
    },
    include: { category: true, account: true },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Transação não encontrada.", 404);
  await prisma.transaction.delete({ where: { id } });
}
