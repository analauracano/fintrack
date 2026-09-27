import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { TransactionType } from "@prisma/client";

export function listCategories(userId: string) {
  return prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } });
}

export function createCategory(
  userId: string,
  name: string,
  type: TransactionType,
  color?: string,
  icon?: string
) {
  return prisma.category.create({ data: { userId, name, type, color, icon } });
}

export async function updateCategory(
  userId: string,
  id: string,
  data: { name?: string; color?: string; icon?: string }
) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw new AppError("Categoria não encontrada.", 404);
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(userId: string, id: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw new AppError("Categoria não encontrada.", 404);
  await prisma.category.delete({ where: { id } });
}
