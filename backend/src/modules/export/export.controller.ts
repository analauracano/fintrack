import { Response, NextFunction } from "express";
import { Parser as CsvParser } from "json2csv";
import PDFDocument from "pdfkit";
import { AuthRequest } from "../../middleware/auth.middleware";
import { prisma } from "../../lib/prisma";

async function fetchTransactions(userId: string, startDate?: string, endDate?: string) {
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    },
    include: { category: true, account: true },
    orderBy: { date: "desc" },
  });
}

export async function exportCsv(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await fetchTransactions(
      req.userId!,
      startDate as string | undefined,
      endDate as string | undefined
    );

    const rows = transactions.map((t) => ({
      data: t.date.toISOString().slice(0, 10),
      descricao: t.description,
      categoria: t.category.name,
      conta: t.account.name,
      tipo: t.type === "INCOME" ? "Receita" : "Despesa",
      valor: Number(t.amount).toFixed(2),
    }));

    const parser = new CsvParser({
      fields: ["data", "descricao", "categoria", "conta", "tipo", "valor"],
    });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("transacoes.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export async function exportPdf(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await fetchTransactions(
      req.userId!,
      startDate as string | undefined,
      endDate as string | undefined
    );

    const doc = new PDFDocument({ margin: 40 });
    res.header("Content-Type", "application/pdf");
    res.attachment("transacoes.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("FinTrack — Relatório de Transações", { align: "center" });
    doc.moveDown();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const value = Number(t.amount);
      if (t.type === "INCOME") totalIncome += value;
      else totalExpense += value;

      doc
        .fontSize(10)
        .text(
          `${t.date.toISOString().slice(0, 10)}  |  ${t.description}  |  ${t.category.name}  |  ${
            t.type === "INCOME" ? "+" : "-"
          } R$ ${value.toFixed(2)}`
        );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total de receitas: R$ ${totalIncome.toFixed(2)}`);
    doc.text(`Total de despesas: R$ ${totalExpense.toFixed(2)}`);
    doc.text(`Saldo: R$ ${(totalIncome - totalExpense).toFixed(2)}`);

    doc.end();
  } catch (err) {
    next(err);
  }
}
