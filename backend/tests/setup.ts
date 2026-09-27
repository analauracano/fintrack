import { prisma } from "../src/lib/prisma";
import { afterAll, beforeEach } from "vitest";

// Limpa as tabelas relevantes antes de cada teste para isolamento.
beforeEach(async () => {
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
