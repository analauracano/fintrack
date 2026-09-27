import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";

export function listAccounts(userId: string) {
  return prisma.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
}

export function createAccount(userId: string, name: string, type: string, color?: string) {
  return prisma.account.create({ data: { userId, name, type, color } });
}

export async function updateAccount(
  userId: string,
  id: string,
  data: { name?: string; type?: string; color?: string }
) {
  const account = await prisma.account.findFirst({ where: { id, userId } });
  if (!account) throw new AppError("Conta não encontrada.", 404);
  return prisma.account.update({ where: { id }, data });
}

export async function deleteAccount(userId: string, id: string) {
  const account = await prisma.account.findFirst({ where: { id, userId } });
  if (!account) throw new AppError("Conta não encontrada.", 404);
  await prisma.account.delete({ where: { id } });
}
