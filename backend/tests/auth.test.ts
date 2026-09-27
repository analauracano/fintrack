import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("Auth", () => {
  it("deve registrar um novo usuário e retornar tokens", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Maria Teste",
      email: "maria@teste.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("maria@teste.com");
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("não deve permitir registro duplicado do mesmo e-mail", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Maria Teste",
      email: "maria@teste.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Maria Teste 2",
      email: "maria@teste.com",
      password: "123456",
    });

    expect(res.status).toBe(409);
  });

  it("deve logar com credenciais válidas", async () => {
    await request(app).post("/api/auth/register").send({
      name: "João Teste",
      email: "joao@teste.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "joao@teste.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("deve rejeitar login com senha errada", async () => {
    await request(app).post("/api/auth/register").send({
      name: "João Teste",
      email: "joao2@teste.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "joao2@teste.com",
      password: "senhaerrada",
    });

    expect(res.status).toBe(401);
  });
});
