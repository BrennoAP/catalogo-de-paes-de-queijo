import { describe, test, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import app from "../app.js"; // ajuste o caminho se necessário
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

let adminCookie;
let userCookie;

beforeAll(async () => {
  // Limpa usuários e pães antes dos testes
  await prisma.pao.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // Cria usuário admin
  await prisma.user.upsert({
    where: { email: "admin@pao.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@pao.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Cria usuário normal
  await prisma.user.upsert({
    where: { email: "user@pao.com" },
    update: {},
    create: {
      name: "Usuário Normal",
      email: "user@pao.com",
      password: hashedPassword,
      role: "user",
    },
  });
});

afterAll(async () => {
  await prisma.pao.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("E2E - Cadastro de Pães", () => {
  test("Login como admin deve funcionar", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "admin@pao.com", password: "123456" });

    expect(res.statusCode).toBe(302); // redireciona após o login
    adminCookie = res.headers["set-cookie"];
    expect(adminCookie).toBeDefined();
  });

  test("Login como usuário normal deve funcionar", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "user@pao.com", password: "123456" });

    expect(res.statusCode).toBe(302);
    userCookie = res.headers["set-cookie"];
    expect(userCookie).toBeDefined();
  });

  test("Usuário normal não deve conseguir cadastrar pão", async () => {
    const res = await request(app)
      .post("/create") // rota de cadastro de pao
      .set("Cookie", userCookie)
      .send({
        name: "Pão Teste User",
        preco: 2.5,
        textura: "Macio",
        padariaId: 1,
      });

    expect(res.statusCode).toBe(403); // acesso negado
    expect(res.text).toMatch(/Acesso negado/);
  });

  test("Admin deve conseguir cadastrar pão", async () => {
    const res = await request(app)
      .post("/create")
      .set("Cookie", adminCookie)
      .send({
        name: "Pão Teste Admin",
        preco: 3.5,
        textura: "Crocante",
        padariaId: 1,
      });

    expect(res.statusCode).toBe(200); // como a pagina e re-renderizada apos a criação o status e 200
  });
});
