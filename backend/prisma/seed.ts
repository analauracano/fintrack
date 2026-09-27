import { PrismaClient, TransactionType } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("123456");

  const user = await prisma.user.upsert({
    where: { email: "demo@fintrack.com" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "demo@fintrack.com",
      passwordHash,
    },
  });

  const account = await prisma.account.create({
    data: { name: "Conta Corrente", type: "corrente", userId: user.id },
  });

  const cardAccount = await prisma.account.create({
    data: { name: "Cartão de Crédito", type: "cartao", userId: user.id },
  });

  const salario = await prisma.category.create({
    data: { name: "Salário", type: TransactionType.INCOME, color: "#22c55e", userId: user.id },
  });

  const mercado = await prisma.category.create({
    data: { name: "Mercado", type: TransactionType.EXPENSE, color: "#ef4444", userId: user.id },
  });

  const lazer = await prisma.category.create({
    data: { name: "Lazer", type: TransactionType.EXPENSE, color: "#f59e0b", userId: user.id },
  });

  await prisma.transaction.createMany({
    data: [
      {
        description: "Salário mensal",
        amount: 5000,
        type: TransactionType.INCOME,
        date: new Date(),
        userId: user.id,
        accountId: account.id,
        categoryId: salario.id,
      },
      {
        description: "Compras do mês",
        amount: 620.5,
        type: TransactionType.EXPENSE,
        date: new Date(),
        userId: user.id,
        accountId: account.id,
        categoryId: mercado.id,
      },
      {
        description: "Cinema",
        amount: 80,
        type: TransactionType.EXPENSE,
        date: new Date(),
        userId: user.id,
        accountId: cardAccount.id,
        categoryId: lazer.id,
      },
    ],
  });

  await prisma.budget.create({
    data: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: 1500,
      userId: user.id,
      categoryId: mercado.id,
    },
  });

  console.log("Seed concluído. Login: demo@fintrack.com / senha: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
