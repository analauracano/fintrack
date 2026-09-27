import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/app";

let accessToken: string;
let accountId: string;
let categoryId: string;

beforeEach(async () => {
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Usuário Transações",
    email: "transacoes@teste.com",
    password: "123456",
  });
  accessToken = registerRes.body.accessToken;

  const accountRes = await request(app)
    .post("/api/accounts")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ name: "Conta Teste", type: "corrente" });
  accountId = accountRes.body.id;

  const categoryRes = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ name: "Categoria Teste", type: "EXPENSE" });
  categoryId = categoryRes.body.id;
});

describe("Transações", () => {
  it("deve criar uma transação de despesa", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Almoço",
        amount: 45.9,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("Almoço");
  });

  it("deve rejeitar transação sem autenticação", async () => {
    const res = await request(app).post("/api/transactions").send({
      description: "Sem token",
      amount: 10,
      type: "EXPENSE",
      date: new Date().toISOString(),
      accountId,
      categoryId,
    });

    expect(res.status).toBe(401);
  });

  it("deve listar transações com paginação", async () => {
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Item 1",
        amount: 20,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
      });

    const res = await request(app)
      .get("/api/transactions?page=1&pageSize=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.page).toBe(1);
  });

  it("deve calcular o resumo do dashboard corretamente", async () => {
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Receita",
        amount: 1000,
        type: "INCOME",
        date: new Date().toISOString(),
        accountId,
        categoryId,
      });

    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Despesa",
        amount: 300,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
      });

    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(700);
  });
});
